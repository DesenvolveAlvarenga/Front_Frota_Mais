import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CompartilhadoModule } from '../../compartilhado/compartilhado.module';
import { CaminhoesComponent } from './caminhoes.component';
import { CaminhaoFormularioComponent } from './caminhao-formulario/caminhao-formulario.component';

@NgModule({
  declarations: [CaminhoesComponent, CaminhaoFormularioComponent],
  imports: [CommonModule, ReactiveFormsModule, CompartilhadoModule,
    RouterModule.forChild([{ path: '', component: CaminhoesComponent }])]
})
export class CaminhoesModule {}
