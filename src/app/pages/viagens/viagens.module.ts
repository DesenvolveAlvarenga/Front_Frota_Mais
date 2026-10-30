import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ViagensComponent } from './viagens.component';

@NgModule({
  declarations: [ViagensComponent],
  imports: [CommonModule, MatCardModule, MatButtonModule,
    RouterModule.forChild([{ path: '', component: ViagensComponent }])]
})
export class ViagensModule {}
