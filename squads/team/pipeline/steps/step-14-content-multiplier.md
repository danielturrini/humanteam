---
execution: inline
agent: squads/team/agents/transformacao
inputFile: squads/team/output/internal/publicacao.md
outputFile: squads/team/output/internal/multiplicacao.md
---

# Step 14: Multiplication — Transformação

## Context Loading

- `squads/team/output/{run_id}/internal/master.md` — paths das versões finais
- `squads/team/output/{run_id}/internal/publicacao.md` — métricas iniciais (orientam priorização)
- `squads/team/output/{run_id}/internal/conceito.md` — Big Idea (precisa sobreviver nas derivadas)
- `squads/team/output/{run_id}/internal/roteiro.md` — texto base para repurpose
- `squads/team/output/{run_id}/internal/storyboard.md` — peças/quadros que podem virar derivadas
- `squads/team/output/{run_id}/internal/copy-pack.md` — biblioteca de copy da campanha, se existir
- `squads/team/pipeline/data/campaign-delivery-system.md` — pacote de campanha, ads, copies, calendario e handoff
- `squads/team/pipeline/data/expertise/content-multiplier.md` — repertorio avancado de repurposing, atomic content e calendario
- `squads/team/pipeline/data/anti-patterns.md` — seção Multiplication

Skills: `canva`, `image-creator`, `template-designer`.

## Instructions

### Process

0. Antes de produzir derivadas finais, confirme que `step-09` registrou aprovacao explicita do `documentos/documento-do-projeto.pdf` com a frase `Documento oficial aprovado para producao final`. Se nao houver aprovacao, pare e volte ao checkpoint de aprovacao do PDF.
1. **Identifique átomos** do hero asset: cada frase forte, cada dado, cada peça/quadros com força visual = 1 átomo.
2. **Mapeie formatos destino** prioritários: carrossel IG, thread X, post LinkedIn longo, newsletter, stories, post estático, etc. Escolha baseado nos canais ativos do plano + sinais das métricas iniciais (ex: "comentários pedindo carrossel" = prioriza carrossel).
3. **Para cada átomo, escolha 1+ formato destino** onde ele funciona melhor. Frase de hook → tweet single. Lista de 3 erros → 3 slides + 1 capa + 1 CTA (carrossel). KV/peça icônica → post estático.
4. **Adapte ao algoritmo do destino**: thread precisa de gancho no tweet 1, carrossel precisa de capa com hook e CTA no último slide, newsletter precisa de assunto curto + primeiro parágrafo forte.
5. **Calendarize**: distribua as derivadas ao longo de 7-14 dias, não no mesmo dia da publicação hero. Respeite picos de cada canal.
6. **Justifique cada derivada**: por que ela existe? Se a resposta é "porque sobrou material", descarte.
7. Para campanha completa, complemente `copy-pack.md` com derivadas de posts, emails, anuncios e CTAs por etapa da jornada.
8. Atualize `final/calendar/notion-calendar.md` e `final/calendar/calendar.csv` com as derivadas aprovadas.
9. Atualize `handoff.md` com o pacote final de multiplicacao e proximas medicoes.

### Decision Criteria

- Se métricas iniciais do hero estão muito abaixo do esperado, considere republicar com nova capa/headline antes de multiplicar.
- Se canal destino é frio (sem audiência), gere derivada mas marque baixa prioridade.
- Se derivada exigiria refazer roteiro do zero, é nova peça, não derivada — separe.

## Output Format

```markdown
# Multiplicação — {nome da peça hero}

## Átomos identificados
1. {frase/dado/peça}
2. ...

## Derivadas planejadas
| # | Formato | Átomo de origem | Canal | Data | Razão de existir |
|---|---------|-----------------|-------|------|------------------|
| 1 | Carrossel 7 slides | Lista 3 erros | IG feed | D+1 | Comentários pediram |
| 2 | Thread 5 tweets | Cada erro = 1 tweet | X | D+2 | Audiência X consome lista |

## Outputs gerados
- Campanhas/{campaign_slug}/final/derivadas/carrossel-3-erros.png (7 slides)
- Campanhas/{campaign_slug}/final/derivadas/thread-3-erros.md
- ...

## Pacote de campanha atualizado
- Copy-pack: ...
- Ads/copies derivados: ...
- Emails derivados: ...
- Calendario atualizado: ...
- Handoff atualizado: ...

## Métricas previstas
{baseline conservador para cada derivada}
```

## Output Example

```markdown
# Multiplicação — Campanha "3 erros que matam sua copy"

## Átomos identificados
1. Frase hook: "Sua copy parece um cara que pede em casamento no primeiro Tinder"
2. Lista 3 erros (com explicações e exemplos)
3. Peça icônica: post "SALVA ESSE POST"
4. Metáfora restaurante como imagem estática
5. Dado novo gerado pelo post hero: "comentários estão pedindo carrossel"

## Derivadas planejadas
| # | Formato | Átomo | Canal | Data | Razão |
|---|---------|-------|-------|------|-------|
| 1 | Carrossel 7 slides | Lista 3 erros | IG feed | 2026-05-30 19h | Comentários do post hero pediram, formato salva mais |
| 2 | Thread 5 tweets | Cada erro vira tweet + hook + CTA | X | 2026-05-31 09h | Audiência X consome thread didática |
| 3 | Newsletter 300 palavras | Expansão dos 3 erros com 1 exemplo NOVO próprio | E-mail | 2026-06-02 08h | Base de e-mail quer profundidade |
| 4 | 3 Stories sequenciais | Enquete por erro (qual te pega?) | IG Stories | 2026-05-29 22h | Engajamento orgânico aumenta alcance do post hero |
| 5 | Post estático com peça icônica | "SALVA ESSE POST" + hook | IG feed | 2026-06-03 19h | Aproveita a peça mais reutilizável |

## Outputs gerados
- output/2026-05-29-001/final/derivadas/carrossel-3-erros/ (7 PNGs 1080×1080)
- output/2026-05-29-001/final/derivadas/thread-3-erros.md
- output/2026-05-29-001/final/derivadas/newsletter-3-erros.md
- output/2026-05-29-001/final/derivadas/stories-3-enquetes/ (3 PNGs 1080×1920)
- output/2026-05-29-001/final/derivadas/post-estatico-salva.png

## Métricas previstas (baseline conservador)
- Carrossel: 30% alcance do post hero + 2x taxa de save
- Thread: 5-15% alcance dos seguidores X, alta replicabilidade se viralizar
- Newsletter: 25-40% open, 5-8% click se houver link
- Stories: 60-80% do alcance da conta, 8-15% respostas em enquete
- Post estático: 15-25% alcance do post hero, mas longevidade muito maior (algoritmo continua entregando semanas)
```

## Veto Conditions

1. Derivada sem razão de existir (= miniaturização).
2. Mais de uma derivada publicada no mesmo dia do hero (canibaliza atenção).
3. Derivada que ignora regras do formato destino (ex: thread com tweet 1 sem hook).
4. Campanha completa sem atualizar copy-pack, calendario e handoff.

## Quality Criteria

- [ ] Mínimo 3 derivadas distintas (não miniaturização)
- [ ] Cada derivada respeita formato destino
- [ ] Calendário espalhado em 7-14 dias
- [ ] Sinais das métricas iniciais incorporados na priorização
- [ ] Outputs gerados e salvos em final/derivadas/
- [ ] Campanha completa atualizada em copy-pack, calendario e handoff
