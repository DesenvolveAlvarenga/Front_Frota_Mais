# CLAUDE.md — Frontend Frota+

Instruções permanentes para o Claude Code neste repositório. Leia este arquivo inteiro antes de cada tarefa.

## 1. Produto

**Frota+** — "Gestão que move resultados."
Gestão de viagens, custos e rentabilidade de pequenos transportadores (caminhoneiros autônomos e donos de pequenas frotas).

O sistema controla caminhões, motoristas, fretes (viagens), quilometragem vazia e carregada, abastecimentos de diesel e Arla, pedágios, despesas extras, manutenções, rentabilidade e indicadores. Os fluxos do motorista são usados no celular: lançamento rápido, poucos campos, mobile first.

## 2. Contexto privado de integração (leitura obrigatória)

- Caminho: `contexto-local/CONTEXTO_INTEGRACAO_FRONTEND_FROTA_MAIS.md`
- A pasta `contexto-local/` é **ignorada pelo Git** e o documento é de **distribuição controlada**.
- **Consulte-o antes de qualquer tarefa** que envolva comportamento do produto, regras de negócio, permissões, DTOs ou chamadas à API. Ele contém os 41 endpoints, DTOs, enums, códigos de erro, matriz de permissões e regras financeiras.
- **Se o arquivo não existir**, avise o responsável antes de implementar qualquer integração. Não preencha lacunas com conhecimento genérico sobre transporte.
- **Nunca** copie o documento (inteiro ou em grandes trechos) para `CLAUDE.md`, README, código-fonte, comentários, commits, exemplos ou documentação pública. Nunca adicione `contexto-local/` ao Git (confira com `git check-ignore -v contexto-local/<arquivo>`).
- Seções mais consultadas: **D** (contrato e DTOs), **G** (regras financeiras), **H** (fluxos obrigatórios × sugestões de tela), **I** (integração e erros), **J** (matriz do que existe), **K** (limitações, divergências e a lista K.4 de decisões que o Claude **não** toma sozinho).

### Hierarquia em caso de conflito

1. Instruções explícitas mais recentes do proprietário do produto.
2. Regras de negócio privadas aprovadas (versão 1.2).
3. Contrato e comportamento efetivamente implementados no backend.
4. Documentação técnica do backend.
5. Documentação antiga e comentários históricos do frontend (inclui `LEIA-ME.md`).

## 3. Stack e arquitetura reais

| Item | Situação |
|---|---|
| Framework | Angular **20.3** (CLI 20.3, builder `@angular/build:application`) |
| Linguagem | TypeScript **5.9**, `strict` + `strictTemplates` |
| Componentes | Angular Material / CDK **20.2**, tema pré-pronto `azure-blue` (em `angular.json`) |
| Organização | **NgModules** com componentes `standalone: false` (schematic configurado em `angular.json`) |
| Rotas | `RouterModule.forRoot` em `src/app/app-routing.module.ts`; cada página é um módulo **lazy** com `RouterModule.forChild` |
| Estilos | CSS puro (`src/styles.css` global + CSS por componente); fonte Inter (Google Fonts) |
| Estado | Nenhum gerenciador; RxJS 7.8 disponível |
| Formulários | Reactive Forms (`@angular/forms`) nas telas de acesso, caminhões e motoristas |
| HTTP | Ainda não existe (`HttpClient` não configurado) |
| Testes | Karma + Jasmine (`@angular/build:karma`, `karma.conf.js`). `npm test` (observa) e `npm run test:ci` (uma execução). Navegador: Chromium headless do Puppeteer em `~/.cache/puppeteer` (fora do repositório; `CHROME_BIN` tem prioridade). No Codespaces, o Chromium precisa das bibliotecas de sistema (libatk, libnss3, libgbm etc.) instaladas via `apt`. |
| Lint | **Nenhum** linter configurado |
| Gerenciador | npm (`package-lock.json` versionado); Node exigido `^20.19 \|\| ^22.12 \|\| ^24` |

Scripts: `npm start` (ng serve, porta 4200), `npm run build` (produção em `dist/modelo-projeto-integrador/browser`), `npm run watch`, `npm test`, `npm run test:ci`.

Estrutura:

```text
src/app/
  app.module.ts, app-routing.module.ts, app.component.ts
  layout/            LayoutModule + LayoutComponent (sidenav, topo, rodapé, router-outlet)
  pages/<pagina>/    <pagina>.module.ts + <pagina>.component.{ts,html}
public/imagens/      logo.png e ícones SVG do menu
```

Para criar uma página, siga o padrão de `pages/caminhoes` (módulo próprio, componente `standalone: false`, rota lazy declarada **antes** do `**`). Não use `RouterModule.forRoot` em módulos de página nem declare o mesmo componente em dois módulos.

### Preservação

- **Não migre** framework, linguagem, para standalone components, para outra biblioteca visual, nem troque o padrão de NgModules por preferência.
- **Preserve a identidade visual** do integrante responsável: paleta (`#0A56D0`, `#EDF2FA`, `#1b3045`, `#f4f6f9` etc.), fonte Inter, menu lateral em pílulas com ícones SVG, logo, topo e layout. Não faça redesign espontâneo; melhorias de usabilidade devem ser propostas e justificadas antes.
- Refatorações só com problema concreto e justificativa, e dentro do escopo da tarefa.

### Decisões aprovadas pelo responsável (12/11/2026)

| Tema | Decisão |
|---|---|
| Sessão | `sessionStorage` para token, nome e perfil. Limpar no logout e quando rota protegida responder `401`. Cuidados contra XSS: nada de `innerHTML`/`bypassSecurityTrust*` com dados externos. |
| Testes | Karma + Jasmine (configuração estável do Angular 20.3). **Não** usar Jest nem migrar para Vitest nesta etapa. |
| Lint | `angular-eslint` na linha principal compatível com Angular 20 (20.x), **sem** atualizar o Angular. |
| Dashboard | Cards, tabelas e indicadores da API. **Sem** biblioteca de gráficos por enquanto. |
| Identidade visual | **Atualizado em 12/11/2026:** o responsável determinou adaptar layout e telas ao **Figma** (fileKey `tDaJSlUtakCvN1bPwyuhhQ`), que passa a ser a referência visual. Fora do que o Figma define, preservar o existente. Se o Figma contrariar regra de negócio (ex.: trechos, consumo fixo, categorias de despesa, CNPJ), seguir a regra e apontar a divergência. |
| Dados mockados | Permitidos nas telas enquanto a integração não existe, **isolados** em arquivos `*.mock.ts`, tipados com os DTOs reais e substituídos pelos serviços HTTP depois. Nunca apresentados como persistidos (sem "salvo com sucesso" falso). |
| Figma × API (13/11/2026) | Formulários **ajustados à API**: remover campos sem suporte (Caminhão: Cor, Renavam, Chassi; Viagem: Data de chegada prevista, Status "Agendada", Observações; lixeira de viagens) e incluir os obrigatórios no mesmo estilo (Criar conta: Nome da empresa; Caminhão: Eixos e Tanque opcional; Viagem: "Sai vazio ou carregado?" + km, Valor do frete e seção expansível com consumos e abastecimentos anteriores). Lixeira de viagens vira "Cancelar" (só DONO, só em andamento). Mapeamento completo em `contexto-local/MAPEAMENTO_FIGMA_API.md`. |
| Telas ausentes do Figma (13/11/2026) | Criar no padrão visual do Figma (cards, modal no desktop, folha inferior no celular): detalhe da viagem, carregamento, lançamentos, finalizar, cancelar, viagem histórica, auditoria, ativação de convite, Conta e início do MOTORISTA. Revisão por grupo. |
| Motoristas (13/11/2026) | Tela própria no menu do DONO, no padrão lista + modal de Caminhões. |
| Gráficos do Dashboard (13/11/2026) | Barras e rosca em HTML/CSS/SVG, **sem biblioteca**, com valores da API; barras dos últimos 6 meses (uma chamada a `/indicadores` por mês). |
| Arquivos alheios | `package-lock.json` (alterações anteriores de `"peer": true`) e `install.cmd` **não** entram nos commits da branch de governança. Nunca usar `git add .`; adicionar arquivos nominalmente. |

## 4. Backend como fonte de verdade

- O backend (Java + Spring Boot) decide regras, permissões, validações e cálculos. O frontend exibe, coleta e orienta; **não reimplementa** regras nem cálculos.
- **Não invente** endpoints, campos, DTOs, enums, filtros, respostas, permissões ou funcionalidades. Não altere o contrato da API para acomodar uma tela.
- Lacunas conhecidas da API: sem `/api/me`, sem recuperação de senha, sem paginação, sem filtro de data em `GET /api/viagens`, sem abastecimento avulso, sem reabertura nem exclusão de viagem, sem exportação PDF/Excel, sem série histórica mensal dedicada. Quando uma tela depender de algo inexistente, **apresente a lacuna**; não simule com dados fictícios nem com estado local apresentado como persistido.
- Tipos TypeScript devem ser **fiéis aos DTOs** do contexto privado, definidos em um único lugar. A API ignora campos desconhecidos em silêncio: um nome errado vira `null` sem erro.
- **`PUT` é substituição integral:** carregue o recurso, pré-preencha o formulário e reenvie todos os campos. Cuidado com opcionais (ex.: no `PUT` de viagem do DONO, omitir `motoristaId` **remove** o responsável).
- Dinheiro: envie como **texto** (`"1500.00"`); exiba em moeda brasileira. Datas `AAAA-MM-DD`; instantes vêm em UTC e são exibidos no fuso de Brasília; "hoje" é calculado em `America/Sao_Paulo`.
- Após criar, editar ou excluir abastecimento, pedágio ou despesa extra, **recarregue o detalhe da viagem** (a resposta do lançamento não traz a rentabilidade).
- **URL da API** sempre em configuração de ambiente, nunca fixa no código. **CORS não está configurado no backend**; a proposta registrada é o proxy do `ng serve` encaminhando `/api` para a porta 8080, mas a estratégia (dev e produção) está **pendente de decisão**. Nunca peça CORS amplo (`*`).
- Não repita requisições automaticamente em `4xx`; em `409`, recarregue o recurso (o estado mudou).
- Toda tela que consulta a API tem estados de carregando, vazio (lista vazia não é erro), sucesso e falha.

## 5. Regras essenciais de negócio

### Perfis

- **DONO**: administra empresa, caminhões, motoristas (por convite), viagens, custos, manutenções, indicadores e auditoria.
- **MOTORISTA**: vê só os caminhões vinculados e opera viagens deles (abre em seu nome, altera em andamento, lança, finaliza). **Não vê** custos, lucro, margem, rentabilidade, indicadores, manutenções, auditoria nem gestão de motoristas (a API envia esses campos como `null` e responde `403` às rotas). O valor do frete ele vê.
- Ocultar menus e botões é experiência, **não segurança**. Sempre trate `403`/`404` do servidor. Não busque dados financeiros por outra rota para "completar" a tela do motorista.

### Viagem

- **Uma viagem = um frete.** Origem e destino; sem cadastro de cidades intermediárias.
- **Não existem trechos, paradas ou segmentos** como entidades. Não os implemente. Cada viagem tem no máximo um deslocamento vazio e um percurso carregado, separados por leituras de odômetro.
- O deslocamento vazio pertence ao **frete seguinte** (o que ele foi buscar).
- Estados: `EM_ANDAMENTO` → `FINALIZADA` ou `CANCELADA`. Sem reabertura, sem exclusão, sem módulo de compensação. Finalizada não é cancelada. Correções de encerradas só pelo DONO e são auditadas pelo backend.

### Abastecimentos, pedágios, despesas

- `DIESEL` e `ARLA` independentes; parciais permitidos. Abastecimento feito fora de viagem pertence ao **próximo frete**, com data real, e pode ir na abertura.
- Não crie: abastecimento avulso, estoque de combustível, lotes, FIFO, capacidade de tanque de Arla, consumo fixo do caminhão.
- Pedágio: data e valor pago, vários por viagem. Sem cálculo por eixos, tag, horário ou tabela.
- Despesa extra: descrição **livre**. Não bloqueie palavras, não crie categorias, não classifique automaticamente sem aprovação.
- Caminhão: `ATIVO`, `INATIVO`, `EXCLUIDO` (lógico, preserva histórico). Eixos são só cadastrais.

### Financeiro

- **Não calcule no frontend**: custo do diesel, rentabilidade, lucro, margem, resultado ou indicadores. Exiba o que a API devolve.
- **Diesel pago ≠ diesel consumido.** O custo é estimado pelo backend (km ÷ consumo × preço médio); o pago só forma o preço médio e aparece como informação.
- **`null` não é zero.** Mostre "não calculado" e as `pendencias` devolvidas pelo backend, sem reescrevê-las.
- Manutenções pertencem ao caminhão e ao resultado do período, não a um frete. Canceladas aparecem em bloco separado dos fretes concluídos. Fretes encerrados exibem a fotografia gravada; nunca recalcule.

## 6. Segurança

- **Autenticação:** JWT do backend em `Authorization: Bearer <token>` nas rotas protegidas (não em registro, login e ativação). Sem refresh token, sem autenticação paralela.
- **Nunca** coloque token em URL, logs, analytics ou mensagens de erro; nunca registre senhas, tokens ou credenciais no console. Na página de ativação de convite, remova o `token` da barra de endereço depois de lido.
- **Armazenamento de sessão:** `sessionStorage` (decisão aprovada, seção 3). Não mude a estratégia sem análise de impacto e nova aprovação.
- **Sair/trocar de usuário:** limpar token, perfil, nome, caches e qualquer dado em memória, para nada de uma empresa aparecer em outra sessão.
- **Erros HTTP:** decida pelo `status`, nunca pelo texto; exiba `detalhes`. `401` em rota protegida → sessão inválida (limpa e vai ao login com aviso). `401` no login → credenciais inválidas (não é sessão expirada). `400` em troca de senha → não desloga. `403` → mostra a mensagem, recarrega o estado, **não desloga**. `404` → "não encontrado" sem sugerir que o recurso existe. Tratar também `409`, `415`, `503` e `500`.
- O token decodificado sem verificação serve só para interface (`exp`, `sub`), nunca como prova de que o usuário continua ativo ou autorizado.
- **Multiempresa:** nunca envie `empresaId`; não confie em identificadores manipuláveis; não compartilhe cache entre sessões.
- **Segredos:** nada de senhas, tokens ou chaves no código; não versione `.env` (já ignorado no `.gitignore`); não imprima segredos em diagnóstico; não copie variáveis privadas do backend.
- **Dependências:** só com justificativa, sem duplicar funções, sem atualizar tudo indiscriminadamente, sem mexer no `package-lock.json` sem razão técnica.

## 7. Código, testes e qualidade

- Chamadas HTTP ficam em **serviços**, não em componentes. Separe apresentação de comunicação.
- Componentes reutilizáveis e de responsabilidade limitada; nada de componentes gigantes nem regras/modelos repetidos em vários arquivos; nada de abstrações desnecessárias.
- Formulários com validação (Reactive Forms do `@angular/forms`), estados de carregamento, sucesso, vazio e falha; responsividade; acessibilidade (rótulos, foco, contraste, `aria-*`).
- Confirmação para operações irreversíveis (cancelar viagem, excluir caminhão/manutenção, desativar motorista).
- Antes de concluir: rodar testes relacionados (quando existirem), `npm run build`, checar tipagem, fluxos de autenticação/permissão afetados, responsividade e o diff final.
- **Nunca afirme que algo foi testado sem executar.** Não desabilite testes, não remova validações e não mascare erros com dados fictícios. Teste falhando: investigue a causa antes de mudar a expectativa.

## 8. Git

- Antes de alterar: `git status`, branch atual, últimos commits, arquivos já modificados. Preserve trabalho não commitado de outras pessoas.
- **Nunca implemente na `main`.** Uma branch por tarefa: `feat/…`, `fix/…`, `refactor/…`, `docs/…`, `chore/…`.
- Proibido sem autorização explícita: commit, push, merge, stash. Sempre proibido: `git reset --hard`, `git clean`, force push, reescrever histórico, descartar alterações de terceiros, incluir arquivos privados (`contexto-local/`, `.env`) em commits.
- Commits pequenos, objetivos, descrevendo exatamente o que mudou.

## 9. Fluxo de trabalho em toda sessão

Antes de cada tarefa:
1. Ler este `CLAUDE.md`.
2. Ler o contexto privado em `contexto-local/` (avisar se ausente ou incompleto para o que a tarefa exige).
3. Conferir o Git.
4. Entender o comportamento atual dos componentes que serão alterados.
5. Conferir o contrato da API envolvido.
6. Identificar dependências e riscos.

Durante:
- Explicar o que pretende alterar antes de mudanças relevantes; trabalhar em etapas coerentes.
- Não sair do escopo: sem refatorações paralelas, sem mexer em telas fora da tarefa, sem bibliotecas sem justificativa, sem ignorar erros ou alertas relevantes.
- Não inventar regras de produto nem alterar a API.

Ao terminar, informar: arquivos alterados, o que foi feito, testes executados e resultados, limitações e pendências, riscos, e o estado do Git. Não fazer push nem merge.

## 10. Divergências e decisões pendentes

Quando uma regra não estiver definida ou frontend e backend divergirem:
1. Não presumir.
2. Não implementar uma escolha de negócio unilateralmente.
3. Apresentar as alternativas.
4. Explicar os impactos de cada uma.
5. Solicitar decisão do proprietário do produto.

Itens marcados **[PENDENTE]** no contexto privado e todos os itens da seção **K.4** exigem decisão do proprietário. Exemplos: restringir o motorista aos próprios lançamentos, onde ficam as ações de motoristas, rótulos "Margem Média" e "R$/Km", estratégia de CORS/publicação, tratamento de despesas após o cancelamento. A prioridade é a consistência do produto, não terminar a tela.
