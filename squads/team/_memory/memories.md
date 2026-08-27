# Squad Memory: Time Criativo

Aprendizados reutilizaveis do time. As secoes abaixo sao o ponto de partida do
squad e valem para qualquer marca. Conforme voce roda campanhas, o time acrescenta
aqui o que aprender sobre o seu negocio, seu tom e suas preferencias.

## Pacing
- Respeitar os checkpoints do pipeline por padrao. So reduzir o numero de pausas se o usuario pedir explicitamente fluxo continuo.
- Sempre pausar antes de acao irreversivel ou com custo real: chamar Higgsfield CLI pago, publicar em canal, comprar dominio, disparar e-mail.
- Quando o brief ja vier generoso, nao re-confirmar a cada agente — entregar o pacote e oferecer ajustes pontuais depois.

## Estilo de Escrita
- Tom premium, calmo, contido. Frases curtas. Pausa em vez de exclamacao.
- Voz emocional sem ser sentimental. Senior sem ser frio.
- Em marcas de lifestyle premium, evitar diminutivo afetivo e linguagem infantilizada.

## Design Visual
- Sistema que costuma funcionar em lifestyle premium: paleta neutra (cream, off-white, tan, charcoal) com 1 cor de assinatura saturada como diferencial da marca.
- Tipografia editorial com serifa (ex.: Cormorant Garamond) + sans neogrotesca (ex.: Inter) para hierarquia.
- Fotografia natural, golden hour ou janela lateral. Evitar fundo branco vazio.
- Continuidade visual do produto e critica entre renders de IA — sempre gerar um "character reference anchor" antes de rodar um batch.

## Estrutura de Conteudo
- Campanhas de lancamento de marca + produto funcionam melhor em 3 ondas: Teaser (curiosidade sem nomear) → Reveal (marca + produto + lista de espera) → Sell (loja abre, conversao).
- Montar cronograma backward a partir da data de lancamento, com a Art Bible como gargalo do caminho critico.

## Proibicoes Padrao
- Sem emoji em copy de marcas premium.
- Sem clipart, cartoon, mascote, ilustracao infantil.
- Sem caps gritante, exclamacao gratuita, hype.
- Sem produto em fundo branco vazio.
- Sem nomear concorrente diretamente.

## Tecnico
- KV, anuncio com lettering e peca principal com texto aplicado: usar Higgsfield CLI + `gpt_image_2`, sempre enviando referencia de KV com imagem + lettering por `--image` quando houver KV final.
- Imagem solta sem lettering, textura, fundo e asset secundario: usar Higgsfield CLI + Nano Banana 2 (`nano_banana_2`).
- Prompts de KV seguem `pipeline/data/gpt-image-kv-system.md`; prompts de imagem solta seguem o formato Human Image: CAMERA / LENS / LIGHT / SUBJECT / FOREGROUND / MIDGROUND / BACKGROUND / WARDROBE TONAL BEHAVIOR / MAKEUP SURFACE PHYSICS / POST BEHAVIOR / COMPOSITIONAL GEOMETRY / MOOD & ART DIRECTION.
- Camera padrao: IMAX MK IV 65mm em cenas contemplativas, ARRI Alexa 35 em cenas com movimento.

## Prompt Engineering — Higgsfield / Nano Banana 2
- **Instrucoes negativas falham em boa parte das geracoes.** "no TV screen visible" costuma ser ignorado. Substituir por instrucao POSITIVA do que se quer no lugar.
- **Repeticao em sinonimo aumenta aderencia.** Para "olhos fechados": "eyes softly closed, eyelids gently shut, sleeping peacefully" — tres formulacoes em uma frase.
- **Referencias cinematograficas familiares ao modelo elevam a densidade visual.** "shot on Portra 400 medium format film", "warm tungsten domestic light".
- **Posturas e expressoes especificas funcionam melhor que estados emocionais abstratos.** "head resting on hand, eyes closed, slumped shoulders" > "defeated posture".
- **Para excluir um elemento, descreva o que deve ocupar o lugar dele.** Em vez de "no costume" num pet, usar "natural fur uncovered" + os tecidos permitidos (cachecol, lenco, cobertor).
- **Transformar restricao em assinatura visual rende mais que banir o elemento.** Ex.: em vez de proibir a TV no quadro, pedir "warm flickering amber-blue light from television off-frame, screen completely outside the frame".
