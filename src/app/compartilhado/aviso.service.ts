import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

/** Mensagens curtas ao usuário (barra inferior do Material). */
@Injectable({ providedIn: 'root' })
export class AvisoService {
  private readonly snackBar = inject(MatSnackBar);

  mostrar(mensagem: string): void {
    this.snackBar.open(mensagem, 'Fechar', { duration: 6000 });
  }

  /**
   * Usado nos envios enquanto a comunicação com o backend não existe.
   * Deixa claro que nada foi gravado (nunca simula sucesso).
   */
  integracaoPendente(acao: string): void {
    this.mostrar(`${acao}: a comunicação com o servidor ainda não foi integrada. Nada foi gravado.`);
  }
}
