---
type: checkpoint
---

# Step 06: Aprovação do Roteiro

## Objetivo
Pausar antes da direção de arte para o usuário aprovar o roteiro escrito por Roteiro.

## Mensagem ao usuário

Roteiro entregou a versão para aprovação no documento do projeto: `Campanhas/{campaign_slug}/documentos/documento-do-projeto.pdf`. O markdown técnico fica em `Campanhas/{campaign_slug}/internal/roteiro.md`.

Por favor leia em voz alta. Se travar em algum ponto, o leitor também trava.

**Aprova o roteiro?**

Opções:
- **Aprovar** → seguimos para Arte (step-07) começar a direção visual
- **Ajustar** → me diga o que mudar (hook fraco? CTA pouco específico? trecho que travou na leitura?) e Roteiro refaz
- **Recomeçar do conceito** → volta pro step-04 (você acha que o problema não é o roteiro, é a Big Idea)

## Comportamento esperado

Se aprovado, segue para step-07.
Se ajuste, retorna para step-05 com o feedback anexado.
Se recomeçar, retorna para step-04.
