import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CaminhoesModule } from '../caminhoes.module';
import { CaminhaoFormularioComponent, DadosFormularioCaminhao } from './caminhao-formulario.component';
import { paraCaminhaoRequest, valoresIniciaisCaminhao } from './caminhao-formulario';
import { AvisoService } from '../../../compartilhado/aviso.service';
import { CAMINHOES_DONO_MOCK } from '../../../demonstracao/caminhoes.mock';

describe('CaminhaoFormularioComponent', () => {
  let aviso: jasmine.SpyObj<AvisoService>;

  function criar(dados: DadosFormularioCaminhao) {
    aviso = jasmine.createSpyObj<AvisoService>('AvisoService', ['integracaoPendente', 'mostrar']);
    TestBed.configureTestingModule({
      imports: [CaminhoesModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dados },
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: AvisoService, useValue: aviso }
      ]
    });
    const fixture = TestBed.createComponent(CaminhaoFormularioComponent);
    fixture.detectChanges();
    return fixture;
  }

  function preencherValido(componente: CaminhaoFormularioComponent): void {
    componente.formulario.setValue({
      placa: 'abc-1d23', marca: 'Volvo', modelo: 'FH 540', ano: 2022, eixos: 6,
      capacidadeTanqueLitros: null, status: 'ATIVO'
    });
  }

  it('exige placa, marca, modelo, ano e eixos; tanque é opcional', () => {
    const { componentInstance: c } = criar({ modo: 'novo', caminhao: null });
    const controles = c.formulario.controls;
    expect(controles.placa.hasError('required')).toBeTrue();
    expect(controles.marca.hasError('required')).toBeTrue();
    expect(controles.modelo.hasError('required')).toBeTrue();
    expect(controles.ano.hasError('required')).toBeTrue();
    expect(controles.eixos.hasError('required')).toBeTrue();
    expect(controles.capacidadeTanqueLitros.valid).toBeTrue();
  });

  it('respeita os limites do contrato (eixos 1–20, ano 1950–2100, placa até 8 letras/números)', () => {
    const { componentInstance: c } = criar({ modo: 'novo', caminhao: null });
    const { eixos, ano, placa, capacidadeTanqueLitros } = c.formulario.controls;
    eixos.setValue(0); expect(eixos.valid).toBeFalse();
    eixos.setValue(21); expect(eixos.valid).toBeFalse();
    eixos.setValue(2.5); expect(eixos.hasError('inteiro')).toBeTrue();
    eixos.setValue(20); expect(eixos.valid).toBeTrue();
    ano.setValue(1949); expect(ano.valid).toBeFalse();
    ano.setValue(2101); expect(ano.valid).toBeFalse();
    placa.setValue('ABC-1D2345'); expect(placa.hasError('placaInvalida')).toBeTrue(); // 9 após normalizar
    placa.setValue('ABC-1D234'); expect(placa.valid).toBeTrue(); // 8 após normalizar: limite aceito
    placa.setValue('---'); expect(placa.hasError('placaInvalida')).toBeTrue(); // nada sobra após normalizar
    placa.setValue('abc-1d23'); expect(placa.valid).toBeTrue();
    capacidadeTanqueLitros.setValue(0); expect(capacidadeTanqueLitros.valid).toBeFalse();
  });

  it('oferece só ATIVO e INATIVO no status (EXCLUIDO só pela exclusão)', () => {
    const fixture = criar({ modo: 'novo', caminhao: null });
    const opcoes = Array.from(fixture.nativeElement.querySelectorAll('#caminhao-status option')).map(o => (o as HTMLOptionElement).value);
    expect(opcoes).toEqual(['ATIVO', 'INATIVO']);
  });

  it('não envia nada com o formulário inválido', () => {
    const { componentInstance: c } = criar({ modo: 'novo', caminhao: null });
    c.salvar();
    expect(c.ultimoRequest).toBeNull();
    expect(aviso.integracaoPendente).not.toHaveBeenCalled();
  });

  it('com dados válidos monta o CaminhaoRequest e avisa que nada foi gravado', () => {
    const fixture = criar({ modo: 'novo', caminhao: null });
    preencherValido(fixture.componentInstance);
    fixture.componentInstance.salvar();
    fixture.detectChanges();
    expect(fixture.componentInstance.ultimoRequest).toEqual({
      placa: 'abc-1d23', marca: 'Volvo', modelo: 'FH 540', ano: 2022, eixos: 6, status: 'ATIVO', capacidadeTanqueLitros: null
    });
    expect(aviso.integracaoPendente).toHaveBeenCalledWith('Cadastrar caminhão');
    expect(fixture.nativeElement.textContent).toContain('Nada foi gravado');
  });

  it('na edição pré-preenche todos os campos atuais (PUT integral)', () => {
    const caminhao = CAMINHOES_DONO_MOCK.find(c => c.placa === 'QIT2E40')!;
    const { componentInstance: c } = criar({ modo: 'editar', caminhao });
    expect(c.formulario.getRawValue()).toEqual(valoresIniciaisCaminhao(caminhao));
    expect(paraCaminhaoRequest(valoresIniciaisCaminhao(caminhao)).capacidadeTanqueLitros).toBe(700);
  });

  it('caminhão antigo sem marca/eixos avisa e exige completar antes de salvar', () => {
    const caminhao = CAMINHOES_DONO_MOCK.find(c => c.placa === 'DEM1B22')!;
    const fixture = criar({ modo: 'editar', caminhao, statusSugerido: 'ATIVO' });
    expect(fixture.nativeElement.textContent).toContain('sem marca ou eixos');
    expect(fixture.componentInstance.formulario.controls.status.value).toBe('ATIVO');
    expect(fixture.componentInstance.formulario.valid).toBeFalse();
  });

  it('em visualização fica somente leitura e sem botão de salvar', () => {
    const caminhao = CAMINHOES_DONO_MOCK[0];
    const fixture = criar({ modo: 'visualizar', caminhao });
    expect(fixture.componentInstance.formulario.disabled).toBeTrue();
    expect(fixture.nativeElement.querySelector('button[type="submit"]')).toBeNull();
  });
});
