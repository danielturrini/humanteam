---
execution: inline
agent: squads/team/agents/midia
inputFile: squads/team/output/internal/master.md
outputFile: squads/team/output/internal/publicacao.md
---

# Step 13: Distribution — Mídia

## Context Loading

- `squads/team/output/{run_id}/internal/master.md` — paths das versões finais
- `squads/team/output/{run_id}/internal/plano.md` — cronograma de publicação por canal
- `squads/team/output/{run_id}/internal/conceito.md` — Big Idea (orienta captions)
- `squads/team/output/{run_id}/internal/roteiro.md` — texto base para captions
- `squads/team/output/{run_id}/internal/copy-pack.md` — biblioteca de copy da campanha, se existir
- `squads/team/pipeline/data/campaign-delivery-system.md` — calendario Notion MCP, campos, status e pacote de campanha
- `squads/team/pipeline/data/expertise/social-manager.md` — repertorio avancado de distribuicao e governanca de publicacao
- `squads/team/pipeline/data/anti-patterns.md` — seção Distribution

Skills: `instagram-publisher`, `blotato`, `canva`, Notion MCP quando disponivel.

## Instructions

### Process

0. Antes de criar calendario final, publicar ou agendar, confirme que `step-09` registrou aprovacao explicita do `documentos/documento-do-projeto.pdf` com a frase `Documento oficial aprovado para producao final` e que o checkpoint final `step-12` aprovou publicacao/agendamento. Se nao houver aprovacao, pare e volte ao checkpoint adequado.
1. **Para cada canal** definido no plano, escreva uma **caption nativa** (não copy-paste). Cada caption deve ter primeira frase forte que cabe no preview da plataforma.
2. **Pesquise hashtags** específicas do nicho (5 para IG, 0-3 para LinkedIn, 0 para X). Nunca use as proibidas em `anti-patterns.md` (#love, #fyp, #photooftheday).
3. **Defina o horário** de cada publicação alinhado ao pico do público (não publique todas as derivadas no mesmo dia — distribua na semana).
4. **Verifique a versão correta** do material final para cada canal (9:16 para Stories/vertical ads, 4:5 para feed/Meta Ads, 1:1 para feed, 16:9 para LinkedIn/display/apresentação).
5. Para campanha completa, gere `final/calendar/notion-calendar.md` e `final/calendar/calendar.csv` com campos prontos para Notion MCP.
6. Se Notion MCP estiver configurado, procure/crie a pagina raiz `Projetos`, procure/crie a pagina do projeto atual e suba/atualize o pacote do projeto nessa pagina.
7. Se Notion MCP estiver configurado, crie ou atualize a base de calendario antes de publicar.
8. **Confirme com o usuário** (este step roda após checkpoint step-12 obrigatório) e **publique/agende** via skills disponíveis.
9. **Monitore as primeiras 2 horas** de cada publicação: salve métricas iniciais em `publicacao.md` para alimentar Content Multiplier.

### Decision Criteria

- Se brand voice declara "nunca publicar em finais de semana", respeite mesmo que pico seja domingo.
- Se uma plataforma rejeita o upload (formato/duração), reporte ao Editor (volta para step-11) — não improvise.
- Se a primeira hora mostra zero engajamento em uma plataforma, pause publicações pendentes da campanha naquele canal.
- Se Notion MCP nao estiver disponivel, nao bloqueie a campanha: gere os arquivos importaveis em `final/calendar/` e registre a pendencia no `internal/handoff.md`.
- Se a pagina `Projetos` nao existir no Notion MCP, crie. Se o projeto ja existir dentro dela, atualize em vez de duplicar.

## Output Format

```markdown
# Publicação — {nome da peça}

## Pacote por canal

### Instagram Feed/Stories
- Versão: Campanhas/{campaign_slug}/final/social/instagram/...
- Caption: "{caption específica para IG}"
- Hashtags: #... #... (5 pesquisadas)
- Horário: AAAA-MM-DD HH:MM
- URL publicação: {preenchido após publicar}

### LinkedIn
...

### X/Twitter
...

## Métricas iniciais (2h após publicar)
| Canal | Alcance | Engajamento | Saves | Comentários |

## Calendario Notion
- Fonte: `final/calendar/notion-calendar.md`
- Importacao: `final/calendar/calendar.csv`
- Status Notion MCP: criado / atualizado / pendente
- Pagina Projetos: criada / atualizada / pendente
- Pagina do projeto: {nome ou URL quando disponivel}

## Notas
{ajustes, surpresas, alertas}
```

## Output Example

```markdown
# Publicação — Campanha "{nome}"

## Pacote por canal

### Instagram Feed
- Versão: output/2026-05-29-001/final/social/instagram/feed-4x5.png
- Caption: "Salva pra quando tua copy travar — Qual dos 3 erros mais te pega? 1, 2 ou 3 nos comentários."
- Hashtags: #copywriting #copywriter #marketingdigital #vendasonline #empreendedorismo (5, sem #fyp)
- Horário: 2026-05-29 19:12
- URL: https://instagram.com/p/Cxxxx

### LinkedIn (versão repurpose pelo Mídia, antes do Content Multiplier)
- Versão: output/2026-05-29-001/final/social/linkedin/feed-1x1.png
- Caption (formato longo): "Há 3 erros que tornam toda copy fraca, independentemente do nicho. Aprendi isso analisando 100+ posts essa semana. (1) Você fala de você antes de entender o cliente. (2) Lista feature em vez de transformação. (3) Pede a venda antes de criar desejo. Salva se isso te ajudar."
- Hashtags: #marketingdigital #copywriting #vendas (3, formato LinkedIn)
- Horário: 2026-05-30 09:00 (LinkedIn pico é manhã)
- URL: https://linkedin.com/posts/...

## Métricas iniciais (2h após cada publicação)
| Canal | Alcance | Engajamento | Saves | Comentários |
|-------|---------|-------------|-------|-------------|
| IG Feed | 8,200 | 6.4% | 412 | 67 |
| LinkedIn | 1,800 | 9.2% | n/a | 34 |

## Notas
- IG entregou primeiro spike 18min após pub (algoritmo testando, ok)
- Comentários do IG estão pedindo carrossel — sinal para Transformação priorizar derivada de carrossel
```

## Veto Conditions

1. Caption igual em mais de um canal (copy-paste).
2. Hashtag genérica proibida usada.
3. Publicação sem confirmação humana (Gate 2b violado).
4. Campanha completa sem calendario Notion MCP ou arquivo importavel.

## Quality Criteria

- [ ] Caption original por canal
- [ ] Hashtags pesquisadas (não genéricas)
- [ ] Horário alinhado ao pico do público de cada canal
- [ ] Confirmação humana obtida antes de publicar
- [ ] Métricas iniciais 2h registradas
- [ ] Calendario Notion MCP criado/atualizado ou CSV importavel gerado
