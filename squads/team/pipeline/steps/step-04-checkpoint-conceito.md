---
type: checkpoint
---

# Step 04: Aprovação do Conceito (Big Idea)

## Objetivo
Pausar antes do roteiro para o usuário aprovar a Big Idea proposta por Conceito.

## Mensagem ao usuário

Conceito propôs a Big Idea abaixo. Revise o documento do projeto em `Campanhas/{campaign_slug}/documentos/documento-do-projeto.pdf`; os detalhes técnicos ficam em `Campanhas/{campaign_slug}/internal/conceito.md`.

**Antes do Scriptwriter começar a escrever, você aprova esse conceito?**

Opções:
- **Aprovar** → seguimos para Roteiro (step-05)
- **Ajustar** → me diga o que mudar (ângulo, tom, direção) e Conceito refaz
- **Recomeçar** → voltamos pra pesquisa (step-02) com novo input

Lembre: corrigir agora custa minutos. Corrigir depois do roteiro pronto custa horas.

## Comportamento esperado

Se aprovado, segue para step-05.
Se ajuste, retorna para step-03 com o feedback anexado.
Se recomeçar, retorna para step-02 com novo input.
