import { Pipe, PipeTransform } from '@angular/core';
import { InstanteUtc, SituacaoMotorista, StatusCaminhao } from '../core/modelos/api.modelos';

/** Fuso usado para exibir instantes e calcular "hoje" (regra do produto). */
export const FUSO_BRASILIA = 'America/Sao_Paulo';

const FORMATO_INSTANTE = new Intl.DateTimeFormat('pt-BR', {
  timeZone: FUSO_BRASILIA,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

/** Instante UTC da API → "dd/mm/aaaa hh:mm" no horário de Brasília. */
export function formatarInstante(instante: InstanteUtc | null | undefined): string {
  if (!instante) return '—';
  const data = new Date(instante);
  return Number.isNaN(data.getTime()) ? '—' : FORMATO_INSTANTE.format(data).replace(',', '');
}

@Pipe({ name: 'instante', standalone: false })
export class InstantePipe implements PipeTransform {
  transform(valor: InstanteUtc | null | undefined): string {
    return formatarInstante(valor);
  }
}

export const ROTULO_STATUS_CAMINHAO: Record<StatusCaminhao, string> = {
  ATIVO: 'Ativo',
  INATIVO: 'Inativo',
  EXCLUIDO: 'Excluído'
};

export const ROTULO_SITUACAO_MOTORISTA: Record<SituacaoMotorista, string> = {
  CONVITE_PENDENTE: 'Convite pendente',
  ATIVO: 'Ativo',
  INATIVO: 'Inativo'
};
