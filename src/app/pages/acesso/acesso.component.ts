import { Component } from '@angular/core';

/** Moldura das telas de acesso: formulário à esquerda e painel da marca à direita (desktop). */
@Component({
  selector: 'app-acesso',
  standalone: false,
  template: `
    <div class="acesso">
      <main class="lado-formulario">
        <img src="imagens/logo.png" alt="Frota+" class="logo">
        <router-outlet></router-outlet>
      </main>
      <aside class="painel-marca" aria-hidden="true">
        <div class="texto-marca">
          <p class="titulo-marca">Gestão completa<br>da sua frota</p>
          <p class="subtitulo-marca">Mais controle, menos custos,<br>e sua frota sempre em movimento.</p>
          <span class="traco-marca"></span>
        </div>
      </aside>
    </div>
  `,
  styleUrls: ['./acesso.component.css']
})
export class AcessoComponent {}
