---
type: checkpoint
outputFile: squads/team/output/internal/brief.md
---

# Step 00: Brief Inicial

## Objetivo
Coletar a ideia bruta do usuário e estruturá-la em um brief que vai alimentar toda a pipeline.

## Context Loading

Carregue antes de executar:
- `squads/team/pipeline/data/expertise/briefer.md` — conhecimento especialista para diagnostico, entrevista, brief e classificacao de entrada
- `squads/team/pipeline/data/campaign-delivery-system.md` — quando o usuario pedir campanha completa, projeto, imagens, anuncios, copies e calendario
- `_opensquad/_memory/preferences.md` — preferencias do usuario
- `_opensquad/_memory/company.md` — se existir, contexto permanente da marca/empresa

## Mensagem ao usuário

Olá! Vou montar uma peça de conteúdo com você do zero. Pra eu chamar o time certo (Planejamento, Sondagem, Conceito e os outros 7), preciso entender 5 coisas — pode responder no formato livre, eu organizo depois:

1. **Sobre o que** é o conteúdo? (tema, ideia bruta, dor que quer endereçar)
2. **Para quem**? (audiência específica — nicho, momento de jornada, plataforma onde está)
3. **Para que**? (qual ação você espera depois — salvar, comentar, clicar, comprar, agendar reunião)
4. **Restrições**? (formato preferido, prazo, tom obrigatório, tabus, compliance)
5. **Entrega esperada**? (peça única ou campanha completa com KV, imagens, anúncios, copies e calendário)

Se houver campanha, KV, key visual, imagem principal, anúncios ou identidade visual, peça também:

6. **Logotipo do cliente**: arquivo local, link ou informe que ainda não existe.
7. **Referência de KV**: 1 a 5 imagens/prints/links de KV ou campanha com imagem + lettering para guiar estilo, hierarquia e composição. A referência não será copiada; ela será enviada ao `gpt_image_2` como guia visual.
8. **Brand kit**: cores oficiais, fontes, elementos gráficos, guideline, produto/oferta ou materiais existentes. Se não houver, registre como pendência antes de produzir o KV.

Quanto mais específico, mais o time entrega exato. Vago demais, eu te devolvo perguntas antes de seguir.

## Comportamento esperado

A resposta do usuário é gravada em `Campanhas/{campaign_slug}/internal/brief.md`, o documento do usuário é atualizado em `Campanhas/{campaign_slug}/documentos/documento-do-projeto.pdf` e o pipeline avança para `step-01-planner.md`.

Se a resposta cobrir menos de 3 dos 5 pontos acima, o sistema deve repetir a pergunta apenas para os pontos faltantes antes de avançar.

Se o usuario pedir campanha completa, registre explicitamente no brief:

- escopo: campanha completa;
- status do KV: `bloqueado aguardando logo/referencias`, `pronto para direcao` ou `fallback aprovado pelo usuario`;
- logotipo/assinatura recebidos ou pendentes;
- referencia de KV recebida ou pendente;
- cores, fontes e elementos proprietarios recebidos ou pendentes;
- necessidade de imagens principais/secundarias sem lettering;
- necessidade de anuncios 9:16, 4:5 e 16:9;
- necessidade de copies de campanha, posts, anuncios e e-mail;
- necessidade de calendario Notion MCP ou arquivo importavel.
