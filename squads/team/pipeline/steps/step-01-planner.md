---
execution: inline
agent: squads/team/agents/planejamento
inputFile: squads/team/output/internal/brief.md
outputFile: squads/team/output/internal/plano.md
---

# Step 01: Planning — Planejamento

## Context Loading

Carregue os arquivos abaixo antes de executar:
- `squads/team/output/{run_id}/internal/brief.md` — brief inicial do usuário coletado no step-00
- `_opensquad/_memory/company.md` — contexto da empresa (brand, calendário existente)
- `_opensquad/_memory/preferences.md` — preferências do usuário
- `squads/team/pipeline/data/domain-framework.md` — metodologia da pipeline
- `squads/team/pipeline/data/campaign-delivery-system.md` — estrutura de campanha completa, pasta de entrega, imagens, anuncios, copies e calendario
- `squads/team/pipeline/data/gpt-image-kv-system.md` — regra de KV integrado via `gpt_image_2` com referencia de KV obrigatoria
- `squads/team/pipeline/data/headline-intelligence-system.md` — padroes de headlines/case names de campanhas premiadas recentes
- `squads/team/pipeline/data/quality-criteria.md` — DoD e rubricas
- `squads/team/pipeline/data/expertise/planner.md` — repertório avançado de planejamento, estratégia, risco, dependências e decisão

## Instructions

### Process

1. Leia o brief integral. Extraia: objetivo, público, ação esperada, formato preferido, prazo, restrições.
2. Classifique o escopo como **peca unica**, **pacote de campanha** ou **campanha completa**. Se houver imagens + copy + calendario + anuncios, classifique como campanha completa.
3. Identifique a **data de publicação alvo**. Se não estiver no brief, infera a partir do tempo de produção típico do formato (ex: campanha completa = 10-15 dias) e proponha.
4. Aplique **backward planning** a partir da data de publicação: liste todos os entregáveis necessários (peça principal + derivadas + assets).
5. Para campanha completa, inclua obrigatoriamente: `projeto.md`, `copy-pack.md`, KV integrado via `gpt_image_2`, imagens principais/secundarias sem lettering quando necessarias, anuncios 9:16/4:5/16:9, calendario Notion MCP ou importavel e `handoff.md`. Nao inclua video/motion no escopo do `/team`.
6. Se houver KV/campanha, coloque `KV / Key Visual` como entregável obrigatório e marque como bloqueado se faltarem logotipo do cliente, referencia de KV com lettering ou brand kit.
7. Para cada tarefa/entregável, liste os **agentes envolvidos** e a função de cada um naquela tarefa.
8. Para cada entregável, escreva uma **Definition of Done** clara (1 frase, verificável).
9. Identifique **dependências** entre entregáveis e marque o **critical path**.
10. Mapeie **riscos** (atrasos, gargalos de recurso, aprovações lentas) e o **plano B** de cada um.

### Decision Criteria

- Se brief insuficiente em ≥1 dos 4 vértices (quem/o quê/por quê/quando), devolva pergunta direcionada antes de planejar.
- Se prazo é inviável dado o escopo, proponha 2 alternativas: cortar escopo OU estender prazo.
- Se há mais de 5 entregáveis em peca unica, sugira priorização (hero + 3 derivadas, resto fica em segunda onda).
- Se o usuario pediu campanha completa, nao corte imagens, anuncios, copy-pack ou calendario sem aprovacao humana. Reorganize em ondas se necessario.

## Output Format

```markdown
# Plano — {nome da peça}

## Resumo
- **Objetivo**: ...
- **Público**: ...
- **Ação esperada**: ...
- **Formato hero**: ...
- **Data publicação**: AAAA-MM-DD

## Entregáveis
| # | Peça | Formato | DoD | Responsável | Prazo |
|---|------|---------|-----|-------------|-------|
| 1 | KV master | 4:5 / 9:16 / 16:9 | ... | Arte + Operação | D-1 |
| ... |

## Agentes por tarefa
| Tarefa | Agentes usados | Por que entram |
|---|---|---|
| KV / Key Visual | Arte + Operação + image-ai-generator | Arte define sistema, referência de KV e prompt; Operação executa/organiza render via `gpt_image_2`; image-ai-generator produz quando aprovado |
| ... | ... | ... |

## Pacote de campanha (se aplicavel)
- Projeto: ...
- Imagens: KV via `gpt_image_2`, principais (...), secundarias (...)
- Anuncios: 9:16 (...), 4:5 (...), 16:9 (...)
- Copies: campanha, posts, ads, emails
- Calendario: Notion MCP ou `final/calendar/calendar.csv`
- Handoff: ...

## Cronograma (backward)
- D-7: Brief aprovado (hoje)
- D-6: Conceito aprovado
- D-5: Roteiro aprovado
- D-3: Storyboard aprovado
- D-1: Master pronto
- D0: Publicar

## Critical path
{caminho crítico marcado}

## Riscos & Plano B
- Risco 1: ... → Plano B: ...
```

## Output Example

```markdown
# Plano — Campanha "3 erros que matam sua copy"

## Resumo
- **Objetivo**: gerar salvamentos e nutrir base de copywriters iniciantes
- **Público**: empreendedores 25-40 que vendem online e travam na hora de escrever
- **Ação esperada**: salvar o post + comentar com número do erro que mais pega
- **Formato hero**: KV 4:5 + variações 9:16 e 16:9
- **Data publicação**: 2026-05-29 (quinta, 19h)

## Entregáveis
| # | Peça | Formato | DoD | Responsável | Prazo |
|---|------|---------|-----|-------------|-------|
| 1 | KV master | 4:5 | gerado via `gpt_image_2` com referência de KV e texto correto | Operação | D-1 |
| 2 | Carrossel | 7 slides 1:1 | mesmo conceito em sequência estática | Edição | D0 |
| 3 | Newsletter | 300 palavras | expansão do tema com 1 exemplo extra | Transformação | D+1 |

## Cronograma
- D-5 (2026-05-24): brief OK
- D-4 (2026-05-25): conceito OK
- D-3 (2026-05-26): roteiro OK
- D-2 (2026-05-27): storyboard + arte OK
- D-1 (2026-05-28): master pronto
- D0 (2026-05-29 19h): publicar KV/post + carrossel

## Critical path
Copy-pack → referência de KV → KV master → adaptações (qualquer atraso aqui empurra publicação)

## Riscos & Plano B
- Falta de imagem de referência para KV → Plano B: bloquear KV final e pedir referência com lettering ao usuário
- Imagem solta de apoio não funcionar → Plano B: gerar novo asset sem lettering via Higgsfield CLI + Nano Banana 2 ou criar manualmente em template
```

## Veto Conditions

Reject and redo if ANY are true:
1. Plano contém `[TBD]` ou entregável sem responsável.
2. Data de publicação não consta ou cronograma não é backward.
3. Nenhum critical path identificado quando há ≥3 entregáveis.
4. Campanha completa sem pacote de campanha declarado.

## Quality Criteria

- [ ] Plano cabe em 1 página
- [ ] Cada entregável tem DoD escrito
- [ ] Cronograma é backward planning a partir da data de publicação
- [ ] Dependências e bloqueios mapeados
- [ ] Riscos com plano B documentados
- [ ] Se campanha completa, pacote com projeto, KV, imagens, anuncios, copies, calendario e handoff
- [ ] Se houver KV, dependências de logotipo, referência de KV com lettering e brand kit mapeadas
- [ ] Cada tarefa lista agentes envolvidos e função de cada um
