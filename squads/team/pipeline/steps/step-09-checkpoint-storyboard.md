---
type: checkpoint
---

# Step 09: Aprovação Do Documento Oficial Para Produção

## Objetivo
Pausar antes da produção final para o usuário aprovar o documento PDF oficial da campanha: pesquisa, conceito, roteiro/copy, direção visual, KV spec, storyboard, previews permitidos, pendências e plano de produção.

## Mensagem ao usuário

Storyboard montou a versão para aprovação no documento oficial: `Campanhas/{campaign_slug}/documentos/documento-do-projeto.pdf`. O markdown técnico fica em `Campanhas/{campaign_slug}/internal/storyboard.md`.

A partir daqui, Operação, Edição, Mídia e Transformação só podem produzir entregas finais se este PDF for aprovado explicitamente.

Explique ao usuário:

- o que o PDF define como campanha;
- quais imagens/quadros/layouts são apenas `PREVIEW / MATERIAL DE APROVACAO`;
- quais peças só serão produzidas depois da aprovação;
- quais materiais ainda faltam, como logo, referências, ferramenta de render, acessos ou Notion MCP;
- quais decisões o usuário precisa tomar agora.

**Aprova o documento oficial para iniciar a produção completa?**

Opções:
- **Aprovar** → seguimos para Operação (step-10) iniciar produção final
- **Ajustar** → quais quadros/peças precisam mudar e por quê
- **Recomeçar da arte** → volta pro step-07 (a direção visual não casou)

## Comportamento esperado

Se aprovado, registre explicitamente: `Documento oficial aprovado para producao final`.
Se ajuste, retorna para step-08 com lista específica de quadros/peças a refazer.
Se recomeçar, retorna para step-07.
