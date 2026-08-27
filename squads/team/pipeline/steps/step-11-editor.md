---
execution: inline
agent: squads/team/agents/edicao
inputFile: squads/team/output/internal/folha-producao.md
outputFile: squads/team/output/internal/master.md
---

# Step 11: Finalizacao Estatica — Edicao

## Context Loading

- `squads/team/output/{run_id}/internal/storyboard.md` — mapa de peças, formatos e hierarquia
- `squads/team/output/{run_id}/internal/art-bible.md` — paleta, tipografia, regras visuais e KV
- `squads/team/output/{run_id}/internal/folha-producao.md` — lista de assets disponíveis
- `squads/team/output/{run_id}/internal/copy-pack.md` — headlines, CTAs, legendas e textos aplicados
- `squads/team/pipeline/data/campaign-delivery-system.md` — entregaveis finais de campanha
- `squads/team/pipeline/data/gpt-image-kv-system.md` — criterios de KV e lettering via `gpt_image_2`
- `squads/team/pipeline/data/quality-criteria.md` — padrões técnicos de saída
- `squads/team/pipeline/data/expertise/editor.md` — repertório avançado de finalização, formatos e QC

O `/team` nao produz video/motion. Edição aqui significa finalizacao estatica: checagem de KV, anúncios, posts, aplicações, PDFs e pacote final.

## Instructions

### Process

0. Antes de exportar qualquer material final, confirme que `step-09` registrou aprovacao explicita do `documentos/documento-do-projeto.pdf` com a frase `Documento oficial aprovado para producao final`. Se nao houver aprovacao, pare e volte ao checkpoint de aprovacao do PDF.
1. Leia a folha de produção e liste todas as peças finais esperadas por pasta: `final/assets/kv/`, `final/assets/principais/`, `final/assets/secundarias/`, `final/ads/`, `final/social/`, `final/email/`, `final/ooh/`, `final/brindes/`.
2. Verifique se cada KV e anuncio com lettering foi gerado via `gpt_image_2` com referencia de KV enviada por `--image`. Se não, marque como `REPROVADO / REFAZER`.
3. Faça QC de texto aplicado: ortografia perfeita, nenhuma palavra inventada, headline/CTA iguais ao `copy-pack.md`, logo sem distorção e hierarquia legível em mobile.
4. Faça QC visual: proporção nativa, safe zones, contraste, nitidez, escala, anatomia/perspectiva quando houver cena, aderência à marca e ausência de aparência genérica de IA.
5. Separe status por peça: `FINAL`, `AJUSTAR`, `REPROVADA`, `BLOQUEADA`.
6. Atualize `internal/master.md` com manifesto de peças finais, caminhos, status, pendências e decisões de QC.
7. Atualize `handoff.md` com o que foi entregue e o que depende de aprovação ou material externo.

### Decision Criteria

- Se uma peça com lettering tem erro de texto, ela não entra em `FINAL`.
- Se o KV parece imagem solta com texto colado, refaça no Producer via `gpt_image_2`.
- Se uma adaptação 9:16/4:5/16:9 parece crop improvisado, devolva para Arte/Operação.
- Se video/motion aparecer como requisito, marque fora do escopo do `/team` e encaminhe para Human Motion.

## Output Format

```markdown
# Master — {nome da campanha}

## Status geral
- Status: FINAL / AJUSTAR / BLOQUEADO
- Documento aprovado para produção final: SIM/NAO
- KV gerado via `gpt_image_2`: SIM/NAO
- Referência de KV enviada por `--image`: SIM/NAO

## Peças finais
| Peça | Caminho | Formato | Modelo | Status | QC |
|---|---|---|---|---|---|
| KV master 4:5 | final/assets/kv/kv-4x5.png | 4:5 | gpt_image_2 | FINAL | texto OK, marca OK |
| Anúncio 9:16 | final/ads/9x16/ad-01.png | 9:16 | gpt_image_2 | AJUSTAR | CTA pequeno |

## Pendências
- ...

## Decisões de QC
- ...
```

## Veto Conditions

1. Peça com lettering gerada fora de `gpt_image_2`.
2. KV sem referência enviada por `--image`.
3. Headline/CTA com erro, palavra inventada ou divergente do `copy-pack.md`.
4. Adaptação por proporção feita como crop improvisado.
5. Video/motion tratado como entrega do `/team`.

## Quality Criteria

- [ ] KVs e anúncios com lettering gerados via `gpt_image_2`
- [ ] Referência de KV registrada para cada KV
- [ ] Textos aplicados conferidos contra `copy-pack.md`
- [ ] Logo/assinatura sem distorção
- [ ] Proporções nativas verificadas
- [ ] Peças finais organizadas em `final/`
- [ ] Pendências reais registradas em `internal/master.md` e `handoff.md`
