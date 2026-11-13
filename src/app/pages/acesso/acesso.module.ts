import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AcessoComponent } from './acesso.component';
import { LoginComponent } from './login/login.component';
import { CriarContaComponent } from './criar-conta/criar-conta.component';
import { AtivarContaComponent } from './ativar-conta/ativar-conta.component';
import { CampoSenhaComponent } from './campo-senha/campo-senha.component';

// Telas públicas, fora do layout com menu (Figma: "login", "Criar conta").
const routes: Routes = [
  {
    path: '',
    component: AcessoComponent,
    children: [
      { path: 'login', component: LoginComponent, title: 'Entrar | Frota+' },
      { path: 'criar-conta', component: CriarContaComponent, title: 'Criar conta | Frota+' },
      // A URL desta página precisa ser a mesma configurada no servidor para o link do convite.
      { path: 'ativar-conta', component: AtivarContaComponent, title: 'Ativar conta | Frota+' }
    ]
  }
];

@NgModule({
  declarations: [AcessoComponent, LoginComponent, CriarContaComponent, AtivarContaComponent, CampoSenhaComponent],
  imports: [CommonModule, ReactiveFormsModule, MatSnackBarModule, RouterModule.forChild(routes)]
})
export class AcessoModule {}
