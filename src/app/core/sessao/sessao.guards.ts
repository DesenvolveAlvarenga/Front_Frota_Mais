import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Perfil } from '../modelos/api.modelos';
import { SessaoService } from './sessao.service';

/** Áreas internas exigem sessão; sem ela, vai ao login. */
export const sessaoAtivaGuard: CanActivateFn = () => {
  const sessao = inject(SessaoService);
  return sessao.sessao() ? true : inject(Router).createUrlTree(['/login']);
};

/** Login, criar conta e ativação: quem já está na sessão vai ao início. */
export const semSessaoGuard: CanActivateFn = () => {
  const sessao = inject(SessaoService);
  return sessao.sessao() ? inject(Router).createUrlTree(['/inicio']) : true;
};

/**
 * Restringe rotas por perfil (rotas com `data.perfis`). É experiência, não segurança:
 * o servidor responde 403 de qualquer forma.
 */
export const perfilGuard: CanActivateFn = route => {
  const perfis = route.data['perfis'] as Perfil[] | undefined;
  const perfil = inject(SessaoService).perfil();
  if (!perfis || (perfil && perfis.includes(perfil))) return true;
  return inject(Router).createUrlTree(['/inicio']);
};
