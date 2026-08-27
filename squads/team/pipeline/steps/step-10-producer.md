---
execution: inline
agent: squads/team/agents/operacao
inputFile: squads/team/output/internal/storyboard.md
outputFile: squads/team/output/internal/folha-producao.md
---

# Step 10: Production — Operação

## Context Loading

- `squads/team/output/{run_id}/internal/storyboard.md` — mapa de peças, quadros, assets e proporções
- `squads/team/output/{run_id}/internal/art-bible.md` — paleta, tipografia (orienta criação de assets)
- `squads/team/output/{run_id}/internal/plano.md` — prazos do cronograma
- `_opensquad/_memory/company.md` — acervo de assets existentes da marca
- `squads/team/pipeline/data/campaign-delivery-system.md` — estrutura de pastas, imagens, anuncios, copy-pack e handoff
- `squads/team/pipeline/data/image-prompt-system.md` — regras obrigatorias para prompts Higgsfield CLI + Nano Banana 2
- `squads/team/pipeline/data/gpt-image-kv-system.md` — regra de KV integrado via `gpt_image_2` com referencia de KV obrigatoria
- `squads/team/pipeline/data/expertise/producer.md` — repertório avançado de produção, asset management, risco, direitos, ferramentas e controle operacional

Skills: `image-fetcher`, `image-ai-generator`.

Geração visual de KV, anuncios com lettering e peças principais com texto aplicado: Higgsfield CLI + `gpt_image_2`, com referencia de KV enviada por `--image`.

Geração visual de imagem solta sem lettering, textura, fundo ou asset secundario: Higgsfield CLI + Nano Banana 2. Use `image-ai-generator` apenas como wrapper local desses padrões, nunca como provedor alternativo.

## Instructions

### Process

0. Antes de produzir qualquer asset final, confirme que `step-09` registrou aprovacao explicita do `documentos/documento-do-projeto.pdf` com a frase `Documento oficial aprovado para producao final`. Se nao houver aprovacao, pare e volte ao checkpoint de aprovacao do PDF.
1. Antes de listar assets de campanha completa, confirme que o núcleo visual do Art Director foi acionado. Se não foi, volte para Arte/Conceito antes de produzir. KV não nasce de um agente isolado.
2. Liste **todos os assets** mencionados no storyboard + os implícitos pelo art bible (fontes, ícones, padrões gráficos). Em campanha completa, inclua obrigatoriamente o KV em `final/assets/kv/`.
3. Para cada asset, defina **caminho de obtenção**: (a) já tem no acervo, (b) buscar em banco, (c) gerar via IA, (d) capturar/produzir.
4. Atribua **responsável** (pessoa ou agente IA) e **prazo** relativo a data de publicação.
5. Marque o **critical path** — assets que, se atrasarem, atrasam a publicação inteira.
6. Identifique **riscos** (direitos autorais, qualidade insuficiente, custo) e escreva **plano B** para cada.
7. Se o documento oficial estiver aprovado, **execute imediatamente** os KVs finais via `gpt_image_2`, os assets sem lettering via Nano Banana 2 e os assets baixados via image-fetcher. Se ainda nao estiver aprovado, gere somente previews claramente marcados como `PREVIEW / MATERIAL DE APROVACAO`.
8. Se for campanha completa, crie a estrutura de entrega: `documentos/`, `final/assets/kv`, `final/assets/principais`, `final/assets/secundarias`, `final/ads/9x16`, `final/ads/4x5`, `final/ads/16x9`, `final/derivadas`, `final/calendar`, `final/press`, `final/social`, `final/email`, `final/ooh` e `final/brindes`.
9. Para cada imagem ou anuncio, registre provider, modelo/renderer, prompt, fonte, variacao, aspect ratio, resolucao, referencias, status de aprovacao, regra de continuidade visual e regra de continuidade emocional em `internal/generation/`, espelhando a estrutura do arquivo final. Em `final/`, deixe apenas o material visual entregável.
10. Todo prompt de imagem solta sem lettering precisa seguir `image-prompt-system.md`: inglês, headers CAMERA/LENS/LIGHT/SUBJECT/FOREGROUND/MIDGROUND/BACKGROUND/WARDROBE TONAL BEHAVIOR/MAKEUP SURFACE PHYSICS/POST BEHAVIOR/COMPOSITIONAL GEOMETRY/MOOD & ART DIRECTION, câmeras/lentes permitidas, decisões físicas, sem buzzwords e com limite de 1.200-1.500 caracteres.
10b. Todo prompt de KV precisa seguir `gpt-image-kv-system.md`: inglês, prompt integrado com imagem + design + lettering + marca + headline + CTA + hierarquia em uma única geração `gpt_image_2`.
11. Rode controle de realismo em toda imagem antes de aceitar: escala entre objetos/personagens, anatomia, perspectiva, sombra, contato físico, textura, legibilidade, produto correto, marca correta e aparência artificial. Se falhar, marque `REPROVADA / NÃO USAR` em `internal/generation/quality.md`, não inclua no PDF e gere nova solução.
12. Para anúncios, produza peça de anúncio, não apenas imagem. Cada arquivo em `final/ads/` deve conter visual + headline aplicada + CTA + assinatura/logo ou fallback aprovado + safe zone + proporção nativa. Anuncios com texto aplicado devem ser renderizados via `gpt_image_2`; nao substitua por imagem base + HTML-to-PNG como fluxo final de KV.
13. Para posts orgânicos, produza ou especifique peças em `final/social/instagram/` e `final/social/linkedin/` quando esses canais fizerem parte do plano. LinkedIn precisa de linguagem visual própria, não crop do Instagram.
14. Para o KV, confirme que os prompts e renders usam os elementos de campanha: logotipo/assinatura oficial ou assinatura tipográfica provisória aprovada, paleta oficial, tipografia, elementos proprietarios, produto/oferta, promessa visual, energia dominante, headline, CTA e versoes 9:16/4:5/16:9.
15. Se o KV não tiver referência de KV com lettering aprovada, não renderize KV final. Registre o bloqueio em `internal/kv-spec.md` e peça os materiais ao usuário.
16. Se o cliente não tiver logotipo, produza KV apenas se houver fallback aprovado. Nesse caso, gere peças editoriais de KV com textos aplicados, assinatura provisória, grid, paleta e tipografia.
17. O `/team` nao produz video/motion. Se o brief pedir video, registre como fora do escopo e proponha acionar Human Motion em fluxo separado.
18. Gere ou atualize `handoff.md` com o manifesto operacional do que existe, do que falta e do que depende de ferramenta externa.

### Decision Criteria

- Asset crítico (no critical path) sem plano B = BLOCKER. Force decisão antes de avançar.
- Se asset gerado via IA tem qualidade insuficiente em 2 tentativas, escalone para opção (d) produção manual.
- Se prazo do asset estoura o cronograma, sinalize para o Planner (pode exigir replanejamento).
- Se um asset sai com mood incoerente com a plataforma narrativa, descarte ou refaça. Nao leve adiante asset visual que enfraquece a historia.
- Se as peças parecem independentes entre si, volte para Art Director ou Creative Director antes de produzir em volume.

## Output Format

```markdown
# Folha de Produção — {nome da peça}

## Assets necessários
| # | Asset | Origem | Responsável | Prazo | Status | Papel narrativo |
|---|-------|--------|-------------|-------|--------|---|
| 1 | ... | acervo | usuário | D-X | OK |
| 2 | ... | gerar via Higgsfield CLI + `gpt_image_2` quando tiver lettering ou Nano Banana 2 quando nao tiver lettering | Producer | D-Y | TODO |

## Critical path
{lista de assets críticos}

## Riscos & Plano B
- Risco 1: ... → Plano B: ...

## Assets já executados
- [link 1]
- [link 2]

## Estrutura de entrega (campanha)
- `final/assets/kv/`: ...
- `final/assets/principais/`: ...
- `final/assets/secundarias/`: ...
- `final/ads/9x16/`: ...
- `final/ads/4x5/`: ...
- `final/ads/16x9/`: ...
- `final/calendar/`: ...
- `final/press/`: ...
- `final/social/`: ...
- `final/email/`: ...
- `internal/handoff.md`: ...

## Controle de coerencia
- Energia dominante aprovada: ...
- Elementos do KV preservados: ...
- Anti-mood evitado: ...
- Peças que precisam refazer por incoerência: ...
```

## Output Example

```markdown
# Folha de Produção — Campanha "3 erros que matam sua copy"

## Assets necessários
| # | Asset | Origem | Responsável | Prazo | Status |
|---|-------|--------|-------------|-------|--------|
| 1 | Referência de KV com imagem + lettering | usuário/acervo | Usuário | D-4 | OK |
| 2 | Logo/assinatura oficial | acervo | Usuário | D-4 | OK |
| 3 | KV master 4:5 com headline + CTA | Higgsfield CLI + `gpt_image_2` + `--image` da referência | Producer | D-3 | TODO |
| 4 | KV vertical 9:16 para stories/ad | Higgsfield CLI + `gpt_image_2` + mesma referência | Producer | D-3 | TODO |
| 5 | Textura de fundo sem lettering | Higgsfield CLI + Nano Banana 2 | Producer | D-3 | OK |
| 6 | Ícones de alerta para carrossel | biblioteca/licença aberta | image-fetcher | D-3 | OK |
| 7 | Fonte Inter (Bold + Regular) | banco | image-fetcher | D-3 | OK |

## Critical path
- Referência de KV + logo + headline aprovada: sem esses itens, o `gpt_image_2` não renderiza KV final.
- KV master 4:5: desbloqueia ads, posts e apresentação final da campanha.

## Riscos & Plano B
- Risco: referencia de KV não chegar até D-2 → Plano B: bloquear KV final e entregar `internal/kv-spec.md` com pedido objetivo ao usuário
- Risco: logo não chegar em arquivo utilizável → Plano B: assinatura tipográfica provisória aprovada pelo usuário antes do render
- Risco: `gpt_image_2` aplicar texto errado → Plano B: regenerar com bloco COPY TO RENDER EXACTLY mais curto e hierarquia simplificada

## Assets já executados
- [textura fundo v1](Campanhas/{campaign_slug}/final/assets/secundarias/textura-fundo.png)
- [ícones alerta](Campanhas/{campaign_slug}/final/assets/secundarias/icones-alerta.png)
- [KV master pendente](Campanhas/{campaign_slug}/internal/generation/kv-master.md)
```

## Veto Conditions

1. Lista contém `TBD` ou asset sem responsável/prazo.
2. Critical path sem plano B.
3. Asset crítico com status TODO faltando 24h da publicação.
4. Campanha completa sem estrutura de pastas e manifesto de handoff.
5. Video/motion incluído no escopo do `/team` em vez de ser encaminhado para Human Motion.
6. Asset visual com mood incoerente com a plataforma narrativa.
7. Pacote de campanha com assets que parecem campanhas diferentes.
8. Prompt de IA visual fora do formato correto: `gpt-image-kv-system.md` para KV/lettering ou `image-prompt-system.md` para imagem solta.
9. Imagem solta aceita com buzzwords no prompt em vez de decisões físicas.
10. Produzir KV/campanha completa sem núcleo visual registrado pelo Art Director.

## Quality Criteria

- [ ] Lista de assets sem TBD
- [ ] Cada asset com fonte, responsável e prazo
- [ ] Critical path marcado
- [ ] Riscos catalogados com plano B
- [ ] Assets de IA já executados quando aplicável
- [ ] Campanha completa organizada em pastas de entrega
- [ ] Cada asset visual registra prompt/fonte, proporcao, status e continuidade
- [ ] Cada asset visual passou por controle de realismo e imagens reprovadas foram excluidas de `final/` e do PDF
- [ ] Cada asset visual preserva energia dominante e papel narrativo
- [ ] KV inclui logotipo, paleta, tipografia, elementos de campanha, produto/oferta e versoes por proporcao
- [ ] KV inclui peças editoriais com textos aplicados, headline e CTA
- [ ] Anúncios em `final/ads/` existem como peças reais com texto aplicado, não apenas imagens base
- [ ] KVs/anuncios com lettering registram Higgsfield CLI + `gpt_image_2`, referencia de KV, resolucao e output
- [ ] Imagens soltas registram Higgsfield CLI + Nano Banana 2, resolucao, referencias e output
- [ ] Cada prompt visual segue o sistema correto para KV ou imagem solta
- [ ] Núcleo visual foi registrado antes da produção de KV/campanha completa
