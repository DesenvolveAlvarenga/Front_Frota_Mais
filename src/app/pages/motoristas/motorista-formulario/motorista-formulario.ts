import {
  CaminhaoResponse, MotoristaAtualizacaoRequest, MotoristaRequest, MotoristaResponse, VinculosRequest
} from '../../../core/modelos/api.modelos';

export const LIMITES_MOTORISTA = { nomeMax: 120, emailMax: 160 } as const;

/** Corpo do POST /api/motoristas (envia o convite por e-mail). */
export function paraMotoristaRequest(nome: string, email: string, caminhaoIds: number[]): MotoristaRequest {
  return { nome: nome.trim(), email: email.trim(), caminhaoIds: [...new Set(caminhaoIds)] };
}

/**
 * Corpo do PUT /api/motoristas/{id} (substituição integral; o e-mail não muda).
 * Conta com convite pendente não pode ser ativada pelo DONO (409): envia `false`.
 */
export function paraAtualizacaoRequest(motorista: MotoristaResponse, nome: string, ativo: boolean): MotoristaAtualizacaoRequest {
  return { nome: nome.trim(), ativo: motorista.situacao === 'CONVITE_PENDENTE' ? false : ativo };
}

/** Corpo do PUT /api/motoristas/{id}/caminhoes: a lista **completa** (vazia remove todos). */
export function paraVinculosRequest(caminhaoIds: number[]): VinculosRequest {
  return { caminhaoIds: [...new Set(caminhaoIds)] };
}

/** Caminhões que podem ser vinculados: todos os não excluídos (inativo pode). */
export function caminhoesVinculaveis(caminhoes: CaminhaoResponse[]): CaminhaoResponse[] {
  return caminhoes.filter(c => c.status !== 'EXCLUIDO');
}

/**
 * Ids vinculados que não podem ser reenviados (caminhão excluído ou desconhecido):
 * a API recusa vínculo com excluído (409), então eles saem da lista ao salvar.
 */
export function vinculosNaoReenviaveis(caminhaoIds: number[], caminhoes: CaminhaoResponse[]): number[] {
  const vinculaveis = new Set(caminhoesVinculaveis(caminhoes).map(c => c.id));
  return caminhaoIds.filter(id => !vinculaveis.has(id));
}
