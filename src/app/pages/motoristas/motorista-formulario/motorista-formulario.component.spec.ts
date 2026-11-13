import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { MotoristasModule } from '../motoristas.module';
import { DadosFormularioMotorista, MotoristaFormularioComponent } from './motorista-formulario.component';
import { AvisoService } from '../../../compartilhado/aviso.service';
import { JanelasService } from '../../../compartilhado/janela/janelas.service';
import { CAMINHOES_DONO_MOCK } from '../../../demonstracao/caminhoes.mock';
import { MOTORISTAS_MOCK } from '../../../demonstracao/motoristas.mock';
import { todos } from '../../../../testes/sessao-de-teste';

describe('MotoristaFormularioComponent', () => {
  let aviso: jasmine.SpyObj<AvisoService>;
  let janelas: jasmine.SpyObj<JanelasService>;

  function criar(dados: DadosFormularioMotorista) {
    aviso = jasmine.createSpyObj<AvisoService>('AvisoService', ['integracaoPendente', 'mostrar']);
    janelas = jasmine.createSpyObj<JanelasService>('JanelasService', ['abrir']);
    janelas.abrir.and.returnValue({ afterClosed: () => of(true) } as never);
    TestBed.configureTestingModule({
      imports: [MotoristasModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dados },
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: AvisoService, useValue: aviso },
        { provide: JanelasService, useValue: janelas }
      ]
    });
    const fixture = TestBed.createComponent(MotoristaFormularioComponent);
    fixture.detectChanges();
    return fixture;
  }

  const motorista = (id: number) => MOTORISTAS_MOCK.find(m => m.id === id)!;

  describe('novo motorista', () => {
    it('exige nome e e-mail válido; caminhões são opcionais', () => {
      const { componentInstance: c } = criar({ motorista: null, caminhoes: CAMINHOES_DONO_MOCK });
      expect(c.formulario.controls.nome.hasError('required')).toBeTrue();
      expect(c.formulario.controls.email.hasError('required')).toBeTrue();
      c.formulario.controls.email.setValue('sem-arroba');
      expect(c.formulario.controls.email.hasError('email')).toBeTrue();
      c.formulario.patchValue({ nome: 'Ana', email: 'ana@exemplo.com' });
      expect(c.formulario.valid).toBeTrue();
    });

    it('não oferece campos pessoais nem senha', () => {
      const fixture = criar({ motorista: null, caminhoes: CAMINHOES_DONO_MOCK });
      const texto = (fixture.nativeElement as HTMLElement).textContent ?? '';
      expect(fixture.nativeElement.querySelector('input[type="password"]')).toBeNull();
      ['CPF', 'CNH', 'Telefone', 'Endereço'].forEach(campo => expect(texto).not.toContain(campo));
    });

    it('oferece só caminhões não excluídos e envia a seleção no convite', () => {
      const fixture = criar({ motorista: null, caminhoes: CAMINHOES_DONO_MOCK });
      const el: HTMLElement = fixture.nativeElement;
      const oferecidos = todos(el, 'input[data-caminhao-id]').map(i => Number(i.getAttribute('data-caminhao-id')));
      expect(oferecidos).toEqual([1, 3, 2]);

      (el.querySelector('input[data-caminhao-id="1"]') as HTMLInputElement).click();
      (el.querySelector('input[data-caminhao-id="3"]') as HTMLInputElement).click();
      (el.querySelector('input[data-caminhao-id="1"]') as HTMLInputElement).click();
      fixture.detectChanges();

      const c = fixture.componentInstance;
      c.formulario.patchValue({ nome: ' Ana ', email: 'ana@exemplo.com' });
      c.salvar();
      expect(c.ultimoRequest).toEqual({ nome: 'Ana', email: 'ana@exemplo.com', caminhaoIds: [3] });
      expect(aviso.integracaoPendente).toHaveBeenCalledWith('Enviar convite');
    });
  });

  describe('edição', () => {
    it('não permite alterar o e-mail', () => {
      const { componentInstance: c } = criar({ motorista: motorista(31), caminhoes: CAMINHOES_DONO_MOCK });
      expect(c.formulario.controls.email.disabled).toBeTrue();
    });

    it('conta com convite pendente não pode ser ativada (envia ativo=false)', () => {
      const fixture = criar({ motorista: motorista(33), caminhoes: CAMINHOES_DONO_MOCK });
      const c = fixture.componentInstance;
      expect(c.formulario.controls.ativo.disabled).toBeTrue();
      expect(fixture.nativeElement.querySelector('input[formcontrolname="ativo"]')).toBeNull();
      c.salvar();
      expect(c.ultimoRequest).toEqual({ nome: 'João Pereira', ativo: false });
    });

    it('desativar conta ativa pede confirmação antes', () => {
      const { componentInstance: c } = criar({ motorista: motorista(31), caminhoes: CAMINHOES_DONO_MOCK });
      c.formulario.controls.ativo.setValue(false);
      c.salvar();
      expect(janelas.abrir).toHaveBeenCalled();
      expect(c.ultimoRequest).toEqual({ nome: 'Carlos Lima', ativo: false });
      expect(aviso.integracaoPendente).toHaveBeenCalledWith('Desativar motorista');
    });

    it('reativar conta inativa não pede confirmação', () => {
      const { componentInstance: c } = criar({ motorista: motorista(32), caminhoes: CAMINHOES_DONO_MOCK });
      c.formulario.controls.ativo.setValue(true);
      c.salvar();
      expect(janelas.abrir).not.toHaveBeenCalled();
      expect(c.ultimoRequest).toEqual({ nome: 'Marcos Souza', ativo: true });
    });
  });
});
