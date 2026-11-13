import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { CaminhaoResponse, MotoristaResponse, SituacaoMotorista } from '../../core/modelos/api.modelos';
import { AvisoService } from '../../compartilhado/aviso.service';
import { EstadoCarga } from '../../compartilhado/estado-lista/estado-lista.component';
import { ConfirmacaoComponent, DadosConfirmacao } from '../../compartilhado/confirmacao/confirmacao.component';
import { JanelasService } from '../../compartilhado/janela/janelas.service';
import { ROTULO_SITUACAO_MOTORISTA, formatarInstante } from '../../compartilhado/formatacao';
import { CAMINHOES_DONO_MOCK } from '../../demonstracao/caminhoes.mock';
import { MOTORISTAS_MOCK } from '../../demonstracao/motoristas.mock';
import { DadosFormularioMotorista, MotoristaFormularioComponent } from './motorista-formulario/motorista-formulario.component';
import { DadosVinculos, VinculosComponent } from './vinculos/vinculos.component';

const CLASSE_SELO: Record<SituacaoMotorista, string> = {
  ATIVO: 'selo',
  CONVITE_PENDENTE: 'selo selo-alerta',
  INATIVO: 'selo selo-neutro'
};

export type FiltroSituacao = SituacaoMotorista | 'TODAS';

/**
 * Motoristas e convites (tela ausente do Figma; decisão: tela própria do DONO,
 * no padrão lista + janela de Caminhões).
 */
@Component({
  selector: 'app-motoristas',
  standalone: false,
  templateUrl: './motoristas.component.html'
})
export class MotoristasComponent {
  private readonly janelas = inject(JanelasService);
  private readonly aviso = inject(AvisoService);

  readonly rotuloSituacao = ROTULO_SITUACAO_MOTORISTA;
  readonly classeSelo = CLASSE_SELO;
  readonly situacoes: SituacaoMotorista[] = ['ATIVO', 'CONVITE_PENDENTE', 'INATIVO'];
  readonly telaPequena = toSignal(
    inject(BreakpointObserver).observe('(max-width: 767px)').pipe(map(r => r.matches)),
    { initialValue: false }
  );

  readonly estado = signal<EstadoCarga>('carregando');
  readonly detalhesFalha = signal<string[]>([]);
  private readonly motoristas = signal<MotoristaResponse[]>([]);
  /** Caminhões da empresa, inclusive excluídos, para mostrar as placas vinculadas. */
  private readonly caminhoes = signal<CaminhaoResponse[]>([]);

  readonly busca = signal('');
  readonly filtroSituacao = signal<FiltroSituacao>('TODAS');

  readonly visiveis = computed(() => {
    const termo = this.busca().trim().toLowerCase();
    const situacao = this.filtroSituacao();
    return this.motoristas()
      .filter(m => situacao === 'TODAS' || m.situacao === situacao)
      .filter(m => !termo || m.nome.toLowerCase().includes(termo) || m.email.toLowerCase().includes(termo));
  });

  readonly total = computed(() => this.motoristas().length);

  constructor() {
    this.carregar();
  }

  /**
   * Ponto de troca para a integração: GET /api/motoristas e
   * GET /api/caminhoes?incluirExcluidos=true (para exibir as placas).
   */
  carregar(): void {
    this.estado.set('carregando');
    this.caminhoes.set(CAMINHOES_DONO_MOCK);
    this.motoristas.set(MOTORISTAS_MOCK);
    this.estado.set(MOTORISTAS_MOCK.length ? 'sucesso' : 'vazio');
  }

  /** Placas vinculadas; caminhão excluído aparece sinalizado. */
  placas(motorista: MotoristaResponse): string {
    if (!motorista.caminhaoIds.length) return 'Nenhum';
    return motorista.caminhaoIds
      .map(id => {
        const caminhao = this.caminhoes().find(c => c.id === id);
        if (!caminhao) return `#${id}`;
        return caminhao.status === 'EXCLUIDO' ? `${caminhao.placa} (excluído)` : caminhao.placa;
      })
      .join(', ');
  }

  /** Texto da validade do convite (só para conta pendente). */
  convite(motorista: MotoristaResponse): string {
    if (motorista.situacao !== 'CONVITE_PENDENTE') return '—';
    return motorista.conviteExpiraEm
      ? `Válido até ${formatarInstante(motorista.conviteExpiraEm)}`
      : 'Expirado ou cancelado';
  }

  podeCancelarConvite(motorista: MotoristaResponse): boolean {
    return motorista.situacao === 'CONVITE_PENDENTE' && motorista.conviteExpiraEm !== null;
  }

  novo(): void {
    this.janelas.abrir<MotoristaFormularioComponent, DadosFormularioMotorista>(
      MotoristaFormularioComponent, { motorista: null, caminhoes: this.caminhoes() });
  }

  editar(motorista: MotoristaResponse): void {
    this.janelas.abrir<MotoristaFormularioComponent, DadosFormularioMotorista>(
      MotoristaFormularioComponent, { motorista, caminhoes: this.caminhoes() }, 720);
  }

  vinculos(motorista: MotoristaResponse): void {
    this.janelas.abrir<VinculosComponent, DadosVinculos>(VinculosComponent, { motorista, caminhoes: this.caminhoes() });
  }

  /** POST /api/motoristas/{id}/convite. */
  reenviarConvite(motorista: MotoristaResponse): void {
    this.confirmar({
      titulo: `Reenviar convite para ${motorista.nome}?`,
      paragrafos: [
        `Um novo link será enviado para ${motorista.email}.`,
        'O link enviado antes deixa de valer.'
      ],
      textoConfirmar: 'Reenviar convite'
    }, () => this.aviso.integracaoPendente('Reenviar convite'));
  }

  /** DELETE /api/motoristas/{id}/convite. */
  cancelarConvite(motorista: MotoristaResponse): void {
    this.confirmar({
      titulo: `Cancelar o convite de ${motorista.nome}?`,
      paragrafos: [
        'O link enviado por e-mail deixa de valer.',
        'A conta continua aguardando ativação; para liberar o acesso, envie um novo convite depois.'
      ],
      textoConfirmar: 'Cancelar convite',
      perigo: true
    }, () => this.aviso.integracaoPendente('Cancelar convite'));
  }

  private confirmar(dados: DadosConfirmacao, aoConfirmar: () => void): void {
    this.janelas.abrir<ConfirmacaoComponent, DadosConfirmacao, boolean>(ConfirmacaoComponent, dados, 520)
      .afterClosed()
      .subscribe(confirmado => {
        if (confirmado) aoConfirmar();
      });
  }
}
