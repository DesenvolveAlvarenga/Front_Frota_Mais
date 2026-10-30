import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CaminhoesComponent } from './caminhoes.component';

@NgModule({
  declarations: [CaminhoesComponent],
  imports: [CommonModule, MatCardModule, MatButtonModule,
    RouterModule.forChild([{ path: '', component: CaminhoesComponent }])]
})
export class CaminhoesModule {}
