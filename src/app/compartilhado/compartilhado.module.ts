import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { IconeComponent } from './icone/icone.component';
import { JanelaComponent } from './janela/janela.component';
import { ConfirmacaoComponent } from './confirmacao/confirmacao.component';
import { EstadoListaComponent } from './estado-lista/estado-lista.component';
import { InstantePipe } from './formatacao';

/** Componentes de interface reutilizados pelas páginas internas. */
@NgModule({
  declarations: [IconeComponent, JanelaComponent, ConfirmacaoComponent, EstadoListaComponent, InstantePipe],
  imports: [CommonModule, MatDialogModule, MatSnackBarModule],
  exports: [IconeComponent, JanelaComponent, ConfirmacaoComponent, EstadoListaComponent, InstantePipe, MatDialogModule, MatSnackBarModule]
})
export class CompartilhadoModule {}
