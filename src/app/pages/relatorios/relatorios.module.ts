import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RelatoriosComponent } from './relatorios.component';

@NgModule({
  declarations: [RelatoriosComponent],
  imports: [CommonModule, MatCardModule, MatButtonModule,
    RouterModule.forChild([{ path: '', component: RelatoriosComponent }])]
})
export class RelatoriosModule {}
