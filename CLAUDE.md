# Human Team — Instrucoes do Projeto

Este projeto e o **Time de Agentes Criativos**: 10 agentes que transformam uma ideia
em campanha pronta (brief, conceito, roteiro, direcao de arte, storyboard, KV,
imagens, anuncios, copy, calendario e handoff). Por baixo ele roda em **OpenSquad**,
um framework de orquestracao multiagente.

O usuario deste projeto pode nunca ter usado Claude Code. Conduza sem jargao.

## Comportamento De Entrada — leia isto primeiro

Quando o usuario abrir este projeto e disser qualquer coisa como "vamos comecar",
"vamos começar", "comecar", "começar", "quero comecar", "vamos la", "bora", "start",
"o que eu faco aqui", "quero criar uma campanha", "oi", "ola", ou trouxer direto uma ideia,
briefing, link, imagem ou material:

1. **Nao abra menu generico.** Nao pergunte "o que voce quer fazer?".
2. Leia `.claude/commands/team.md` e **inicie o fluxo do `/team`** seguindo aquele arquivo.
3. Antes de pedir briefing, apresente os 10 agentes disponiveis, como o `/team` manda.

Esta pasta e autocontida: use sempre a versao que esta aqui dentro (`.claude/commands/team.md`,
`.claude/skills/opensquad/`, `skills/`, `squads/`, `_opensquad/`). Se a pessoa tiver skills
globais parecidas instaladas (`human-team`, `opensquad`), elas **nao** substituem esta pasta.

O comando `/team` e o caminho padrao deste projeto. `/opensquad` continua existindo
para quem quiser criar ou editar outras squads, mas nao e o ponto de partida.

## Primeira Execucao (setup em 2 minutos)

Antes de comecar a primeira campanha, verifique `_opensquad/_memory/company.md`.

Se o arquivo contiver `<!-- NOT CONFIGURED -->`, faca a configuracao inicial **de forma
curta e conversada**, uma pergunta por vez, sem formulario longo:

1. Nome da pessoa e idioma preferido → salve em `_opensquad/_memory/preferences.md`.
2. Nome da marca/empresa e site.
3. Se houver site, use WebFetch/WebSearch para levantar setor, publico, produtos e tom de voz.
4. Apresente um resumo curto para a pessoa confirmar ou corrigir.
5. Salve o resultado em `_opensquad/_memory/company.md`, removendo a linha `<!-- NOT CONFIGURED -->`.
6. Emende direto no fluxo do `/team` — nao devolva a pessoa para um menu.

Se a pessoa quiser pular o setup, siga o `/team` mesmo assim e colete o minimo dentro do brief.

## Dependencias

O time funciona sem nenhuma instalacao para brief, pesquisa, conceito, roteiro,
direcao de arte, storyboard e copy.

Duas coisas so sao necessarias quando o fluxo chegar nelas:

- **PDF de aprovacao** (`npm run render-project-document`): precisa de `npm install` e
  `npx playwright install chromium` rodados uma vez na pasta do projeto. Se o comando
  falhar por falta de dependencia, peca isso na hora, de forma simples, e siga.
- **Geracao de imagem**: precisa de **um** motor configurado na maquina — **Higgsfield CLI**
  ou **Magnific MCP**. Confira com:

  ```bash
  python3 skills/image-ai-generator/scripts/generate.py --check-providers
  ```

  O comando responde o status do Higgsfield; o do Magnific voce mesmo verifica, olhando se
  existem ferramentas `mcp__magnific__*` na sessao (se estiverem diferidas, `ToolSearch` com a
  query `magnific`). **Se os dois estiverem disponiveis, pergunte ao usuario qual usar** — uma
  vez por run, e guarde a escolha. Se so um estiver, use ele sem perguntar. Se nenhum estiver,
  entregue prompt + direcao visual e explique que a imagem final depende dessa configuracao.
  Nao bloqueie o resto da run por causa disso. Detalhes em `providers.md`.

Nunca peca configuracao de ferramenta que nao sera usada naquela execucao.

## Estrutura de Pastas

- `Campanhas/` — onde nascem as campanhas do usuario (uma subpasta por campanha)
- `squads/team/` — o Time de Agentes Criativos: agentes, pipeline, steps e expertise
- `squads/team/_memory/` — aprendizados e historico de execucoes do time
- `_opensquad/` — nucleo do OpenSquad (nao editar manualmente)
- `_opensquad/_memory/` — contexto da empresa e preferencias, carregados em toda run
- `skills/` — skills disponiveis para os agentes (Canva, imagens, publicacao, e-mail)
- `dashboard/` — Escritorio Virtual opcional, mostra os agentes trabalhando

## Regras

- Fale com o usuario em portugues, salvo preferencia diferente em `preferences.md`.
- Carregue o contexto da empresa (`_opensquad/_memory/company.md`) antes de qualquer run.
- Nao pule checkpoints. Sempre pause antes de acao paga, irreversivel ou de publicacao.
- Toda campanha vive em `Campanhas/{nome-da-campanha}/`. Nunca salve entrega solta na raiz.
- Markdown tecnico vai para `internal/`. A pessoa aprova pelo PDF em `documentos/`, nunca lendo markdown.
- Nao edite arquivos em `_opensquad/core/` sem necessidade real.
- Ao final de uma run que gerou arquivos, informe a pasta final como link clicavel de
  caminho absoluto e liste cada arquivo nao-`.md` gerado como link clicavel. Nao liste
  `.md` um a um, mas sempre entregue a pasta para a pessoa encontrar tudo.
- Registre o que aprender sobre a marca em `squads/team/_memory/memories.md` e a execucao
  em `squads/team/_memory/runs.md`.

## Sessoes de Navegador

O OpenSquad usa um perfil Playwright proprio para manter login em redes sociais.

- As sessoes ficam em `_opensquad/_browser_profile/` (privado, fora do git)
- Na primeira vez em cada plataforma, o login e feito manualmente uma unica vez
- **Importante:** o plugin nativo de Playwright do Claude Code precisa estar desativado.
  O OpenSquad usa o proprio servidor `@playwright/mcp` configurado em `.mcp.json`.
