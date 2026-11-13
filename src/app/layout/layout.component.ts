import { Component, computed, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { map, shareReplay } from 'rxjs';
import { Perfil } from '../core/modelos/api.modelos';
import { SessaoService } from '../core/sessao/sessao.service';

interface ItemMenu {
  rota: string;
  rotulo: string;
  icone: string;
  /** Perfis que veem o item. Ocultar é experiência; o servidor também barra (403). */
  perfis: Perfil[];
}

const ITENS_MENU: ItemMenu[] = [
  { rota: '/dashboard', rotulo: 'Dashboard', icone: 'imagens/icon-dashboard.svg', perfis: ['DONO'] },
  { rota: '/caminhoes', rotulo: 'Caminhões', icone: 'imagens/icon-caminhoes.svg', perfis: ['DONO', 'MOTORISTA'] },
  { rota: '/motoristas', rotulo: 'Motoristas', icone: 'imagens/icon-motoristas.svg', perfis: ['DONO'] },
  { rota: '/viagens', rotulo: 'Viagens', icone: 'imagens/icon-viagens.svg', perfis: ['DONO', 'MOTORISTA'] },
  { rota: '/relatorios', rotulo: 'Relatórios', icone: 'imagens/icon-relatorios.svg', perfis: ['DONO'] },
  { rota: '/manutencao', rotulo: 'Manutenções', icone: 'imagens/icon-manutencoes.svg', perfis: ['DONO'] }
];

@Component({
  selector: 'app-layout', standalone: false,
  templateUrl: './layout.component.html', styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  private readonly sessao = inject(SessaoService);
  private readonly router = inject(Router);

  readonly demonstracao = computed(() => this.sessao.sessao()?.demonstracao === true);

  // Usados pelo menu lateral (desktop) e pela navegação inferior (celular).
  readonly itensMenu = computed(() => {
    const perfil = this.sessao.perfil();
    return ITENS_MENU.filter(item => perfil !== null && item.perfis.includes(perfil));
  });

  // Abaixo de 768 px o menu lateral dá lugar ao cabeçalho e à navegação inferior.
  readonly telaPequena$ = inject(BreakpointObserver)
    .observe('(max-width: 767px)')
    .pipe(map(result => result.matches), shareReplay({ bufferSize: 1, refCount: true }));

  sair(): void {
    this.sessao.encerrar();
    this.router.navigateByUrl('/login');
  }
}
