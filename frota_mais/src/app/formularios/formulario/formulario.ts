import { Component } from '@angular/core';

@Component({
  selector: 'app-formulario',
  standalone: false,
  styleUrl: './formulario.scss',
  templateUrl: './formulario.html',
})
export class Formulario {
  nome = '';
  descricao = '';
  mensagem = '';
  salvar(): void {
    if (!this.nome.trim()) return;
    this.mensagem = `Projeto "${this.nome.trim()}" validado!`;
  }
  limpar(): void {
    this.nome = '';
    this.descricao = '';
    this.mensagem = '';
  }
}
