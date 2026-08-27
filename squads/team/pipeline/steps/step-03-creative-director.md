---
execution: inline
agent: squads/team/agents/conceito
inputFile: squads/team/output/internal/dossie.md
outputFile: squads/team/output/internal/conceito.md
---

# Step 03: Concept (Big Idea) — Conceito

## Context Loading

- `squads/team/output/{run_id}/internal/brief.md` — objetivo, público, ação esperada
- `squads/team/output/{run_id}/internal/plano.md` — formato, entregáveis, prazo
- `squads/team/output/{run_id}/internal/dossie.md` — pesquisa do Sondagem
- `_opensquad/_memory/company.md` — brand voice e identidade
- `squads/team/pipeline/data/output-examples.md` — exemplos de Big Idea bem feita
- `squads/team/pipeline/data/anti-patterns.md` — armadilhas conceituais
- `squads/team/pipeline/data/headline-intelligence-system.md` — padroes de campanhas premiadas recentes e testes de headline
- `squads/team/pipeline/data/expertise/creative-director.md` — repertório avançado de account planning, semiótica, brand strategy e big idea

## Instructions

### Process

1. Sintetize o **núcleo** do que precisa ser comunicado em 1 frase técnica (não publicitária).
2. Defina a **plataforma narrativa** da campanha: tensão humana, papel cultural, promessa emocional, energia dominante, arco narrativo e papel da marca/produto.
3. Gere **3-5 ângulos alternativos**, cada um partindo de um insight diferente do dossiê.
4. Filtre pelos critérios: (a) cabe em 12 palavras? (b) é específico desta marca? (c) direciona escolhas de roteiro/arte? (d) tem tensão humana real? (e) combina com o momento cultural? (f) sugere mecanismo, gesto, produto, serviço ou comportamento proprietário?
5. Escolha a Big Idea vencedora. Liste por que ela vence as outras (não basta dizer que ela é boa, precisa dizer por que as outras não são).
6. Escreva o **gancho** (frase que vira o hook do roteiro) e o **payoff** (mensagem que fica depois que o conteúdo acaba).
7. Escreva o **mecanismo de campanha**: qual artefato, serviço, gesto, ritual, prova ou comportamento torna a ideia executável.
8. Escreva o **anti-mood**: qual clima visual/narrativo seria incoerente para esta campanha e por quê.

### Decision Criteria

- Se nenhuma alternativa cabe em 12 palavras, está conceitualmente diluída — refaça.
- Se a Big Idea poderia ser dita por qualquer concorrente, não é Big Idea, é categoria.
- Se humor está envolvido e Conceito não tem domínio do tom da marca, escolha alternativa não-humorística.
- Se o mood contradiz o momento cultural sem justificativa estratégica, refaça. Exemplo: Copa com tristeza só faz sentido se a campanha for sobre saudade, superação ou tensão emocional; para celebração/torcida/pertencimento, o território deve ser vivo, coletivo e energético.
- Se a campanha vira peça isolada e não sustenta desdobramentos, refaça a plataforma narrativa.
- Se a Big Idea gera apenas frase bonita, sem mecanismo ou prova de marca, refaça.

## Output Format

```markdown
# Conceito — {nome da peça}

## Big Idea
> "{frase de até 12 palavras}"

## Ângulo
{1 parágrafo explicando a tensão que sustenta a Big Idea}

## Plataforma narrativa
- Tensão humana: ...
- Papel cultural: ...
- Promessa emocional: ...
- Energia dominante: ...
- Arco narrativo: ...
- Papel da marca/produto: ...
- Mecanismo de campanha: ...
- Anti-mood: ...

## Gancho (vira hook)
"{frase que vai abrir o roteiro}"

## Payoff
{1 frase do que fica na cabeça do leitor depois}

## Testes de força
- Teste do concorrente: passa/falha porque ...
- Teste do mecanismo: passa/falha porque ...
- Teste visual do KV: passa/falha porque ...

## Alternativas descartadas
1. "{alternativa 1}" — descartada porque ...
2. "{alternativa 2}" — descartada porque ...
3. "{alternativa 3}" — descartada porque ...

## Diretrizes para Roteiro
- Fórmula recomendada: {HSO/AIDA/PAS/Save the Cat}
- Tom recomendado: {1 dos 6 tons de tone-of-voice.md}
- Arco de campanha: ...
- O que evitar: ...
```

## Output Example

```markdown
# Conceito — Campanha "3 erros que matam sua copy"

## Big Idea
> "Sua copy não vende porque você está pedindo casamento no primeiro encontro."

## Ângulo
Comparar venda agressiva a comportamento de relacionamento. Aproveita que o público (copywriters iniciantes) já tem repertório emocional sobre "ser muito intenso cedo demais" — transposta para vendas, vira didática.

## Gancho
"Sua copy parece um cara que pede em casamento no primeiro Tinder."

## Payoff
"Vender é relacionamento. Cria desejo antes de pedir."

## Alternativas descartadas
1. "Os 3 maiores erros de quem começa em copy" — descartada por ser genérica, qualquer concorrente faria.
2. "Como triplicar suas conversões em 7 dias" — descartada por ser promessa overpromise, soa golpista.
3. "A ciência por trás de hooks que convertem" — descartada por priorizar autoridade técnica em vez de tensão emocional.

## Diretrizes para Roteiro
- Fórmula: Hook-Story-Offer (HSO) — hook com a metáfora, story com os 3 erros, offer com CTA de salvar
- Tom: Direto & Afiado (frases curtas, imperativo)
- Evitar: floreio técnico, exemplos genéricos, qualquer menção a "neste post eu vou..."
```

## Veto Conditions

1. Big Idea > 12 palavras ou genérica (poderia ser dita por concorrente).
2. Sem alternativas descartadas e justificativa por escrito.
3. Sem diretrizes para Roteirista (fórmula + tom + o que evitar).
4. Plataforma narrativa ausente ou sem energia emocional definida.
5. Mood incoerente com o momento cultural sem justificativa.
6. Sem mecanismo de campanha ou prova concreta de marca.

## Quality Criteria

- [ ] Big Idea cabe em até 12 palavras
- [ ] Mínimo 3 alternativas descartadas com razão
- [ ] Gancho + payoff escritos
- [ ] Plataforma narrativa com tensão, papel cultural, promessa emocional e energia dominante
- [ ] Mecanismo de campanha definido
- [ ] Testes de concorrente, mecanismo e KV documentados
- [ ] Anti-mood definido
- [ ] Diretrizes específicas para Roteiro
