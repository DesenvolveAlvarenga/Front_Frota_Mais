import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ManutencaoComponent } from './manutencao.component';

@NgModule({
  declarations: [ManutencaoComponent],
  imports: [CommonModule, MatCardModule, MatButtonModule,
    RouterModule.forChild([{ path: '', component: ManutencaoComponent }])]
})
export class ManutencaoModule {}
