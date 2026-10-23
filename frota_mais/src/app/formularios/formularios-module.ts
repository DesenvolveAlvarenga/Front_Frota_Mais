import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormulariosRoutingModule } from './formularios-routing-module';
import { Formulario } from './formulario/formulario';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [Formulario],
  imports: [CommonModule, FormulariosRoutingModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule ],
})
export class FormulariosModule {}
