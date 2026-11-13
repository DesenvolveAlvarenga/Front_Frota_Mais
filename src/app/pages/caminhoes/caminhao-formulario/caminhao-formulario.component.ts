import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CaminhaoRequest, CaminhaoResponse, StatusCaminhaoEditavel } from '../../../core/modelos/api.modelos';
import { AvisoService } from '../../../compartilhado/aviso.service';
import { ROTULO_STATUS_CAMINHAO } from '../../../compartilhado/formatacao';
import { inteiroValidator } from '../../../compartilhado/validadores';
import {
  LIMITES_CAMINHAO, STATUS_EDITAVEIS, caminhaoCadastroIncompleto, paraCaminhaoRequest, placaValidator,
  valoresIniciaisCaminhao
} from './caminhao-formulario';

export type ModoFormularioCaminhao = 'novo' | 'editar' | 'visualizar';

export interface DadosFormularioCaminhao {
  modo: ModoFormularioCaminhao;
  caminhao: CaminhaoResponse | null;
  /** Usado por "Inativar/Reativar" quando o cadastro antigo está incompleto e precisa passar pelo formulário. */
  statusSugerido?: StatusCaminhaoEditavel;
}

/**
 * Cadastro/edição de caminhão (Figma: "Novo Caminhão" / "Informações do Veículo").
 * Campos ajustados à API: sem Cor, Renavam e Chassi; com Eixos e Tanque (opcional).
 */
@Component({
  selector: 'app-caminhao-formulario',
  standalone: false,
  templateUrl: './caminhao-formulario.component.html'
})
export class CaminhaoFormularioComponent {
  readonly dados = inject<DadosFormularioCaminhao>(MAT_DIALOG_DATA);
  private readonly aviso = inject(AvisoService);

  readonly limites = LIMITES_CAMINHAO;
  readonly statusEditaveis = STATUS_EDITAVEIS;
  readonly rotuloStatus = ROTULO_STATUS_CAMINHAO;
  readonly somenteLeitura = this.dados.modo === 'visualizar';
  readonly cadastroIncompleto = this.dados.caminhao !== null && caminhaoCadastroIncompleto(this.dados.caminhao);

  /** Processando o envio (fica ativo durante a requisição, quando houver integração). */
  readonly enviando = signal(false);
  /** Mensagem exibida no rodapé após tentar salvar sem integração. */
  readonly integracaoPendente = signal(false);
  /** Último corpo montado; será enviado pelo serviço HTTP na integração. */
  ultimoRequest: CaminhaoRequest | null = null;

  readonly formulario = inject(FormBuilder).group({
    placa: ['', [Validators.required, Validators.maxLength(LIMITES_CAMINHAO.placaMaxDigitada), placaValidator]],
    marca: ['', [Validators.required, Validators.maxLength(LIMITES_CAMINHAO.marcaMax)]],
    modelo: ['', [Validators.required, Validators.maxLength(LIMITES_CAMINHAO.modeloMax)]],
    ano: [null as number | null, [Validators.required, inteiroValidator, Validators.min(LIMITES_CAMINHAO.anoMin), Validators.max(LIMITES_CAMINHAO.anoMax)]],
    eixos: [null as number | null, [Validators.required, inteiroValidator, Validators.min(LIMITES_CAMINHAO.eixosMin), Validators.max(LIMITES_CAMINHAO.eixosMax)]],
    capacidadeTanqueLitros: [null as number | null, [inteiroValidator, Validators.min(1)]],
    status: ['ATIVO' as StatusCaminhaoEditavel, [Validators.required]]
  });

  constructor() {
    const iniciais = valoresIniciaisCaminhao(this.dados.caminhao);
    if (this.dados.statusSugerido) iniciais.status = this.dados.statusSugerido;
    this.formulario.setValue(iniciais);
    if (this.somenteLeitura) this.formulario.disable();
  }

  get titulo(): string {
    switch (this.dados.modo) {
      case 'novo': return 'Novo caminhão';
      case 'editar': return `Editar caminhão ${this.dados.caminhao?.placa ?? ''}`.trim();
      default: return `Caminhão ${this.dados.caminhao?.placa ?? ''}`.trim();
    }
  }

  /** Mostra o erro só depois que o usuário passou pelo campo ou tentou salvar. */
  invalido(campo: keyof typeof this.formulario.controls): boolean {
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
    this.ultimoRequest = paraCaminhaoRequest({
      placa: valor.placa ?? '',
      marca: valor.marca ?? '',
      modelo: valor.modelo ?? '',
      ano: valor.ano,
      eixos: valor.eixos,
      capacidadeTanqueLitros: valor.capacidadeTanqueLitros,
      status: valor.status ?? 'ATIVO'
    });
    // Integração futura: POST /api/caminhoes (novo) ou PUT /api/caminhoes/{id} (editar),
    // tratando 409 (placa duplicada; viagem em andamento ao inativar).
    this.integracaoPendente.set(true);
    this.aviso.integracaoPendente(this.dados.modo === 'novo' ? 'Cadastrar caminhão' : 'Salvar caminhão');
  }
}
