import { Component, inject, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CaminhaoResponse, MotoristaResponse, VinculosRequest } from '../../../core/modelos/api.modelos';
import { AvisoService } from '../../../compartilhado/aviso.service';
import { caminhoesVinculaveis, paraVinculosRequest, vinculosNaoReenviaveis } from '../motorista-formulario/motorista-formulario';

export interface DadosVinculos {
  motorista: MotoristaResponse;
  caminhoes: CaminhaoResponse[];
}

/** Caminhões vinculados ao motorista: a lista marcada é enviada **completa** (PUT .../caminhoes). */
@Component({
  selector: 'app-vinculos',
  standalone: false,
  template: `
    <app-janela [titulo]="'Caminhões de ' + dados.motorista.nome"
      descricao="Marque todos os caminhões que este motorista pode operar. Desmarcar remove o acesso dele ao caminhão e às viagens do caminhão; as viagens continuam registradas.">
      @if (removidosAoSalvar.length) {
        <p class="aviso-formulario" role="note">
          <app-icone nome="alerta" [tamanho]="18"></app-icone>
          Vínculo com caminhão excluído ({{ placasRemovidas }}) não pode ser mantido e sai da lista ao salvar.
        </p>
      }
      <app-selecao-caminhoes [controle]="selecao" [caminhoes]="caminhoesOferecidos"></app-selecao-caminhoes>

      <div rodape>
        @if (integracaoPendente()) {
          <p class="aviso-formulario" role="status">
            A comunicação com o servidor ainda não foi integrada. Nada foi gravado.
          </p>
        }
        <div class="acoes-janela">
          <button type="button" class="botao botao-secundario" mat-dialog-close>Cancelar</button>
          <button type="button" class="botao botao-primario" (click)="salvar()" [disabled]="enviando()">
            <app-icone nome="salvar" [tamanho]="18"></app-icone>
            {{ enviando() ? 'Salvando…' : 'Salvar vínculos' }}
          </button>
        </div>
      </div>
    </app-janela>
  `
})
export class VinculosComponent {
  readonly dados = inject<DadosVinculos>(MAT_DIALOG_DATA);
  private readonly aviso = inject(AvisoService);

  readonly caminhoesOferecidos = caminhoesVinculaveis(this.dados.caminhoes);
  readonly removidosAoSalvar = vinculosNaoReenviaveis(this.dados.motorista.caminhaoIds, this.dados.caminhoes);
  readonly placasRemovidas = this.removidosAoSalvar
    .map(id => this.dados.caminhoes.find(c => c.id === id)?.placa ?? `#${id}`)
    .join(', ');

  readonly selecao = new FormControl<number[]>(
    this.dados.motorista.caminhaoIds.filter(id => !this.removidosAoSalvar.includes(id)),
    { nonNullable: true }
  );

  readonly enviando = signal(false);
  readonly integracaoPendente = signal(false);
  ultimoRequest: VinculosRequest | null = null;

  salvar(): void {
    this.ultimoRequest = paraVinculosRequest(this.selecao.value);
    // Integração futura: PUT /api/motoristas/{id}/caminhoes (409 se algum caminhão foi excluído nesse meio-tempo).
    this.integracaoPendente.set(true);
    this.aviso.integracaoPendente('Salvar vínculos');
  }
}
