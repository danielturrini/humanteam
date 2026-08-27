---
name: image-ai-generator
description: >
  Generates images via Higgsfield CLI. KVs and text-heavy campaign layouts use gpt_image_2 with reference images.
  Loose images without lettering use Nano Banana 2.
description_pt-BR: >
  Gera imagens via Higgsfield CLI. KVs e layouts de campanha com lettering usam gpt_image_2 com imagens de referência.
  Imagens soltas sem lettering usam Nano Banana 2.
type: script
version: "1.1.0"
script:
  path: scripts/generate.py
  runtime: python3
  invoke: "python3 {skill_path}/scripts/generate.py --prompt \"{prompt}\" --output \"{output}\" --mode \"{mode}\""
env:
  - HIGGSFIELD_IMAGE_MODEL
  - HIGGSFIELD_IMAGE_MODEL_TEST
  - HIGGSFIELD_IMAGE_MODEL_PRODUCTION
  - HIGGSFIELD_KV_MODEL
  - HIGGSFIELD_IMAGE_RESOLUTION
categories: [assets, images, ai, generation, kv]
---

# Image Generator

## When to use

Use this skill only after the campaign inputs are clear and the user has approved the relevant checkpoint.

Two generation lanes exist:

- **KV / lettering / campaign layout**: Higgsfield CLI + `gpt_image_2`
- **Loose image without lettering**: Higgsfield CLI + Nano Banana 2 (`nano_banana_2` unless env overrides)

The `/team` does not generate video/motion.

## Hard rule for KV

Every KV must be generated as an integrated image with `gpt_image_2`.

The prompt must include:

- image description;
- design description;
- brand direction;
- headline and CTA to render exactly;
- lettering hierarchy;
- logo/signature instruction;
- grid, safe zones and aspect ratio;
- reference usage rules.

The command must include at least one `--reference`, preferably a KV/campaign image with lettering. The reference is sent to Higgsfield as `--image` and must be used only for style, hierarchy, composition, lettering density and finish. Never copy its text, image, logo, character, product or exact layout.

If there is no KV reference, do not generate KV final. Write `internal/kv-spec.md` with the blocking request.

## Examples

### KV with GPT Image 2

```bash
python3 skills/image-ai-generator/scripts/generate.py \
  --asset-type kv \
  --prompt "Create a final campaign key visual..." \
  --output "Campanhas/{campaign_slug}/final/assets/kv/kv-4x5.png" \
  --reference "Campanhas/{campaign_slug}/refs/kv/reference-with-lettering.png" \
  --reference "Campanhas/{campaign_slug}/refs/marca/logo.png" \
  --aspect-ratio "4:5" \
  --quality high \
  --mode production
```

This forces:

- provider: `higgsfield_cli`
- model: `gpt_image_2` by default, or `HIGGSFIELD_KV_MODEL` if set
- at least one reference image

### Loose image without lettering

```bash
python3 skills/image-ai-generator/scripts/generate.py \
  --prompt "A realistic product usage scene, no text, no lettering..." \
  --output "Campanhas/{campaign_slug}/final/assets/principais/scene-01.png" \
  --aspect-ratio "4:5" \
  --mode production
```

This uses:

- `HIGGSFIELD_IMAGE_MODEL_PRODUCTION`, `HIGGSFIELD_IMAGE_MODEL`, or default `nano_banana_2`

## Batch generation

Batch items can include `asset_type`, `references`, `quality` and `aspect_ratio`.

```json
[
  {
    "asset_type": "kv",
    "prompt": "Create a final campaign key visual...",
    "output": "final/assets/kv/kv-4x5.png",
    "references": ["refs/kv/reference.png", "refs/logo.png"],
    "aspect_ratio": "4:5",
    "quality": "high"
  },
  {
    "asset_type": "image",
    "prompt": "Loose supporting image, no text, no lettering...",
    "output": "final/assets/secundarias/detail.png",
    "aspect_ratio": "1:1"
  }
]
```

## Prompt guidance

For KV, follow `squads/team/pipeline/data/gpt-image-kv-system.md`.

For loose images, follow `squads/team/pipeline/data/image-prompt-system.md`.

Avoid:

- generic buzzwords;
- "hyper realistic, 4K quality" as a substitute for specific physical direction;
- text in Nano Banana 2 outputs;
- HTML-to-PNG as final KV;
- generating variations without a production reason.

## Cost awareness

Image generation costs money and takes time. Before generating:

1. Check if the needed asset already exists.
2. Check if the user has approved the relevant checkpoint.
3. Generate only the needed pieces.
4. For KV, do not generate until reference, copy, brand inputs and aspect ratio are clear.
