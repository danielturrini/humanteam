# GPT Image 2 KV System — Human Team

Este documento define a regra oficial para Key Visual dentro do `/team`.

## Regra central

Todo KV de campanha deve ser gerado como uma imagem final integrada no Higgsfield CLI com o modelo `gpt_image_2`.

KV nao e:

- imagem base gerada separada;
- HTML exportado como PNG;
- fundo bonito com texto aplicado depois;
- mock visual sem marca, sem headline ou sem hierarquia.

KV e uma peca de campanha completa, renderizada ja com composicao, imagem, design, lettering, hierarquia, marca, headline, CTA e sistema visual no mesmo prompt.

## Renderer oficial

Use:

```bash
higgsfield generate create gpt_image_2 \
  --prompt "<prompt integrado do KV>" \
  --image "<referencia-kv.png>" \
  --image "<logo-ou-brand-asset.png>" \
  --aspect_ratio "4:5" \
  --quality high \
  --resolution 4k \
  --wait
```

O wrapper local `image-ai-generator` tambem pode ser usado, desde que o asset seja marcado como `--asset-type kv` e receba ao menos uma referencia:

```bash
python3 skills/image-ai-generator/scripts/generate.py \
  --asset-type kv \
  --prompt "<prompt integrado do KV>" \
  --output "Campanhas/{campaign_slug}/final/assets/kv/kv-master.png" \
  --reference "Campanhas/{campaign_slug}/refs/kv/kv-reference.png" \
  --reference "Campanhas/{campaign_slug}/refs/marca/logo.png" \
  --aspect-ratio "4:5" \
  --quality high \
  --mode production
```

## Referencia obrigatoria de KV

Antes de gerar KV, peça ao usuario uma referencia de KV, preferencialmente uma imagem com lettering. A referencia deve estar em `refs/kv/`, `refs/design/`, `input/` ou caminho local informado pelo usuario.

A referencia deve ser enviada junto com o prompt pelo parametro `--image`.

Use a referencia para entender:

- composicao e ritmo de grid;
- hierarquia entre imagem, headline, assinatura e CTA;
- densidade tipografica;
- contraste, escala e respiro;
- relacao entre foto/ilustracao e lettering;
- linguagem de acabamento, textura, luz, cor e borda;
- energia de marca e grau de editorialidade.

Nao use a referencia para copiar:

- texto;
- personagem;
- produto;
- logotipo;
- layout identico;
- imagem base;
- marca de terceiros.

A instrucao no prompt deve deixar isso explicito: "Use the attached reference only as a style, hierarchy, composition and lettering-density guide. Do not copy its text, image, logo, characters, product, or exact layout."

## Insumos minimos

KV final fica bloqueado se faltar qualquer item abaixo:

- referencia de KV com imagem + lettering, ou justificativa aprovada pelo usuario para seguir sem ela;
- logotipo/assinatura oficial ou fallback tipografico aprovado;
- brand kit ou direcao minima de marca: cores, fontes, elementos proprietarios, produto/oferta;
- headline principal aprovada em `copy-pack.md`;
- CTA ou acao desejada, quando houver;
- aspect ratio final: 9:16, 4:5, 16:9, 1:1 ou outro;
- pasta de output.

Sem esses insumos, gere apenas `internal/kv-spec.md` com pendencias e prompt preparatorio. Nao produza KV final.

## Estrutura do prompt integrado

O prompt de KV para `gpt_image_2` deve ser em ingles e conter estes blocos:

```text
TASK
Create a final campaign key visual as a finished poster/ad layout. The output must include image, design system, lettering, hierarchy, brand signature and CTA in one integrated image.

BRAND
Brand name, brand role, tone, colors, typography direction, logo/signature instructions, product/offer.

REFERENCE USAGE
Use attached reference(s) only for style, composition rhythm, hierarchy, lettering density, contrast and finish. Do not copy text, image, logo, product, characters or exact layout.

CAMPAIGN IDEA
Big idea, human tension, promise, audience, cultural moment, energy.

COPY TO RENDER EXACTLY
Headline: "..."
Support line: "..."
CTA: "..."
Legal/microcopy: "..."

VISUAL SCENE
Subject, environment, product, action, mood, lighting, texture, material, foreground/midground/background.

DESIGN SYSTEM
Grid, safe zones, headline placement, CTA placement, logo placement, color blocking, type mood, contrast, visual anchors, negative space.

QUALITY RULES
Perfect spelling, no invented words, no extra text, no fake logos, no distorted brand marks, no generic AI gloss, no unreadable lettering, no copied reference content.

OUTPUT
Aspect ratio, resolution, final file target.
```

## Diferenca entre KV e imagem solta

Use `gpt_image_2` para:

- KV master;
- KV por proporcao;
- anuncios com headline/CTA/assinatura;
- posts principais com lettering;
- pecas editoriais de campanha onde texto faz parte do layout.

Use `nano_banana_2` para:

- imagem solta sem lettering;
- foto conceitual sem texto;
- textura;
- fundo;
- imagem secundaria sem tipografia;
- mock visual sem texto final.

Nunca substitua KV por Nano Banana 2 quando houver lettering, headline ou design aplicado.

## Controle de qualidade

Reprove e refaca se:

- a headline saiu com erro de ortografia;
- o modelo adicionou palavras que nao estavam no prompt;
- o layout parece template generico;
- a marca poderia ser trocada por concorrente sem perda;
- a referencia foi copiada de forma literal;
- o logo ficou distorcido;
- a hierarquia nao deixa claro o que ler primeiro;
- a imagem tem cara de IA, excesso de brilho generico ou textura plastica;
- a peca nao parece campanha.

## Registro obrigatorio

Para cada KV, registre em `internal/generation/kv/{asset-slug}/metadata.json`:

- provider: `higgsfield_cli`;
- model: `gpt_image_2`;
- prompt completo;
- referencias enviadas;
- aspect ratio;
- quality;
- resolution;
- output;
- status: `PREVIEW`, `FINAL`, `REPROVADO` ou `BLOQUEADO`;
- motivo de aprovacao ou reprova;
- headline/CTA renderizados.
