---
execution: inline
agent: squads/team/agents/roteiro
inputFile: squads/team/output/internal/conceito.md
outputFile: squads/team/output/internal/roteiro.md
---

# Step 05: Script — Roteiro

## Context Loading

- `squads/team/output/{run_id}/internal/brief.md` — público e ação esperada
- `squads/team/output/{run_id}/internal/conceito.md` — Big Idea, gancho, payoff, diretrizes
- `squads/team/output/{run_id}/internal/dossie.md` — linguagem real da audiência
- `squads/team/pipeline/data/tone-of-voice.md` — 6 tons disponíveis
- `squads/team/pipeline/data/headline-intelligence-system.md` — padroes de headlines/case names de campanhas premiadas recentes
- `squads/team/pipeline/data/output-examples.md` — exemplos de copy-pack e campanha
- `_opensquad/_memory/company.md` — brand voice (vence sobre tom escolhido)
- `squads/team/pipeline/data/expertise/scriptwriter.md` — repertório avançado de narrativa, retórica, copywriting, persuasão e escrita por plataforma

## Instructions

### Process

1. Confirme **tom**, **energia dominante**, **arco narrativo** e **fórmula** (HSO/AIDA/PAS/Save-the-Cat) a partir do conceito.
2. Escreva o **hook** (primeira frase ou headline de impacto): use o gancho do conceito como ponto de partida, refine.
3. Desenvolva os **beats** principais (3-5 para peça curta, 7-9 para carrossel/e-mail, mais para campanha longa) como uma historia com começo, virada, prova e CTA.
4. Escreva o **CTA** específico (não "comenta aí" — algo testável e único).
5. **Leia em voz alta**. Marque pontos onde travou. Refaça esses pontos.
6. **Corte 30%** do rascunho. Toda linha que não move a história morre.
7. Para formatos sequenciais, adicione blocos por quadro/slide/peca. O `/team` nao escreve roteiro de video.
8. Para campanha completa, produza tambem o pacote textual base para aprovacao: sistema de headlines, CTAs, legendas por canal, copy de anuncio, email/newsletter e textos que devem aparecer nas peças editoriais/KV. Todos devem parecer partes da mesma campanha, nao textos independentes.
9. Para campanha completa, gere 25 headlines em 5 familias conforme `headline-intelligence-system.md`, corte para 10 e escolha 3 vencedoras: KV master, ads/performance e social/editorial. Registre as descartadas com motivo.
10. Quando houver campanha completa, crie ou atualize tambem `squads/team/output/{run_id}/internal/copy-pack.md` com a biblioteca textual da campanha em status `RASCUNHO PARA APROVACAO`. O roteiro continua em `internal/roteiro.md`, mas o copy-pack deve existir para Social Manager, Content Multiplier, PDF e Notion.
11. Antes da aprovacao explicita do documento oficial, nao marque nenhuma copy como final. Textos nesta etapa sao proposta de aprovacao para o PDF.

### Decision Criteria

- Se o hook não funciona sem áudio (ex: depende de entonação), refaça com versão escrita forte.
- Se o CTA pede ≥2 ações, divida em 2 peças ou escolha 1.
- Se brand voice e tom escolhido conflitam, brand voice vence.
- Se o texto contradiz a energia dominante sem justificativa, refaça.
- Se as copies parecem peças soltas sem arco ou tema unificador, refaça o pacote.
- Se a headline do KV nao orienta imagem, hierarquia e design, refaça antes de enviar para Arte.

## Output Format

```markdown
# Roteiro — {nome da peça}

## Cabeçalho
- Fórmula: {HSO/AIDA/PAS/...}
- Tom: {1 dos 6}
- Energia dominante: ...
- Arco narrativo: ...
- Formato hero: KV | carrossel | anúncio | e-mail | campanha multicanal

## Copy/roteiro por peça

- KV master: headline, subheadline, CTA, microcopy
- Carrossel: slide 1, slide 2, ...
- Ads: variação 9:16, 4:5, 16:9
- E-mail/newsletter: assunto, abertura, corpo, CTA

## Versões alternativas do hook (3)
1. "..."
2. "..."
3. "..."

## Notas para Storyboarder
- Beat X exige imagem/metáfora visual de ...
- Peça Y precisa de texto aplicado: "..."
- Relação entre peças: continuidade de cor, promessa e CTA

## Copy Pack inicial (campanha)
- Status: RASCUNHO PARA APROVACAO
- Tema unificador: ...
- Regra narrativa: ...
- Mensagem central: ...
- Headlines: ...
- Sistema de headlines: tensao humana, papel da marca, mecanismo, familias geradas, shortlist e descartadas
- CTAs: ...
- Legendas por canal: ...
- Copies de anuncio: ...
- Email/newsletter: ...
- Textos para KV/pecas editoriais: ...
```

## Output Example

```markdown
# Copy-Pack — Campanha "3 erros que matam sua copy"

## Cabeçalho
- Fórmula: Hook-Story-Offer
- Tom: Direto & Afiado
- Formato hero: KV + carrossel + ads

## Sistema de headlines

- Tensão humana: o público tenta vender antes de criar desejo.
- Papel da marca: ensinar copy com exemplos simples e aplicáveis.
- Mecanismo: os 3 erros viram cenas de um encontro ruim.

## Shortlist

| Uso | Headline | Por que vence |
|---|---|---|
| KV master | "Sua copy pede casamento no primeiro encontro." | visual, específico e memorável |
| Ads | "Venda boa morre em headline ruim." | direto e orientado a performance |
| Social/editorial | "3 erros que fazem o cliente fugir." | claro para carrossel |

## Versões alternativas do hook/headline
1. "Sua copy vende mal? O erro é um destes 3, sem exceção."
2. "Eu li 100 copies de seguidores essa semana. Os 3 erros são sempre os mesmos."
3. "Sua copy parece um cara que pede em casamento no primeiro Tinder." (vencedor)

## Notas para Storyboarder
- KV: composição de anúncio estático com headline central e imagem-metáfora de encontro.
- Carrossel: capa + 3 erros + solução + CTA.
- Ads: variações 9:16, 4:5 e 16:9 com headline e CTA aplicados.
```

## Veto Conditions

1. Hook genérico ("você sabia que", "neste post vou...") ou ausente.
2. CTA vago, ausente, ou pede mais de 1 ação.
3. Roteiro contém termo proibido da brand voice.
4. Campanha completa com copy-pack sem tema unificador ou arco de campanha.

## Quality Criteria

- [ ] Hook na primeira frase
- [ ] CTA específico e único na última frase
- [ ] Lido em voz alta sem travar
- [ ] 3 versões alternativas de hook anexadas
- [ ] Notas para Storyboarder presentes
- [ ] Se campanha completa, copy pack inicial com sistema de headlines para KV, posts, email/newsletter e anuncios
- [ ] Copy-pack sustenta uma campanha integrada, nao peças soltas
