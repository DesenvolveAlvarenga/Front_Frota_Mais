import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { perfilGuard, sessaoAtivaGuard } from './sessao.guards';
import { entrarComo, limparSessao } from '../../../testes/sessao-de-teste';

function rotaComPerfis(perfis?: string[]): ActivatedRouteSnapshot {
  const rota = new ActivatedRouteSnapshot();
  (rota as { data: Record<string, unknown> }).data = perfis ? { perfis } : {};
  return rota;
}

function executar(guard: typeof perfilGuard, rota: ActivatedRouteSnapshot): ReturnType<typeof perfilGuard> {
  return TestBed.runInInjectionContext(() => guard(rota, {} as RouterStateSnapshot));
}

describe('Guards de sessão e perfil', () => {
  beforeEach(() => {
    limparSessao();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  afterEach(() => limparSessao());

  it('sem sessão, áreas internas levam ao login', () => {
    const resultado = executar(sessaoAtivaGuard, rotaComPerfis());
    expect(resultado instanceof UrlTree).toBeTrue();
    expect(TestBed.inject(Router).serializeUrl(resultado as UrlTree)).toBe('/login');
  });

  it('a tela de motoristas (perfis: DONO) libera o DONO', () => {
    entrarComo('DONO');
    expect(executar(perfilGuard, rotaComPerfis(['DONO']))).toBeTrue();
  });

  it('a tela de motoristas (perfis: DONO) leva o MOTORISTA ao início', () => {
    entrarComo('MOTORISTA');
    const resultado = executar(perfilGuard, rotaComPerfis(['DONO']));
    expect(resultado instanceof UrlTree).toBeTrue();
    expect(TestBed.inject(Router).serializeUrl(resultado as UrlTree)).toBe('/inicio');
  });

  it('a tela de caminhões (sem restrição de perfil) libera o MOTORISTA', () => {
    entrarComo('MOTORISTA');
    expect(executar(perfilGuard, rotaComPerfis())).toBeTrue();
  });
});
