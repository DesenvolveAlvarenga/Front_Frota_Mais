import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MotoristasModule } from './motoristas.module';
import { MotoristasComponent } from './motoristas.component';
import { JanelasService } from '../../compartilhado/janela/janelas.service';
import { AvisoService } from '../../compartilhado/aviso.service';
import { DadosConfirmacao } from '../../compartilhado/confirmacao/confirmacao.component';
import { entrarComo, limparSessao, todos } from '../../../testes/sessao-de-teste';

describe('MotoristasComponent', () => {
  let janelas: jasmine.SpyObj<JanelasService>;
  let aviso: jasmine.SpyObj<AvisoService>;
  let fixture: ComponentFixture<MotoristasComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    limparSessao();
    janelas = jasmine.createSpyObj<JanelasService>('JanelasService', ['abrir']);
    janelas.abrir.and.returnValue({ afterClosed: () => of(true) } as never);
    aviso = jasmine.createSpyObj<AvisoService>('AvisoService', ['integracaoPendente', 'mostrar']);
    await TestBed.configureTestingModule({
      imports: [MotoristasModule],
      providers: [
        { provide: JanelasService, useValue: janelas },
        { provide: AvisoService, useValue: aviso }
      ]
    }).compileComponents();
    entrarComo('DONO');
    fixture = TestBed.createComponent(MotoristasComponent);
    fixture.detectChanges();
    el = fixture.nativeElement;
  });

  afterEach(() => limparSessao());

  function linha(id: number): HTMLElement {
    return el.querySelector(`[data-motorista-id="${id}"]`) as HTMLElement;
  }

  it('exibe a situação de cada motorista com rótulo legível', () => {
    expect(linha(31).querySelector('.selo')?.textContent?.trim()).toBe('Ativo');
    expect(linha(33).querySelector('.selo')?.textContent?.trim()).toBe('Convite pendente');
    expect(linha(32).querySelector('.selo')?.textContent?.trim()).toBe('Inativo');
  });

  it('mostra as placas vinculadas e sinaliza caminhão excluído', () => {
    expect(linha(31).textContent).toContain('BCB8H89');
    expect(linha(32).textContent).toContain('DEM0A01 (excluído)');
    expect(linha(34).textContent).toContain('Nenhum');
  });

  it('mostra ações de convite só para conta com convite pendente', () => {
    expect(linha(31).querySelector('.acao-reenviar')).toBeNull();
    expect(linha(32).querySelector('.acao-reenviar')).toBeNull();
    expect(linha(31).querySelector('.acao-cancelar-convite')).toBeNull();
    expect(linha(33).querySelector('.acao-reenviar')).not.toBeNull();
    expect(linha(33).querySelector('.acao-cancelar-convite')).not.toBeNull();
  });

  it('convite expirado ou cancelado: permite reenviar, mas não cancelar', () => {
    expect(linha(34).textContent).toContain('Expirado ou cancelado');
    expect(linha(34).querySelector('.acao-reenviar')).not.toBeNull();
    expect(linha(34).querySelector('.acao-cancelar-convite')).toBeNull();
  });

  it('exibe a validade do convite pendente no horário de Brasília', () => {
    // 2026-11-14T15:00:00Z = 14/11/2026 12:00 em Brasília.
    expect(linha(33).textContent).toContain('Válido até 14/11/2026 12:00');
  });

  it('cancelar convite pede confirmação e não simula gravação', () => {
    (linha(33).querySelector('.acao-cancelar-convite') as HTMLButtonElement).click();
    const [, dados] = janelas.abrir.calls.mostRecent().args as [unknown, DadosConfirmacao];
    expect(dados.titulo).toContain('Cancelar o convite');
    expect(dados.perigo).toBeTrue();
    expect(aviso.integracaoPendente).toHaveBeenCalledWith('Cancelar convite');
  });

  it('filtra localmente por situação', () => {
    fixture.componentInstance.filtroSituacao.set('CONVITE_PENDENTE');
    fixture.detectChanges();
    const ids = todos(el, '[data-motorista-id]').map(e => e.getAttribute('data-motorista-id'));
    expect(ids).toEqual(['34', '33']);
  });
});
