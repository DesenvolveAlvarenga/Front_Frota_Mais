import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Perfil } from '../../../core/modelos/api.modelos';
import { SessaoService } from '../../../core/sessao/sessao.service';
import { AvisoService } from '../../../compartilhado/aviso.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['../acesso-formulario.css', '../campo-acesso.css']
})
export class LoginComponent {
  private readonly sessao = inject(SessaoService);
  private readonly router = inject(Router);
  private readonly aviso = inject(AvisoService);

  // Campos de LoginRequest. O Figma rotula como "Usuário", mas a API entra por e-mail.
  readonly formulario = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(160)]],
    senha: ['', [Validators.required]]
  });

  mostrarAvisoSenha = false;

  entrar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }
    // Integração futura: POST /api/auth/login; 401 aqui é credencial inválida, não sessão expirada.
    this.aviso.integracaoPendente('Entrar');
  }

  /** Modo demonstração: abre a interface sem servidor, para revisar as telas de cada perfil. */
  entrarDemonstracao(perfil: Perfil): void {
    this.sessao.iniciar({ nome: perfil === 'DONO' ? 'Dono (demonstração)' : 'Motorista (demonstração)', perfil, demonstracao: true });
    this.router.navigateByUrl('/inicio');
  }
}
