/**
 * Tipos dos contratos da API do Frota+ (requisições e respostas).
 * Único lugar onde os DTOs são definidos. Os nomes dos campos precisam ser
 * idênticos aos do backend: a API ignora campos desconhecidos em silêncio.
 *
 * Convenções:
 * - Campos que o servidor pode devolver nulos são `T | null`.
 * - Dinheiro enviado como texto (`Dinheiro`, ex.: "1500.00"); recebido como número.
 * - Datas `AAAA-MM-DD` (`DataIso`); instantes ISO-8601 em UTC (`InstanteUtc`).
 */

export type DataIso = string;
export type HoraIso = string;
export type InstanteUtc = string;
/** Valor monetário enviado como texto com até 2 casas, ex.: "1500.00". */
export type Dinheiro = string;
/** Número decimal enviado como texto (litros, consumo), ex.: "250.5". */
export type Decimal = string;

// ---------- Erro ----------

export interface ErroApi {
  status: number;
  erro: string;
  detalhes: string[];
}

// ---------- Autenticação ----------

export type Perfil = 'DONO' | 'MOTORISTA';

export interface RegistroRequest {
  nomeEmpresa: string;
  nome: string;
  email: string;
  senha: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface TrocaSenhaRequest {
  senhaAtual: string;
  novaSenha: string;
}

export interface AtivacaoConviteRequest {
  token: string;
  senha: string;
}

export interface AutenticacaoResponse {
  token: string;
  nome: string;
  perfil: Perfil;
}

// ---------- Caminhões ----------

export type StatusCaminhao = 'ATIVO' | 'INATIVO' | 'EXCLUIDO';
/** Status aceitos no corpo; `EXCLUIDO` só pelo DELETE. */
export type StatusCaminhaoEditavel = 'ATIVO' | 'INATIVO';

export interface CaminhaoRequest {
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  eixos: number;
  /** Opcional no POST (padrão ATIVO); obrigatório no PUT. */
  status: StatusCaminhaoEditavel | null;
  capacidadeTanqueLitros: number | null;
}

export interface CaminhaoResponse {
  id: number;
  placa: string;
  /** Pode vir nulo em caminhões antigos. */
  marca: string | null;
  modelo: string;
  ano: number;
  /** Pode vir nulo em caminhões antigos. */
  eixos: number | null;
  status: StatusCaminhao;
  capacidadeTanqueLitros: number | null;
  inativadoEm: InstanteUtc | null;
  excluidoEm: InstanteUtc | null;
}

// ---------- Motoristas ----------

export type SituacaoMotorista = 'CONVITE_PENDENTE' | 'ATIVO' | 'INATIVO';

export interface MotoristaRequest {
  nome: string;
  email: string;
  caminhaoIds: number[] | null;
}

export interface MotoristaAtualizacaoRequest {
  nome: string;
  ativo: boolean;
}

export interface VinculosRequest {
  caminhaoIds: number[];
}

export interface MotoristaResponse {
  id: number;
  nome: string;
  email: string;
  situacao: SituacaoMotorista;
  caminhaoIds: number[];
  conviteExpiraEm: InstanteUtc | null;
}

// ---------- Viagens ----------

export type StatusViagem = 'EM_ANDAMENTO' | 'FINALIZADA' | 'CANCELADA';
export type TipoCombustivel = 'DIESEL' | 'ARLA';
export type OrigemPrecoDiesel = 'ABASTECIMENTOS_DA_VIAGEM' | 'ULTIMO_PRECO_DO_CAMINHAO' | 'SEM_REFERENCIA';

export interface AbastecimentoRequest {
  tipo: TipoCombustivel;
  data: DataIso;
  hora: HoraIso | null;
  litros: Decimal;
  valorTotal: Dinheiro;
}

export interface PedagioRequest {
  data: DataIso;
  valor: Dinheiro;
}

export interface DespesaExtraRequest {
  descricao: string;
  data: DataIso;
  valor: Dinheiro;
}

export interface AbastecimentoResponse {
  id: number;
  tipo: TipoCombustivel;
  data: DataIso;
  hora: HoraIso | null;
  litros: number;
  valorTotal: number;
}

export interface PedagioResponse {
  id: number;
  data: DataIso;
  valor: number;
}

export interface DespesaExtraResponse {
  id: number;
  descricao: string;
  data: DataIso;
  valor: number;
}

export interface AberturaViagemRequest {
  caminhaoId: number;
  motoristaId: number | null;
  dataInicio: DataIso;
  origem: string | null;
  destino: string | null;
  valorFrete: Dinheiro | null;
  kmInicialVazio: number | null;
  kmInicialCarregado: number | null;
  consumoMedioVazio: Decimal | null;
  consumoMedioCarregado: Decimal | null;
  abastecimentos: AbastecimentoRequest[] | null;
}

/** PUT integral: reenviar todos os campos, inclusive `motoristaId` (no PUT do DONO, ausente remove o responsável). */
export interface AlteracaoViagemRequest {
  dataInicio: DataIso;
  origem: string | null;
  destino: string | null;
  valorFrete: Dinheiro | null;
  kmInicialVazio: number | null;
  kmInicialCarregado: number | null;
  consumoMedioVazio: Decimal | null;
  consumoMedioCarregado: Decimal | null;
  /** Só em viagem encerrada. */
  dataFim: DataIso | null;
  /** Só em viagem encerrada. */
  kmFinalCarregado: number | null;
  motoristaId: number | null;
}

export interface FinalizacaoViagemRequest {
  dataFim: DataIso;
  kmFinalCarregado: number;
  consumoMedioVazio: Decimal | null;
  consumoMedioCarregado: Decimal | null;
}

export interface CancelamentoViagemRequest {
  motivo: string;
  dataFim: DataIso | null;
  kmFinalCarregado: number | null;
  consumoMedioVazio: Decimal | null;
  consumoMedioCarregado: Decimal | null;
}

export interface ViagemHistoricaRequest {
  caminhaoId: number;
  motoristaId: number | null;
  dataInicio: DataIso;
  dataFim: DataIso;
  origem: string;
  destino: string;
  valorFrete: Dinheiro;
  kmInicialVazio: number | null;
  kmInicialCarregado: number;
  kmFinalCarregado: number;
  consumoMedioVazio: Decimal | null;
  consumoMedioCarregado: Decimal;
  abastecimentos: AbastecimentoRequest[] | null;
  pedagios: PedagioRequest[] | null;
  despesasExtras: DespesaExtraRequest[] | null;
}

export interface ViagemResumoResponse {
  id: number;
  caminhaoId: number;
  placa: string;
  motoristaId: number | null;
  motoristaNome: string | null;
  status: StatusViagem;
  origem: string | null;
  destino: string | null;
  dataInicio: DataIso;
  dataFim: DataIso | null;
  valorFrete: number | null;
  kmVazio: number | null;
  kmCarregado: number | null;
  /** Nulo para o MOTORISTA e quando não calculável. */
  custoOperacionalTotal: number | null;
  lucro: number | null;
  margemPercentual: number | null;
  calculoCompleto: boolean | null;
}

export interface PoliticaCalculo {
  versao: string;
  precoDieselMinimo: number;
  precoDieselMaximo: number;
  consumoMinimo: number;
  consumoMaximo: number;
}

export interface RentabilidadeResponse {
  receita: number | null;
  kmVazio: number | null;
  kmCarregado: number | null;
  litrosEstimadosVazio: number | null;
  litrosEstimadosCarregado: number | null;
  precoMedioDiesel: number | null;
  origemPrecoDiesel: OrigemPrecoDiesel;
  viagemReferenciaPrecoDieselId: number | null;
  referenciaPrecoConsolidadaEm: InstanteUtc | null;
  custoDieselVazio: number | null;
  custoDieselCarregado: number | null;
  custoArla: number | null;
  pedagios: number | null;
  despesasExtras: number | null;
  custoOperacionalTotal: number | null;
  lucro: number | null;
  margemPercentual: number | null;
  calculoCompleto: boolean;
  pendencias: string[];
  politicaCalculo: PoliticaCalculo | null;
  /** Nulo = cálculo ao vivo (em andamento); preenchido = fotografia gravada. */
  resultadoConsolidadoEm: InstanteUtc | null;
}

export interface ViagemResponse {
  id: number;
  caminhaoId: number;
  placa: string;
  motoristaId: number | null;
  motoristaNome: string | null;
  status: StatusViagem;
  origem: string | null;
  destino: string | null;
  dataInicio: DataIso;
  dataFim: DataIso | null;
  valorFrete: number | null;
  kmInicialVazio: number | null;
  kmFinalVazio: number | null;
  kmInicialCarregado: number | null;
  kmFinalCarregado: number | null;
  consumoMedioVazio: number | null;
  consumoMedioCarregado: number | null;
  criadaEm: InstanteUtc;
  atualizadaEm: InstanteUtc;
  finalizadaEm: InstanteUtc | null;
  cadastroRetroativoEm: InstanteUtc | null;
  canceladaEm: InstanteUtc | null;
  motivoCancelamento: string | null;
  abastecimentosDiesel: AbastecimentoResponse[];
  abastecimentosArla: AbastecimentoResponse[];
  pedagios: PedagioResponse[];
  despesasExtras: DespesaExtraResponse[];
  /** Nulo para o MOTORISTA. */
  rentabilidade: RentabilidadeResponse | null;
}

// ---------- Auditoria ----------

export type EntidadeAuditada = 'VIAGEM' | 'ABASTECIMENTO' | 'PEDAGIO' | 'DESPESA_EXTRA';

export interface AlteracaoViagemResponse {
  id: number;
  alteradaEm: InstanteUtc;
  usuarioId: number;
  usuarioNome: string;
  perfil: Perfil;
  entidade: EntidadeAuditada;
  registroId: number;
  campo: string;
  valorAnterior: string | null;
  valorNovo: string | null;
}

export interface FotografiaAnteriorResponse {
  id: number;
  substituidaEm: InstanteUtc;
  substituidaPorId: number;
  substituidaPorNome: string;
  perfil: Perfil;
  /** Formato de `rentabilidade` daquele momento; tratar como JSON flexível. */
  resultado: Partial<RentabilidadeResponse> & Record<string, unknown>;
  resultadoNovo: (Partial<RentabilidadeResponse> & Record<string, unknown>) | null;
}

// ---------- Indicadores ----------

export interface FiltroPeriodo {
  ano?: number;
  mes?: number;
  semana?: DataIso;
  de?: DataIso;
  ate?: DataIso;
  caminhaoId?: number;
}

export interface IndicadoresResponse {
  de: DataIso | null;
  ate: DataIso | null;
  caminhaoId: number | null;
  criterioPeriodo: 'DATA_FIM';
  viagensFinalizadas: number;
  viagensConsideradas: number;
  viagensIncompletas: number;
  viagensComCalculoIncompleto: number[];
  valorFreteIncompletasNaoIncluido: number;
  receitaTotal: number;
  custoDieselVazio: number;
  custoDieselCarregado: number;
  custoArla: number;
  pedagios: number;
  despesasExtras: number;
  custoOperacionalTotal: number;
  lucroTotal: number;
  margemPercentual: number | null;
  kmVazio: number;
  kmCarregado: number;
  custoPorKm: number | null;
  lucroPorKm: number | null;
  percentualKmVazio: number | null;
  consumoMedioKmPorLitro: number | null;
  dieselPago: number;
  dieselEstimado: number;
  diferencaDieselPagoEstimado: number;
  quantidadeManutencoes: number;
  custoManutencoes: number;
  resultadoAposManutencoes: number;
  viagensCanceladas: number;
  canceladasComCustoIncompleto: number[];
  receitaCanceladas: number;
  custoCanceladas: number;
  resultadoCanceladas: number;
  resultadoFinanceiroPeriodo: number;
}

export interface IndicadoresPorCaminhaoResponse {
  caminhaoId: number;
  placa: string;
  indicadores: IndicadoresResponse;
}

// ---------- Manutenções ----------

export interface ManutencaoRequest {
  caminhaoId: number;
  data: DataIso;
  descricao: string;
  valor: Dinheiro;
}

export interface ManutencaoResponse {
  id: number;
  caminhaoId: number;
  placa: string;
  data: DataIso;
  descricao: string;
  valor: number;
  criadaEm: InstanteUtc;
  atualizadaEm: InstanteUtc;
  excluidaEm: InstanteUtc | null;
}
