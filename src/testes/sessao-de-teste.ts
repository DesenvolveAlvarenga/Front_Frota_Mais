import { TestBed } from '@angular/core/testing';
import { Perfil } from '../app/core/modelos/api.modelos';
import { SessaoService } from '../app/core/sessao/sessao.service';

/** Abre uma sessão de demonstração com o perfil pedido (apenas para testes). */
export function entrarComo(perfil: Perfil): SessaoService {
  const sessao = TestBed.inject(SessaoService);
  sessao.iniciar({ nome: `Teste ${perfil}`, perfil, demonstracao: true });
  return sessao;
}

/** Limpa a sessão gravada no sessionStorage entre os testes. */
export function limparSessao(): void {
  sessionStorage.clear();
}

/** Atalho para localizar elementos no DOM do componente. */
export function todos(raiz: HTMLElement, seletor: string): HTMLElement[] {
  return Array.from(raiz.querySelectorAll<HTMLElement>(seletor));
}
