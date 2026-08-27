#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function arg(name, fallback = '') {
  const index = process.argv.indexOf(`--${name}`);
  if (index === -1 || index + 1 >= process.argv.length) return fallback;
  return process.argv[index + 1];
}

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function writeIfMissing(filePath, content) {
  if (fs.existsSync(filePath)) return;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

const cwd = process.cwd();
const runId = arg('run-id') || new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
const rawName = arg('name') || `campanha-${runId}`;
const slug = slugify(rawName) || `campanha-${runId}`;
const projectDir = path.join(cwd, 'Campanhas', slug);

const dirs = [
  'input',
  'refs',
  'refs/kv',
  'refs/marca',
  'refs/produto',
  'documentos',
  'final',
  'final/assets',
  'final/assets/kv',
  'final/assets/principais',
  'final/assets/secundarias',
  'final/ads',
  'final/ads/9x16',
  'final/ads/4x5',
  'final/ads/16x9',
  'final/calendar',
  'final/derivadas',
  'final/social',
  'final/email',
  'final/press',
  'final/ooh',
  'final/brindes',
  'internal',
  'internal/generation',
  'internal/generation/kv',
  'internal/generation/images',
];

for (const dir of dirs) {
  fs.mkdirSync(path.join(projectDir, dir), { recursive: true });
}

writeIfMissing(path.join(projectDir, 'README.md'), `# ${rawName}

Run ID: ${runId}

## Onde colocar materiais

- \`input/\`: briefing, textos, arquivos recebidos e materiais gerais.
- \`refs/kv/\`: referencias de KV, preferencialmente imagem + lettering.
- \`refs/marca/\`: logo, brand kit, fontes, guias e assets oficiais.
- \`refs/produto/\`: fotos, mockups e materiais do produto/oferta.

## Onde revisar e pegar entregas

- \`documentos/documento-do-projeto.pdf\`: documento de aprovacao.
- \`documentos/apresentacao-da-campanha.pdf\`: apresentacao final das pecas.
- \`final/\`: pecas finais publicaveis.

## Bastidores

- \`internal/\`: prompts, markdowns, logs e metadata do time.
`);

writeIfMissing(path.join(projectDir, 'input', 'LEIA-ME.md'), `# Input

Coloque aqui os materiais brutos do projeto:

- briefing;
- textos;
- imagens recebidas;
- links salvos em arquivo \`.md\` ou \`.txt\`;
- arquivos que o time precisa considerar.
`);

writeIfMissing(path.join(projectDir, 'refs', 'kv', 'LEIA-ME.md'), `# Referencias de KV

Coloque aqui referencias de KV/campanha, com preferencia por imagem + lettering.

Essas referencias serao enviadas ao \`gpt_image_2\` como guia de estilo, hierarquia, composicao e densidade tipografica.

Regra: nao copiar texto, imagem, logo, personagem, produto ou layout exato da referencia.
`);

writeIfMissing(path.join(projectDir, 'refs', 'marca', 'LEIA-ME.md'), `# Marca

Coloque aqui:

- logo em SVG/PNG;
- brand book;
- paleta;
- fontes;
- exemplos de pecas da marca;
- elementos proprietarios.
`);

writeIfMissing(path.join(projectDir, 'final', 'LEIA-ME.md'), `# Final

As entregas finais da campanha aparecem aqui:

- \`assets/kv/\`: KVs principais;
- \`ads/\`: anuncios por proporcao;
- \`social/\`: posts organicos;
- \`email/\`: pecas e textos de email;
- \`calendar/\`: calendario importavel;
- \`derivadas/\`: desdobramentos.
`);

console.log(JSON.stringify({
  status: 'ok',
  runId,
  name: rawName,
  slug,
  projectDir,
}, null, 2));
