---
execution: subagent
agent: squads/team/agents/sondagem
inputFile: squads/team/output/internal/plano.md
outputFile: squads/team/output/internal/dossie.md
model_tier: fast
---

# Step 02: Research — Sondagem

## Context Loading

Carregue antes de executar:
- `squads/team/output/{run_id}/internal/brief.md` — para entender o tema
- `squads/team/output/{run_id}/internal/plano.md` — para saber data e formato (orienta tipo de pesquisa)
- `squads/team/pipeline/data/research-brief.md` — frameworks e referências de método
- `squads/team/pipeline/data/quality-criteria.md` — critérios mínimos do dossiê
- `squads/team/pipeline/data/expertise/scout.md` — repertório avançado de pesquisa, etnografia digital, fontes, triangulação e trend intelligence

Skills disponíveis: `web_search`, `web_fetch`.

## Instructions

### Process

1. Identifique no brief o **tema central** e **3-5 subtemas adjacentes**.
2. Pesquise em **3 frentes paralelas**:
   - **Tendências da categoria**: o que está acontecendo agora no nicho (últimos 30 dias)
   - **Audiência**: linguagem, dor, desejo do público alvo — vá em fontes primárias (comentários reais, fóruns, lives, Reviews)
   - **Referências de execução**: 5+ peças que funcionaram em formato similar (cite engajamento)
3. Para cada fonte: anote URL, data de publicação, e classifique como **primária** (audiência direta) ou **secundária** (curador).
4. Separe rigorosamente **dado** (fato verificável) de **opinião** (interpretação).
5. Identifique **pelo menos 3 padrões** que se repetem nas referências (estrutura, vocabulário, hook).
6. Sintetize tudo em um dossiê de 1-2 páginas pronto para Conceito.
7. Escreva a sintese pensando que ela sera renderizada no `documentos/documento-do-projeto.pdf` para aprovacao do usuario. O usuario aprova pelo PDF, nao pelo markdown interno.

### Decision Criteria

- Se menos de 5 fontes encontradas, expanda subtemas antes de fechar.
- Se todas as fontes são secundárias, busque ao menos 1 primária (comentário, fórum, transcrição de live).
- Se tendência tem volume mas não velocidade, descarte (não é tendência, é categoria estável).

## Output Format

```markdown
# Dossiê — {tema}

## Síntese (3 linhas)
{o ângulo mais promissor + 1 dado de suporte + 1 risco}

## Tendências da categoria (últimos 30 dias)
| Sinal | Fonte | Data | Velocidade |
|-------|-------|------|------------|

## Audiência — linguagem, dor, desejo
- **Como falam**: ...
- **Dor recorrente**: ...
- **Desejo declarado**: ...
- Fontes primárias usadas: [link, link, link]

## Referências de execução (peças que funcionaram)
| Peça | Canal | Engajamento | Por que funcionou |

## Padrões identificados
1. ...
2. ...
3. ...

## Recomendações para Conceito
- Ângulo promissor 1: ...
- Ângulo promissor 2: ...
- Armadilhas a evitar: ...

## Bloco para aprovacao no PDF
- O que recomendamos aprovar: ...
- O que ainda depende de informacao do usuario: ...
- Referencias que precisam ser validadas: ...
```

## Output Example

```markdown
# Dossiê — copywriting para empreendedores iniciantes

## Síntese
Ângulo mais promissor: comparar copy ruim a comportamento social inadequado (metáfora). Sustenta dado: 67% dos posts de copy salvos no IG nos últimos 30 dias usam metáfora extrabranch. Risco: pode soar moralista se exagerar.

## Tendências (últimos 30 dias)
| Sinal | Fonte | Data | Velocidade |
|-------|-------|------|------------|
| Crescimento de "anti-templates" | IG @paulovieira | 2026-05-12 | +180% saves/sem |
| Hook em formato "X erros" | Instagram/LinkedIn #copywriting | 2026-05-15 | +210% salvamentos/cliques |
| Anti-AI copy (humanização) | LinkedIn pulse | 2026-05-08 | +90% reposts |

## Audiência
- **Como falam**: "travei na hora de escrever", "não sei o que falar", "copia tudo igual"
- **Dor recorrente**: medo de soar "vendedor demais"
- **Desejo declarado**: "queria saber o que escrever toda vez"
- Fontes primárias: thread r/Brasil, comentários do live @copyqueen, fórum NTopMarkting

## Referências
| Peça | Canal | Engajamento | Por que funcionou |
| Post "3 erros de copy" @marko | IG | 22k saves | Hook visual + lista enumerada + CTA específico |
| Carrossel @ana | IG | 18k saves | Cada slide = 1 erro com mock real |
| Thread @joao | X | 4k repost | Provocação contraintuitiva no tweet 1 |

## Padrões
1. Lista numerada explícita no hook ("3 erros")
2. Exemplo real (mock-up ou print) em cada item
3. CTA com micro-ação ("comenta o número")

## Recomendações para Conceito
- Ângulo 1: erro = comportamento social inadequado (metáfora de relacionamento)
- Ângulo 2: "tudo que te ensinaram sobre X está errado" (provocativo)
- Evitar: tom moralista, exemplo genérico, CTA vago ("comenta aí")
```

## Veto Conditions

1. Menos de 5 fontes citadas com data.
2. Nenhuma fonte primária presente.
3. Confusão dado/opinião sem distinção clara.

## Quality Criteria

- [ ] Mínimo 5 fontes datadas e linkadas
- [ ] Pelo menos 1 fonte primária
- [ ] Distinção dado vs opinião explícita
- [ ] 3+ padrões identificados
- [ ] Recomendações específicas para próxima etapa
- [ ] Bloco de aprovacao claro para o PDF
