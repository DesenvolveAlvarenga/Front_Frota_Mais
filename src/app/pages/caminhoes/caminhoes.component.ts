import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { CaminhaoResponse, StatusCaminhao } from '../../core/modelos/api.modelos';
import { SessaoService } from '../../core/sessao/sessao.service';
import { AvisoService } from '../../compartilhado/aviso.service';
import { EstadoCarga } from '../../compartilhado/estado-lista/estado-lista.component';
import { ConfirmacaoComponent, DadosConfirmacao } from '../../compartilhado/confirmacao/confirmacao.component';
import { JanelasService } from '../../compartilhado/janela/janelas.service';
import { ROTULO_STATUS_CAMINHAO } from '../../compartilhado/formatacao';
import { CAMINHOES_DONO_MOCK, CAMINHOES_MOTORISTA_MOCK } from '../../demonstracao/caminhoes.mock';
import { CaminhaoFormularioComponent, DadosFormularioCaminhao } from './caminhao-formulario/caminhao-formulario.component';
import { caminhaoCadastroIncompleto } from './caminhao-formulario/caminhao-formulario';

const CLASSE_SELO: Record<StatusCaminhao, string> = {
  ATIVO: 'selo',
  INATIVO: 'selo selo-neutro',
  EXCLUIDO: 'selo selo-perigo'
};

/**
 * Caminhões (Figma: "Caminhões" e "Caminhões - Mobile").
 * DONO administra; MOTORISTA só consulta os vinculados (o servidor já devolve a lista filtrada).
 */
@Component({
  selector: 'app-caminhoes', standalone: false,
  templateUrl: './caminhoes.component.html'
})
export class CaminhoesComponent {
  private readonly sessao = inject(SessaoService);
  private readonly janelas = inject(JanelasService);
  private readonly aviso = inject(AvisoService);

  readonly ehDono = this.sessao.ehDono;
  readonly rotuloStatus = ROTULO_STATUS_CAMINHAO;
  readonly classeSelo = CLASSE_SELO;
  readonly telaPequena = toSignal(
    inject(BreakpointObserver).observe('(max-width: 767px)').pipe(map(r => r.matches)),
    { initialValue: false }
  );

  readonly estado = signal<EstadoCarga>('carregando');
  readonly detalhesFalha = signal<string[]>([]);
  private readonly caminhoes = signal<CaminhaoResponse[]>([]);

  /** Equivale ao parâmetro `incluirExcluidos` (só o DONO; o servidor ignora para o MOTORISTA). */
  readonly incluirExcluidos = signal(false);
  readonly busca = signal('');

  readonly visiveis = computed(() => {
    const termo = this.busca().trim().toLowerCase();
    return this.caminhoes()
      .filter(c => this.incluirExcluidos() || c.status !== 'EXCLUIDO')
      .filter(c => !termo || [c.placa, c.marca ?? '', c.modelo].some(t => t.toLowerCase().includes(termo)));
  });

  readonly totalCadastrados = computed(() => this.caminhoes().filter(c => c.status !== 'EXCLUIDO').length);

  constructor() {
    this.carregar();
  }

  /**
   * Ponto de troca para a integração: substituir pelos dados de GET /api/caminhoes
   * (com `incluirExcluidos=true` quando a opção estiver marcada).
   */
  carregar(): void {
    this.estado.set('carregando');
    const dados = this.ehDono() ? CAMINHOES_DONO_MOCK : CAMINHOES_MOTORISTA_MOCK;
    this.caminhoes.set(dados);
    this.estado.set(dados.length ? 'sucesso' : 'vazio');
  }

  /** Caminhões antigos podem vir sem marca (o servidor aceita nulo até a próxima edição). */
  descricao(caminhao: CaminhaoResponse): string {
    return caminhao.marca ? `${caminhao.marca} ${caminhao.modelo}` : `${caminhao.modelo} (marca não informada)`;
  }

  novo(): void {
    this.abrirFormulario({ modo: 'novo', caminhao: null });
  }

  abrir(caminhao: CaminhaoResponse): void {
    const podeEditar = this.ehDono() && caminhao.status !== 'EXCLUIDO';
    this.abrirFormulario({ modo: podeEditar ? 'editar' : 'visualizar', caminhao });
  }

  /** Inativar/reativar é um PUT com todos os campos e o novo status. */
  alternarStatus(caminhao: CaminhaoResponse): void {
    const novoStatus = caminhao.status === 'ATIVO' ? 'INATIVO' : 'ATIVO';
    if (caminhaoCadastroIncompleto(caminhao)) {
      // O PUT exige marca e eixos: o usuário completa o cadastro no formulário.
      this.abrirFormulario({ modo: 'editar', caminhao, statusSugerido: novoStatus });
      return;
    }
    if (novoStatus === 'ATIVO') {
      this.aviso.integracaoPendente('Reativar caminhão');
      return;
    }
    this.confirmar({
      titulo: `Inativar o caminhão ${caminhao.placa}?`,
      paragrafos: [
        'Um caminhão inativo continua consultável e pode receber manutenções, mas não abre novas viagens.',
        'Se houver uma viagem em andamento neste caminhão, ela precisa ser finalizada ou cancelada antes.',
        'Você pode reativá-lo depois.'
      ],
      textoConfirmar: 'Inativar'
    }, () => this.aviso.integracaoPendente('Inativar caminhão'));
  }

  /** Exclusão lógica (DELETE /api/caminhoes/{id}). */
  excluir(caminhao: CaminhaoResponse): void {
    this.confirmar({
      titulo: `Excluir o caminhão ${caminhao.placa}?`,
      paragrafos: [
        'O caminhão será retirado da operação: sai da lista padrão, não abre viagens, não recebe manutenções e não pode ser vinculado a motoristas.',
        'Todo o histórico (viagens, lançamentos, manutenções e resultados) é preservado e continua consultável.',
        'A exclusão não pode ser desfeita: o caminhão não volta a ficar ativo pelo fluxo normal.',
        'Se houver uma viagem em andamento neste caminhão, ela precisa ser finalizada ou cancelada antes.'
      ],
      textoConfirmar: 'Excluir caminhão',
      perigo: true
    }, () => this.aviso.integracaoPendente('Excluir caminhão'));
  }

  private abrirFormulario(dados: DadosFormularioCaminhao): void {
    this.janelas.abrir(CaminhaoFormularioComponent, dados);
  }

  private confirmar(dados: DadosConfirmacao, aoConfirmar: () => void): void {
    this.janelas.abrir<ConfirmacaoComponent, DadosConfirmacao, boolean>(ConfirmacaoComponent, dados, 520)
      .afterClosed()
      .subscribe(confirmado => {
        if (confirmado) aoConfirmar();
      });
  }
}
