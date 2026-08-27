#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

let chromium;
try {
  ({ chromium } = require('playwright'));
} catch (err) {
  console.error(`
Falta instalar as dependencias deste projeto para gerar o PDF.

Rode uma unica vez, na pasta do projeto:

  npm install
  npx playwright install chromium

Depois repita o comando do documento.
`);
  process.exit(1);
}

const SECTION_ORDER = [
  { file: 'brief.md', title: 'Contexto da Campanha', maxWords: 360 },
  { file: 'plano.md', title: 'Plano de Produção', maxWords: 520 },
  { file: 'dossie.md', title: 'Pesquisa e Referências', maxWords: 560 },
  { file: 'pesquisa.md', title: 'Pesquisa e Referências', maxWords: 560 },
  { file: 'conceito.md', title: 'Conceito Criativo', maxWords: 620 },
  { file: 'roteiro.md', title: 'Roteiro e Copy', maxWords: 900 },
  { file: 'art-bible.md', title: 'Direção de Arte', maxWords: 760 },
  { file: 'brand-applications.md', title: 'Aplicações de Marca', maxWords: 760 },
  { file: 'storyboard.md', title: 'Storyboard', maxWords: 760 },
  { file: 'folha-producao.md', title: 'Produção Visual', maxWords: 520 },
  { file: 'master.md', title: 'Material Final', maxWords: 500 },
  { file: 'publicacao.md', title: 'Publicação', maxWords: 620 },
  { file: 'multiplicacao.md', title: 'Derivadas e Multiplicação', maxWords: 620 },
  { file: 'copy-pack.md', title: 'Copy da Campanha', maxWords: 760 },
  { file: 'handoff.md', title: 'Próximos Passos', maxWords: 360 },
];

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
const MAX_GALLERY_IMAGES = Number(process.env.HUMAN_TEAM_PDF_MAX_IMAGES || 18);
const TECHNICAL_LINE_PATTERNS = [
  /\b(run id|agente|agent|pipeline|checkpoint|handoff|source map|definition of done|quality criteria)\b/i,
  /\b(codinome interno|data de abertura|modo de entrada|substitui:|arquivada|documentos?)\b/i,
  /\b(markdown|\.md\b|\.yaml\b|\.yml\b|\.json\b|\.html\b|\.txt\b)\b/i,
  /\b(internal\/|output\/|squads\/|assets\/|ads\/|final\/|derivadas\/|refs\/|input\/|calendar\/)\b/i,
  /\b(higgsfield|nano banana|prompts?|metadata|bash|comando|command|mcp|api|batch|cr[eé]ditos?|serverside|retries)\b/i,
  /\b(disparar|gerar|gera[cç][aã]o)\s+(batch|visual|imagem|imagens)\b/i,
  /^\s*[-*]\s*\[[ x]\]/i,
  /^\s*[├└│]/,
];
const TECHNICAL_HEADING_PATTERNS = [
  /\b(integration|quality criteria|definition of done|acceptance criteria|output|outputs|inputs|depends on|triggers)\b/i,
  /\b(prompts?|estrutura de comandos|metadata|source map|handoff técnico|arquivos|pastas|especifica[cç][oõ]es t[eé]cnicas)\b/i,
];

function usage() {
  console.error('Usage: node scripts/render-project-document.js <run_dir>');
  process.exit(1);
}

const runDir = process.argv[2] ? path.resolve(process.argv[2]) : null;
if (!runDir || !fs.existsSync(runDir)) usage();

const internalDir = path.join(runDir, 'internal');
const documentsDir = path.join(runDir, 'documentos');
fs.mkdirSync(internalDir, { recursive: true });
fs.mkdirSync(documentsDir, { recursive: true });

const outMd = path.join(internalDir, 'documento-do-projeto.md');
const outHtml = path.join(internalDir, 'documento-do-projeto.html');
const outPdf = path.join(documentsDir, 'documento-do-projeto.pdf');
const outCampaignMd = path.join(internalDir, 'apresentacao-da-campanha.md');
const outCampaignHtml = path.join(internalDir, 'apresentacao-da-campanha.html');
const outCampaignPdf = path.join(documentsDir, 'apresentacao-da-campanha.pdf');

function readIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8').trim() : '';
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function stripCodeBlocks(markdown) {
  return markdown.replace(/```[\s\S]*?```/g, '');
}

function countWords(value) {
  const words = value.match(/[\p{L}\p{N}]+/gu);
  return words ? words.length : 0;
}

function truncateWords(value, maxWords) {
  if (!maxWords || countWords(value) <= maxWords) return value;
  let words = 0;
  const lines = [];
  for (const line of value.split('\n')) {
    const lineWords = countWords(line);
    if (words + lineWords > maxWords) break;
    lines.push(line);
    words += lineWords;
  }
  const trimmed = lines.join('\n').trim();
  return `${trimmed}\n\n> Esta seção foi condensada para aprovação. O detalhamento operacional permanece registrado internamente para a equipe de produção.`;
}

function sanitizeSectionMarkdown(markdown, maxWords) {
  const lines = stripCodeBlocks(markdown)
    .replace(/\r\n/g, '\n')
    .replace(/`([^`]+)`/g, '$1')
    .split('\n');

  const output = [];
  let skipUntilHeadingLevel = null;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();
    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);

    if (heading) {
      const level = heading[1].length;
      if (skipUntilHeadingLevel && level <= skipUntilHeadingLevel) {
        skipUntilHeadingLevel = null;
      }
      if (
        TECHNICAL_HEADING_PATTERNS.some((pattern) => pattern.test(heading[2])) ||
        TECHNICAL_LINE_PATTERNS.some((pattern) => pattern.test(heading[2]))
      ) {
        skipUntilHeadingLevel = level;
        continue;
      }
      output.push(`${'#'.repeat(Math.min(Math.max(level + 1, 3), 6))} ${heading[2]}`);
      continue;
    }

    if (skipUntilHeadingLevel) continue;
    if (TECHNICAL_LINE_PATTERNS.some((pattern) => pattern.test(trimmed))) continue;

    output.push(line);
  }

  return truncateWords(output.join('\n').replace(/\n{3,}/g, '\n\n').trim(), maxWords);
}

function humanizeAssetLabel(label) {
  const withoutVariant = label
    .replace(/\.[^.]+$/, '')
    .replace(/\/v\d+$/i, '')
    .replace(/(^|\/)(assets|ads|final|derivadas)\//g, '')
    .replace(/\b(9x16|4x5|16x9)\b/g, (match) => match.replace('x', ':'))
    .split('/')
    .filter(Boolean)
    .map((part) => part.replace(/[-_]+/g, ' '))
    .join(' · ');

  return withoutVariant.replace(/\s+/g, ' ').trim() || 'Material visual';
}

function selectGalleryImages(images) {
  const groups = new Map();
  for (const image of images) {
    const key = path.dirname(image.label);
    const group = groups.get(key) || [];
    group.push(image);
    groups.set(key, group);
  }

  const chosen = [];
  for (const group of groups.values()) {
    const sorted = group.sort((a, b) => {
      const aName = path.basename(a.path).toLowerCase();
      const bName = path.basename(b.path).toLowerCase();
      const score = (name) => (name.startsWith('v1.') ? 0 : name.startsWith('v2.') ? 1 : name.startsWith('v3.') ? 2 : 3);
      return score(aName) - score(bName) || a.label.localeCompare(b.label);
    });
    chosen.push(sorted[0]);
  }

  return chosen
    .sort((a, b) => a.label.localeCompare(b.label))
    .slice(0, MAX_GALLERY_IMAGES);
}

function selectPresentationImages(images) {
  const maxImages = Number(process.env.HUMAN_TEAM_CAMPAIGN_PDF_MAX_IMAGES || 120);
  return images
    .sort((a, b) => {
      const rank = (label) => {
        if (label.includes('final/assets/kv/')) return 0;
        if (label.includes('final/ads/')) return 1;
        if (label.includes('final/social/')) return 2;
        if (label.includes('final/assets/principais/')) return 3;
        if (label.includes('final/assets/secundarias/')) return 4;
        if (label.includes('final/derivadas/')) return 5;
        return 9;
      };
      return rank(a.label) - rank(b.label) || a.label.localeCompare(b.label);
    })
    .slice(0, maxImages);
}

function markdownToHtml(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let paragraph = [];
  let list = null;
  let table = [];
  let inCode = false;
  let code = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${formatInline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    html.push(`</${list}>`);
    list = null;
  };

  const flushTable = () => {
    if (!table.length) return;
    const rows = table.filter((row) => !/^\s*\|?\s*:?-{3,}:?\s*\|/.test(row));
    if (rows.length) {
      html.push('<table>');
      rows.forEach((row, index) => {
        const cells = row.split('|').map((cell) => cell.trim()).filter(Boolean);
        const tag = index === 0 ? 'th' : 'td';
        html.push(`<tr>${cells.map((cell) => `<${tag}>${formatInline(cell)}</${tag}>`).join('')}</tr>`);
      });
      html.push('</table>');
    }
    table = [];
  };

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      flushParagraph();
      flushList();
      flushTable();
      if (inCode) {
        html.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
        code = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      code.push(line);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      flushTable();
      continue;
    }

    if (/^\s*\|.+\|\s*$/.test(line)) {
      flushParagraph();
      flushList();
      table.push(line);
      continue;
    }

    flushTable();

    const quote = line.match(/^\s*>\s+(.+)$/);
    if (quote) {
      flushParagraph();
      flushList();
      html.push(`<blockquote>${formatInline(quote[1])}</blockquote>`);
      continue;
    }

    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = Math.min(heading[1].length + 1, 5);
      html.push(`<h${level}>${formatInline(heading[2])}</h${level}>`);
      continue;
    }

    const unordered = line.match(/^\s*[-*]\s+(.+)$/);
    if (unordered) {
      flushParagraph();
      if (list !== 'ul') {
        flushList();
        list = 'ul';
        html.push('<ul>');
      }
      html.push(`<li>${formatInline(unordered[1])}</li>`);
      continue;
    }

    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (ordered) {
      flushParagraph();
      if (list !== 'ol') {
        flushList();
        list = 'ol';
        html.push('<ol>');
      }
      html.push(`<li>${formatInline(ordered[1])}</li>`);
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  flushTable();
  return html.join('\n');
}

function formatInline(value) {
  let text = escapeHtml(value);
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  text = text.replace(/(^|[\s(])#([0-9a-fA-F]{6})\b/g, (_match, prefix, hex) => {
    const color = `#${hex}`;
    return `${prefix}<span class="color-token"><span class="color-swatch" style="background:${color}"></span><span>${color}</span></span>`;
  });
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return text;
}

function collectImages(dir, root = dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const images = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      images.push(...collectImages(full, root));
    } else if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      images.push({
        path: full,
        label: path.relative(root, full),
      });
    }
  }

  return images;
}

function collectUniqueMedia(items) {
  const seen = new Set();
  const unique = [];
  for (const item of items) {
    const key = path.resolve(item.path);
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(item);
  }
  return unique;
}

function buildDocumentMarkdown() {
  const now = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date());
  const parts = [
    '# Apresentação da Campanha',
    '',
    `Atualizado em: ${now}`,
    '',
    '> Este documento reúne a visão de campanha, os principais materiais criativos e os pontos de aprovação. O detalhamento operacional permanece com a equipe de produção.',
    '',
  ];

  const addedTitles = new Set();
  for (const { file, title, maxWords } of SECTION_ORDER) {
    if (addedTitles.has(title)) continue;
    const content = readIfExists(path.join(internalDir, file));
    if (!content) continue;
    const section = sanitizeSectionMarkdown(content, maxWords);
    if (!section) continue;
    addedTitles.add(title);
    parts.push(`## ${title}`, '', section, '');
  }

  const images = collectUniqueMedia([
    ...collectImages(path.join(runDir, 'final'), runDir),
    ...collectImages(path.join(runDir, 'assets'), runDir),
    ...collectImages(path.join(runDir, 'ads'), runDir),
    ...collectImages(path.join(runDir, 'derivadas'), runDir),
  ]);

  const galleryImages = selectGalleryImages(images);

  if (galleryImages.length) {
    parts.push('## Amostra Visual', '');
    parts.push(`A seleção abaixo mostra os caminhos visuais mais representativos da campanha. Variações e alternativas ficam reservadas para avaliação interna e refinamento de produção.`, '');
    for (const image of galleryImages) {
      const label = humanizeAssetLabel(image.label);
      parts.push(`### ${label}`, '', `![${label}](${path.relative(runDir, image.path)})`, '');
    }
  }

  if (images.length > galleryImages.length) {
    parts.push('## Acervo de Produção', '');
    parts.push(`${images.length} materiais visuais foram identificados nesta campanha. Este PDF apresenta uma curadoria reduzida para facilitar aprovação; o acervo completo permanece organizado para seleção final, revisão e desdobramento.`, '');
  }

  return parts.join('\n').replace(/\n{3,}/g, '\n\n');
}

function buildCampaignPresentationMarkdown() {
  const now = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date());

  const parts = [
    '# Apresentação Final da Campanha',
    '',
    `Atualizado em: ${now}`,
    '',
    '> Este deck reúne as peças criadas para revisão final, apresentação e handoff. Estratégia e bastidores ficam no documento do projeto; aqui o foco é ver a campanha pronta.',
    '',
  ];

  const summaryFiles = [
    { file: 'conceito.md', title: 'Ideia Da Campanha', maxWords: 220 },
    { file: 'copy-pack.md', title: 'Mensagem E Copies', maxWords: 360 },
    { file: 'art-bible.md', title: 'Sistema Visual', maxWords: 360 },
    { file: 'publicacao.md', title: 'Plano De Publicação', maxWords: 360 },
    { file: 'handoff.md', title: 'Handoff', maxWords: 300 },
  ];

  for (const { file, title, maxWords } of summaryFiles) {
    const content = readIfExists(path.join(internalDir, file));
    if (!content) continue;
    const section = sanitizeSectionMarkdown(content, maxWords);
    if (!section) continue;
    parts.push(`## ${title}`, '', section, '');
  }

  const finalDir = path.join(runDir, 'final');
  const images = collectUniqueMedia(collectImages(finalDir, runDir));
  const presentationImages = selectPresentationImages(images);

  if (presentationImages.length) {
    parts.push('## Peças Da Campanha', '');
    for (const image of presentationImages) {
      const label = humanizeAssetLabel(image.label);
      parts.push(`### ${label}`, '', `![${label}](${path.relative(runDir, image.path)})`, '');
    }
  } else {
    parts.push('## Peças Da Campanha', '', 'Nenhuma peça visual final foi encontrada em `final/` nesta run. Quando a produção gerar KVs, anúncios, posts, assets e derivadas, eles aparecerão automaticamente aqui.', '');
  }

  if (images.length > presentationImages.length) {
    parts.push('## Observação De Acervo', '');
    parts.push(`${images.length} imagens finais foram encontradas. Este PDF incluiu as ${presentationImages.length} primeiras por prioridade de campanha. Ajuste HUMAN_TEAM_CAMPAIGN_PDF_MAX_IMAGES para ampliar a apresentação.`, '');
  }

  return parts.join('\n').replace(/\n{3,}/g, '\n\n');
}

function buildHtml(markdown) {
  const sections = markdown.split(/^##\s+/m);
  const title = sections.shift();
  const body = [];
  const toc = [];

  body.push(markdownToHtml(title));
  for (const section of sections) {
    const [firstLine, ...rest] = section.split('\n');
    const id = slugify(firstLine);
    toc.push(`<a href="#${id}">${escapeHtml(firstLine)}</a>`);
    body.push(`<section id="${id}"><h1>${escapeHtml(firstLine)}</h1>${markdownToHtml(rest.join('\n'))}</section>`);
  }

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Apresentação da Campanha</title>
  <style>
    @page { size: A4; margin: 14mm 13mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: #181818;
      background: #f6f2ea;
      font: 13px/1.48 Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    main {
      max-width: 920px;
      margin: 0 auto;
      background: #fffaf1;
      padding: 34px;
      min-height: 100vh;
    }
    h1, h2, h3, h4, h5 { color: #17120e; line-height: 1.15; page-break-after: avoid; }
    h1 { font-size: 28px; margin: 0 0 16px; padding-top: 6px; }
    h2 { font-size: 21px; margin: 22px 0 10px; }
    h3 { font-size: 16px; margin: 16px 0 7px; }
    p { margin: 0 0 10px; }
    blockquote {
      margin: 18px 0;
      padding: 14px 18px;
      border-left: 5px solid #b9825b;
      background: #f4eee4;
      color: #3b3029;
    }
    .toc {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px 18px;
      margin: 28px 0 36px;
      padding: 18px;
      border: 1px solid #dccbb8;
      background: #fff;
    }
    .toc a { color: #2b1d16; text-decoration: none; font-weight: 700; }
    section { page-break-inside: auto; margin-top: 24px; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0 20px;
      background: #fff;
      font-size: 12px;
    }
    th, td { border: 1px solid #dccbb8; padding: 8px 9px; vertical-align: top; }
    th { background: #2b1d16; color: #fffaf1; text-align: left; }
    tr { page-break-inside: avoid; }
    .color-token {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-weight: 700;
      white-space: nowrap;
    }
    .color-swatch {
      width: 24px;
      height: 24px;
      border-radius: 999px;
      border: 1px solid rgba(23, 18, 14, 0.25);
      box-shadow: inset 0 0 0 2px rgba(255, 250, 241, 0.7);
    }
    table:has(.color-token) td {
      min-height: 42px;
    }
    ul, ol { margin: 8px 0 16px 22px; padding: 0; }
    li { margin: 4px 0; }
    code {
      padding: 1px 5px;
      border-radius: 4px;
      background: #f4eee4;
      color: #2b1d16;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.92em;
    }
    pre {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      background: #17120e;
      color: #fffaf1;
      padding: 14px;
      border-radius: 6px;
      font-size: 11px;
    }
    img {
      max-width: 100%;
      max-height: 420px;
      object-fit: contain;
      display: block;
      margin: 10px auto 18px;
      border: 1px solid #dccbb8;
      background: #fff;
    }
    a { color: #8b4c33; }
    strong { color: #17120e; }
  </style>
</head>
<body>
  <main>
    ${body[0]}
    ${toc.length ? `<nav class="toc">${toc.join('\n')}</nav>` : ''}
    ${body.slice(1).join('\n')}
  </main>
</body>
</html>`;
}

(async () => {
  const markdown = buildDocumentMarkdown();
  const html = buildHtml(markdown);
  const campaignMarkdown = buildCampaignPresentationMarkdown();
  const campaignHtml = buildHtml(campaignMarkdown);

  fs.writeFileSync(outMd, markdown, 'utf8');
  fs.writeFileSync(outHtml, html, 'utf8');
  fs.writeFileSync(outCampaignMd, campaignMarkdown, 'utf8');
  fs.writeFileSync(outCampaignHtml, campaignHtml, 'utf8');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`file://${outHtml}`, { waitUntil: 'networkidle' });
  await page.pdf({
    path: outPdf,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
  });
  await page.goto(`file://${outCampaignHtml}`, { waitUntil: 'networkidle' });
  await page.pdf({
    path: outCampaignPdf,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();

  console.log(JSON.stringify({
    markdown: outMd,
    html: outHtml,
    pdf: outPdf,
    campaignMarkdown: outCampaignMd,
    campaignHtml: outCampaignHtml,
    campaignPdf: outCampaignPdf,
  }, null, 2));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
