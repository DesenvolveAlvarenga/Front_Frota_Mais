import { Injectable, computed, signal } from '@angular/core';
import { Perfil } from '../modelos/api.modelos';

export interface DadosSessao {
  nome: string;
  perfil: Perfil;
  /** Verdadeiro quando a sessão foi aberta pelo modo demonstração (sem servidor). */
  demonstracao: boolean;
}

const CHAVE = 'frota.sessao';

/**
 * Sessão do usuário na interface (decisão aprovada: sessionStorage).
 *
 * Nesta etapa guarda só nome e perfil para montar menus e telas. O token JWT
 * será incluído na integração com o backend. O perfil daqui serve apenas para
 * a experiência: a autorização real é do servidor (403/404 continuam tratados).
 */
@Injectable({ providedIn: 'root' })
export class SessaoService {
  private readonly dados = signal<DadosSessao | null>(this.ler());

  readonly sessao = this.dados.asReadonly();
  readonly perfil = computed(() => this.dados()?.perfil ?? null);
  readonly ehDono = computed(() => this.dados()?.perfil === 'DONO');
  readonly nome = computed(() => this.dados()?.nome ?? '');

  iniciar(dados: DadosSessao): void {
    this.dados.set(dados);
    try {
      sessionStorage.setItem(CHAVE, JSON.stringify(dados));
    } catch {
      // Armazenamento indisponível: a sessão vale só enquanto a página estiver aberta.
    }
  }

  /** Sair: descarta tudo o que identifica o usuário. */
  encerrar(): void {
    this.dados.set(null);
    try {
      sessionStorage.removeItem(CHAVE);
    } catch {
      // Nada a limpar.
    }
  }

  private ler(): DadosSessao | null {
    try {
      const bruto = sessionStorage.getItem(CHAVE);
      if (!bruto) return null;
      const dados = JSON.parse(bruto) as Partial<DadosSessao>;
      if ((dados.perfil === 'DONO' || dados.perfil === 'MOTORISTA') && typeof dados.nome === 'string') {
        return { nome: dados.nome, perfil: dados.perfil, demonstracao: dados.demonstracao === true };
      }
    } catch {
      // Conteúdo inválido: ignora.
    }
    return null;
  }
}
