---
execution: inline
agent: squads/team/agents/storyboard
inputFile: squads/team/output/internal/roteiro.md
outputFile: squads/team/output/internal/storyboard.md
---

# Step 08: Storyboard — Storyboard

## Context Loading

- `squads/team/output/{run_id}/internal/roteiro.md` — beats, copy, headlines e blocos por peça
- `squads/team/output/{run_id}/internal/art-bible.md` — paleta, tipografia, regras
- `squads/team/output/{run_id}/internal/conceito.md` — Big Idea (orienta tom visual)
- `squads/team/pipeline/data/campaign-delivery-system.md` — plataforma narrativa, KV e desdobramentos de campanha
- `squads/team/pipeline/data/expertise/storyboarder.md` — repertório avançado de narrativa visual, grid, continuidade e previsualização estática

Geração visual: quando um KV ou peça com lettering precisar ser produzido por IA, use Higgsfield CLI + `gpt_image_2` com a referência de KV enviada por `--image`. Quando uma imagem solta sem lettering precisar ser produzida, use Higgsfield CLI + Nano Banana 2. `image-creator` pode ser usado apenas como apoio conceitual, nunca como provedor final da campanha.

## Instructions

### Process

1. Mapeie **um quadro ou peça por beat** do roteiro/copy. Não pode haver beat sem especificação visual.
2. Para cada quadro/peça, descreva: **plano/layout** (close/médio/aberto/grid), **ângulo** (frontal/lateral/contra-plongée quando houver cena), **ação ou composição**, **texto aplicado** (palavras na peça), **função narrativa** no arco e **desdobramento** para formato.
3. Verifique **continuidade visual e emocional**: cor dominante, posição do sujeito, eyeline, energia dominante e papel do produto/personagem. Saltos abruptos = redo.
4. Para conteúdo estático (carrossel), defina o **grid de cada slide** e a **hierarquia visual** (o que o olho lê primeiro).
5. Marque os quadros que precisam de **asset visual específico** (lista para Producer).
6. Indique peças onde **mock visual** vale a pena e especifique prompt, aspect ratio, resolucao e pasta de saida. KV e peças com texto usam `gpt_image_2`; imagens soltas usam Nano Banana 2.
7. Para campanha completa, escreva como o storyboard desdobra o KV e a plataforma narrativa: posts principais, anuncios, thumbnails, email e aplicações.

### Decision Criteria

- Se beat tem copy apenas textual, ainda assim precisa de quadro ou layout (ex: "grid tipográfico, texto aplicado X").
- Se 2 quadros consecutivos têm o mesmo plano/layout, considere variar para evitar monotonia visual.
- Se texto aplicado > 8 palavras em peça de impacto, redivida em 2 quadros ou mova para carrossel/e-mail.
- Se o quadro quebra a energia dominante sem motivo narrativo, refaça.
- Se o storyboard nao sustenta desdobramentos da campanha, refaça.

## Output Format

```markdown
# Storyboard — {nome da peça}

## Quadros e peças

### Quadro 1 — {função}
- **Formato**: KV 4:5 | anúncio 9:16 | carrossel 1:1 | post LinkedIn | e-mail header
- **Plano/layout**: close | médio | aberto | grid editorial | split
- **Ângulo/composição**: frontal | lateral | terço esquerdo | centro | assimétrico
- **Ação visual**: ...
- **Texto aplicado**: "..."
- **Função narrativa**: começo | virada | prova | CTA | reforço de KV
- **Relação com a próxima peça**: continuidade de cor | contraste | prova | CTA

### Quadro 2 — {...}
...

## Assets visuais necessários (para Producer)
- Quadro X: ...
- Quadro Y: ...

## Peças para Higgsfield
- KV/peça com lettering: prompt integrado para `gpt_image_2`, aspect ratio, resolucao, referencias de KV enviadas por `--image`, output esperado
- Imagem solta sem lettering: prompt visual para Nano Banana 2, aspect ratio, resolucao, referencias, output esperado

## Continuidade
- Eyeline: ...
- Cor dominante por quadro: ...
- Posição do sujeito: ...
- Energia emocional por quadro: ...
- Elementos do KV preservados: ...

## Desdobramentos da campanha
- Posts principais: ...
- Anuncios: ...
- Thumbnails/email/aplicações: ...
```

## Output Example

```markdown
# Storyboard — Campanha "3 erros que matam sua copy"

## Quadros e peças

### Quadro 1 — KV master 4:5
- **Formato**: KV 4:5
- **Plano/layout**: split assimétrico, personagem/objeto à esquerda e bloco tipográfico à direita
- **Ângulo/composição**: frontal, headline no ponto de maior contraste
- **Ação visual**: metáfora de pedido de casamento cedo demais aplicada a uma situação de venda
- **Texto aplicado**: "Sua copy parece um pedido de casamento no primeiro Tinder"
- **Relação com próxima peça**: estabelece metáfora visual e paleta

### Quadro 2 — Ad 9:16
- **Formato**: anúncio vertical
- **Plano/layout**: headline no topo, imagem central, CTA em safe zone inferior
- **Ângulo/composição**: leitura de cima para baixo
- **Ação visual**: o produto/oferta aparece como correção do erro
- **Texto aplicado**: "Você está vendendo antes de ser ouvido"
- **Relação com próxima peça**: transforma a metáfora em tensão de conversão

### Quadro 3 — Carrossel slide 1
- **Formato**: carrossel 1:1
- **Plano/layout**: título grande + três marcadores visuais
- **Ângulo/composição**: grid editorial, alto contraste
- **Ação visual**: promessa de diagnóstico rápido
- **Texto aplicado**: "3 erros que fazem a pessoa fechar a janela"
- **Relação com próxima peça**: abre a lista sem entregar tudo

## Assets visuais necessários (para Operação)
- Quadro 1: referência de KV com imagem + lettering enviada pelo usuário; logotipo/assinatura oficial; prompt integrado `gpt_image_2`
- Quadro 2: adaptação vertical via `gpt_image_2` com mesma referência de KV
- Quadro 3: ícones ou mock-ups sem lettering via Nano Banana 2, se necessários

## Continuidade
- Direção de leitura: headline primeiro, prova depois, CTA por último
- Cor dominante: preto + amarelo signal em todos os quadros com texto
- Posição do sujeito: alinhado à esquerda no KV master, preservado nas adaptações
```

## Veto Conditions

1. Beat do roteiro/copy sem quadro ou peça correspondente.
2. Quadro sem alguma das informações obrigatórias (formato, plano/layout, composição, ação visual, texto aplicado).
3. Texto aplicado >8 palavras em qualquer peça de impacto sem justificativa.
4. Quadro ou sequencia contradiz energia dominante sem justificativa.
5. Campanha completa sem desdobramentos narrativos para outras peças.

## Quality Criteria

- [ ] Um quadro/peça por beat (sem buracos)
- [ ] Cada quadro com formato + plano/layout + composição + ação visual + texto aplicado
- [ ] Continuidade visual verificada (eyeline, cor, sujeito)
- [ ] Continuidade emocional verificada
- [ ] Lista de assets visuais para Producer anexada
- [ ] Peças com lettering especificam Higgsfield CLI + `gpt_image_2`, referência de KV por `--image`, aspect ratio, resolucao e output
- [ ] Imagens soltas sem lettering especificam Higgsfield CLI + Nano Banana 2, aspect ratio, resolucao e output
- [ ] Desdobramentos de campanha conectados ao KV
