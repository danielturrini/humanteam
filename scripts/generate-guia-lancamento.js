#!/usr/bin/env node
// Gera o Guia de Bolso (6 paineis) + Peca de Lancamento + Peca de Lembrete,
// fechando o inventario completo do plano de producao.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const outDir = process.argv[2];
if (!outDir) { console.error('Uso: node generate-guia-lancamento.js <outDir>'); process.exit(1); }
const guiaDir = path.join(outDir, 'guia');
const lancDir = path.join(outDir, 'lancamento');
fs.mkdirSync(guiaDir, { recursive: true });
fs.mkdirSync(lancDir, { recursive: true });

const LOGO_PATH = path.join(__dirname, '..', 'Campanhas', 'espaco-viver-bem-bd', 'refs', 'marca', 'Logo_Unimed_Juiz_de_Fora_branco.png');
const LOGO_WHITE_DATAURI = fs.existsSync(LOGO_PATH)
  ? `data:image/png;base64,${fs.readFileSync(LOGO_PATH).toString('base64')}`
  : null;
function logoImg(heightPx) {
  return LOGO_WHITE_DATAURI
    ? `<img src="${LOGO_WHITE_DATAURI}" alt="Unimed Juiz de Fora" style="height:${heightPx}px">`
    : `<span style="font-weight:800">Unimed Juiz de Fora</span>`;
}

const PANEL_W = 585;
const PANEL_H = 1240;

const BADGE = '<div class="badge">PREVIEW / MATERIAL DE APROVAÇÃO</div>';
const BASE_CSS = `
  *{box-sizing:border-box;margin:0;padding:0}
  body{width:${PANEL_W}px;height:${PANEL_H}px;font-family:Arial,Helvetica,sans-serif;position:relative;overflow:hidden}
  .badge{position:absolute;top:20px;left:0;right:0;text-align:center;font-size:9px;letter-spacing:1px;opacity:.5;font-weight:700}
`;

function capaHtml() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}
  body{background:#00995d;color:#fff;padding:60px 34px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center}
  .logo{display:flex;flex-direction:column;align-items:center;margin-bottom:50px}
  .tag{font-size:20px;font-weight:800;color:#A9CF3D;margin-bottom:18px}
  .titulo{font-size:30px;font-weight:800;line-height:1.2}
  .sub2{font-size:15px;font-weight:500;margin-top:20px;opacity:.95;line-height:1.4}
  .selo{margin-top:34px;background:#fff;color:#00995d;font-weight:800;font-size:14px;padding:10px 20px;border-radius:30px}
  </style></head><body>
  ${BADGE}
  <div class="logo">${logoImg(70)}</div>
  <div class="tag">Tudo isso já é seu.</div>
  <div class="titulo">Espaço Viver Bem (EVB)</div>
  <div class="sub2">Linhas de cuidado para sua saúde e de seus dependentes</div>
  <div class="selo">Sem custo extra</div>
  </body></html>`;
}

function pag1Html() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}
  body{background:#F4F6EF;color:#1F4B3F;padding:60px 34px}
  h1{font-size:24px;font-weight:800;color:#00995d;margin-bottom:20px}
  p{font-size:14px;line-height:1.55;margin-bottom:16px}
  .destaque{font-weight:800;color:#00995d}
  </style></head><body>
  ${BADGE}
  <h1>Olá!</h1>
  <p>O Espaço Viver Bem (EVB) da Unimed Juiz de Fora é uma unidade exclusiva, onde uma equipe multidisciplinar apoia você e seus dependentes, com foco em autocuidado apoiado, promoção da saúde e prevenção de agravos, além de tratamentos domiciliares.</p>
  <p>A equipe é composta por médicos, enfermeiros, técnicos de enfermagem, educadores físicos, nutricionistas, fonoaudiólogos, psicólogos, fisioterapeutas e assistentes sociais.</p>
  <p class="destaque">Tudo isso sem custo adicional no plano de saúde!</p>
  <p>Conheça a seguir as diversas possibilidades de cuidado.</p>
  </body></html>`;
}

function listPageHtml(items) {
  const blocks = items.map(([t, d]) => `<div class="item"><h2>${t}</h2><p>${d}</p></div>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}
  body{background:#F4F6EF;color:#1F4B3F;padding:56px 32px}
  .item{margin-bottom:22px}
  h2{font-size:15px;font-weight:800;color:#00995d;margin-bottom:6px}
  p{font-size:12.5px;line-height:1.5}
  </style></head><body>
  ${BADGE}
  ${blocks}
  </body></html>`;
}

function contracapaHtml() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS}
  body{background:#00995d;color:#fff;padding:60px 34px;display:flex;flex-direction:column;align-items:center;text-align:center;justify-content:center}
  .titulo{font-size:20px;font-weight:800;margin-bottom:30px}
  .qr{width:170px;height:170px;border:3px solid #fff;border-radius:16px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;font-weight:800;font-size:12px;padding:12px}
  .contato{margin-top:30px;font-size:13px;line-height:1.7;opacity:.95}
  </style></head><body>
  ${BADGE}
  <div class="titulo">Saiba mais sobre o EVB!</div>
  <div class="qr">QR CODE GERAL<span style="font-size:10px;font-weight:600">(gerado após confirmação da URL)</span></div>
  <div class="contato">[Telefone a confirmar]<br>Atendimento: Seg a sex, 7h às 19h<br>Av. Presidente Itamar Franco, 1.442<br>Centro — Juiz de Fora — MG</div>
  </body></html>`;
}

function lancamentoHtml() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{width:1240px;height:1754px;background:#00995d;font-family:Arial,Helvetica,sans-serif;color:#fff;position:relative;overflow:hidden}
  .badge{position:absolute;top:70px;right:80px;font-size:14px;letter-spacing:2px;opacity:.55;font-weight:700}
  .pad{padding:90px 80px}
  .logo{display:flex;align-items:center}
  .headline{font-size:70px;font-weight:800;line-height:1.1;margin-top:110px;max-width:1000px}
  .corpo{font-size:30px;font-weight:400;line-height:1.5;margin-top:44px;max-width:900px;opacity:.95}
  .cta-block{margin-top:110px;background:#A9CF3D;color:#123425;border-radius:24px;padding:44px 48px;max-width:820px;font-size:30px;font-weight:800}
  </style></head><body>
  ${BADGE}
  <div class="pad">
    <div class="logo">${logoImg(56)}</div>
    <div class="headline">Um novo espaço, para um cuidado que você já tinha.</div>
    <div class="corpo">A partir de agora, o Espaço Saúde da Unimed Juiz de Fora tem presença quinzenal aqui na sua empresa. Venha descobrir as Linhas de Cuidado que já fazem parte do seu plano — para você e seus dependentes.</div>
    <div class="cta-block">Converse com a nossa assistente no Espaço Saúde.</div>
  </div>
  </body></html>`;
}

function lembreteHtml() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{width:1080px;height:1350px;background:#00995d;font-family:Arial,Helvetica,sans-serif;color:#fff;position:relative;overflow:hidden;display:flex;flex-direction:column;padding:80px 76px}
  .badge{font-size:13px;letter-spacing:2px;opacity:.5;font-weight:700}
  .icon{width:84px;height:84px;stroke:#fff;fill:none;stroke-width:3;margin-top:60px}
  .headline{font-size:56px;font-weight:800;line-height:1.15;margin-top:44px;max-width:840px}
  .corpo{font-size:28px;font-weight:500;margin-top:30px;opacity:.95;max-width:800px;line-height:1.45}
  .spacer{flex:1}
  .cta{background:#A9CF3D;color:#123425;font-weight:800;font-size:28px;padding:30px 46px;border-radius:60px;display:inline-block;width:fit-content}
  </style></head><body>
  <div class="badge">PREVIEW / MATERIAL DE APROVAÇÃO</div>
  <svg class="icon" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-6-4-8-9c-1.3-3.2.5-6.5 3.5-6.5 1.8 0 3.2 1 4.5 2.4C13.3 6.5 14.7 5.5 16.5 5.5c3 0 4.8 3.3 3.5 6.5-2 5-8 9-8 9z"/></svg>
  <div class="headline">A assistente do Espaço Viver Bem está aqui hoje.</div>
  <div class="corpo">Aproveite para descobrir mais uma Linha de Cuidado que já é sua.</div>
  <div class="spacer"></div>
  <div class="cta">Passe no Espaço Saúde</div>
  </body></html>`;
}

const PAG2 = [
  ['Atenção Domiciliar', 'Ações de promoção, prevenção, tratamento e reabilitação em casa. Indicado para beneficiários com restrição de mobilidade ou em cuidados paliativos, com participação ativa e presença de cuidador de referência, além de treinamentos e orientações à família.'],
  ['Cessação do Tabagismo', 'Apoio emocional e comportamental para beneficiários que desejam parar de fumar, seguindo recomendações do Instituto Nacional do Câncer (INCA). O atendimento inclui acompanhamentos individuais e em grupo com psicólogo e equipe multidisciplinar.'],
  ['Cuidado Integral de Feridas', 'Ambulatório especializado em tratamento de lesões de pele, com atendimentos agendados, realizados por enfermeiro estomaterapeuta, responsável pela avaliação inicial, definição da conduta e acompanhamento do tratamento.'],
  ['Desospitalização', 'A equipe da Unimed Juiz de Fora realiza visitas diárias nos principais hospitais da rede para identificar pacientes com condições estáveis para continuidade do tratamento em casa. Tudo com consentimento da família e do médico assistente.'],
];
const PAG3 = [
  ['Escola de Coluna e Dor Crônica', 'Conduzida por fisioterapeuta especializado. Busca melhorar a qualidade de vida de beneficiários portadores de dor crônica na coluna, reduzindo ou retardando a evolução dos quadros de dor e incapacidade.'],
  ['Intervenção Específica', 'Serviço de apoio ao médico assistente para garantir a continuidade do tratamento domiciliar em regime de 24h. Envolve atendimentos pontuais, como administração de medicação endovenosa e curativos, com monitoramento contínuo de um enfermeiro.'],
  ['Linha Materno-Infantil', 'Acompanha a gestante e o bebê durante toda a gestação e o puerpério. A captação ocorre no primeiro trimestre, com consultas de enfermagem obstétrica, oficinas e encontros. Após o nascimento, mãe e bebê recebem visita domiciliar do enfermeiro.'],
  ['Monitoramento Ambulatorial', 'Para beneficiários portadores de doenças crônicas, como hipertensão, diabetes, cardiopatias, doença renal crônica, doença pulmonar obstrutiva e obesidade. Promove o autocuidado apoiado e o monitoramento periódico com o enfermeiro.'],
];
const PAG4 = [
  ['Programa Peso Saudável', 'Tratamento para sobrepeso e obesidade, com acompanhamento nutricional e apoio de equipe multidisciplinar. Atendimentos individuais e em grupo presencial, com ênfase na reeducação alimentar e adoção de hábitos saudáveis.'],
  ['Reabilitação Cardiopulmonar e Metabólica (RCPM)', 'Para beneficiários com doenças cardiovasculares e metabólicas, atua em duas fases, atendendo diferentes perfis de risco. O foco é a reabilitação funcional, por meio da prática supervisionada de exercício físico.'],
  ['Telessaúde', 'Serviço de captação e monitoramento remoto, com orientações em saúde e direcionamento para serviços próprios da Unimed. Foco em clientes idosos (acima de 60 anos), com orientações preventivas e gerenciamento de saúde.'],
  ['Unimed Cuidados Continuados', 'Unidade exclusiva para pacientes do Programa de Atenção Domiciliar e Cuidados Paliativos que necessitam de internação, em ala específica de hospital parceiro. Atendimento pela mesma equipe do EVB, garantindo continuidade do cuidado.'],
];

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage();

  await page.setViewportSize({ width: PANEL_W, height: PANEL_H });
  const guiaPages = [
    ['guia-01-capa.png', capaHtml()],
    ['guia-02-pag1.png', pag1Html()],
    ['guia-03-pag2.png', listPageHtml(PAG2)],
    ['guia-04-pag3.png', listPageHtml(PAG3)],
    ['guia-05-pag4.png', listPageHtml(PAG4)],
    ['guia-06-contracapa.png', contracapaHtml()],
  ];
  for (const [name, html] of guiaPages) {
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(guiaDir, name) });
    console.log('gerado:', name);
  }

  await page.setViewportSize({ width: 1240, height: 1754 });
  await page.setContent(lancamentoHtml(), { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(lancDir, 'peca-lancamento.png') });
  console.log('gerado: peca-lancamento.png');

  await page.setViewportSize({ width: 1080, height: 1350 });
  await page.setContent(lembreteHtml(), { waitUntil: 'networkidle' });
  await page.screenshot({ path: path.join(lancDir, 'peca-lembrete.png') });
  console.log('gerado: peca-lembrete.png');

  await browser.close();
})();
