import { TestBed, ComponentFixture } from '@angular/core/testing';
import { of } from 'rxjs';
import { CaminhoesModule } from './caminhoes.module';
import { CaminhoesComponent } from './caminhoes.component';
import { JanelasService } from '../../compartilhado/janela/janelas.service';
import { AvisoService } from '../../compartilhado/aviso.service';
import { ConfirmacaoComponent, DadosConfirmacao } from '../../compartilhado/confirmacao/confirmacao.component';
import { CaminhaoFormularioComponent } from './caminhao-formulario/caminhao-formulario.component';
import { CAMINHOES_DONO_MOCK } from '../../demonstracao/caminhoes.mock';
import { entrarComo, limparSessao, todos } from '../../../testes/sessao-de-teste';

describe('CaminhoesComponent', () => {
  let janelas: jasmine.SpyObj<JanelasService>;
  let aviso: jasmine.SpyObj<AvisoService>;

  beforeEach(async () => {
    limparSessao();
    janelas = jasmine.createSpyObj<JanelasService>('JanelasService', ['abrir']);
    janelas.abrir.and.returnValue({ afterClosed: () => of(true) } as never);
    aviso = jasmine.createSpyObj<AvisoService>('AvisoService', ['integracaoPendente', 'mostrar']);
    await TestBed.configureTestingModule({
      imports: [CaminhoesModule],
      providers: [
        { provide: JanelasService, useValue: janelas },
        { provide: AvisoService, useValue: aviso }
      ]
    }).compileComponents();
  });

  afterEach(() => limparSessao());

  function criar(): ComponentFixture<CaminhoesComponent> {
    const fixture = TestBed.createComponent(CaminhoesComponent);
    fixture.detectChanges();
    return fixture;
  }

  function placas(fixture: ComponentFixture<CaminhoesComponent>): string[] {
    return todos(fixture.nativeElement, '[data-placa]').map(e => e.getAttribute('data-placa') ?? '');
  }

  describe('perfil DONO', () => {
    beforeEach(() => entrarComo('DONO'));

    it('mostra "+ Novo Caminhão" e as ações de gestão', () => {
      const fixture = criar();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.botao-cabecalho')?.textContent).toContain('Novo Caminhão');
      expect(todos(el, '.acao-editar').length).toBe(3);
      expect(todos(el, '.acao-status').length).toBe(3);
      expect(todos(el, '.acao-excluir').length).toBe(3);
    });

    it('omite os excluídos até marcar "Mostrar excluídos"', () => {
      const fixture = criar();
      expect(placas(fixture)).toEqual(['BCB8H89', 'DEM1B22', 'QIT2E40']);

      fixture.componentInstance.incluirExcluidos.set(true);
      fixture.detectChanges();
      expect(placas(fixture)).toEqual(['BCB8H89', 'DEM0A01', 'DEM1B22', 'QIT2E40']);
    });

    it('exibe os rótulos de status e, para o excluído, só a consulta', () => {
      const fixture = criar();
      fixture.componentInstance.incluirExcluidos.set(true);
      fixture.detectChanges();
      const el: HTMLElement = fixture.nativeElement;
      const selos = todos(el, 'tbody .selo').map(s => s.textContent?.trim());
      expect(selos).toEqual(['Ativo', 'Excluído', 'Inativo', 'Ativo']);
      const linhaExcluida = el.querySelector('[data-placa="DEM0A01"]') as HTMLElement;
      expect(linhaExcluida.querySelector('.acao-excluir')).toBeNull();
      expect(linhaExcluida.querySelector('.acao-visualizar')).not.toBeNull();
    });

    it('oferece "Inativar" para ativo e "Reativar" para inativo', () => {
      const el: HTMLElement = criar().nativeElement;
      expect(el.querySelector('[data-placa="BCB8H89"] .acao-status')?.getAttribute('title')).toBe('Inativar');
      expect(el.querySelector('[data-placa="DEM1B22"] .acao-status')?.getAttribute('title')).toBe('Reativar');
    });

    it('confirma a exclusão lógica explicando que o histórico é preservado e não há volta', () => {
      const fixture = criar();
      (fixture.nativeElement.querySelector('[data-placa="BCB8H89"] .acao-excluir') as HTMLButtonElement).click();

      expect(janelas.abrir).toHaveBeenCalled();
      const [componente, dados] = janelas.abrir.calls.mostRecent().args as [unknown, DadosConfirmacao];
      expect(componente).toBe(ConfirmacaoComponent);
      expect(dados.perigo).toBeTrue();
      const texto = dados.paragrafos.join(' ');
      expect(texto).toContain('retirado da operação');
      expect(texto).toContain('histórico');
      expect(texto).toContain('preservado');
      expect(texto).toContain('não pode ser desfeita');
      // Confirmado: sem integração, apenas o aviso de que nada foi gravado.
      expect(aviso.integracaoPendente).toHaveBeenCalledWith('Excluir caminhão');
    });

    it('caminhão antigo sem marca/eixos vai ao formulário para inativar/reativar (PUT exige os campos)', () => {
      const fixture = criar();
      (fixture.nativeElement.querySelector('[data-placa="DEM1B22"] .acao-status') as HTMLButtonElement).click();
      const [componente, dados] = janelas.abrir.calls.mostRecent().args as [unknown, { statusSugerido: string }];
      expect(componente).toBe(CaminhaoFormularioComponent);
      expect(dados.statusSugerido).toBe('ATIVO');
    });

    it('abre o formulário em modo edição pelo lápis', () => {
      const fixture = criar();
      (fixture.nativeElement.querySelector('[data-placa="QIT2E40"] .acao-editar') as HTMLButtonElement).click();
      const [, dados] = janelas.abrir.calls.mostRecent().args as [unknown, { modo: string; caminhao: { id: number } }];
      expect(dados.modo).toBe('editar');
      expect(dados.caminhao.id).toBe(CAMINHOES_DONO_MOCK.find(c => c.placa === 'QIT2E40')!.id);
    });
  });

  describe('perfil MOTORISTA', () => {
    beforeEach(() => entrarComo('MOTORISTA'));

    it('vê só os caminhões vinculados, sem cadastrar, editar, inativar ou excluir', () => {
      const fixture = criar();
      const el: HTMLElement = fixture.nativeElement;
      expect(placas(fixture)).toEqual(['BCB8H89']);
      expect(el.querySelector('.botao-cabecalho')).toBeNull();
      expect(el.querySelector('.acao-editar, .acao-status, .acao-excluir')).toBeNull();
      expect(el.querySelector('.acao-visualizar')).not.toBeNull();
      expect(el.textContent).not.toContain('Mostrar excluídos');
    });

    it('abre os dados do caminhão só para visualização', () => {
      const fixture = criar();
      (fixture.nativeElement.querySelector('.acao-visualizar') as HTMLButtonElement).click();
      const [, dados] = janelas.abrir.calls.mostRecent().args as [unknown, { modo: string }];
      expect(dados.modo).toBe('visualizar');
    });
  });
});
