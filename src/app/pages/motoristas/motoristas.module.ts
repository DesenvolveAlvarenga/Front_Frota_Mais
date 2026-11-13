import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CompartilhadoModule } from '../../compartilhado/compartilhado.module';
import { MotoristasComponent } from './motoristas.component';
import { MotoristaFormularioComponent } from './motorista-formulario/motorista-formulario.component';
import { VinculosComponent } from './vinculos/vinculos.component';
import { SelecaoCaminhoesComponent } from './selecao-caminhoes/selecao-caminhoes.component';

@NgModule({
  declarations: [MotoristasComponent, MotoristaFormularioComponent, VinculosComponent, SelecaoCaminhoesComponent],
  imports: [CommonModule, ReactiveFormsModule, CompartilhadoModule,
    RouterModule.forChild([{ path: '', component: MotoristasComponent }])]
})
export class MotoristasModule {}
