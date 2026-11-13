import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CaminhaoResponse } from '../../../core/modelos/api.modelos';
import { ROTULO_STATUS_CAMINHAO } from '../../../compartilhado/formatacao';

let proximoId = 0;

/**
 * Seleção de um ou mais caminhões para o motorista. O controle guarda a lista
 * completa de ids marcados (o que a API espera em `caminhaoIds`).
 */
@Component({
  selector: 'app-selecao-caminhoes',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
  template: `
    <fieldset class="selecao" [attr.aria-describedby]="idAjuda">
      <legend class="rotulo-campo">{{ rotulo }} <span class="opcional">— opcional</span></legend>
      @if (!caminhoes.length) {
        <p class="ajuda-campo">Nenhum caminhão disponível para vínculo.</p>
      } @else {
        <ul class="opcoes">
          @for (caminhao of caminhoes; track caminhao.id) {
            <li>
              <label class="opcao" [class.marcada]="marcado(caminhao.id)">
                <input type="checkbox" [checked]="marcado(caminhao.id)" (change)="alternar(caminhao.id)"
                  [disabled]="controle.disabled" [attr.data-caminhao-id]="caminhao.id">
                <span class="placa">{{ caminhao.placa }}</span>
                <span class="modelo">{{ caminhao.marca ?? '' }} {{ caminhao.modelo }}</span>
                @if (caminhao.status !== 'ATIVO') {
                  <span class="selo selo-neutro">{{ rotuloStatus[caminhao.status] }}</span>
                }
              </label>
            </li>
          }
        </ul>
      }
      <p class="ajuda-campo" [id]="idAjuda">
        {{ quantidade }} selecionado(s). O motorista vê só os caminhões vinculados e as viagens deles.
      </p>
    </fieldset>
  `,
  styles: [`
    .selecao { border: 0; margin: 0; padding: 0; min-width: 0; display: flex; flex-direction: column; gap: 8px; }
    .rotulo-campo { padding: 0; margin-bottom: 4px; font-size: 15px; font-weight: 600; color: #1e293b; }
    .opcional { font-weight: 400; color: #64748b; }
    .opcoes { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 8px; }
    .opcao { display: flex; align-items: center; gap: 10px; min-height: 48px; padding: 8px 12px; border: 1px solid #e2e8f0;
      border-radius: 8px; background: #f8fafc; cursor: pointer; font-size: 14px; color: #444746; }
    .opcao.marcada { border-color: #0A56D0; background: #EDF2FA; }
    .opcao input { width: 18px; height: 18px; margin: 0; accent-color: #0A56D0; flex-shrink: 0; }
    .placa { font-weight: 700; color: #1e293b; }
    .modelo { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .opcao:focus-within { outline: 2px solid #0A56D0; outline-offset: 1px; }
  `]
})
export class SelecaoCaminhoesComponent {
  @Input({ required: true }) controle!: FormControl<number[]>;
  /** Caminhões oferecidos (sem os excluídos). */
  @Input({ required: true }) caminhoes: CaminhaoResponse[] = [];
  @Input() rotulo = 'Caminhões vinculados';

  readonly rotuloStatus = ROTULO_STATUS_CAMINHAO;
  readonly idAjuda = `selecao-caminhoes-ajuda-${++proximoId}`;

  get quantidade(): number {
    return this.controle.value.length;
  }

  marcado(id: number): boolean {
    return this.controle.value.includes(id);
  }

  alternar(id: number): void {
    const atual = this.controle.value;
    this.controle.setValue(atual.includes(id) ? atual.filter(i => i !== id) : [...atual, id]);
    this.controle.markAsDirty();
  }
}
