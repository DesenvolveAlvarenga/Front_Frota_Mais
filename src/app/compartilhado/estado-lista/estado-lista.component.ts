import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export type EstadoCarga = 'carregando' | 'sucesso' | 'vazio' | 'falha';

/**
 * Estados de uma tela que consulta a API: carregando, vazio (não é erro),
 * falha (com os `detalhes` do servidor e "tentar de novo") e sucesso (conteúdo projetado).
 */
@Component({
  selector: 'app-estado-lista',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @switch (estado) {
      @case ('carregando') {
        <p class="estado" role="status">Carregando…</p>
      }
      @case ('vazio') {
        <p class="estado" role="status">{{ mensagemVazio }}</p>
      }
      @case ('falha') {
        <div class="estado estado-falha" role="alert">
          <p>Não foi possível carregar os dados.</p>
          @for (detalhe of detalhes; track $index) {
            <p>{{ detalhe }}</p>
          }
          <button type="button" class="botao botao-secundario" (click)="tentarDeNovo.emit()">Tentar de novo</button>
        </div>
      }
      @default {
        <ng-content></ng-content>
      }
    }
  `,
  styles: [`
    .estado { margin: 0; padding: 40px 24px; text-align: center; color: #64748b; font-size: 14px; }
    .estado-falha { color: #b3261e; }
    .estado-falha p { margin: 0 0 8px; }
    .estado-falha .botao { margin-top: 8px; }
  `]
})
export class EstadoListaComponent {
  @Input({ required: true }) estado!: EstadoCarga;
  @Input() mensagemVazio = 'Nenhum registro encontrado.';
  @Input() detalhes: string[] = [];
  @Output() readonly tentarDeNovo = new EventEmitter<void>();
}
