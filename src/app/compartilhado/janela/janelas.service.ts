import { Injectable, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

const TELA_PEQUENA = '(max-width: 767px)';

/**
 * Abre formulários e confirmações no padrão do Figma:
 * modal centralizado no desktop e folha inferior no celular.
 */
@Injectable({ providedIn: 'root' })
export class JanelasService {
  private readonly dialog = inject(MatDialog);
  private readonly breakpoints = inject(BreakpointObserver);

  abrir<C, D = unknown, R = unknown>(componente: ComponentType<C>, dados: D, largura = 860): MatDialogRef<C, R> {
    const pequena = this.breakpoints.isMatched(TELA_PEQUENA);
    const config: MatDialogConfig<D> = {
      data: dados,
      // No celular, focar um campo abriria o teclado e esconderia a folha.
      autoFocus: pequena ? 'dialog' : 'first-tabbable',
      restoreFocus: true,
      panelClass: ['janela-frota', pequena ? 'folha-inferior' : 'janela-modal'],
      width: pequena ? '100vw' : `${largura}px`,
      maxWidth: pequena ? '100vw' : 'calc(100vw - 32px)',
      maxHeight: pequena ? '92dvh' : 'calc(100dvh - 48px)',
      position: pequena ? { bottom: '0' } : undefined
    };
    return this.dialog.open<C, D, R>(componente, config);
  }
}
