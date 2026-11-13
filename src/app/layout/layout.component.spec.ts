import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LayoutModule } from './layout.module';
import { LayoutComponent } from './layout.component';
import { entrarComo, limparSessao, todos } from '../../testes/sessao-de-teste';

describe('LayoutComponent (menu por perfil)', () => {
  beforeEach(async () => {
    limparSessao();
    await TestBed.configureTestingModule({
      imports: [LayoutModule],
      providers: [provideRouter([]), provideNoopAnimations()]
    }).compileComponents();
  });

  afterEach(() => limparSessao());

  function rotulosDoMenu(): string[] {
    const fixture = TestBed.createComponent(LayoutComponent);
    fixture.detectChanges();
    return todos(fixture.nativeElement, 'mat-nav-list a').map(a => a.textContent?.trim() ?? '');
  }

  it('DONO vê Motoristas e as telas de gestão', () => {
    entrarComo('DONO');
    expect(rotulosDoMenu()).toEqual(['Dashboard', 'Caminhões', 'Motoristas', 'Viagens', 'Relatórios', 'Manutenções']);
  });

  it('MOTORISTA vê só Caminhões e Viagens', () => {
    entrarComo('MOTORISTA');
    expect(rotulosDoMenu()).toEqual(['Caminhões', 'Viagens']);
  });
});
