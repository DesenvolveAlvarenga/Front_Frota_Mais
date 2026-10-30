import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { LayoutComponent } from './layout.component';
@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, RouterModule, MatSidenavModule, MatToolbarModule, MatButtonModule, MatListModule],
  exports: [LayoutComponent]
})
export class LayoutModule {}
