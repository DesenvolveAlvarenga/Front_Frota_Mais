import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AvisoService } from '../../../compartilhado/aviso.service';
import { senhaNovaValidator } from '../../../compartilhado/validadores';

@Component({
  selector: 'app-criar-conta',
  standalone: false,
  templateUrl: './criar-conta.component.html',
  styleUrls: ['../acesso-formulario.css', '../campo-acesso.css']
})
export class CriarContaComponent {
  private readonly aviso = inject(AvisoService);

  // Campos de RegistroRequest. "Nome da empresa" não está no Figma, mas é obrigatório na API.
  readonly formulario = inject(FormBuilder).nonNullable.group({
    nomeEmpresa: ['', [Validators.required, Validators.maxLength(120)]],
    nome: ['', [Validators.required, Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(160)]],
    senha: ['', [Validators.required, senhaNovaValidator]]
  });

  criar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    // Integração futura: POST /api/auth/registro (já autentica); 409 = e-mail já cadastrado.
    this.aviso.integracaoPendente('Criar conta');
  }
}
