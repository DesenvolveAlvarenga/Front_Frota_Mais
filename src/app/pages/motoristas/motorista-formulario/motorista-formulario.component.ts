import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  CaminhaoResponse, MotoristaAtualizacaoRequest, MotoristaRequest, MotoristaResponse
} from '../../../core/modelos/api.modelos';
import { AvisoService } from '../../../compartilhado/aviso.service';
import { ConfirmacaoComponent, DadosConfirmacao } from '../../../compartilhado/confirmacao/confirmacao.component';
import { JanelasService } from '../../../compartilhado/janela/janelas.service';
import { ROTULO_SITUACAO_MOTORISTA } from '../../../compartilhado/formatacao';
import { LIMITES_MOTORISTA, caminhoesVinculaveis, paraAtualizacaoRequest, paraMotoristaRequest } from './motorista-formulario';

export interface DadosFormularioMotorista {
  /** Nulo = novo motorista (convite). */
  motorista: MotoristaResponse | null;
  /** Caminhões da empresa (GET /api/caminhoes). */
  caminhoes: CaminhaoResponse[];
}

/**
 * Novo motorista (nome, e-mail, caminhões → convite por e-mail) ou edição
 * (nome e ativação de conta já ativada). Sem CPF, CNH, telefone ou endereço.
 */
@Component({
  selector: 'app-motorista-formulario',
  standalone: false,
  templateUrl: './motorista-formulario.component.html'
})
export class MotoristaFormularioComponent {
  readonly dados = inject<DadosFormularioMotorista>(MAT_DIALOG_DATA);
  private readonly aviso = inject(AvisoService);
  private readonly janelas = inject(JanelasService);

  readonly limites = LIMITES_MOTORISTA;
  readonly rotuloSituacao = ROTULO_SITUACAO_MOTORISTA;
  readonly novo = this.dados.motorista === null;
  readonly pendente = this.dados.motorista?.situacao === 'CONVITE_PENDENTE';
  readonly caminhoesOferecidos = caminhoesVinculaveis(this.dados.caminhoes);

  readonly enviando = signal(false);
  readonly integracaoPendente = signal(false);
  /** Último corpo montado; será enviado pelo serviço HTTP na integração. */
  ultimoRequest: MotoristaRequest | MotoristaAtualizacaoRequest | null = null;

  private readonly fb = inject(FormBuilder).nonNullable;
  readonly formulario = this.fb.group({
    nome: [this.dados.motorista?.nome ?? '', [Validators.required, Validators.maxLength(LIMITES_MOTORISTA.nomeMax)]],
    email: [
      { value: this.dados.motorista?.email ?? '', disabled: !this.novo },
      [Validators.required, Validators.email, Validators.maxLength(LIMITES_MOTORISTA.emailMax)]
    ],
    caminhaoIds: [[] as number[]],
    ativo: [{ value: this.dados.motorista?.situacao === 'ATIVO', disabled: this.pendente }]
  });

  get titulo(): string {
    return this.novo ? 'Novo motorista' : `Editar ${this.dados.motorista?.nome ?? 'motorista'}`;
  }

  invalido(campo: 'nome' | 'email'): boolean {
    const controle = this.formulario.controls[campo];
    return controle.invalid && (controle.touched || controle.dirty);
  }

  salvar(): void {
    this.integracaoPendente.set(false);
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    const valor = this.formulario.getRawValue();
    const motorista = this.dados.motorista;

    if (!motorista) {
      this.ultimoRequest = paraMotoristaRequest(valor.nome, valor.email, valor.caminhaoIds);
      // Integração futura: POST /api/motoristas (503 = envio de e-mail indisponível; nada é gravado).
      this.concluirSemIntegracao('Enviar convite');
      return;
    }

    this.ultimoRequest = paraAtualizacaoRequest(motorista, valor.nome, valor.ativo);
    const desativando = motorista.situacao === 'ATIVO' && !valor.ativo;
    if (!desativando) {
      // Integração futura: PUT /api/motoristas/{id}.
      this.concluirSemIntegracao('Salvar motorista');
      return;
    }
    this.janelas.abrir<ConfirmacaoComponent, DadosConfirmacao, boolean>(ConfirmacaoComponent, {
      titulo: `Desativar ${motorista.nome}?`,
      paragrafos: [
        'O motorista perde o acesso ao Frota+ imediatamente, mesmo que esteja conectado agora.',
        'As viagens e os lançamentos dele continuam registrados.',
        'Você pode reativar a conta depois.'
      ],
      textoConfirmar: 'Desativar',
      perigo: true
    }, 520).afterClosed().subscribe(confirmado => {
      if (confirmado) this.concluirSemIntegracao('Desativar motorista');
    });
  }

  private concluirSemIntegracao(acao: string): void {
    this.integracaoPendente.set(true);
    this.aviso.integracaoPendente(acao);
  }
}
