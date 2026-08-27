# Quality Criteria — Time Criativo

> Rubricas globais que avaliam a saída de cada etapa. Cada agente também tem critérios próprios em seu `.agent.md`, mas estes aqui são os mínimos transversais.

## Rubrica geral (aplicada à peça final)

| Dimensão | Falha (0-3) | Aceitável (4-7) | Excelente (8-10) |
|---|---|---|---|
| **Clareza da mensagem** | Não dá pra explicar o ponto principal em 1 frase | Dá, mas exige contexto | Frase única óbvia em até 5 palavras |
| **Hook (primeiro contato)** | Genérico, "olha isso", "você sabia" | Curiosidade vaga | Curiosidade específica + promessa concreta |
| **Voz da marca** | Inconsistente ou ausente | Reconhecível em 50% do material | Inconfundível em 100% |
| **Densidade visual** | Slides/cenas vazios ou poluídos | Hierarquia clara, alguns excessos | Cada elemento justifica seu peso |
| **CTA** | Ausente ou implícito | Presente, mas fraco ("comenta aí") | Específico, único, com fricção mínima |
| **Aderência ao formato** | Quebra regras do canal | Funciona, mas não explora o canal | Nativo, parece feito pelo melhor do canal |
| **Coerência de campanha** | Peças soltas, sem arco ou sistema | Mensagem comum, mas desdobramento fraco | KV, narrativa, copy, assets e calendário parecem uma campanha única |
| **Energia emocional** | Mood contradiz produto/momento cultural | Mood aceitável, mas genérico | Emoção dominante é clara, justificada e memorável |
| **Apresentação visual** | PDF textual, sem previews ou amostras visuais | PDF explica, mas mostra pouco | PDF apresenta campanha visualmente, com cores, KV, previews, exemplos e desdobramentos |

**Mínimo para publicar**: nota >= 6 em todas as dimensões, sem nenhuma <= 3.

## Critérios por etapa

### Planning
- [ ] Plano cabe em uma página
- [ ] Cada entregável tem DoD escrito
- [ ] Dependências e bloqueios mapeados
- [ ] Cronograma backward planning (data de pub → trás)

### Research
- [ ] Mínimo 5 fontes citadas, cada uma datada e linkada
- [ ] Distinção clara entre dado (fato) e opinião (interpretação)
- [ ] Pelo menos uma fonte primária (audiência real, não 2ª mão)

### Concept (Big Idea)
- [ ] Cabe em uma frase de até 12 palavras
- [ ] Diferente do óbvio que qualquer concorrente faria
- [ ] Direciona escolhas de roteiro e arte sem ambiguidade
- [ ] Define plataforma narrativa: tensão humana, papel cultural, promessa emocional, energia dominante e arco
- [ ] Define mecanismo/prova de campanha
- [ ] Declara anti-mood ou caminhos incoerentes a evitar

### Script
- [ ] Hook na primeira frase
- [ ] CTA na última frase
- [ ] Lido em voz alta: nada trava
- [ ] Aderente à fórmula declarada (HSO, AIDA, PAS, etc.)
- [ ] Campanha completa tem sistema de headlines com shortlist para KV, ads e social/editorial

### Art Direction
- [ ] Paleta com no máximo 5 cores principais
- [ ] Tipografia com no máximo 2 famílias
- [ ] Mood board com 8-15 referências, todas categorizadas
- [ ] Mood visual coerente com energia emocional e momento cultural
- [ ] KV tratado como sistema de campanha, não como imagem isolada
- [ ] KV exige referência com lettering e renderer `gpt_image_2`

### Storyboard
- [ ] Um quadro por beat do roteiro (sem buracos)
- [ ] Cada quadro descreve: plano, ângulo, ação, texto sobreposto
- [ ] Continuidade visual verificada (sem saltos abruptos)

### Production
- [ ] Lista de assets sem itens "TBD"
- [ ] Cada asset tem fonte e prazo
- [ ] Riscos identificados com plano B

### Editing
- [ ] Peças finais organizadas em `final/`
- [ ] Versões por canal nos aspect ratios corretos (9:16, 4:5, 1:1, 16:9)
- [ ] Texto aplicado conferido contra `copy-pack.md`
- [ ] KVs/anúncios com lettering gerados via `gpt_image_2` com referência de KV

### Distribution
- [ ] Caption original por canal (não copy-paste)
- [ ] Hashtags pesquisadas (não genéricas)
- [ ] Horário alinhado ao pico do público

### Multiplication
- [ ] Mínimo 3 derivadas distintas
- [ ] Cada derivada respeita as regras do formato destino
- [ ] Sem "miniaturização" — derivada precisa ter razão de existir, não ser só o original cortado

### Campaign Delivery Package
- [ ] `projeto.md` explica campanha, publico, promessa, canais, formatos, criterios de sucesso e riscos
- [ ] Plataforma narrativa explica historia, energia emocional, papel cultural e desdobramento
- [ ] `copy-pack.md` cobre campanha geral, sistema de headlines, posts, anuncios, emails e CTAs
- [ ] KV inclui textos aplicados, regras de uso, anti-usos e desdobramentos por canal
- [ ] PDF apresenta cores com swatches, previews, exemplos de aplicacao e materiais visuais suficientes para aprovacao
- [ ] Imagens organizadas em KV, principais e secundarias
- [ ] Anuncios planejados ou gerados em 9:16, 4:5 e 16:9
- [ ] Continuidade visual documentada quando houver roupa, personagem, pessoa ou produto
- [ ] `final/calendar/notion-calendar.md` e `final/calendar/calendar.csv` prontos para Notion MCP/importacao
- [ ] `handoff.md` lista arquivos, pendencias, ferramentas externas e proximas acoes

## Veto absoluto (qualquer = redo)

1. Output contém placeholders não preenchidos (`[TBD]`, `lorem ipsum`, `XYZ`)
2. Output viola brand voice declarada em `_memory/memories.md`
3. Output usa termo da lista "vocabulário nunca usar" do agente
4. Output contém alegação factual sem fonte
5. Output contém dado pessoal de terceiros sem consentimento
6. Campanha completa entregue sem calendario, copy-pack ou manifesto de handoff
7. Campanha completa com peças soltas sem plataforma narrativa, energia emocional e KV sistêmico
8. Mood visual contradiz o momento cultural ou a promessa emocional sem justificativa estratégica
9. Documento oficial de campanha entregue como texto puro, sem apresentacao visual suficiente
