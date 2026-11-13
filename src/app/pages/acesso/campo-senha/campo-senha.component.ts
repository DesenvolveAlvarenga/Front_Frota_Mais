import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

let proximoId = 0;

/** Campo de senha com ícone de cadeado e botão de mostrar/ocultar (Figma: login). */
@Component({
  selector: 'app-campo-senha',
  standalone: false,
  template: `
    <label class="campo-acesso" [for]="id">
      <svg class="icone" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18 8h-1V6A5 5 0 0 0 7 6v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zm-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm3.1-9H8.9V6a3.1 3.1 0 0 1 6.2 0v2z"/>
      </svg>
      <span class="rotulo">{{ rotulo }}:</span>
      <input [id]="id" [type]="visivel ? 'text' : 'password'" [formControl]="controle"
        [attr.autocomplete]="autocomplete" [attr.aria-invalid]="controle.invalid && controle.touched"
        [attr.aria-describedby]="descricaoId">
      <button type="button" class="alternar" (click)="visivel = !visivel"
        [attr.aria-label]="visivel ? 'Ocultar senha' : 'Mostrar senha'" [attr.aria-pressed]="visivel">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          @if (visivel) {
            <path d="M12 7a5 5 0 0 1 5 5c0 .65-.13 1.26-.36 1.83l2.92 2.92A11.8 11.8 0 0 0 22.99 12 11.83 11.83 0 0 0 7.97 5.4l2.16 2.16A4.86 4.86 0 0 1 12 7zM2 4.27l2.28 2.28.46.46A11.8 11.8 0 0 0 1 12a11.83 11.83 0 0 0 15.4 6.7l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55A2.82 2.82 0 0 0 9 12a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55A5 5 0 0 1 7.53 9.8zm4.31-.78 3.15 3.15.02-.16a3 3 0 0 0-3-3l-.17.01z"/>
          } @else {
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
          }
        </svg>
      </button>
    </label>
  `,
  styleUrls: ['../campo-acesso.css']
})
export class CampoSenhaComponent {
  @Input({ required: true }) controle!: FormControl<string>;
  @Input() rotulo = 'Senha';
  @Input() autocomplete = 'current-password';
  /** Id do texto de ajuda/erro associado ao campo. */
  @Input() descricaoId: string | null = null;

  readonly id = `campo-senha-${++proximoId}`;
  visivel = false;
}
