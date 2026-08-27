---
execution: inline
agent: squads/team/agents/arte
inputFile: squads/team/output/internal/roteiro.md
outputFile: squads/team/output/internal/art-bible.md
---

# Step 07: Art Direction — Arte

## Context Loading

- `squads/team/output/{run_id}/internal/conceito.md` — Big Idea + payoff
- `squads/team/output/{run_id}/internal/roteiro.md` — beats e notas visuais
- `_opensquad/_memory/company.md` — sistema visual existente da marca
- `squads/team/pipeline/data/campaign-delivery-system.md` — sistema de imagens, roupa/look, continuidade e anuncios por proporcao
- `squads/team/pipeline/data/image-prompt-system.md` — regras obrigatorias para prompts Higgsfield CLI + Nano Banana 2
- `squads/team/pipeline/data/gpt-image-kv-system.md` — regra de KV integrado via `gpt_image_2` com referencia de KV enviada por `--image`
- `squads/team/pipeline/data/output-examples.md` — 2 art bibles exemplares
- `squads/team/pipeline/data/expertise/art-director.md` — repertório avançado de design, composição, tipografia, cor, acessibilidade e sistemas visuais

Skills: `canva`, `template-designer`, `image-fetcher` (para mood board).

## Instructions

### Nucleo Visual Obrigatorio

Para KV, campanha completa, anuncios e pecas principais, Arte nao trabalha sozinha. Ative um nucleo visual com:

- Conceito: garante que a Big Idea continua visivel.
- Roteiro: fecha headline, CTA e textos aplicados.
- Arte: define sistema visual, marca, grid, paleta, tipografia e KV.
- Storyboard: testa leitura, composicao, sequencia e desdobramento por formato.
- Operacao: verifica se assets, referencias, prompts e producao sao executaveis.
- Edicao: antecipa finalizacao estatica, cortes de formato, capas e thumbnails.

Regra: se o visual parece pobre, generico ou sem marca, o nucleo deve voltar antes de produzir. O output precisa registrar `Nucleo visual acionado` e a contribuicao de cada agente.

### Process

1. Leia conceito e roteiro identificando a **plataforma narrativa**: energia dominante, promessa emocional, papel cultural, arco e anti-mood.
2. Traduza a plataforma narrativa em **território visual**: clima, cor, composição, textura, ritmo, casting/personagem, cenário, luz e movimento.
3. Confira o sistema visual da marca em `company.md`. **Aderência > inovação**: o art bible amplia o existente, não recria do zero.
4. Defina a **paleta** (máximo 5 cores principais com códigos hex e função: primária, secundária, acento, fundo, texto). A função deve explicar papel emocional e narrativo, não só estética.
5. Defina a **tipografia** (máximo 2 famílias: 1 para títulos, 1 para corpo — com pesos específicos).
6. Colete um **mood board** com 8-15 referências via `image-fetcher`, categorizadas (composição / cor / tipografia / iluminação / energia emocional).
7. Escreva **regras de composição** específicas (uso de espaço negativo, alinhamento, grid).
8. Se for campanha completa, defina o **sistema de imagens e peças**: KV, principais, secundarias, anuncios 9:16/4:5/16:9, Instagram feed, Stories, LinkedIn, e-mail, OOH/app/PDV/brinde quando fizer sentido, e como cada grupo conta parte da narrativa.
9. Para campanha, defina obrigatoriamente o **KV (Key Visual)** antes dos demais assets. Antes de produzir o KV, peça e valide: logotipo/assinatura do cliente, referencia de KV com imagem + lettering e brand kit (cores, fontes, elementos proprietarios, produto/oferta). Sem referencia de KV, o KV fica bloqueado ou apenas em layout/prompt preparatório. Antes da aprovacao do documento oficial, qualquer KV, imagem, layout ou frame visual e apenas `PREVIEW / MATERIAL DE APROVACAO`; nao produza nem marque KV final.
10. O KV precisa parecer peça de marca, não imagem bonita solta. Especifique composição-mãe, hierarquia de marca, assinatura/logo, headline, CTA, grid, área de produto/oferta, elementos proprietários, textura visual, proporções, desdobramentos, mockups e anti-usos.
11. Todo KV deve ser renderizado integralmente via `gpt_image_2`: imagem, design, lettering, headline, CTA, assinatura e hierarquia no mesmo prompt. Nao use fluxo de gerar imagem e depois compor PNG de HTML como KV final.
12. Para cada imagem-base de IA prevista sem lettering, escreva a intenção fotográfica seguindo `image-prompt-system.md`: câmera permitida, lente permitida, luz física, textura, composição, post behavior e restrições de realismo. O prompt final será fechado pelo Producer, mas Arte precisa travar a direção visual e os critérios de aprovação.
13. Defina critérios de realismo visual para a campanha: escala, anatomia, tamanho de objetos, perspectiva, sombra, textura, relação produto/personagem/cenário e sinais de imagem artificial que devem reprovar uma peça.
14. Para anúncios e posts, não entregue apenas imagem base. Especifique layout com headline aplicada, CTA, logo/assinatura, safe zones, proporção nativa e diferença entre Instagram, Meta Ads e LinkedIn.
15. Se houver pessoa, produto fisico, personagem ou roupa, escreva o bloco de **continuidade visual**: roupa, cabelo, acessorios, postura, ambiente, iluminacao e elementos que nao podem mudar.

### Decision Criteria

- Se brand já tem paleta e tipografia oficiais, REUSE — não duplique sistema.
- Se a marca tem logo, cores ou elementos proprietarios, o KV proposto deve usá-los ou justificar explicitamente por que algum item nao entrou.
- Se o mood visual contradiz a energia dominante sem justificativa, refaça. Exemplo: campanha de Copa/torcida/pet leal tende a pedir alegria, presença, vínculo, movimento e pertencimento; tristeza só entra com razão narrativa explícita.
- Se o KV não explica como as peças derivadas se desdobram, ainda não é KV, é só imagem.
- Se o KV não carrega marca, assinatura, headline/CTA, grid, elementos proprietários e regra de aplicação, ainda não é KV: é apenas imagem base.
- Se faltar referencia de KV com lettering, não produza KV final. Gere apenas lista de pendências, direção preparatória e pedido objetivo ao usuário.
- Se faltar logotipo mas o usuário aprovar fallback, produza apenas proposta/preview de KV editorial com assinatura tipográfica provisória, headline, CTA, paleta, tipografia, grid e elementos de campanha ate o documento oficial ser aprovado. Marque `Logo oficial: pendente`.
- Se a peça é educativa, prefira alto contraste (legibilidade em feed denso).
- Se a peça é storytelling, prefira paleta mais coesa (3 cores principais), tipografia serif para títulos.

## Output Format

```markdown
# Art Bible — {nome da peça}

## Mood (1 frase)
{a sensação que a peça precisa transmitir}

## Plataforma visual da campanha
- Energia dominante: ...
- Promessa emocional: ...
- Momento cultural: ...
- Território visual: ...
- Anti-mood / anti-uso: ...

## Paleta
| Cor | Hex | Função |
|-----|-----|--------|
| ... | #... | primária |

## Apresentacao visual para o PDF
- Nucleo visual acionado: Conceito / Roteiro / Arte / Storyboard / Operacao / Edicao e contribuicao de cada um.
- Swatches de cor: liste cada HEX com funcao emocional e exemplo de uso.
- Exemplos de aplicacao: fundo, headline, CTA, destaque, area segura.
- Preview do KV: descreva ou aponte o arquivo de preview/wireframe.
- Razão criativa: explique por que este visual sustenta a ideia, a marca e o momento.
- Desdobramentos visuais: como o sistema vira posts, ads, email, OOH, app, brinde e thumbnail.
- Peças com texto aplicado: quais headlines, CTAs e assinaturas aparecem nas peças.
- Controle de realismo: quais sinais reprovam imagem artificial ou inverossímil.
- Justificativa narrativa: por que esse visual sustenta a historia da campanha.

## Tipografia
- Títulos: {família} {peso}
- Corpo: {família} {peso}

## Regras de composição
- Grid: ...
- Espaço negativo mínimo: ...
- Alinhamento: ...

## Mood board (8-15 refs categorizadas)
- Composição: [ref1, ref2, ref3]
- Cor: [ref4, ref5]
- Tipografia: [ref6, ref7]
- Iluminação: [ref8, ref9]

## Sistema de imagens (campanha)
- KV / Key Visual: ...
  - Status: PREVIEW / MATERIAL DE APROVACAO / bloqueado por falta de logo / bloqueado por falta de referencias / fallback aprovado
  - Logo: arquivo recebido / assinatura provisoria / pendente
  - Renderer: Higgsfield CLI + `gpt_image_2`
  - Referencias obrigatorias: referencia de KV com lettering enviada por `--image`, logo, paleta, tipografia, produto/oferta, imagens base
- Elementos de campanha: ...
  - Layout-mãe: ...
  - Textos aplicados: headline, apoio, CTA
  - Regras de uso: ...
  - Desdobramentos: principais, secundarias, ads, emails, thumbnails
  - O que nunca pode mudar: ...
  - Peças editoriais com texto: capa/KV master, 9:16, 4:5, 16:9
  - Versoes: 9:16, 4:5, 16:9
  - Prompt direction: camera, lente, luz, textura, post behavior e composicao conforme `image-prompt-system.md`
- Principais: ...
- Secundarias: ...
- Anuncios 9:16: ...
- Anuncios 4:5: ...
- Anuncios 16:9: ...

## Continuidade visual
- Roupa/look: ...
- Cabelo/maquiagem/acessorios: ...
- Produto/personagem: ...
- Ambiente: ...
- Iluminacao: ...
- Nao pode mudar: ...

## Diretrizes para Storyboarder e Editor
- Iluminação preferida: ...
- Transições preferidas: ...
- O que não fazer: ...
```

## Output Example

```markdown
# Art Bible — Campanha "3 erros que matam sua copy"

## Mood
Urgência didática — provoca, mas ensina.

## Paleta
| Cor | Hex | Função |
|-----|-----|--------|
| Preto | #0A0A0A | fundo principal |
| Amarelo signal | #FFD400 | acento (alertas, erros) |
| Branco | #FFFFFF | texto principal |
| Cinza | #6B6B6B | texto secundário |

(4 cores — abaixo do máximo de 5)

## Tipografia
- Títulos: Inter Bold 72-96pt (sans, alta legibilidade em mobile)
- Corpo: Inter Regular 24-32pt

## Regras de composição
- Grid: 12 colunas, gutter 24px
- Espaço negativo mínimo: 15% da peça
- Alinhamento: tudo à esquerda (leitura ocidental, evita zigzag)
- Texto aplicado: máx 8 palavras por peça de impacto

## Mood board (9 refs)
- Composição: KV de campanha com lettering, @ana carrossel "5 erros", @joao thread
- Cor: paleta Vercel landing, Linear changelog, Stripe docs
- Tipografia: @paulovieira posts, NN/g style
- Iluminação: ring light frontal, sem sombras duras

## Diretrizes para Storyboarder e Editor
- Iluminação preferida: ring light frontal, fundo escuro
- Transições preferidas: corte seco entre erros, jump cut em frases-âncora
- Não fazer: layout genérico, lettering pequeno ou crop improvisado
```

## Veto Conditions

1. Mais de 5 cores ou mais de 2 famílias tipográficas.
2. Mood board com menos de 8 ou mais de 15 refs.
3. Ignora sistema visual da marca já existente.
4. Campanha completa sem sistema de imagens e continuidade visual.
5. KV sem logotipo ou assinatura provisoria aprovada, paleta, tipografia, produto/oferta ou elementos proprietarios quando esses materiais existem.
6. KV gerado como imagem generica sem registrar referencia de KV, renderer `gpt_image_2`, prompt, regras de aplicacao e razão criativa.
7. KV final produzido sem pedir referência de KV com lettering e logotipo do cliente ou sem registrar fallback aprovado.
8. Mood visual incoerente com a plataforma narrativa sem justificativa estratégica.
9. KV sem regras de desdobramento para as demais peças da campanha.
10. Aceitar imagem com erro de escala, anatomia, perspectiva, objeto impossível ou aparência artificial sem reprovar.
11. Chamar asset de anúncio quando não existe headline/CTA/texto aplicado e proporção nativa.
12. Prompt visual de imagem solta descrito com buzzwords ou sem câmera, lente, luz física, textura, post behavior e composição.
15. KV final gerado por HTML-to-PNG ou por imagem base + texto composto depois, em vez de integrado no `gpt_image_2`.
13. KV com cara de banco/imagem genérica, sem aderência visível à marca.
14. KV/campanha completa sem registrar o núcleo visual e a contribuição de cada agente.

## Quality Criteria

- [ ] Paleta com máximo 5 cores com função declarada
- [ ] Tipografia com máximo 2 famílias e pesos
- [ ] Mood board com 8-15 refs categorizadas
- [ ] Regras de composição escritas
- [ ] Diretrizes específicas para Storyboarder e Editor
- [ ] KV definido como imagem-mãe da campanha, com logo, paleta, tipografia, elementos proprietarios e produto/oferta
- [ ] KV inclui peças editoriais com texto/headline/CTA, não apenas imagem decorativa
- [ ] KV tem regras de uso, anti-usos e desdobramentos por canal
- [ ] Mood visual coerente com energia dominante e momento cultural
- [ ] Se campanha completa, sistema de imagens por tier e proporcao
- [ ] Se campanha completa, anúncios e posts foram especificados como peças reais com texto aplicado
- [ ] Critérios de realismo visual foram definidos para reprovar imagens com “cara de IA”
- [ ] Prompts visuais de imagens soltas seguem `image-prompt-system.md`
- [ ] KV usa `gpt_image_2` com referencia de KV enviada junto por `--image`
- [ ] KV parece peça proprietária da marca, não imagem genérica com texto em cima
- [ ] Núcleo visual foi acionado para KV/campanha completa
- [ ] Se houver pessoa/produto/personagem, continuidade visual definida
