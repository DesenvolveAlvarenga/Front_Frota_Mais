import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { CaminhaoRequest, CaminhaoResponse, StatusCaminhaoEditavel } from '../../../core/modelos/api.modelos';

/** Valores do formulário de caminhão (campos do CaminhaoRequest, como o usuário digita). */
export interface ValorFormularioCaminhao {
  placa: string;
  marca: string;
  modelo: string;
  ano: number | null;
  eixos: number | null;
  capacidadeTanqueLitros: number | null;
  status: StatusCaminhaoEditavel;
}

/** Status oferecidos no formulário. `EXCLUIDO` só existe pela exclusão lógica (DELETE). */
export const STATUS_EDITAVEIS: StatusCaminhaoEditavel[] = ['ATIVO', 'INATIVO'];

export const LIMITES_CAMINHAO = {
  placaMaxDigitada: 12,
  placaMaxNormalizada: 8,
  marcaMax: 60,
  modeloMax: 80,
  anoMin: 1950,
  anoMax: 2100,
  eixosMin: 1,
  eixosMax: 20
} as const;

/**
 * Placa: o servidor normaliza (maiúsculas, só letras e números) e exige de 1 a 8
 * caracteres depois disso. Aqui só avisamos antes de enviar; quem normaliza é o servidor.
 */
export const placaValidator: ValidatorFn = (controle: AbstractControl): ValidationErrors | null => {
  const valor = String(controle.value ?? '');
  if (!valor.trim()) return null;
  const normalizada = valor.replace(/[^\p{L}\p{N}]/gu, '');
  if (normalizada.length < 1 || normalizada.length > LIMITES_CAMINHAO.placaMaxNormalizada) {
    return { placaInvalida: true };
  }
  return null;
};

/** Pré-preenchimento: no PUT (substituição integral) todos os campos atuais precisam voltar. */
export function valoresIniciaisCaminhao(caminhao: CaminhaoResponse | null): ValorFormularioCaminhao {
  if (!caminhao) {
    return { placa: '', marca: '', modelo: '', ano: null, eixos: null, capacidadeTanqueLitros: null, status: 'ATIVO' };
  }
  return {
    placa: caminhao.placa,
    marca: caminhao.marca ?? '',
    modelo: caminhao.modelo,
    ano: caminhao.ano,
    eixos: caminhao.eixos,
    capacidadeTanqueLitros: caminhao.capacidadeTanqueLitros,
    // Um caminhão EXCLUIDO não é editado; o valor só preenche a visualização.
    status: caminhao.status === 'INATIVO' ? 'INATIVO' : 'ATIVO'
  };
}

/** Corpo do POST/PUT /api/caminhoes. `status` sempre enviado (obrigatório no PUT). */
export function paraCaminhaoRequest(valor: ValorFormularioCaminhao): CaminhaoRequest {
  return {
    placa: valor.placa.trim(),
    marca: valor.marca.trim(),
    modelo: valor.modelo.trim(),
    ano: Number(valor.ano),
    eixos: Number(valor.eixos),
    status: valor.status,
    capacidadeTanqueLitros: valor.capacidadeTanqueLitros === null ? null : Number(valor.capacidadeTanqueLitros)
  };
}

/** Caminhões antigos podem ter marca/eixos nulos; o PUT exige os dois. */
export function caminhaoCadastroIncompleto(caminhao: CaminhaoResponse): boolean {
  return caminhao.marca === null || caminhao.eixos === null;
}
