import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MotoristasModule } from '../motoristas.module';
import { DadosVinculos, VinculosComponent } from './vinculos.component';
import { AvisoService } from '../../../compartilhado/aviso.service';
import { CAMINHOES_DONO_MOCK } from '../../../demonstracao/caminhoes.mock';
import { MOTORISTAS_MOCK } from '../../../demonstracao/motoristas.mock';

describe('VinculosComponent', () => {
  function criar(motoristaId: number) {
    const dados: DadosVinculos = { motorista: MOTORISTAS_MOCK.find(m => m.id === motoristaId)!, caminhoes: CAMINHOES_DONO_MOCK };
    TestBed.configureTestingModule({
      imports: [MotoristasModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: dados },
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: AvisoService, useValue: jasmine.createSpyObj('AvisoService', ['integracaoPendente', 'mostrar']) }
      ]
    });
    const fixture = TestBed.createComponent(VinculosComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('começa com os vínculos atuais marcados', () => {
    const fixture = criar(31);
    expect(fixture.componentInstance.selecao.value).toEqual([1]);
    const marcados = Array.from(fixture.nativeElement.querySelectorAll('input[data-caminhao-id]:checked'))
      .map(i => (i as HTMLInputElement).getAttribute('data-caminhao-id'));
    expect(marcados).toEqual(['1']);
  });

  it('envia a lista completa, não só o que mudou', () => {
    const fixture = criar(31);
    (fixture.nativeElement.querySelector('input[data-caminhao-id="2"]') as HTMLInputElement).click();
    fixture.componentInstance.salvar();
    expect(fixture.componentInstance.ultimoRequest).toEqual({ caminhaoIds: [1, 2] });
  });

  it('desmarcar tudo envia lista vazia (remove todos os vínculos)', () => {
    const fixture = criar(31);
    (fixture.nativeElement.querySelector('input[data-caminhao-id="1"]') as HTMLInputElement).click();
    fixture.componentInstance.salvar();
    expect(fixture.componentInstance.ultimoRequest).toEqual({ caminhaoIds: [] });
  });

  it('avisa e retira do envio o vínculo com caminhão excluído', () => {
    const fixture = criar(32);
    expect(fixture.nativeElement.textContent).toContain('DEM0A01');
    expect(fixture.componentInstance.selecao.value).toEqual([3]);
    fixture.componentInstance.salvar();
    expect(fixture.componentInstance.ultimoRequest).toEqual({ caminhaoIds: [3] });
  });
});
