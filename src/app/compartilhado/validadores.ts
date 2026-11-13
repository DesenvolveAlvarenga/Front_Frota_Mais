import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Política de senha nova (registro, ativação e troca): 8 caracteres a 72 bytes
 * em UTF-8, com ao menos uma letra e um número. Validação só de ajuda ao
 * usuário; o servidor confere de novo.
 */
export const senhaNovaValidator: ValidatorFn = (controle: AbstractControl): ValidationErrors | null => {
  const valor = String(controle.value ?? '');
  if (!valor) return null;
  const erros: ValidationErrors = {};
  if ([...valor].length < 8) erros['senhaCurta'] = true;
  if (new TextEncoder().encode(valor).length > 72) erros['senhaLonga'] = true;
  if (!/\p{L}/u.test(valor) || !/\d/.test(valor)) erros['senhaLetraNumero'] = true;
  return Object.keys(erros).length ? erros : null;
};

/** Grupo com `senha` e `confirmacao` iguais. */
export const confirmacaoSenhaValidator: ValidatorFn = (grupo: AbstractControl): ValidationErrors | null => {
  const senha = grupo.get('senha')?.value;
  const confirmacao = grupo.get('confirmacao')?.value;
  return senha && confirmacao && senha !== confirmacao ? { confirmacaoDiferente: true } : null;
};

/** Número inteiro (km, ano, eixos, litros do tanque). Vazio é tratado pelo `required`. */
export const inteiroValidator: ValidatorFn = (controle: AbstractControl): ValidationErrors | null => {
  const valor = controle.value;
  if (valor === null || valor === undefined || valor === '') return null;
  return Number.isInteger(Number(valor)) ? null : { inteiro: true };
};
