---
type: checkpoint
---

# Step 02b: Aprovacao Da Pesquisa

## Objetivo

Pausar para aprovar pesquisa, achados, referencias, hipoteses e direcao estrategica antes de gerar conceito, roteiro ou qualquer producao visual.

## Mensagem ao usuario

Sondagem finalizou a pesquisa e o documento de aprovacao foi atualizado em:

```text
Campanhas/{campaign_slug}/documentos/documento-do-projeto.pdf
```

O PDF deve conter, em linguagem de apresentacao:

- sintese da pesquisa;
- principais achados;
- fontes e referencias;
- leitura de audiencia;
- referencias de execucao;
- oportunidades criativas;
- riscos e pendencias.

O markdown tecnico da equipe fica em:

```text
Campanhas/{campaign_slug}/internal/dossie.md
```

**Aprova a pesquisa e a direcao estrategica?**

1. **Aprovar** -> seguimos para Conceito / Direcao Criativa.
2. **Ajustar** -> diga quais pontos precisam mudar, aprofundar ou remover.
3. **Refazer pesquisa** -> informe novas fontes, publico, concorrentes, referencias ou restricoes.

Se pedir ajustes, atualize `internal/dossie.md`, regenere `documentos/documento-do-projeto.pdf` e sincronize o projeto no Notion quando Notion MCP estiver disponivel antes de pedir nova aprovacao.

## Regra

Nao avance para `step-03-creative-director.md` sem aprovacao explicita da pesquisa.
