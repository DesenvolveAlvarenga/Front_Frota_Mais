/**
 * DADOS DE DEMONSTRAÇÃO — fictícios (domínio exemplo.com).
 * Usados só enquanto a integração com a API não existe; serão substituídos
 * pelas respostas de GET /api/motoristas. Tipados com o DTO oficial.
 */
import { MotoristaResponse } from '../core/modelos/api.modelos';

/** Ordem por nome, como a API devolve. */
export const MOTORISTAS_MOCK: MotoristaResponse[] = [
  {
    id: 31, nome: 'Carlos Lima', email: 'carlos@exemplo.com', situacao: 'ATIVO',
    caminhaoIds: [1], conviteExpiraEm: null
  },
  {
    id: 34, nome: 'Davi Rocha', email: 'davi@exemplo.com', situacao: 'CONVITE_PENDENTE',
    // Convite expirado ou cancelado: a conta continua aguardando um novo convite.
    caminhaoIds: [], conviteExpiraEm: null
  },
  {
    id: 33, nome: 'João Pereira', email: 'joao@exemplo.com', situacao: 'CONVITE_PENDENTE',
    caminhaoIds: [2], conviteExpiraEm: '2026-11-14T15:00:00Z'
  },
  {
    id: 32, nome: 'Marcos Souza', email: 'marcos@exemplo.com', situacao: 'INATIVO',
    // Vínculo com caminhão excluído (id 4) é preservado na resposta da API.
    caminhaoIds: [3, 4], conviteExpiraEm: null
  }
];
