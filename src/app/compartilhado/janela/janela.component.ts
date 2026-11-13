import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Moldura dos formulários em janela (Figma: "Informações do Veículo", "Detalhes do Trajeto").
 * Desktop: modal centralizado. Celular: folha inferior com puxador.
 * Uso: <app-janela titulo="..."> conteúdo <div rodape> botões </div> </app-janela>
 */
@Component({
  selector: 'app-janela',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="puxador" aria-hidden="true"></div>
    <h2 mat-dialog-title class="titulo-janela">{{ titulo }}</h2>
    @if (descricao) {
      <p class="descricao-janela">{{ descricao }}</p>
    }
    <div class="corpo-janela">
      <ng-content></ng-content>
    </div>
    <div class="rodape-janela">
      <ng-content select="[rodape]"></ng-content>
    </div>
  `,
  styleUrls: ['./janela.component.css']
})
export class JanelaComponent {
  @Input({ required: true }) titulo!: string;
  @Input() descricao: string | null = null;
}
