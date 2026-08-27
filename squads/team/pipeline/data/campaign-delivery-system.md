# Campaign Delivery System — Human Team

Este documento define o pacote completo de entrega quando o `/team` for usado para transformar um brief em uma campanha publicavel. Ele deve ser carregado por Planner, Art Director, Producer, Social Manager e Content Multiplier.

## Objetivo

Garantir que o Time Criativo nao entregue apenas uma ideia, um roteiro ou uma peca isolada. Quando o escopo for campanha, o resultado esperado e um projeto organizado com:

- estrutura de campanha;
- plataforma narrativa de campanha;
- territorio emocional coerente com marca, produto, cultura e momento;
- KV (Key Visual) como imagem-mae da campanha, gerado de forma integrada via Higgsfield CLI + `gpt_image_2`;
- imagens principais e secundarias sem lettering quando necessarias;
- anuncios em 9:16, 4:5 e 16:9;
- copies de campanha, posts, anuncios e e-mail;
- calendario de postagem pronto para Notion MCP;
- pasta de entrega com manifesto claro.
- PDF final de apresentacao da campanha com todas as pecas criadas, em `documentos/apresentacao-da-campanha.pdf`.

Todo KV, anuncio com lettering, peca principal com texto aplicado ou layout de campanha gerado por IA dentro do `/team` usa obrigatoriamente **Higgsfield CLI + `gpt_image_2`**. O prompt deve integrar descricao da imagem, descricao do design, headline, CTA, marca, grid, hierarquia e referencia de KV enviada com `--image`.

Imagens soltas sem lettering, texturas, fundos e assets secundarios podem usar **Higgsfield CLI + Nano Banana 2**. O Time nao usa video/motion como entrega do `/team`.

## Quando ativar

Ative este sistema quando o usuario pedir qualquer uma destas coisas:

- campanha completa;
- lancamento, produto, oferta, aula, evento, comunidade ou projeto;
- imagens + copy + calendario;
- anuncios pagos ou criativos para trafego;
- pipeline completo de brief ate conteudo publicavel;
- "Claude faz o resto" a partir de um brief.

Se o usuario pedir uma peca unica, use este sistema apenas como checklist leve: nao inflar escopo sem necessidade.

## Estrutura de entrega

Use esta estrutura dentro da run:

```text
Campanhas/{campaign_slug}/
  documentos/
    documento-do-projeto.pdf
    apresentacao-da-campanha.pdf
  internal/
    documento-do-projeto.html
    documento-do-projeto.md
    projeto.md
    brief.md
    plano.md
    pesquisa.md
    conceito.md
    roteiro.md
    art-bible.md
    storyboard.md
    folha-producao.md
    copy-pack.md
    publicacao.md
    multiplicacao.md
    handoff.md
  final/
    assets/
      kv/
      principais/
      secundarias/
    ads/
      9x16/
      4x5/
      16x9/
    calendar/
      notion-calendar.md
      calendar.csv
    derivadas/
    press/
    social/
    email/
    ooh/
    brindes/
  input/
  refs/
```

Regra de entrega: tudo que for material final ou entregável da campanha fica organizado dentro de `final/` por categoria. `ads`, `assets`, `calendar`, `derivadas`, `press`, `social`, `email`, `ooh` e `brindes` não devem ficar soltos na raiz da run. A raiz existe apenas para as pastas-mãe da operação.

## Arquivos obrigatorios

### `documentos/documento-do-projeto.pdf`

Documento principal para o usuario final. Deve ser formatado, visual e atualizado a cada etapa/checkpoint. Ele e uma apresentacao de campanha, nao um relatorio textual nem um espelho bruto dos arquivos internos.

Deve conter:

- resumo executivo;
- brief e contexto;
- plano de producao;
- pesquisa sintetizada;
- conceito e Big Idea;
- plataforma narrativa com storytelling, promessa emocional e arco;
- roteiro/copy;
- direcao de arte com previews visuais;
- paleta com amostras de cor, HEX, funcao emocional e exemplos de uso;
- tipografia com hierarquia e exemplo aplicado;
- KV com logotipo, paleta, tipografia, elementos da campanha, textos aplicados e versoes por proporcao;
- exemplos visuais de pensamento criativo, referencias, cenas, mockups ou previews quando necessarios para aprovacao;
- storyboard;
- imagens, assets, anuncios e materiais finais;
- publicacao, calendario e derivadas;
- pendencias, aprovacoes e proximas acoes.

O usuario nunca deve ser enviado para ler os markdowns internos como fonte principal de aprovacao.

O PDF deve ser editorial e seletivo. Para aprovação, priorize clareza e impacto: resuma pesquisa, plano, roteiro e produção em linguagem humana; mostre apenas as imagens mais representativas; deixe variações, prompts, comandos, custos de ferramenta, mapas de origem, nomes de arquivos, caminhos locais, logs e diagnosticos completos fora do PDF. Como referência prática, uma campanha completa deve tentar ficar entre 20 e 45 páginas. Só ultrapasse isso quando houver muitas peças finais que realmente precisem ser vistas pelo cliente.

Regra de organizacao: nenhum markdown tecnico fica solto na raiz da run. Arquivos `.md`, `.html`, prompts, logs, metadata, mapas de fonte, diagnosticos, pesquisas brutas e documentos auxiliares ficam sempre em `internal/`. Registros de geracao visual, como `prompt.txt`, `.log` e `metadata.json`, ficam em `internal/generation/`, espelhando a estrutura do entregavel. A raiz da run existe para a entrega limpa: `documentos/`, `final/`, `input/` e `refs/`. Dentro de `final/`, organize os entregaveis em `assets/`, `ads/`, `calendar/`, `derivadas/`, `press/`, `social/`, `email/`, `ooh/` e `brindes/`. `final/` deve conter apenas materiais publicáveis, importáveis ou revisáveis pelo cliente.

O PDF deve ajudar o cliente a ver a campanha. Sempre que houver cor, imagem, KV, peça, calendario ou narrativa visual, o documento deve trazer exemplos visuais, previews, amostras, thumbnails, galerias, tabelas claras e justificativas curtas. Texto sozinho nao basta para aprovar campanha.

O documento deve ser positivo, claro e persuasivo sem declarar intencao de venda, convencimento ou manipulacao. Nao use termos como "vender a campanha", "manipular", "persuadir o cliente" ou similares dentro do PDF. A apresentacao deve transmitir forca, clareza, cuidado e seguranca criativa.

### `documentos/apresentacao-da-campanha.pdf`

PDF final de apresentacao das pecas. Ele deve ser gerado quando a campanha tiver materiais em `final/` e atualizado no fechamento da run.

Este PDF nao substitui o `documento-do-projeto.pdf`. A diferenca e:

- `documento-do-projeto.pdf`: estrategia, aprovacao, conceito, direcao e status.
- `apresentacao-da-campanha.pdf`: vitrine final com as pecas criadas.

Deve conter:

- nome da campanha;
- ideia central em poucas linhas;
- sistema visual sintetizado;
- KVs e pecas principais;
- anuncios 9:16, 4:5 e 16:9;
- posts organicos;
- assets principais e secundarios;
- derivadas;
- handoff curto.

Regra: quando a campanha terminar, o usuario deve receber explicitamente o caminho de `documentos/apresentacao-da-campanha.pdf` junto com o PDF principal.

### Diretrizes Visuais Do PDF

O documento oficial deve funcionar como uma apresentacao de estudio:

- abrir com nome da campanha, promessa e resumo visual;
- mostrar a plataforma narrativa como historia, nao como checklist frio;
- explicar a razão criativa de cada escolha importante;
- criar desejo de aprovação: o leitor precisa entender o conceito, sentir a intenção e enxergar como a campanha aparece no mundo;
- mostrar paleta com swatches, HEX, papel emocional e aplicacao;
- mostrar tipografia e hierarquia com exemplos;
- mostrar KV como sistema: master, elementos, regras, anti-usos, peças com texto aplicado e desdobramentos;
- mostrar previews permitidos quando ajudam a aprovar: mockups, composições, thumbnails, referencias, layouts, posts, anúncios, aplicações e calendário;
- mostrar calendário e peças em formato escaneável, com status claro;
- consolidar a inteligencia dos arquivos internos em uma narrativa visual coesa, sem expor bastidores técnicos.

O PDF não pode parecer manual técnico. Evite páginas longas de tópicos soltos, tabelas sem contexto e seções que só listam arquivos. Cada bloco deve ter título editorial, parágrafo curto de razão, visual quando existir, e uma conclusão clara sobre o que está sendo aprovado.

Estrutura recomendada do deck:

1. Capa com nome da campanha, promessa e visual principal.
2. Ideia em uma frase.
3. Por que essa campanha faz sentido agora.
4. Conceito criativo e território emocional.
5. Sistema visual: KV, paleta, tipografia, grid e elementos.
6. Peças principais por canal, com mockups ou previews.
7. Anúncios pagos com texto aplicado e CTA.
8. Posts orgânicos e LinkedIn.
9. Aplicações da marca: e-mail, OOH, app, PDV, brindes ou outros formatos relevantes.
10. Calendário e sequência de campanha.
11. Próximos passos e pontos de aprovação.

Quando ainda nao houver asset final aprovado, o PDF deve exibir previews marcados como `PREVIEW / MATERIAL DE APROVACAO`.

### `projeto.md`

Mapa executivo da campanha. Deve responder:

- o que estamos promovendo;
- para quem;
- promessa central;
- big idea;
- oferta ou CTA;
- canais;
- formatos;
- ativos necessarios;
- criterio de sucesso;
- riscos e restricoes.

### `copy-pack.md`

Biblioteca de copy da campanha. Deve conter:

- mensagem central da campanha em 1 frase;
- promessa principal e promessas secundarias;
- 5 a 10 hooks;
- copy geral da campanha;
- captions por canal;
- emails da campanha;
- headlines e primary texts para anuncios;
- CTAs aprovados;
- frases que nao devem ser usadas.

### `handoff.md`

Manifesto final para o usuario ou equipe. Deve listar:

- tudo que foi entregue;
- onde cada arquivo esta;
- quais ativos ainda dependem de aprovacao;
- quais ferramentas externas foram usadas ou seriam usadas;
- proximas acoes recomendadas.

## Sistema de imagens

## Plataforma Narrativa De Campanha

Toda campanha completa precisa de uma plataforma narrativa antes de roteiros, KVs ou imagens finais. O time deve pensar como um estudio contratado para construir uma historia integrada, nao como um gerador de pecas soltas.

A plataforma narrativa deve definir:

- **tensao humana**: qual desejo, problema, ritual, conflito ou oportunidade a campanha explora;
- **papel cultural**: em qual momento, conversa ou comportamento a campanha entra;
- **promessa emocional**: o que a pessoa sente ao entrar na campanha;
- **energia dominante**: celebracao, pertencimento, conquista, cuidado, urgencia, humor, nostalgia, superacao, provocacao etc.;
- **arco narrativo**: começo, virada, prova e chamada para acao;
- **papel do produto/marca**: como a marca resolve, potencializa ou simboliza a historia;
- **territorio visual**: clima, cor, composicao, ritmo e linguagem de imagem;
- **desdobramentos**: como KV, posts, anuncios, emails e calendario contam partes da mesma historia.

Antes de escolher qualquer mood visual, o time deve checar se ele combina com o momento cultural. Exemplo: campanha de Copa normalmente pede energia coletiva, festa, torcida, pertencimento, humor, ritual e calor humano. Um clima triste so entra se houver justificativa estrategica explicita, como saudade, superacao ou reparacao emocional. Sem justificativa, tristeza em Copa e incoerencia criativa.

O tom nao precisa ser sempre otimista. Campanhas podem ser sentimentais, tensas, contemplativas ou dramaticas quando a estrategia exigir. Mas o mood deve ser escolhido por coerencia narrativa, nao por acaso estetico.

## Campanha não é pacote de imagens

Uma campanha completa precisa parecer uma campanha que poderia ir para aprovação de cliente ou direção de marketing. O time não pode entregar apenas um conjunto de imagens geradas por IA, textos internos e um calendário. Toda entrega deve formar um sistema reconhecível, com conceito, narrativa, peças, aplicações, canais e razão clara para aprovação.

O documento oficial precisa responder, em linguagem humana:

- qual é a ideia;
- por que essa ideia existe;
- por que ela é adequada para a marca, o público e o momento;
- como a campanha aparece em cada canal;
- quais peças serão vistas por pessoas reais;
- o que está pronto, o que é preview e o que ainda depende de produção;
- por que o usuário deveria aprovar este caminho.

Se o PDF não consegue convencer pela clareza da história, pela força visual e pela qualidade das peças, ele ainda não é documento de campanha. É apenas um relatório interno.

## Sistema de imagens

### KV / Key Visual

Toda campanha completa precisa de um KV antes das demais imagens.

O KV e a imagem-mae da campanha. Ele define a linguagem visual que as imagens principais, anuncios, posts, emails e derivadas seguem.

KV nao e apenas uma imagem bonita. KV e o sistema visual e narrativo que permite reconhecer a campanha em qualquer peca.

Um KV completo deve documentar:

- ideia visual central;
- emocao dominante;
- composicao-mãe;
- paleta e funcao emocional de cada cor;
- tipografia e hierarquia;
- elementos graficos proprietarios;
- assinatura/logotipo e regras de uso;
- produto, personagem, cena ou simbolo principal;
- textos aplicados: headline, apoio, CTA quando houver;
- regras de desdobramento para posts, ads, emails, thumbnails e aplicacoes;
- o que nunca pode mudar sem quebrar a campanha.

Na apresentacao do KV no PDF, inclua:

- preview do KV master ou wireframe visual, se houver;
- amostras de cores;
- exemplos de uso em 9:16, 4:5 e 16:9;
- exemplos de texto aplicado;
- explicacao curta de por que o visual sustenta a narrativa;
- desdobramentos previstos para posts, ads, email e calendario.

Antes de produzir KV final, o time deve pedir ao usuário:

- logotipo/assinatura do cliente, preferencialmente PNG/SVG em boa resolução;
- 1 a 5 referências de KV, preferencialmente imagem com lettering, que indiquem a direção desejada;
- referências negativas, se houver;
- brand kit: cores oficiais, fontes, elementos gráficos, guideline, produto/oferta e materiais existentes.

Sem referência de KV, o KV não deve ser tratado como produzido. O time pode preparar layout, prompt e pendências, mas deve marcar o KV como bloqueado aguardando materiais ou fallback aprovado pelo usuário.

Toda referência de KV deve ser enviada junto na geração por `--image` do `gpt_image_2`. A referência serve para estilo, hierarquia, densidade de lettering, composição, acabamento e ritmo visual; nunca para copiar texto, imagem, logotipo, produto, personagem ou layout idêntico.

Se o logotipo não existir, o time pode produzir KV somente depois de registrar essa ausência e obter aprovação de fallback. Nesse caso, a peça deve usar uma assinatura tipográfica provisória com o nome da marca/projeto, paleta, tipografia, elementos editoriais, headline, CTA e sistema visual consistente. Ainda assim, deve ficar claro no PDF e no Notion: `Logo oficial: pendente`.

KV não é apenas uma imagem. O pacote de KV deve incluir peças editoriais prontas para aprovação:

- KV master com headline e composição de campanha;
- versão sem texto quando fizer sentido;
- 9:16, 4:5 e 16:9 com composição própria;
- texto/headline/CTA aplicados visualmente;
- especificação de paleta, tipografia, grid, safe zones e elementos gráficos;
- prompt e referências;
- observação de status: aprovado, ajustar, bloqueado ou fallback sem logo.

O KV deve conter obrigatoriamente, quando esses materiais existirem:

- logotipo, assinatura ou lockup da marca;
- paleta oficial com HEX e funcao;
- tipografia ou direcao tipografica compativel com a marca;
- elementos graficos proprietarios da campanha;
- produto, oferta, personagem ou transformacao em destaque;
- promessa visual da campanha;
- area segura para headline, CTA e adaptacoes;
- versoes nativas para `9:16`, `4:5` e `16:9`, nao apenas crops;
- prompt final e referencias usadas.

### Controle de realismo visual

Toda imagem gerada, comprada, editada ou composta precisa passar por uma checagem de veracidade antes de entrar no PDF, em `final/` ou em qualquer peça de campanha.

Checklist obrigatório:

- escala plausível entre pessoas, animais, objetos, produto, cenário e mobiliário;
- anatomia coerente, sem membros estranhos, patas/mãos deformadas, olhos inconsistentes ou expressão artificial;
- física plausível, com apoio, sombra, profundidade, contato com chão/móveis e perspectiva compatíveis;
- objetos com tamanho realista. Exemplo: cama, sofá, produto, embalagem ou acessório não pode ser menor do que o animal/pessoa quando isso não fizer sentido;
- textura e iluminação naturais, sem aparência plástica, “IA demais”, pele/pelo borrado, fundo derretido ou excesso de nitidez artificial;
- legibilidade e composição compatíveis com o canal;
- presença correta de produto, marca, logo, headline e CTA quando a peça exigir;
- adequação emocional ao conceito da campanha. A imagem pode ser triste, alegre ou tensa, mas precisa ser justificada pela narrativa.

Se a imagem falhar em qualquer item acima, ela deve ser marcada como `REPROVADA / NÃO USAR` em `internal/generation/quality.md` e não pode aparecer como material de aprovação. O Producer deve gerar nova variação, trocar referência, pedir material real ao usuário ou propor solução de composição/montagem.

O time deve preferir referências reais, mockups realistas, fotografia de produto, acervo do cliente e composição controlada sempre que a peça exigir veracidade. IA visual é ferramenta de produção, não licença para aceitar imagem inverossímil.

### Peças reais, não apenas imagens

Imagem base, KV e asset visual não são a mesma coisa que anúncio, post ou aplicação. Para campanha completa, o time deve produzir ou especificar peças finais por canal, com texto aplicado visualmente quando o formato exigir.

Peças obrigatórias quando o canal fizer parte do plano:

- Meta/Instagram Feed 4:5 com headline, logo/assinatura, visual, CTA e safe zone;
- Instagram Stories 9:16 com área segura para UI nativa, headline curta e CTA;
- Facebook/Meta 1:1 ou 4:5 quando mídia paga exigir adaptação;
- LinkedIn feed 1.91:1 ou 1:1 com copy visual mais sóbria, logo, headline e argumento profissional;
- post orgânico de Instagram com texto aplicado quando a peça for carrossel, post estático ou story;
- capa de carrossel e pelo menos um slide exemplo quando houver conteúdo educativo;
- e-mail header, push, OOH, brinde, PDV, app ou mockup de aplicação quando fizer sentido para a campanha;
- calendário de publicação com canal, formato, peça, copy, CTA, status e data.

Os arquivos de anúncio devem ficar em:

```text
final/ads/meta-feed-4x5/
final/ads/meta-story-9x16/
final/ads/linkedin-feed-1x1/
final/ads/linkedin-sponsored-191x1/
```

Posts orgânicos e aplicações devem ficar em:

```text
final/social/instagram/
final/social/linkedin/
final/social/tiktok/
final/email/
final/ooh/
final/brindes/
```

Toda peça visual final deve ter:

- imagem ou composição;
- texto aplicado na própria peça quando o canal pedir;
- logo ou assinatura aprovada, ou fallback explicitamente aprovado;
- CTA, quando houver ação esperada;
- proporção nativa, não apenas crop;
- versão com status claro: `preview`, `aprovado`, `ajustar`, `bloqueado` ou `final`.

Renderer:

- KV, anuncio com lettering e peca principal com texto aplicado: `higgsfield_cli` + `gpt_image_2`, com referencia de KV enviada por `--image`.
- Imagem solta sem lettering, textura, fundo ou asset secundario: `higgsfield_cli` + `nano_banana_2`.

Pasta:

```text
final/assets/kv/
```

Arquivos esperados:

```text
final/assets/kv/kv-9x16.png
final/assets/kv/kv-4x5.png
final/assets/kv/kv-16x9.png
final/assets/kv/kv-editorial-9x16.png
final/assets/kv/kv-editorial-4x5.png
final/assets/kv/kv-editorial-16x9.png
internal/prompts/kv-prompt.md
internal/kv-spec.md
```

## Aprovação em formato agência

Antes de qualquer produção final, o usuário aprova o **documento PDF oficial**. Este PDF e o contrato de campanha: primeiro como documento de aprovacao visual, depois como documento oficial de entrega.

Antes da aprovacao explicita do PDF:

- nao produza arte final;
- nao produza KV final;
- nao produza copy final;
- nao produza calendario final;
- nao produza anuncios finais;
- nao marque nada como entrega final.

E permitido produzir imagens, mockups, layouts, frames ou pecas visuais apenas para compor e explicar o PDF de aprovacao. Esses materiais devem ser marcados como `PREVIEW / MATERIAL DE APROVACAO`, com status claro, e nao podem ser tratados como entrega final.

Depois da aprovacao explicita do PDF:

- comece a producao completa;
- conclua o mesmo `documentos/documento-do-projeto.pdf` como documento oficial da campanha;
- inclua nele KV final, assets, copies, calendario, anuncios, status, caminhos dos arquivos e proximas acoes;
- crie ou atualize tudo no Notion quando houver Notion MCP conectado.

Cada fase atualiza:

- markdowns, HTML, prompts e logs internos em `internal/`;
- `documentos/documento-do-projeto.pdf`;
- página do projeto no Notion, quando Notion MCP estiver disponível.

Fases obrigatórias de aprovação:

1. **Pesquisa e direção estratégica**: dossiê, achados, referências, hipóteses e recomendação.
2. **Conceito e roteiro/copy**: Big Idea, hooks, roteiro, CTA, copies iniciais.
3. **Direção visual e storyboard**: art bible, KV spec, storyboard e pendências de marca.
4. **Aprovação do documento oficial para produção**: art bible, KV spec, storyboard, previews permitidos, pendências e contrato de produção.
5. **Produção final após aprovação explícita**: KV, assets, anúncios, copies finais, calendário e materiais finais.

Se o usuário pedir alteração, o time deve atualizar arquivos internos, regenerar PDF e sincronizar Notion novamente antes de pedir nova aprovação.

## Produção Textual E Copywriting

Toda campanha completa precisa de produção textual entregue em PDF e Notion:

- copy central da campanha;
- headlines;
- CTAs;
- legendas por canal;
- copies de anúncio;
- emails;
- newsletter;
- textos de post;
- variações de hook;
- textos aplicados nos KVs e peças editoriais.

O agente Roteiro / Scriptwriter é responsável pela base persuasiva. Social Manager adapta por canal. Content Multiplier cria derivações e calendário editorial.

## Producao Integrada De Campanha

Uma campanha real nao e uma colecao de markdowns nem uma lista isolada de imagens. O `/team` deve pensar em entregaveis integrados, com agentes trabalhando em paralelo quando possivel e em sequencia quando houver dependencia.

Entregaveis finais possiveis:

- documentos oficiais de aprovacao e entrega: `documentos/documento-do-projeto.pdf`, HTML e resumo executivo;
- plataforma narrativa da campanha;
- KV editorial com textos aplicados e versoes por proporcao;
- imagens finais: principais, secundarias, thumbnails e anuncios;
- copies finais para posts, anuncios, emails, newsletter, legendas e CTAs;
- calendario editorial e calendario de publicacao;
- handoff operacional com paths, status, pendencias e proximas acoes.

Modelo operacional de agencia:

| Frente | Agente responsavel | Entrega |
|---|---|---|
| Pesquisa e estrategia | Sondagem + Planejamento | dossie, oportunidades, riscos e caminho aprovado |
| Conceito | Conceito | Big Idea, plataforma narrativa, promessa, energia emocional, hook e criterio criativo |
| Copy e roteiro | Roteiro | roteiro, copy-pack, headlines, CTAs e textos aplicados |
| Direcao visual/KV | Arte | art bible, KV spec, referencias e regras visuais |
| Imagens/assets | Operacao | imagens, fontes, prompts, assets e pastas |
| Finalizacao estatica | Edicao | pecas finais, composicoes, QC visual e versoes por canal |
| Publicacao/calendario | Midia + Transformacao | calendario, copies por canal, derivadas e Notion/importacao |

O `/team` nao produz video/motion. Se o usuario pedir video, explique que esta frente foi removida do Human Team e proponha acionar Human Motion como fluxo separado.

### Padrao de geracao

Antes de gerar qualquer asset visual, o Producer ou Art Director deve registrar:

- modelo: `gpt_image_2` para KV/anuncios com lettering, ou `nano_banana_2` para imagens soltas sem lettering;
- provider: `higgsfield_cli`;
- referencia de KV enviada via `--image`, quando o asset for KV ou peca com lettering;
- aspect ratio: `9:16`, `4:5`, `16:9`, `1:1` ou outro formato aprovado;
- resolucao: `1k`, `2k` ou `4k` — padrao `2k`;
- referencias usadas;
- prompt final;
- pasta de output;
- tentativa e decisao de aprovacao/refino.

Assets gerados devem entrar nas subpastas corretas:

```text
final/assets/kv/
final/assets/principais/
final/assets/secundarias/
final/ads/9x16/
final/ads/4x5/
final/ads/16x9/
```

Cada formato nasce com composicao propria. Nao trate 16:9, 9:16 e 4:5 como cortes do mesmo arquivo.

### Principais

Objetivo: carregar a promessa central. Sao as imagens mais importantes da campanha.

Deve conter:

- produto, pessoa, oferta ou transformacao em primeiro plano;
- roupa/look consistente com a direcao de arte;
- leitura forte em mobile;
- versoes com e sem texto, quando possivel;
- espaco seguro para headline e CTA.

### Secundarias

Objetivo: sustentar argumentos, objecoes, provas, bastidores e variacoes.

Podem incluir:

- detalhe do produto;
- cena de uso;
- prova social;
- comparativo antes/depois;
- bastidor;
- recorte educativo;
- visual para e-mail, post estatico ou story.

## Roupa, visual e continuidade

Quando a campanha envolve pessoa, personagem, produto fisico ou look especifico, a direcao de arte deve criar um bloco de continuidade:

- roupa principal;
- roupa alternativa;
- cabelo, maquiagem, acessorios;
- postura;
- expressao;
- ambiente;
- iluminacao;
- elementos que nunca podem mudar entre imagens.

O Producer deve transformar isso em checklist de producao ou prompt de imagem. O Art Director deve vetar assets que quebrem continuidade.

## Anuncios por proporcao

Toda campanha completa deve prever estes formatos:

| Proporcao | Uso principal | Requisito |
|---|---|---|
| 9:16 | Stories, vertical ads, posts verticais estaticos | leitura imediata em mobile, safe zone para UI nativa |
| 4:5 | Feed Instagram, Meta Ads | Headline legivel, produto/promessa em destaque |
| 16:9 | landing, apresentacao, display, header horizontal | Composicao horizontal sem parecer corte improvisado |

Cada anuncio deve ter:

- objetivo;
- publico;
- hook;
- visual;
- headline;
- primary text;
- CTA;
- arquivo ou prompt de asset;
- observacao de safe zone.

Anúncio só conta como anúncio quando existe como peça de mídia ou layout especificado: imagem base + headline aplicada + CTA + assinatura + proporção nativa. Uma imagem sem copy aplicada é apenas asset visual, não anúncio.

## Copies obrigatorias

Para campanha completa, o Scriptwriter, Social Manager e Content Multiplier devem cobrir:

- copy geral da campanha;
- copy curta para posts;
- copy longa para LinkedIn ou e-mail;
- assunto e preheader de e-mail;
- copy de anuncio por proporcao;
- captions nativas por canal;
- CTAs por etapa da jornada.

## Calendario Notion MCP

Quando Notion MCP estiver disponivel, o Social Manager deve criar ou atualizar uma base de calendario. Quando nao estiver disponivel, deve gerar `final/calendar/notion-calendar.md` e `final/calendar/calendar.csv` prontos para importacao.

## Projetos No Notion MCP

Quando Notion MCP estiver disponivel, toda run do `/team` deve sincronizar com uma pagina de projeto.

Hierarquia:

```text
Projetos
  {nome-do-projeto}
```

Regras:

- Primeiro procure a pagina raiz `Projetos`.
- Se `Projetos` nao existir, crie.
- Dentro de `Projetos`, procure uma pagina com o mesmo nome do projeto/campanha.
- Se existir, atualize essa pagina.
- Se nao existir, crie uma nova pagina.
- Nunca duplique projeto com o mesmo nome.
- A pagina do projeto deve conter ou referenciar:
  - PDF `documentos/documento-do-projeto.pdf`;
  - HTML interno `internal/documento-do-projeto.html`;
  - resumo executivo;
  - status de aprovacao;
  - KV e assets principais;
  - anuncios;
  - calendario;
  - links/caminhos dos materiais finais;
  - historico de atualizacoes.
- Se Notion MCP nao estiver disponivel, registre `Notion MCP: pendente` no handoff e mantenha os arquivos locais.

Campos recomendados:

| Campo | Tipo | Descricao |
|---|---|---|
| Data | Date | Dia e horario de publicacao |
| Campanha | Text | Nome da campanha |
| Canal | Select | Instagram, LinkedIn, E-mail, Blog, Ads |
| Formato | Select | Story, Carrossel, Post, Email, Ad, KV, OOH |
| Pilar | Select | Teaser, Principal, Prova, Educativo, Oferta, Bastidor |
| Asset | Files/URL | Caminho do arquivo ou link |
| Caption | Text | Copy final do post |
| CTA | Text | Acao esperada |
| Status | Select | Ideia, Producao, Aguardando aprovacao, Agendado, Publicado, Medido, Arquivado |
| Responsavel | Person/Text | Quem executa |
| Observacoes | Text | Dependencias, riscos, notas de aprovacao |

## Regra de decisao: agente sozinho vs pipeline

Use um agente sozinho quando:

- a demanda e pontual;
- o usuario ja sabe exatamente o que falta;
- existe material pronto e so precisa melhorar um trecho.

Use pipeline completo quando:

- o usuario trouxe apenas brief ou ideia;
- ha multiplos entregaveis;
- a campanha precisa de imagem, copy, anuncio e calendario;
- ha dependencia entre estrategia, roteiro, arte, producao e publicacao.

## Definition of Done para campanha completa

Uma campanha so esta pronta quando:

- `projeto.md` resume a campanha sem depender de conversa externa;
- `copy-pack.md` cobre campanha, posts, anuncios e e-mail;
- imagens estao organizadas em KV, principais e secundarias;
- KV existe como sistema visual e narrativo, não apenas como imagem isolada;
- cada imagem usada no PDF passou pelo controle de realismo visual;
- imagens reprovadas por escala, anatomia, perspectiva, textura ou “cara de IA” foram excluidas do PDF e de `final/`;
- anuncios existem ou estao especificados em 9:16, 4:5 e 16:9 com headline, CTA e texto aplicado visualmente;
- existe pelo menos um pacote orgânico com Instagram e LinkedIn quando esses canais fizerem parte do plano;
- aplicações e mockups relevantes foram apresentados: e-mail, OOH, app, PDV, brinde, post ou outro formato do escopo;
- calendario esta pronto para Notion MCP ou importacao;
- o PDF parece uma apresentação editorial de campanha, com conceito, razão criativa, emoção e peças, não um manual técnico;
- `handoff.md` lista tudo que foi entregue e pendencias reais;
- nao ha placeholders, nomes falsos, links quebrados ou arquivos sem funcao.
