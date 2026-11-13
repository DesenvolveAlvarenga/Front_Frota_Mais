import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { SessaoService } from './core/sessao/sessao.service';
import { perfilGuard, semSessaoGuard, sessaoAtivaGuard } from './core/sessao/sessao.guards';

// Telas públicas (login, criar conta, ativação) ficam fora do layout.
// As páginas internas são filhas do LayoutComponent: o menu permanece
// e somente o conteúdo do router-outlet do layout é trocado.
// `data.perfis` esconde telas do perfil sem acesso; a autorização real é do servidor.
const routes: Routes = [
  {
    path: '',
    canActivate: [semSessaoGuard],
    loadChildren: () => import('./pages/acesso/acesso.module').then(m => m.AcessoModule)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [sessaoAtivaGuard],
    canActivateChild: [perfilGuard],
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      // Início de cada perfil: DONO vê o Dashboard; MOTORISTA, as viagens.
      { path: 'inicio', redirectTo: () => (inject(SessaoService).ehDono() ? 'dashboard' : 'viagens') },
      { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule), data: { titulo: 'Dashboard', perfis: ['DONO'] } },
      { path: 'caminhoes', loadChildren: () => import('./pages/caminhoes/caminhoes.module').then(m => m.CaminhoesModule), data: { titulo: 'Caminhões' } },
      { path: 'motoristas', loadChildren: () => import('./pages/motoristas/motoristas.module').then(m => m.MotoristasModule), data: { titulo: 'Motoristas', perfis: ['DONO'] } },
      { path: 'viagens', loadChildren: () => import('./pages/viagens/viagens.module').then(m => m.ViagensModule), data: { titulo: 'Viagens' } },
      { path: 'relatorios', loadChildren: () => import('./pages/relatorios/relatorios.module').then(m => m.RelatoriosModule), data: { titulo: 'Relatórios', perfis: ['DONO'] } },
      { path: 'manutencao', loadChildren: () => import('./pages/manutencao/manutencao.module').then(m => m.ManutencaoModule), data: { titulo: 'Manutenções', perfis: ['DONO'] } }
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule { }
