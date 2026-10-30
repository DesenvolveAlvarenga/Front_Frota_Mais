import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// O layout permanece na tela. Somente o conteúdo do router-outlet é trocado.
const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'caminhoes', loadChildren: () => import('./pages/caminhoes/caminhoes.module').then(m => m.CaminhoesModule), data: { titulo: 'Início' } },
  { path: 'viagens', loadChildren: () => import('./pages/viagens/viagens.module').then(m => m.ViagensModule), data: { titulo: 'Viagens' } },
  { path: 'dashboard', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule), data: { titulo: 'Dashboard' } },
  { path: 'relatorios', loadChildren: () => import('./pages/relatorios/relatorios.module').then(m => m.RelatoriosModule), data: { titulo: 'Relatórios' } },
  { path: 'manutencao', loadChildren: () => import('./pages/manutencao/manutencao.module').then(m => m.ManutencaoModule), data: { titulo: 'Relatórios' } },

  { path: '**', redirectTo: 'dashboard' }
];
@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule { }
''