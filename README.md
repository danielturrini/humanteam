# Human Team — Time de Agentes Criativos

Um time de 10 agentes de IA que pega uma ideia e devolve campanha pronta:
pesquisa, conceito, roteiro, direcao de arte, storyboard, key visual, imagens,
anuncios, copy, calendario de publicacao e handoff.

Voce traz a ideia. O time conduz o resto, parando so quando precisa da sua aprovacao.

---

## Comecar

1. Abra esta pasta no Claude Code.
2. Escreva **`começar`** e mande.

E so isso. O time se apresenta, faz um setup curto na primeira vez (seu nome, sua
marca, seu site) e ja entra no fluxo da primeira campanha.

Se preferir ir direto ao ponto, escreva o que voce quer:

```
quero uma campanha de lancamento para o meu produto
```

Voce tambem pode chamar o time pelo comando:

```
/team
```

---

## O que voce precisa ter

**Para comecar agora, nada.** Brief, pesquisa, conceito, roteiro, direcao de arte,
storyboard e copy funcionam sem nenhuma instalacao.

Duas coisas so entram quando o fluxo chega nelas — e o proprio time avisa na hora:

| Para que serve | O que instalar | Quando |
|---|---|---|
| Gerar o PDF de aprovacao da campanha | `npm install` e depois `npx playwright install chromium`, na pasta do projeto | Antes da primeira aprovacao |
| Gerar as imagens finais (KV, anuncios) | Higgsfield CLI configurado na maquina | Antes da producao visual |

Sem o Higgsfield o time ainda entrega toda a direcao visual e os prompts prontos —
falta so apertar o botao de gerar.

Se quiser deixar tudo pronto de uma vez, rode na pasta do projeto:

```bash
npm install && npx playwright install chromium
```

---

## Onde ficam as suas coisas

Cada campanha nasce em `Campanhas/{nome-da-campanha}/`:

```text
Campanhas/minha-campanha/
  input/          o que voce entregou ao time
  refs/           referencias, logo, brand kit
  documentos/     PDF de aprovacao da campanha  ← e aqui que voce revisa
  final/          pecas finais publicaveis
  internal/       bastidor tecnico do time
```

Voce aprova pelo PDF em `documentos/`. Nao precisa abrir nada tecnico.

---

## O time

| Agente | O que faz |
|---|---|
| Planejamento | Transforma briefing em plano, prazos e criterios de conclusao |
| Sondagem | Pesquisa tendencias, audiencia e referencias de mercado |
| Conceito | Define a big idea e o angulo criativo |
| Roteiro | Escreve copy, hooks e CTAs |
| Arte | Define paleta, tipografia, mood e regras visuais |
| Storyboard | Quebra a copy em quadros e composicoes |
| Operacao | Organiza assets, producao e geracao de imagem |
| Edicao | Fecha KVs, anuncios e o pacote final |
| Midia | Prepara publicacao, captions e calendario |
| Transformacao | Multiplica a peca principal em derivadas |

---

## Escritorio Virtual (opcional)

Uma tela 2D que mostra os agentes trabalhando em tempo real.

```bash
npm install && npm run dev
```

Depois abra o endereco que aparecer no terminal.

---

## Duvidas frequentes

**Preciso saber programar?** Nao. Voce conversa em portugues e o time faz o resto.

**Posso usar a minha marca?** Sim. Na primeira execucao o time pergunta sobre ela e
guarda o contexto. Nas proximas campanhas ele ja sabe.

**O time publica sozinho?** Nao. Ele nunca publica, nunca gera imagem paga e nunca faz
nada irreversivel sem a sua aprovacao explicita.

**Quero mudar alguma coisa no meio.** E so falar. O time refaz a etapa e atualiza o PDF.
