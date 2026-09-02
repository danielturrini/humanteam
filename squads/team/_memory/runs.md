# Run History: Time Criativo

Ao final de cada execucao do `/team`, registre uma linha nesta tabela.

| Data | Run ID | Tema | Output | Resultado |
|------|--------|------|--------|-----------|
| 2026-09-02 | 20260902190000 | Espaço Viver Bem x Becton Dickinson (Unimed Juiz de Fora) | 58 peças visuais (12 Linhas de Cuidado + guia de bolso + lançamento/lembrete) + calendário de rotação quinzenal | Documento oficial aprovado; peças em status AJUSTAR aguardando logo/telefone/URL/data de lançamento |
| — | — | Nenhuma campanha executada ainda | — | — |

## Run 20260902190000 — Espaço Viver Bem x Becton Dickinson (Unimed Juiz de Fora)

**Campanha**: `Campanhas/espaco-viver-bem-bd/`

- **Contexto**: Unimed Juiz de Fora ativa o Espaço Viver Bem (EVB) dentro da
  empresa parceira Becton Dickinson (BD), com presença quinzenal de uma
  assistente. Objetivo: revelar aos titulares/dependentes as 12 Linhas de
  Cuidado já incluídas no plano, sem custo adicional*.
- **Entrada**: usuário trouxe brief já avançado (plano de outra IA/Copilot),
  conteúdo oficial validado, PDF-base, 3 referências visuais (vistas no chat,
  nunca recebidas como arquivo) e, depois, o manual de marca oficial (MS.139)
  e manuais complementares via Google Drive.
- **Conceito aprovado**: "O cuidado que já é seu, só falta descobrir."
  Headline master: "Você sabia que isso já é seu?". Descartado o conceito
  original do usuário ("Mais cuidado para cada momento da vida") por ser
  genérico. Regra fixa: nunca abrir peça com sintoma/dor/urgência.
- **Pipeline completo**: brief → plano → sondagem (checagem factual, não
  pesquisa de tendência) → conceito → roteiro (copy-pack + 25→10→3
  headlines) → art bible (paleta/tipografia herdadas do manual oficial) →
  storyboard (peça-piloto) → checkpoint PDF aprovado → operação (assets
  mapeados, KV bloqueado) → edição (mockups editoriais da peça-piloto) →
  transformação (multiplicado para as 12 linhas + guia de bolso + lançamento/
  lembrete = 58 peças) → mídia (calendário de rotação quinzenal, 13 ciclos).
- **Bloqueios reais da run**: nenhum motor de geração de imagem disponível
  (Higgsfield CLI não instalado; Magnific requer OAuth não executável nesta
  sessão) e logo/referência de KV nunca chegaram como arquivo (só vistos no
  chat). Resolvido com fallback: peças renderizadas via HTML/CSS→PNG
  (Chromium local), sem geração por IA, marcadas `PREVIEW / MATERIAL DE
  APROVAÇÃO` e status `AJUSTAR`.
- **Pendências reais deixadas para o usuário**: logo oficial em arquivo,
  referências de KV em arquivo, HEX de apoio (lima/verde escuro)
  confirmados, telefone de contato, URL oficial do EVB, data de lançamento
  (D0), canal digital interno (Teams/e-mail) confirmado.
- **Correção de infraestrutura**: `scripts/render-project-document.js`
  quebrava neste ambiente porque o playwright resolvido pelo `npm install`
  esperava uma revisão de Chromium mais nova do que a pré-instalada — corrigido
  para usar `/opt/pw-browsers/chromium` quando presente. Sem esse fix, o PDF
  de aprovação não gera.

## Run 20260827160735 — Somos Juntos / Instituto Unimed Juiz de Fora
- Modo: evoluir sistema editorial existente (InDesign).
- Escopo atual: capa + contracapa (12,5×24 cm; aberto 25×24 cm).
- Entregue: concept visual (canvas) com espelho aberto + capa + contracapa. Status: aguardando aprovação.
- Placeholders: logo oficial pendente; confirmar Instagram/site; tipografia licenciada.
- Pendências p/ arte final: exports atuais, paleta hex, fontes da marca, fotos dos projetos (miolo).
