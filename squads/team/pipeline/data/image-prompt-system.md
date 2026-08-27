# Image Prompt System — Imagens Soltas via Nano Banana 2

Este arquivo e regra obrigatoria para todo prompt visual gerado pelo Human Team. Ele consolida o sistema de criacao de prompt do Human Image e e autossuficiente: nao depende de nenhum arquivo externo.

## Principio Central

O time escreve prompts como Diretor de Fotografia e Diretor de Arte, nao como chatbot. O usuario nao precisa escolher camera, lente, luz, abertura ou mood. O time infere essas decisoes a partir da marca, campanha, plataforma narrativa, art bible, storyboard e objetivo da peca.

Este sistema vale para imagens soltas sem lettering: fotos conceituais, texturas, fundos, detalhes, imagens principais/secundarias e assets visuais que nao precisam renderizar texto.

KV, anuncio com lettering, peca principal com headline/CTA ou layout de campanha com texto aplicado nao usam este sistema como regra principal. Esses casos usam `squads/team/pipeline/data/gpt-image-kv-system.md` com Higgsfield CLI + `gpt_image_2` e referencia de KV enviada por `--image`.

## Proibicoes

Nao usar linguagem generica ou buzzwords no prompt:

- cinematic
- epic
- beautiful
- dramatic
- stunning
- moody
- ethereal
- perfect composition
- gorgeous
- breathtaking
- masterpiece
- award-winning
- best quality
- 4k / 8k
- hyperrealistic
- ultra detailed

Nao pedir texto livre dentro de imagem Nano Banana. Se houver texto, logo, CTA, preco, headline, assinatura ou lettering como parte da peca final, mude para o fluxo `gpt_image_2` de KV/lettering.

Nunca incluir watermark, frame numbers, sprocket holes, film borders, mock logos falsos ou letras aleatorias.

## Regra De Qualidade

Descreva fisica, nao adjetivos. Toda decisao visual precisa virar instrucao concreta:

- posicao da camera;
- lente e T-stop;
- altura e angulo;
- distancia do sujeito;
- fonte de luz motivada;
- Kelvin;
- direcao da sombra;
- textura de pele, produto, tecido e superficie;
- comportamento tonal;
- grao e halation;
- composicao, assimetria, intrusao de foreground e geometria.

Imagem boa precisa parecer filmada, nao renderizada. Imperfeicao controlada e desejavel: foco que dissolve, assimetria, bordas tocadas, luz nao balanceada e textura real.

## Cameras Permitidas

Use apenas duas cameras:

- `IMAX MK IV 65mm`, ISO 250: cenas contemplativas, grandes, ritualisticas, retratos densos, escala, silencio, produto premium.
- `ARRI Alexa 35`, ISO 800: cenas narrativas, urbanas, dinamicas, noturnas ou com movimento.

Em duvida, use `ARRI Alexa 35`.

## Lentes Permitidas

Para IMAX 65mm:

- Zeiss Makro-Planar 65mm T2.2: close-ups, retratos, rituais, objetos.
- Hasselblad/Zeiss 80mm T2.2: medium-wide, interiores, composicoes calmas.
- Zeiss Otus 85mm T2.5: retratos densos.
- Leica Summilux-C 40mm T1.4: wide natural.

Para Alexa 35:

- Canon K35 24mm T1.5: wide dinamico.
- Canon K35 35mm T1.5: narrativa padrao, handheld, default.
- Canon K35 55mm T1.5: retrato urbano.
- Canon K35 85mm T1.8: close-up.

## Estrutura Obrigatoria Do Prompt Nano Banana

O prompt final deve ser em ingles, com paragrafos nesta ordem e headers exatamente assim:

```text
CAMERA:
LENS:
LIGHT:
SUBJECT:
FOREGROUND:
MIDGROUND:
BACKGROUND:
WARDROBE TONAL BEHAVIOR:
MAKEUP SURFACE PHYSICS:
POST BEHAVIOR:
COMPOSITIONAL GEOMETRY:
MOOD & ART DIRECTION:
```

Limite: 1.200 a 1.500 caracteres. Corte decoracao; preserve decisoes fisicas.

Linha final permitida:

```text
MOOD & ART DIRECTION: Composition and art direction inspired in the work of award-winning directors.
```

Nao citar diretores, filmes ou DPs especificos no output.

## POST BEHAVIOR

POST BEHAVIOR carrega assinatura visual e nunca pode ser generico.

Use por formato:

- IMAX 65mm -> `65mm film grain structure`
- Alexa 35 -> `35mm film grain structure`

Ou por stock quando o look pedir:

- Neon/tungsten/noite urbana: Kodak Vision3 500T 5219.
- Diurno natural/verde/folha: Kodak Vision3 250D 5207.
- Pastel urbano/interiores mistos: Fuji Eterna 500T 8573.
- Preto e branco alto contraste: Kodak Double-X 5222.
- Print final com pele rica: Kodak 2383 print.
- 16mm indie/documental: Kodak 7219 ou 7222 B&W.

O grao deve ser visivel: `visible`, `tactile`, `organic`, `heavy`, `coarse`, `prominent`. Nunca `subtle`, `fine` ou `barely visible`.

## Workflow De Iteracao

1. Escreva o prompt mestre baseado no KV/art bible/storyboard.
2. Gere 1 ou 2 candidatos, nao 20 variacoes cegas.
3. Inspecione contra brief, marca, KV e realismo.
4. Mude uma variavel por iteracao.
5. Registre tentativa, falha, decisao e prompt em `internal/generation/`.

## QC Obrigatorio

Reprove qualquer imagem com:

- cara de IA;
- escala incoerente;
- anatomia errada;
- sombra sem fonte;
- perspectiva quebrada;
- produto diferente do brief;
- roupa/look inconsistente entre pecas;
- paleta fora da marca;
- ausencia de funcao narrativa;
- asset que parece banco generico;
- KV que nao parece peca de marca.

Se uma imagem falhar, marque `REPROVADA / NAO USAR` e nao inclua em `final/` nem no PDF de campanha.
