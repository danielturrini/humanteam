---
type: checkpoint
---

# Step 12: Aprovação Final (antes de publicar)

## Objetivo
Checkpoint OBRIGATÓRIO (Gate 2b do OpenSquad) antes da Social Manager publicar/agendar — publicação é irreversível.

## Mensagem ao usuário

Edição finalizou o material em `Campanhas/{campaign_slug}/final/` e atualizou o documento de aprovação em `Campanhas/{campaign_slug}/documentos/documento-do-projeto.pdf`:
- KV gerado via `gpt_image_2` com referência de KV enviada junto;
- peças por canal (9:16, 4:5, 1:1, 16:9 conforme aplicável);
- anúncios com headline, CTA e assinatura;
- posts, e-mails, aplicações e calendário.

**Próximo passo é publicação real nas redes sociais. Isso é irreversível.**

Antes de Mídia subir tudo, revise:
- [ ] Headline do KV está correta e sem erro?
- [ ] Referência de KV foi usada só como estilo, sem cópia?
- [ ] Texto aplicado está legível em mobile?
- [ ] Versão correta para cada canal?
- [ ] Nada quebra brand voice?

**Aprova a publicação?**

Opções:
- **Aprovar e publicar** → segue para step-13 (Mídia publica nos canais agendados)
- **Aprovar mas só agendar** → publica em horário definido pelo Planner, não agora
- **Ajustar** → me diga o que mudar e Edição refaz
- **Não publicar** → encerra a run sem publicar

## Comportamento esperado

Se aprovado, segue para step-13.
Se ajuste, retorna para step-11 com lista de correções.
Se cancelar, encerra pipeline com status "abortado no checkpoint final".
