import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Ícones de ação usados nas listas e formulários (lápis, lixeira etc.).
 * Os vetores originais do Figma não puderam ser baixados; estes seguem o mesmo
 * desenho (ícones Material, 24×24) e herdam a cor do texto.
 */
const CAMINHOS = {
  editar: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
  excluir: 'M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
  inativar: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 14H9V8h2v8zm4 0h-2V8h2v8z',
  reativar: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-2 14.5v-9l6 4.5-6 4.5z',
  enviar: 'M2.01 21 23 12 2.01 3 2 10l15 2-15 2z',
  fechar: 'M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  caminhao: 'M20 8h-3V4H3a2 2 0 0 0-2 2v11h2a3 3 0 0 0 6 0h6a3 3 0 0 0 6 0h2v-5l-3-4zM6 18.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm13.5-9 1.96 2.5H17V9.5h2.5zm-1.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z',
  salvar: 'M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4zm-5 16a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm3-10H5V5h10v4z',
  busca: 'M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z',
  mais: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  alerta: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z'
} as const;

export type NomeIcone = keyof typeof CAMINHOS;

@Component({
  selector: 'app-icone',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<svg viewBox="0 0 24 24" [attr.width]="tamanho" [attr.height]="tamanho" aria-hidden="true" focusable="false"><path [attr.d]="caminho"></path></svg>`,
  styles: [':host { display: inline-flex; line-height: 0; } svg { fill: currentColor; }']
})
export class IconeComponent {
  @Input({ required: true }) nome!: NomeIcone;
  @Input() tamanho = 20;

  get caminho(): string {
    return CAMINHOS[this.nome];
  }
}
