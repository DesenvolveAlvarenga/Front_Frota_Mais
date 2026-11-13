/**
 * DADOS DE DEMONSTRAÇÃO — fictícios, sem relação com dados reais.
 * Usados só enquanto a integração com a API não existe; serão substituídos
 * pelas respostas de GET /api/caminhoes. Tipados com o DTO oficial.
 */
import { CaminhaoResponse } from '../core/modelos/api.modelos';

/**
 * Resposta que o servidor daria ao DONO com `incluirExcluidos=true`.
 * Sem o parâmetro, o servidor omite os `EXCLUIDO` (a tela reproduz isso).
 */
export const CAMINHOES_DONO_MOCK: CaminhaoResponse[] = [
  {
    id: 1, placa: 'BCB8H89', marca: 'Scania', modelo: '440', ano: 2026, eixos: 6,
    status: 'ATIVO', capacidadeTanqueLitros: 600, inativadoEm: null, excluidoEm: null
  },
  {
    id: 4, placa: 'DEM0A01', marca: 'Volvo', modelo: 'FH 460', ano: 2015, eixos: 5,
    status: 'EXCLUIDO', capacidadeTanqueLitros: null, inativadoEm: null, excluidoEm: '2026-08-02T14:20:00Z'
  },
  {
    id: 3, placa: 'DEM1B22', marca: null, modelo: 'Atego 2430', ano: 2012, eixos: null,
    status: 'INATIVO', capacidadeTanqueLitros: null, inativadoEm: '2026-10-05T12:00:00Z', excluidoEm: null
  },
  {
    id: 2, placa: 'QIT2E40', marca: 'Scania', modelo: '440', ano: 2026, eixos: 6,
    status: 'ATIVO', capacidadeTanqueLitros: 700, inativadoEm: null, excluidoEm: null
  }
];

/** Resposta que o servidor daria ao MOTORISTA: só os caminhões vinculados a ele e não excluídos. */
export const CAMINHOES_MOTORISTA_MOCK: CaminhaoResponse[] = [CAMINHOES_DONO_MOCK[0]];
