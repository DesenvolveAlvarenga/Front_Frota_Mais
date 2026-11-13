import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DadosConfirmacao {
  titulo: string;
  /** Cada item vira um parágrafo; explique a consequência da ação. */
  paragrafos: string[];
  textoConfirmar: string;
  /** Ação irreversível ou destrutiva: botão em vermelho. */
  perigo?: boolean;
}

/** Confirmação de operações sensíveis (excluir, desativar, cancelar convite...). Fecha com `true` ao confirmar. */
@Component({
  selector: 'app-confirmacao',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-janela [titulo]="dados.titulo">
      @for (paragrafo of dados.paragrafos; track $index) {
        <p class="paragrafo">{{ paragrafo }}</p>
      }
      <div rodape class="acoes-janela">
        <button type="button" class="botao botao-secundario" mat-dialog-close>Voltar</button>
        <button type="button" class="botao" [class.botao-perigo]="dados.perigo" [class.botao-primario]="!dados.perigo"
          (click)="confirmar()">{{ dados.textoConfirmar }}</button>
      </div>
    </app-janela>
  `,
  styles: ['.paragrafo { margin: 0 0 12px; color: #444746; font-size: 15px; line-height: 1.55; } .paragrafo:last-child { margin-bottom: 0; }']
})
export class ConfirmacaoComponent {
  readonly dados = inject<DadosConfirmacao>(MAT_DIALOG_DATA);
  private readonly ref = inject(MatDialogRef<ConfirmacaoComponent, boolean>);

  confirmar(): void {
    this.ref.close(true);
  }
}
