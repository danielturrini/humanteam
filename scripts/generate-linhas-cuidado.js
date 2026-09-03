#!/usr/bin/env node
// Gera os mockups editoriais (display individual A4, cartao frente/verso,
// cartao digital) para as 12 Linhas de Cuidado do Espaco Viver Bem,
// reaproveitando o mesmo sistema visual validado na peca-piloto.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const outDir = process.argv[2];
if (!outDir) {
  console.error('Uso: node generate-linhas-cuidado.js <outDir>');
  process.exit(1);
}
const displaysDir = path.join(outDir, 'displays');
const cartoesDir = path.join(outDir, 'cartoes');
const digitalDir = path.join(outDir, 'digital');
for (const d of [displaysDir, cartoesDir, digitalDir]) fs.mkdirSync(d, { recursive: true });

const LOGO_PATH = path.join(__dirname, '..', 'Campanhas', 'espaco-viver-bem-bd', 'refs', 'marca', 'Logo_Unimed_Juiz_de_Fora_branco.png');
const LOGO_WHITE_DATAURI = fs.existsSync(LOGO_PATH)
  ? `data:image/png;base64,${fs.readFileSync(LOGO_PATH).toString('base64')}`
  : null;
const LOGO_IMG = LOGO_WHITE_DATAURI
  ? `<img src="${LOGO_WHITE_DATAURI}" alt="Unimed Juiz de Fora" style="height:32px">`
  : `<span style="display:flex;align-items:center;gap:12px"><svg viewBox="0 0 24 24" style="width:32px;height:32px"><path d="M12 2 L18 12 L14 12 L18 20 L12 16 L6 20 L10 12 L6 12 Z" fill="#fff"/></svg>Unimed <span style="font-size:14px;font-weight:600;opacity:.9;margin-left:4px">Juiz de Fora</span></span>`;

const ICONS = {
  domiciliar: '<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/>',
  tabagismo: '<rect x="3" y="10" width="14" height="4" rx="1"/><path d="M17 11h2v2h-2z"/><path d="M4 6l16 16" stroke-width="2.6"/>',
  feridas: '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/>',
  desospitalizacao: '<path d="M5 21V9l7-5 7 5v12"/><path d="M9 21v-6h6v6"/><path d="M15 3l6 6" />',
  coluna: '<path d="M12 2v3M12 19v3M9 5h6M9 19h6"/><path d="M10 5c-2 1-2 3 0 4s2 3 0 4 -2 3 0 4 2 3 0 6"/><path d="M14 5c2 1 2 3 0 4s-2 3 0 4 2 3 0 4 -2 3 0 6"/>',
  intervencao: '<path d="M12 3l5 5-5 14-5-14z"/><path d="M9 8h6"/>',
  materno: '<circle cx="9" cy="7" r="3"/><path d="M4 20c0-3.5 2.5-6 5-6s5 2.5 5 6"/><circle cx="18" cy="16" r="2.4"/>',
  ambulatorial: '<path d="M3 12h4l2-7 4 14 2-7h6"/>',
  peso: '<path d="M12 3v3"/><path d="M4 8h16"/><path d="M6 8l-3 6a3 3 0 0 0 6 0z"/><path d="M18 8l-3 6a3 3 0 0 0 6 0z"/>',
  rcpm: '<path d="M12 21s-7-4.6-9.3-9C1.2 8.8 3 5 6.5 5c2 0 3.5 1.2 4.5 2.6C12 6.2 13.5 5 15.5 5 19 5 20.8 8.8 19.3 12 17 16.4 12 21 12 21z"/><path d="M8 12h2l1-3 2 6 1-3h2"/>',
  telessaude: '<path d="M4 9a12 12 0 0 1 16 0"/><path d="M7 13a7 7 0 0 1 10 0"/><circle cx="12" cy="17" r="1.4" fill="currentColor"/>',
  continuados: '<path d="M4 20v-7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v7"/><path d="M4 20h16"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>',
};

const LINHAS = [
  {
    id: 'atencao-domiciliar', nome: 'Atenção Domiciliar', icon: 'domiciliar',
    headline: 'Cuidado que já chega até a sua casa.',
    apoio: 'Cuidado profissional, no conforto da sua casa.',
    bullets: ['Ações de promoção, prevenção, tratamento e reabilitação em casa', 'Indicado para quem tem restrição de mobilidade', 'Atendimento também em cuidados paliativos', 'Participação ativa do beneficiário', 'Presença de um cuidador de referência', 'Treinamentos e orientações para a família', 'Cuidado no conforto da sua casa'],
  },
  {
    id: 'cessacao-tabagismo', nome: 'Cessação do Tabagismo', icon: 'tabagismo',
    headline: 'Apoio que já é seu para dar o próximo passo.',
    apoio: 'Apoio especializado para parar de fumar, no seu tempo.',
    bullets: ['Orientação especializada', 'Suporte emocional e comportamental', 'Atendimento individual', 'Acompanhamento em grupo', 'Equipe multidisciplinar', 'Avaliação pneumológica', 'Acompanhamento da abstinência', 'Cuidado contínuo'],
  },
  {
    id: 'feridas', nome: 'Cuidado Integral de Feridas', icon: 'feridas',
    headline: 'Cuidado especializado que já é seu.',
    apoio: 'Avaliação e tratamento especializado de feridas.',
    bullets: ['Avaliação especializada da lesão', 'Plano de cuidado individualizado', 'Curativos e coberturas adequados para cada tipo de ferida', 'Acompanhamento da evolução e cicatrização', 'Cuidado de feridas em pessoas com diabetes', 'Prevenção e tratamento de lesões de pele', 'Orientações para cuidados em casa', 'Cuidado integrado e humanizado em todas as etapas'],
  },
  {
    id: 'desospitalizacao', nome: 'Desospitalização', icon: 'desospitalizacao',
    headline: 'Continuidade de cuidado que você já tem.',
    apoio: 'Continuidade do tratamento, com segurança, em casa.',
    bullets: ['Visitas diárias aos principais hospitais da rede', 'Identificação de pacientes com condições estáveis', 'Continuidade do tratamento em casa', 'Avaliação conjunta com o médico assistente', 'Sempre com consentimento da família', 'Transição acompanhada do hospital para casa', 'Cuidado sem interrupção'],
  },
  {
    id: 'escola-coluna', nome: 'Escola de Coluna e Dor Crônica', icon: 'coluna',
    headline: 'Cuidado para sua coluna que já é seu.',
    apoio: 'Fisioterapia especializada, para você viver com mais qualidade.',
    bullets: ['Voltado para beneficiários que convivem com dores crônicas na coluna', 'Fisioterapia especializada', 'Foco na melhora da qualidade de vida e da funcionalidade', 'Redução da dor', 'Prevenção de incapacidades', 'Atendimento personalizado', 'Acompanhamento individual ou em grupo', 'Reabilitação pós-cirúrgica'],
  },
  {
    id: 'intervencao-especifica', nome: 'Intervenção Específica', icon: 'intervencao',
    headline: 'Acompanhamento contínuo, já incluso no seu plano.',
    apoio: 'Cuidado contínuo em casa, com uma equipe de enfermagem.',
    bullets: ['Apoio ao médico assistente', 'Continuidade do cuidado', 'Atendimento domiciliar 24 horas', 'Atendimentos pontuais', 'Administração de medicamentos', 'Realização de curativos', 'Monitoramento de enfermagem', 'Cuidado integrado'],
  },
  {
    id: 'materno-infantil', nome: 'Linha Materno-Infantil', icon: 'materno',
    headline: 'Cuidado que acompanha cada novo começo — e já é seu.',
    apoio: 'Acompanhamento completo da gestação ao pós-parto.',
    bullets: ['Acompanhamento completo durante a gestação e o puerpério', 'Acolhimento desde o início da gestação', 'Consultas de enfermagem obstétrica', 'Oficinas e encontros', 'Visita domiciliar', 'Teleconsulta', 'Cuidados com mãe e bebê', 'Fototerapia domiciliar'],
  },
  {
    id: 'monitoramento-ambulatorial', nome: 'Monitoramento Ambulatorial', icon: 'ambulatorial',
    headline: 'Acompanhamento constante que você já tem.',
    apoio: 'Acompanhamento periódico para quem convive com uma condição crônica.',
    bullets: ['Para quem convive com hipertensão, diabetes, cardiopatias e outras condições crônicas', 'Consultas periódicas com enfermeiro', 'Promoção do autocuidado apoiado', 'Acompanhamento contínuo da condição', 'Orientações para o dia a dia', 'Cuidado constante, não apenas em momentos de crise'],
  },
  {
    id: 'peso-saudavel', nome: 'Programa Peso Saudável', icon: 'peso',
    headline: 'Apoio para mudar de verdade — e já é seu.',
    apoio: 'Acompanhamento nutricional e multidisciplinar para uma mudança real.',
    bullets: ['Tratamento do sobrepeso e obesidade', 'Acompanhamento nutricional', 'Equipe multidisciplinar', 'Atendimentos individuais e em grupo', 'Avaliação integral da saúde', 'Preparação para cirurgia bariátrica', 'Cuidados no pós-bariátrica', 'Monitoramento contínuo'],
  },
  {
    id: 'rcpm', nome: 'Reabilitação Cardiopulmonar e Metabólica (RCPM)', icon: 'rcpm',
    headline: 'Reabilitação segura que já é sua.',
    apoio: 'Reabilitação supervisionada para o coração e o corpo.',
    bullets: ['Reabilitação Cardiometabólica', 'Acompanhamento em duas fases', 'Avaliação de risco', 'Plano de cuidado individualizado', 'Exercício físico supervisionado', 'Promoção do autocuidado', 'Equipe multidisciplinar', 'Reabilitação integrada e segura'],
  },
  {
    id: 'telessaude', nome: 'Telessaúde', icon: 'telessaude',
    headline: 'Cuidado à distância que você já tem.',
    apoio: 'Orientação e acompanhamento por telefone, sem sair de casa.',
    bullets: ['Acompanhamento da saúde', 'Captação de beneficiários', 'Monitoramento remoto', 'Contato periódico da equipe de enfermagem', 'Orientações em saúde', 'Prevenção e promoção da saúde', 'Gerenciamento do cuidado', 'Direcionamento para serviços próprios'],
  },
  {
    id: 'cuidados-continuados', nome: 'Unimed Cuidados Continuados', icon: 'continuados',
    headline: 'Continuidade de cuidado, em qualquer fase.',
    apoio: 'Continuidade do cuidado, mesmo quando é preciso internar.',
    bullets: ['Unidade exclusiva para internação, quando necessária', 'Para pacientes de Atenção Domiciliar e Cuidados Paliativos', 'Ala específica em hospital parceiro', 'Atendimento pela mesma equipe do EVB', 'Continuidade do cuidado, mesmo internado', 'Integração entre o cuidado em casa e no hospital'],
  },
];

const BADGE = '<div class="badge">PREVIEW / MATERIAL DE APROVAÇÃO</div>';

function cartaoFrenteHtml(l) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{width:591px;height:1063px;background:#00995d;font-family:Arial,Helvetica,sans-serif;color:#fff;position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:56px 44px}
  .icon{width:100px;height:100px;stroke:#fff;fill:none;stroke-width:3;margin-bottom:36px}
  .headline{font-size:38px;font-weight:800;line-height:1.15}
  .linha{font-size:23px;font-weight:800;margin-top:34px;color:#A9CF3D}
  .apoio{font-size:19px;font-weight:500;margin-top:18px;opacity:.95;line-height:1.4}
  .badge{position:absolute;top:24px;left:0;right:0;text-align:center;font-size:11px;letter-spacing:1.5px;opacity:.5;font-weight:700}
  </style></head><body>
  ${BADGE}
  <svg class="icon" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">${ICONS[l.icon]}</svg>
  <div class="headline">${l.headline}</div>
  <div class="linha">${l.nome}</div>
  <div class="apoio">${l.apoio}</div>
  </body></html>`;
}

function cartaoVersoHtml(l) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{width:591px;height:1063px;background:#F4F6EF;font-family:Arial,Helvetica,sans-serif;color:#1F4B3F;position:relative;overflow:hidden;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;text-align:center;padding:56px 36px}
  .badge{font-size:11px;letter-spacing:1.5px;opacity:.45;font-weight:700;margin-bottom:30px}
  .qr{width:220px;height:220px;border:3px solid #00995d;border-radius:16px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;color:#00995d;font-weight:800;font-size:14px;margin-top:20px;padding:16px}
  .texto1{font-size:19px;font-weight:700;margin-top:34px;line-height:1.4}
  .texto2{font-size:17px;font-weight:600;margin-top:18px;color:#00995d;line-height:1.4}
  .footer{position:absolute;bottom:0;left:0;right:0;background:#00995d;color:#fff;padding:34px 30px;font-size:14px;line-height:1.6}
  .footer b{display:block;font-size:16px;margin-bottom:6px}
  </style></head><body>
  <div class="badge">PREVIEW / MATERIAL DE APROVAÇÃO</div>
  <div class="qr">QR CODE<br>${l.nome.toUpperCase()}<span style="font-size:11px;font-weight:600">(gerado após confirmação da URL)</span></div>
  <div class="texto1">Aponte a câmera do seu celular e conheça ${l.nome}.</div>
  <div class="texto2">Cuidado que já é seu — é só dar o próximo passo.</div>
  <div class="footer"><b>Dúvidas? Fale com a gente!</b>[Telefone a confirmar]</div>
  </body></html>`;
}

function digitalHtml(l) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{width:1080px;height:1350px;background:#00995d;font-family:Arial,Helvetica,sans-serif;color:#fff;position:relative;overflow:hidden;display:flex;flex-direction:column;padding:80px 76px}
  .badge{font-size:13px;letter-spacing:2px;opacity:.5;font-weight:700}
  .icon{width:84px;height:84px;stroke:#fff;fill:none;stroke-width:3;margin-top:50px}
  .headline{font-size:52px;font-weight:800;line-height:1.15;margin-top:40px;max-width:840px}
  .linha{font-size:30px;font-weight:800;margin-top:28px;color:#A9CF3D}
  .apoio{font-size:24px;font-weight:500;margin-top:20px;opacity:.95;max-width:780px;line-height:1.4}
  .spacer{flex:1}
  .button{background:#A9CF3D;color:#123425;font-weight:800;font-size:28px;padding:30px 46px;border-radius:60px;display:inline-block;width:fit-content}
  </style></head><body>
  ${BADGE}
  <svg class="icon" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">${ICONS[l.icon]}</svg>
  <div class="headline">${l.headline}</div>
  <div class="linha">${l.nome}</div>
  <div class="apoio">${l.apoio}</div>
  <div class="spacer"></div>
  <div class="button">Saiba mais</div>
  </body></html>`;
}

function displayHtml(l) {
  const bullets = l.bullets.map(b => `<li>${b}</li>`).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{width:1240px;height:1754px;background:#00995d;font-family:Arial,Helvetica,sans-serif;color:#fff;position:relative;overflow:hidden}
  .pad{padding:80px 80px 0}
  .logo{display:flex;align-items:center}
  .icon{width:64px;height:64px;stroke:#fff;fill:none;stroke-width:3;margin-top:56px}
  .headline{font-size:54px;font-weight:800;line-height:1.1;margin-top:26px;max-width:960px}
  .intro{font-size:22px;font-weight:600;margin-top:30px;max-width:920px;opacity:.95}
  .nome{font-size:28px;font-weight:800;margin-top:26px;color:#A9CF3D}
  ul{margin-top:26px;padding-left:0;list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:14px 40px;max-width:1080px}
  li{font-size:19px;font-weight:600;line-height:1.35;position:relative;padding-left:26px}
  li:before{content:"";position:absolute;left:0;top:9px;width:10px;height:10px;border-radius:50%;background:#A9CF3D}
  .footer{position:absolute;bottom:0;left:0;right:0;background:#0d7a49;padding:40px 80px;display:flex;justify-content:space-between;align-items:center}
  .qr{width:110px;height:110px;border:2px solid #fff;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;text-align:center;padding:8px}
  .contact{font-size:14px;text-align:right;line-height:1.5}
  .badge{position:absolute;top:34px;right:80px;font-size:13px;letter-spacing:1.5px;opacity:.5;font-weight:700}
  </style></head><body>
  ${BADGE}
  <div class="pad">
    <div class="logo">${LOGO_IMG}</div>
    <svg class="icon" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">${ICONS[l.icon]}</svg>
    <div class="headline">${l.headline}</div>
    <div class="intro">Cliente Unimed, você tem acesso aos serviços do Espaço Viver Bem (EVB). Sem custo extra para o titular e o dependente!</div>
    <div class="nome">Lá, temos ${l.nome}</div>
    <ul>${bullets}</ul>
  </div>
  <div class="footer">
    <div class="qr">QR CODE<br>(pendente URL)</div>
    <div class="contact">[Telefone a confirmar]<br>Seg a sex, 7h às 19h<br>Av. Presidente Itamar Franco, 1.442, Centro</div>
  </div>
  </body></html>`;
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: '/opt/pw-browsers/chromium' });
  const page = await browser.newPage();

  for (const l of LINHAS) {
    await page.setViewportSize({ width: 591, height: 1063 });
    await page.setContent(cartaoFrenteHtml(l), { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(cartoesDir, `${l.id}-frente.png`) });

    await page.setContent(cartaoVersoHtml(l), { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(cartoesDir, `${l.id}-verso.png`) });

    await page.setViewportSize({ width: 1080, height: 1350 });
    await page.setContent(digitalHtml(l), { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(digitalDir, `${l.id}-digital.png`) });

    await page.setViewportSize({ width: 1240, height: 1754 });
    await page.setContent(displayHtml(l), { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(displaysDir, `${l.id}.png`) });

    console.log('gerado:', l.id);
  }
  await browser.close();
})();
