# PROVIDERS — CAMADA DE RENDER (Higgsfield CLI **ou** Magnific MCP)

> Esta pasta circula entre pessoas com setups diferentes. Umas tem o **Higgsfield CLI**, outras
> o **Magnific MCP**, algumas tem os dois.
> A **inteligencia do squad e a mesma nos dois casos** — brief, conceito, roteiro, direcao de
> arte e copy nao mudam. So muda quem executa o render das imagens.
> Leia este arquivo antes de gerar qualquer imagem.

---

## 1. REGRA DE OURO

O prompt **nao muda** por causa do motor. O agente de direcao de arte escreve o prompt do jeito
de sempre e so no momento do render escolhe quem executa.

Nunca troque de motor no meio de uma run. Se o key visual saiu no Higgsfield, as secundarias e
os anuncios saem no Higgsfield tambem — senao a campanha perde unidade visual.

---

## 2. ORDEM DE RESOLUCAO DO MOTOR

Resolva nesta ordem e **pare no primeiro que der match**:

1. **Pedido explicito do usuario** — "usa o Magnific", "roda pelo Higgsfield", "usa o MCP".
2. **Variavel de ambiente** `HUMAN_IMAGE_PROVIDER` — valores aceitos: `higgsfield` ou `magnific`.
3. **So um disponivel** -> use esse, sem perguntar nada. Nao anuncie o que faltou.
4. **Os dois disponiveis** -> **pergunte ao usuario**. Uma linha, uma vez por run, antes do
   primeiro render:

   > Posso gerar as imagens por dois motores: **Higgsfield** ou **Magnific**. Qual voce prefere?

   Se ele nao tiver preferencia, use o **Higgsfield** e siga. Guarde a escolha para a run
   inteira — nao pergunte de novo a cada asset.
5. **Nenhum disponivel** -> nao renderize e nao prometa arquivo. Entregue prompt + direcao
   visual, explique que a imagem depende dessa configuracao e **siga o resto da run**. Geracao
   de imagem nao bloqueia brief, conceito, roteiro, copy nem handoff.

### Pre-flight

```bash
python3 skills/image-ai-generator/scripts/generate.py --check-providers
```

Responde o status do Higgsfield. O status do **Magnific** voce mesmo verifica: olhe se existem
ferramentas `mcp__magnific__*` na sessao (se estiverem diferidas, use `ToolSearch` com a query
`magnific`).

---

## 3. CONTRATO COMUM (vale para os dois motores)

| Item | Valor |
|---|---|
| Modelos (Higgsfield) | `nano_banana_2` para imagem; `gpt_image_2` para key visual integrado (`--asset-type kv`) |
| Modelo (Magnific) | a ferramenta de maior qualidade; use image-to-image quando houver referencia |
| Referencias | KV, logo e brand assets entram como referencia em **todas** as chamadas da serie |
| Aspect ratios | 9:16, 4:5 e 16:9 conforme o anuncio |
| Saida | `human-output/team/{run_id}/`, no caminho que a run ja define |

---

## 4. MOTOR A — HIGGSFIELD CLI

```bash
python3 skills/image-ai-generator/scripts/generate.py \
  --prompt "..." --output "human-output/team/{run_id}/kv-01.png" \
  --mode production --asset-type kv --aspect-ratio "4:5" \
  --reference "caminho/da/ref.png"
```

Tambem aceita `--batch <arquivo.json>` para gerar a serie inteira. O script checa CLI/login,
sobe as referencias, submete, espera e baixa.

---

## 5. MOTOR B — MAGNIFIC MCP

Servidor: `https://mcp.magnific.com/mcp` (HTTP, OAuth no primeiro uso).

### 5.1. Setup (uma vez por maquina)

Quem abre o Claude Code **dentro desta pasta** ja encontra o servidor declarado no
[.mcp.json](.mcp.json) — basta aprovar quando o Claude Code perguntar.

Para qualquer outra pasta:

```bash
claude mcp add --transport http --scope user magnific https://mcp.magnific.com/mcp
```

### 5.2. Como chamar

Os nomes das ferramentas mudam entre versoes. **Descubra em runtime**: procure `mcp__magnific__*`
na sessao (se estiverem diferidas, `ToolSearch` com a query `magnific`) e leia a assinatura
antes de chamar. Mapeie:

| Contrato | Como passar no Magnific |
|---|---|
| `prompt` | campo de prompt/texto — o mesmo texto que iria para o Higgsfield |
| `aspect_ratio` | campo de aspect ratio; se so aceitar largura/altura, converta mantendo a proporcao |
| referencias | campo de imagem de referencia / image-to-image (KV, logo, brand assets) |
| serie de N pecas | uma chamada por peca, disparadas em paralelo |

### 5.3. Salvando o resultado no padrao da casa

Nao deixe o retorno solto e nao baixe na mao:

```bash
python3 skills/image-ai-generator/scripts/generate.py --save-external \
  --from-url "https://.../resultado.png" \
  --output "human-output/team/{run_id}/kv-01.png" \
  --provider magnific_mcp --model "{nome_da_ferramenta}" \
  --aspect-ratio "4:5"
```

Se o MCP gravou arquivo local, troque `--from-url` por `--from-file "/caminho/do/arquivo.png"`.

---

## 6. QUANDO NENHUM MOTOR EXISTE

1. Entregue tudo que nao depende de render: brief, conceito, roteiro, direcao de arte,
   storyboard descrito, copy-pack, calendario e handoff.
2. Entregue os prompts prontos, para a pessoa rodar depois.
3. Diga em uma frase que falta o motor de imagem e ofereca os dois caminhos:

**Higgsfield CLI**

```bash
npm install -g @higgsfield/cli
```

```bash
higgsfield auth login
```

**Magnific MCP**

```bash
claude mcp add --transport http --scope user magnific https://mcp.magnific.com/mcp
```

---

## 7. CHECKLIST DO RENDER

- [ ] Motor resolvido pela ordem da secao 2, nao por chute
- [ ] Se os dois estavam disponiveis, a escolha foi **perguntada** — uma vez so por run
- [ ] `--check-providers` rodado antes do primeiro render
- [ ] Prompt identico ao que seria usado no outro motor
- [ ] Run inteira no mesmo motor
- [ ] Referencias (KV, logo, brand assets) repetidas em **todas** as chamadas da serie
- [ ] Resultado do Magnific salvo com `--save-external`, nunca baixado na mao
- [ ] Falta de motor nao bloqueou brief, conceito, roteiro, copy nem handoff
- [ ] Sem fallback silencioso de motor ou de modelo
