import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AvisoService } from '../../../compartilhado/aviso.service';
import { confirmacaoSenhaValidator, senhaNovaValidator } from '../../../compartilhado/validadores';

/**
 * Ativação do convite do motorista (tela ausente do Figma, criada no padrão do login).
 * O link do e-mail traz `?token=...`: o token é lido uma vez, guardado só em memória
 * e retirado da barra de endereço.
 */
@Component({
  selector: 'app-ativar-conta',
  standalone: false,
  templateUrl: './ativar-conta.component.html',
  styleUrls: ['../acesso-formulario.css', '../campo-acesso.css']
})
export class AtivarContaComponent implements OnInit {
  private readonly rota = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly aviso = inject(AvisoService);

  private token: string | null = null;
  semToken = false;

  readonly formulario = inject(FormBuilder).nonNullable.group(
    {
      senha: ['', [Validators.required, senhaNovaValidator]],
      confirmacao: ['', [Validators.required]]
    },
    { validators: confirmacaoSenhaValidator }
  );

  ngOnInit(): void {
    const token = this.rota.snapshot.queryParamMap.get('token');
    this.token = token && token.length <= 200 ? token : null;
    this.semToken = !this.token;
    if (token !== null) {
      this.router.navigate([], { relativeTo: this.rota, queryParams: {}, replaceUrl: true });
    }
  }

  ativar(): void {
    if (this.formulario.invalid || !this.token) {
      this.formulario.markAllAsTouched();
      return;
    }
    // Integração futura: POST /api/convites/ativacao { token, senha } (já autentica como MOTORISTA).
    this.aviso.integracaoPendente('Ativar conta');
  }
}
