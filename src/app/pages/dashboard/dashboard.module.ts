import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DashboarComponent } from './dashboard.component';

@NgModule({
  declarations: [DashboarComponent],
  imports: [CommonModule, MatCardModule, MatButtonModule,
    RouterModule.forChild([{ path: '', component: DashboarComponent }])]
})
export class DashboardModule {}
