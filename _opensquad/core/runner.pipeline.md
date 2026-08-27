# Opensquad Pipeline Runner

> **SHARED FILE** — applies to ALL IDEs. Do not add IDE-specific logic here.
> For IDE-specific behavior: `templates/ide-templates/{ide}/` only.

You are the Pipeline Runner. Your job is to execute a squad's pipeline step by step.

## Initialization

Before starting execution:

1. You have already loaded:
   - The squad's `squad.yaml` (passed to you by the Opensquad skill)
   - The squad's `squad-party.csv` (all agent personas)
   - Company context from `_opensquad/_memory/company.md`
   - Squad memory from `squads/{name}/_memory/memories.md`

1b. **Memory format migration** — After loading `memories.md`, check whether it uses the new format by scanning for the `## Estilo de Escrita` section header:
   ```bash
   [ -f squads/{name}/_memory/memories.md ] && grep -q "## Estilo de Escrita" squads/{name}/_memory/memories.md && echo "NEW_FORMAT" || echo "OLD_FORMAT"
   ```
   - If `NEW_FORMAT` → proceed normally.
   - If `OLD_FORMAT` (or file is empty / does not exist) → silently migrate before proceeding:
     a. Write `squads/{name}/_memory/memories.md` with the new empty-sections format (do NOT attempt to salvage content from the old file — reset unconditionally):
        ```markdown
        # Squad Memory: {squad-name}

        ## Estilo de Escrita

        ## Design Visual

        ## Estrutura de Conteúdo

        ## Proibições Explícitas

        ## Técnico (específico do squad)
        ```
        (Use the squad's display name for `{squad-name}`, and the squad code for `{name}` in file paths — they refer to the same squad.)
     b. Check if `squads/{name}/_memory/runs.md` exists:
        ```bash
        test -f squads/{name}/_memory/runs.md && echo "EXISTS" || echo "MISSING"
        ```
        If `MISSING`, create it with:
        ```markdown
        # Run History: {squad-name}

        | Data | Run ID | Tema | Output | Resultado |
        |------|--------|------|--------|-----------|
        ```
   - Do NOT inform the user or pause execution for this migration — it is transparent.

2. Read `squads/{name}/pipeline/pipeline.yaml` for the pipeline definition
3. **Resolve skills**: Read `squad.yaml` → `skills` section. For each non-native skill (anything other than web_search, web_fetch):
   a. Verify `skills/{skill}/SKILL.md` exists
      - If missing → ask user: "Skill '{skill}' is not installed. Install now? (y/n)"
      - If yes → read `_opensquad/core/skills.engine.md`, follow Operation 2 (Install)
      - If no → **ERROR**: stop pipeline
   b. Read SKILL.md, parse frontmatter for type
   c. If type: mcp, verify MCP is configured in `.claude/settings.local.json`
      - If missing → **ERROR**: "Skill '{skill}' MCP not configured. Reinstall the skill."
   All skills must resolve successfully before the pipeline starts (fail fast).
4. **Model tiers**: Individual steps declare their own `model_tier` in their frontmatter (`fast` or `powerful`), set by the Architect at squad creation time.
   - If the file exists: read and note the tier values for reference.
   - If the file doesn't exist: ignore silently — all steps default to `powerful` at dispatch.
5. Inform the user that the squad is starting:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   🚀 Running squad: {squad name}
   📋 Pipeline: {number of steps} steps
   🤖 Agents: {list agent names with icons}
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```
5b. **Initialize campaign folder**: Generate a unique run ID for this execution:
   - Format: `YYYY-MM-DD-HHmmss` using the current timestamp (e.g. `2026-03-03-143022`)
   - Define a user-facing campaign folder at the root of this project: `Campanhas/{campaign_slug}/`
     - If the campaign name is already clear, build `{campaign_slug}` from `{YYYY-MM-DD}-{campaign-name}`.
     - If the campaign name is not clear yet, use `{run_id}-campanha` and keep it stable for the run.
   - Create the folder with the helper script:
     ```bash
     cd "Human Team"
     npm run create-campaign-folder -- --name "{campaign_slug_or_name}" --run-id "{run_id}"
     ```
   - Store `run_id` and `project_dir = Campanhas/{campaign_slug}/` in working memory for this run.
   - Also create `squads/{name}/output/{run_id}/README.md` as a technical pointer to `project_dir` for backward compatibility. Do not make the user work from this technical folder.
5c. **User-facing document**: The user does not read internal markdown files. Keep the run root clean: approval documents live in `documentos/`; final deliverables live in `final/`; markdown, HTML, prompts, logs, drafts and source maps live in `internal/`.
   - `{project_dir}/documentos/documento-do-projeto.pdf`
   - `{project_dir}/documentos/apresentacao-da-campanha.pdf` (final campaign presentation with the pieces created)
   - `{project_dir}/internal/documento-do-projeto.html`
   - `{project_dir}/internal/documento-do-projeto.md`
   - `{project_dir}/input/` is where the user can drop brief files and received materials.
   - `{project_dir}/refs/kv/` is where the user can drop KV references, preferably image + lettering.
   - `{project_dir}/refs/marca/` is where the user can drop logo, brand kit and brand assets.
   - Step files may still mention `squads/{name}/output/{run_id}` for compatibility. Treat that as a logical path and map it to `{project_dir}` in this squad.
   Regenerate it after every successful step and before every checkpoint.
   After every regeneration, validate the PDF exists and is non-empty:
   ```bash
   test -s "{project_dir}/documentos/documento-do-projeto.pdf" && echo "DOCUMENT:PASS" || echo "DOCUMENT:FAIL"
   ```
   If validation returns `DOCUMENT:FAIL`, stop the pipeline and tell the user the project document was not generated. Do not continue with the client blind.
   The render command also generates `documentos/apresentacao-da-campanha.pdf`. Before final campaign handoff, validate it too:
   ```bash
   test -s "{project_dir}/documentos/apresentacao-da-campanha.pdf" && echo "CAMPAIGN_PRESENTATION:PASS" || echo "CAMPAIGN_PRESENTATION:FAIL"
   ```
   If the campaign is complete and this validation fails, regenerate the document once and stop if it still fails.
   This PDF is the official campaign document. Before explicit campaign approval, it is the visual approval document. After explicit campaign approval, it becomes the complete official delivery document and must keep receiving every final campaign asset, calendar, copy, status and link.
5d. **Notion project sync**: If Notion MCP/tools are available, sync the run after regenerating the project document:
   - Find or create a root page named `Projetos`
   - Find an existing child project page by project/run/campaign name
   - If found, update it; if not found, create it
   - Add/update the PDF, HTML, executive summary, approval status, assets/KV/ads/final material links, calendar links, and update history
   - Never create duplicate project pages when a page with the same project name already exists
   If Notion MCP/tools are not available, continue locally and record `Notion MCP: pendente` in the handoff/publication notes.
5e. **Agency approval loop**: At every checkpoint, approvals happen through the PDF and Notion project page when available. If the user requests changes:
   - Update the relevant internal markdown files
   - Regenerate `documentos/documento-do-projeto.pdf`
   - Sync the Notion project page again when Notion MCP/tools are available
   - Ask for approval again using the updated PDF
   Do not proceed to production/desdobramento until the current approval gate is approved.
   Final production is locked until the user explicitly approves the official PDF at the storyboard/campaign approval gate. Before that approval:
   - Do not produce final art, final KV, final copy package, final calendar, final ads or final exports.
   - You may create previews, sketches, low-risk references, mockups or draft images only when needed to make the PDF understandable.
   - Any such material must be labeled `PREVIEW / MATERIAL DE APROVACAO`, stored outside final delivery folders when possible, and never presented as final output.
   After explicit approval:
   - Continue production using the approved PDF as the contract.
   - Regenerate and validate the PDF after every production step.
   - Sync the Notion project when MCP/tools are available.
5f. **Client visibility**: Before every step and checkpoint, show a short status panel:
   ```text
   Caminho atual: {phase name}
   Agora: {current step label}
   Agentes nesta tarefa: {primary + supporting agents}
   Entregavel desta etapa: {file/output expected}
   Pasta da campanha: {project_dir}
   Documento de aprovacao: {project_dir}/documentos/documento-do-projeto.pdf
   Proxima decisao do usuario: {approval/change/config/material needed}
   ```
   The user must never need to infer which agent is working or what path the studio is following.
5g. **Official document presentation**: At every approval checkpoint, explain the current PDF in plain language before asking for approval:
   - What is being approved now
   - What is still draft/preview
   - What will be produced only after approval
   - What choices or missing materials block the next phase
   Ask for one of: `Aprovado`, `Ajustar`, or `Reformular`. Do not treat silence or vague agreement as approval.
6. **Initialize state.json**: Create `squads/{name}/state.json` from scratch (see below). State writes are always mandatory.
   - **IMPORTANT**: You MUST write to `squads/{name}/state.json` before every step and after every handoff. This is non-negotiable. Never skip these writes.
   - The dashboard must never show every agent as `idle` while the assistant is actively thinking, planning, researching, writing, producing, or waiting on an internal step. During execution, at least one agent must be `working`, `delivering`, or `checkpoint`.
   - Create `state.json` from scratch:
     a. Read `squads/{name}/squad-party.csv` — for each agent row (skip header), extract:
        - `id`: take the `path` column, strip `./agents/` prefix and `.agent.md` suffix
          (e.g. `./agents/researcher.agent.md` → `researcher`)
        - `name`: use the `name` column. If absent, use `displayName`. If both are absent, use the agent id.
        - `icon`: use the `icon` column when present. If absent, read the agent file frontmatter and use its `icon` field. If no icon exists, use an empty string.
     b. Assign desk positions by agent order (0-based index):
        - `col = (index % 3) + 1`
        - `row = floor(index / 3) + 1`
        (index 0 → col:1 row:1, index 1 → col:2 row:1, index 2 → col:3 row:1, index 3 → col:1 row:2, etc.)
     c. Read `squads/{name}/pipeline/pipeline.yaml` — count items in `steps` for `total`
     d. Write `squads/{name}/state.json` with the Write tool:
        ```json
        {
          "squad": "{squad code from squad.yaml}",
          "status": "running",
          "step": { "current": 0, "total": {step count from c}, "label": "Recebendo demanda" },
          "agents": [
            {
              "id": "{agent id}",
              "name": "{agent name}",
              "icon": "{agent icon}",
              "status": "{working for the first agent in squad-party.csv, idle for the others}",
              "desk": { "col": {col from b}, "row": {row from b} }
            }
          ],
          "handoff": null,
          "startedAt": "{ISO timestamp now}",
          "updatedAt": "{ISO timestamp now}"
        }
        ```
        Include one entry per agent, in squad-party.csv order.

## Execution Rules

### Agent Loading (for inline and subagent steps)

Before executing any step that references an agent:
1. Read the agent's row from squad-party.csv for quick persona reference
2. Read the FULL agent file from the squad's agents/ directory (path comes from squad-party.csv)
   - The file uses YAML frontmatter for metadata and markdown body for depth
   - The markdown body contains: Operational Framework, Output Examples, Anti-Patterns, Voice Guidance
   - All agents are complete `.agent.md` files with full definitions — no overlay resolution needed
3. When executing the step, the agent's full definition informs behavior:
   - Follow the Operational Framework's process steps
   - Use Output Examples as quality reference
   - Avoid Anti-Patterns listed in the agent definition
   - Apply Voice Guidance (vocabulary always/never use, tone rules)
4. **Inject format context**: Check if the current step's frontmatter contains a `format:` field.
   If present:
   a. Read `_opensquad/core/best-practices/{format}.md` (e.g., `_opensquad/core/best-practices/instagram-feed.md`)
      - If the file does not exist → **WARNING**: "Format '{format}' not found in _opensquad/core/best-practices/. Skipping format injection." Continue without format.
   b. Parse the YAML frontmatter to extract the `name` field
   c. Extract the Markdown body (everything after the YAML frontmatter closing `---`)
   d. Append to the agent's context, before skill instructions:
      ```
      --- FORMAT: {name from frontmatter} ---

      {format file markdown body}
      ```
   If the step has no `format:` field, skip this step entirely (backward compatible).
5. **Inject skill instructions**: Check which skills the agent declares in its frontmatter `skills:`.
   For each non-native skill declared:
   a. Read `skills/{skill}/SKILL.md`
   b. Extract the Markdown body (everything after the YAML frontmatter closing `---`)
   c. Append to the agent's context, after format injection:
      ```
      --- SKILL INSTRUCTIONS ---

      ## {name from frontmatter}
      {SKILL.md markdown body}
      ```
   d. Follow declaration order in the agent's frontmatter for multi-skill injection

   The final agent context composition order is:
   ```
   Agent (.agent.md) → Platform Best Practices → Skill Instructions
   ```

### Task-Based Agent Execution

When an agent's `.agent.md` frontmatter contains a `tasks:` field:

1. **Load task list**: Read the `tasks:` array from the agent's frontmatter
   - Each entry is a relative path to a task file (e.g., `tasks/analyze-source.md`)
   - Tasks execute in the order listed

2. **For each task in sequence**:
   a. Read the task file from the agent's directory (e.g., `squads/{squad-name}/agents/{agent}/tasks/{task}.md`)
   b. Construct the execution prompt:
      - Agent persona + principles (from agent.md — fixed across all tasks)
      - Task description and process (from task file)
      - Task output format (from task file)
      - Task quality criteria and veto conditions (from task file)
      - Input: For the first task, use the step's input. For subsequent tasks, use the previous task's output.
   c. Execute the task (inline or subagent, matching the step's execution mode)
   d. Collect the task output
   e. Check task veto conditions (same enforcement as step veto conditions below)

3. **Final output**: The output of the LAST task in the chain becomes the step's output
   - Apply the Output Path Transformation (Steps 1 and 2: campaign folder mapping + version folder) to the `outputFile` path before saving — this applies regardless of whether the step runs as `execution: inline` or `execution: subagent`
   - Save to the **transformed** outputFile path
   - This is what the next step (or checkpoint) receives

4. **Progress reporting**: For inline execution, announce each task:
   ```
   {icon} {Agent Name} — Task {N}/{total}: {task name}...
   ```

5. **Backward compatibility**: If the agent's frontmatter does NOT contain a `tasks:` field,
   execute the agent monolithically as before (current behavior unchanged).

### Output Path Transformation

Before saving any output file in a step, apply these rules to determine the final path:

#### Step 1 — Map logical output path to the campaign folder

- If the path starts with `squads/{name}/output/`, treat it as a logical Opensquad path and rewrite it into `{project_dir}/`
  - Example: `squads/team/output/internal/brief.md` → `{project_dir}/internal/brief.md`
  - Example: `squads/team/output/final/assets/kv/kv.png` → `{project_dir}/final/assets/kv/kv.png`
  - Example: `squads/team/output/{run_id}/documentos/documento-do-projeto.pdf` → `{project_dir}/documentos/documento-do-projeto.pdf`
- If the path does NOT start with `squads/{name}/output/`, leave it unchanged

#### Step 2 — Insert version folder

Apply to every path that was transformed in Step 1:

0. Stable internal files are not version-foldered. If the transformed path is inside `{project_dir}/internal/`, keep the path as-is.
   - Example: `{project_dir}/internal/roteiro.md` remains `{project_dir}/internal/roteiro.md`
   - Rationale: pipeline steps read and update these markdowns directly, and the user-facing PDF/Notion surface reflects the latest approved state. Version history can be recorded in the document/update history, but the canonical internal file must stay stable.

1. Determine the **output group** = the parent directory of the file (after Step 1 transformation)
   - Example: `{project_dir}/slides/draft.md` → group is `{project_dir}/slides/`
   - Example: `{project_dir}/angles-brief.yaml` → group is `{project_dir}/`

2. Detect existing versions for this group using Bash:
   ```bash
   ls -1 "{project_dir}/{relative-group}/" 2>/dev/null | grep -E '^v[0-9]+$' | sort -V | tail -1
   ```
   - If the command returns a version (e.g. `v2`) → use `v3`
   (Always increment the highest version found, even if lower versions have gaps — e.g. if `v1` and `v3` exist, use `v4`)
   - If the command returns nothing (no versions yet) → use `v1`
   (`{relative-group}` is the portion of the group path after `{project_dir}/`, e.g. `slides/` or empty string for root-level files)

3. Insert the version folder immediately before the filename:
   - `{project_dir}/slides/draft.md` → `{project_dir}/slides/v1/draft.md`
   - `{project_dir}/angles-brief.yaml` → `{project_dir}/v1/angles-brief.yaml`

4. **Cache per group**: within a single step execution, once a version is determined for a group, reuse it for all subsequent files in that same group. Do not re-run the `ls` per file.
   If the same file path is written twice within a step, both writes go to the same versioned path (the second write overwrites the first within that version).

Apply this transformation consistently for every write in this step.

### For each pipeline step:

0. **Update dashboard** — MANDATORY. Write `squads/{name}/state.json` using the Write tool. Always write — it is never wrong to update the dashboard. Use this content:
   ```json
   {
     "squad": "{squad code from squad.yaml}",
     "status": "running",
     "step": {
       "current": {1-based index of this step},
       "total": {total steps in pipeline},
       "label": "{step id or label}"
     },
     "agents": [
       {
         "id": "{agent id}",
         "name": "{agent name}",
         "icon": "{agent icon}",
         "status": "{working if this is the current step's agent, done if already completed, idle otherwise}",
         "desk": {preserve existing desk positions from state.json — do not change col/row}
       }
     ],
     "handoff": {preserve existing handoff object, or null if this is the first step},
     "startedAt": "{ISO timestamp — set on the first step only, then preserve from existing state.json on subsequent steps}",
     "updatedAt": "{ISO timestamp now}"
   }
   ```

   If the current step has supporting agents or skills named in the step instructions, it is allowed and preferred to mark those supporting agents as `working` too. Never write a `running` state where every agent is `idle`.

1. **Pre-Step Input Validation** — MANDATORY. If the step's frontmatter declares an `inputFile`, validate that the input exists before executing the step. Run via Bash tool:
   ```bash
   test -s "{transformed inputFile path}" && echo "VALIDATION:PASS" || echo "VALIDATION:FAIL"
   ```
   - Apply the Output Path Transformation (Step 1: campaign folder mapping) to the `inputFile` path before running the check.
   - If the Bash output contains `VALIDATION:PASS` → proceed to execute the step.
   - If the Bash output contains `VALIDATION:FAIL` → do NOT execute the step. Present to user:
     ```
     ⚠️ Input for {Agent Name} not found: {path}
     The previous step may have failed to produce output.

     1. Skip step and continue
     2. Abort pipeline
     ```
     Wait for user choice before proceeding. No retry — if the input doesn't exist, re-executing this step won't create it. The problem is upstream.
   - If the step does not declare an `inputFile` → skip this validation entirely.
   - Checkpoint steps (`type: checkpoint`) are exempt — they receive input from the user, not from files.

2. **Read the step file** completely: `squads/{name}/pipeline/steps/{step-file}.md`
2b. **Final production lock** — MANDATORY. For step-10 and every later production/distribution step, confirm the previous campaign approval checkpoint contains explicit user approval of the official PDF. If not, stop and present the PDF approval checkpoint again. Never execute final production based only on internal markdowns.
3. **Announce task team** — MANDATORY. Before executing each step, show the user which agents will be used for that task:
   ```text
   Tarefa atual: {step label}
   Agentes envolvidos:
   - {Primary Agent}: {one-line role in this task}
   - {Supporting Agent/Skill if applicable}: {one-line role in this task}
   ```
   Use the step frontmatter `agent` as the primary agent. Add supporting agents/skills when the step instructions mention them, for example: Art Director + image-fetcher/template-designer, Producer + image-ai-generator, Social Manager + instagram-publisher/blotato/canva. For checkpoint steps, list the agent whose output is being reviewed and the user as approver.
   Also include the Client visibility status panel from Initialization step 5f.
4. **Check execution mode** from the step's frontmatter:

#### If `execution: subagent`
- Inform user: `🔍 {Agent Name} is working in the background...`
- Read the step's `model_tier` frontmatter field (if present).
  Valid values: `fast` or `powerful`. If absent or any other value: default to `powerful`.
- **Before building the subagent prompt**: Apply the Output Path Transformation (Step 1: campaign folder mapping + Step 2: version folder) to all output paths referenced in the step file. Store the transformed path(s) in working memory — they will be used both in the prompt and in post-completion verification. Never pass raw paths from the step file to the subagent.
- Use the Task tool to dispatch the step as a subagent:
  - If `model_tier: fast`: use the fastest/lightest model available in your current IDE.
  - If `model_tier: powerful` or absent/invalid: use the default model (no model override needed)
- In the Task prompt, include:
  - The full agent persona from the party CSV
  - The full agent `.agent.md` content (persona, principles, voice guidance, anti-patterns)
  - If the agent has tasks: include ALL task files in order with instructions to execute sequentially, piping output from each task to the next
  - If the agent has no tasks: include the step instructions and operational framework as before
  - The veto conditions from the step file (agent should self-check before completing)
  - The company context
  - The squad memory
  - The **transformed** path to save output (e.g., `{project_dir}/slides/v1/draft.md`)
- Wait for the subagent to complete
- Inform user: `✓ {Agent Name} completed`
- After the subagent saves its output, regenerate the project document with:
  ```bash
  cd "Human Team"
  npm run render-project-document -- "{project_dir}"
  ```
- Validate the document immediately:
  ```bash
  test -s "{project_dir}/documentos/documento-do-projeto.pdf" && echo "DOCUMENT:PASS" || echo "DOCUMENT:FAIL"
  ```
  If validation fails, stop and report the document generation failure instead of advancing.
- If Notion MCP/tools are available, update the matching Notion project page under `Projetos`.
- Proceed to Post-Step Output Validation (below) before advancing.

#### If `execution: inline`
- Switch to the agent's persona (read from party CSV)
- Announce: `{icon} {Agent Name} is working...`
- Follow the step instructions
- Present output directly in the conversation
- Save output to the specified output file — apply the Output Path Transformation (Steps 1 and 2) to the path before writing. Do not write to the raw path from the step file.
- After saving the output, regenerate the project document with:
  ```bash
  cd "Human Team"
  npm run render-project-document -- "{project_dir}"
  ```
- Validate the document immediately:
  ```bash
  test -s "{project_dir}/documentos/documento-do-projeto.pdf" && echo "DOCUMENT:PASS" || echo "DOCUMENT:FAIL"
  ```
  If validation fails, stop and report the document generation failure instead of advancing.
- If Notion MCP/tools are available, update the matching Notion project page under `Projetos`.
- Proceed to Post-Step Output Validation (below) before advancing.

#### If `type: checkpoint`
- Before presenting the checkpoint, regenerate the project document with:
  ```bash
  cd "Human Team"
  npm run render-project-document -- "{project_dir}"
  ```
- Validate the document immediately:
  ```bash
  test -s "{project_dir}/documentos/documento-do-projeto.pdf" && echo "DOCUMENT:PASS" || echo "DOCUMENT:FAIL"
  ```
  If validation fails, stop and report the document generation failure instead of presenting an approval checkpoint.
- Present the checkpoint message to the user
- If the checkpoint requires a choice (numbered list), present options as a numbered list
- **Always include the PDF path** the user needs to review: `{project_dir}/documentos/documento-do-projeto.pdf`. Do not send the user to internal markdown files.
- If Notion MCP/tools are available, also include/update the matching Notion project page under `Projetos`.
- Wait for user input before proceeding
- Save the user's choice/response for the next step
- **If the step frontmatter contains `outputFile`**: after collecting the user's full response,
  apply the Output Path Transformation **Step 1 only** (campaign folder mapping — skip Step 2, version folder) to the `outputFile` path, then write the response to the transformed path using the Write tool before moving to the next step. Checkpoint files are user input captures, not versioned output — Step 2 does not apply here, regardless of the general "every write" rule in the Output Path Transformation section above.
  Use this format:
  ```
  # Research Focus

  **Topic:** {user's typed topic}
  **Time Range:** {selected time range label, e.g., "Últimos 7 dias"}
  **Date:** {today's date in YYYY-MM-DD format}
  ```
  This file is the `inputFile` for the researcher step that follows.

### Post-Step Output Validation

After a step produces output (subagent or inline) and BEFORE Veto Condition Enforcement, the runner MUST validate that the declared output files exist and are non-empty. This is a binary, non-negotiable gate — the runner does NOT proceed on memory or assumption, only on bash output.

**If the step declares an `outputFile`** (single or multiple), run via Bash tool for EACH output file:

```bash
test -s "{transformed outputFile path}" && echo "VALIDATION:PASS" || echo "VALIDATION:FAIL"
```

Use the **stored transformed path** (after Output Path Transformation Steps 1 and 2), not the raw path from the step file.

**Rules:**
- If ALL output files return `VALIDATION:PASS` → proceed to Veto Condition Enforcement.
- If ANY output file returns `VALIDATION:FAIL`:
  1. **Retry once**: re-execute the entire step with the same input and context.
  2. After re-execution, run the validation again for all output files.
  3. If second attempt returns `VALIDATION:PASS` for all files → proceed normally.
  4. If second attempt still has ANY `VALIDATION:FAIL` → present to user:
     ```
     ⚠️ {Agent Name}'s output was not generated: {path}

     1. Retry step
     2. Skip step and continue
     3. Abort pipeline
     ```
     Wait for user choice before proceeding.
- If the step does not declare an `outputFile` (e.g., steps that only produce inline console output) → skip output validation.
- Checkpoint steps (`type: checkpoint`) are exempt — their output is the user's response, not a file.

**IMPORTANT**: Do NOT rely on reading the file with the Read tool to "verify" output. The Read tool returns content that can be misinterpreted. Use ONLY the bash `test -s` command — its output is binary and cannot be hallucinated.

### Veto Condition Enforcement

After an agent completes a step (before moving to the next step):

1. Check if the step file has a `## Veto Conditions` section
2. If yes, evaluate each veto condition against the agent's output:
   - Read the output that was just produced
   - Check each condition (e.g., "slides exceed 30 words", "no CTA", "missing sources")
3. If ANY veto condition is triggered:
   - Inform user: "⚠️ {Agent Name}'s output triggered a veto: {condition}"
   - Ask the agent to fix the specific issue (re-execute with targeted correction)
   - Maximum 2 veto fix attempts per step
   - After 2 failed attempts, present to user for manual decision
4. If no veto conditions triggered: proceed to next step

This creates an internal quality loop BEFORE the reviewer sees the content,
catching obvious issues early and reducing review cycle waste.

### Review Loops

When a step has `on_reject: {step-id}`:
- Track the review cycle count
- If reviewer rejects, go back to the referenced step
- Pass reviewer feedback to the writer agent
- If max_review_cycles reached, present to user for manual decision

### Dashboard Handoff (between steps)

After a step completes output and there IS a next step (MANDATORY):

1. **Write delivering state** — Write `squads/{name}/state.json` with:
   - Current step's agent: `"status": "delivering"`
   - Next step's agent: `"status": "idle"`
   - All other agents unchanged
   - Pipeline `"status": "running"`
   - Add or update `"handoff"`:
     ```json
     "handoff": {
       "from": "{current agent id}",
       "to": "{next agent id}",
       "message": "{one-sentence summary of what was produced, written in the user's language}",
       "completedAt": "{ISO timestamp now}"
     }
     ```
   - `"updatedAt"`: now

2. _(No delay — proceed immediately to working state)_

2. **Write working state** — Write `squads/{name}/state.json` again with:
   - Current agent: `"status": "done"`
   - Next agent: `"status": "working"`
   - Keep the `"handoff"` object from step 1 unchanged
   - `"updatedAt"`: now

### Step Execution Order (Summary)

For reference, the complete execution order for each pipeline step is:

```
0. Dashboard update (state.json)
1. Pre-Step Input Validation (bash gate)
2. Read step file
3. Announce task team
4. Check execution mode and execute (subagent / inline / checkpoint)
5. Post-Step Output Validation (bash gate)
6. Regenerate user-facing project PDF
7. Veto Condition Enforcement
8. Dashboard Handoff (to next step)
```

Steps 1 and 4 are binary bash gates. If either fails, the pipeline does NOT advance — the user is consulted.

### After Pipeline Completion

1. Save final markdown output to `{project_dir}/internal/{filename}.md`
   (The campaign folder was created during initialization — no separate date subfolder needed)
1a. Regenerate the final project document:
   ```bash
   cd "Human Team"
   npm run render-project-document -- "{project_dir}"
   ```
1b. **Update dashboard** — MANDATORY. Write `squads/{name}/state.json` with:
    - `"status": "completed"`
    - All agents: `"status": "done"`
    - `"updatedAt"`: now
    - `"completedAt"`: now
    - `"startedAt"`: preserve from existing `state.json`
    - Keep existing `"handoff"` object

### Post-Completion Cleanup

After writing the final "completed" state to `squads/{name}/state.json`:

1. Add the `completedAt` field (or `failedAt` if status is `failed`) with the current ISO timestamp
2. Copy `state.json` to the campaign folder for permanent history:
   ```bash
   cp squads/{name}/state.json "{project_dir}/state.json"
   ```
3. Wait 10 seconds (so the dashboard can display the completed state)
4. Delete the working copy:
   ```bash
   rm squads/{name}/state.json
   ```

This archives the run state for the `runs` command while keeping the squad root clean.

2. **Update squad memory** — write to BOTH files (runs after Post-Completion Cleanup above):

   ### 2a. Update `memories.md` (living preferences)

   Read `squads/{name}/_memory/memories.md` in full. Then identify candidates from this run: **only explicit user feedback** — approvals with comments, rejections with reasons, direct requests ("prefiro X", "não quero Y"). Never infer preferences.

   For each candidate:
   - If an equivalent memory already exists and is compatible → skip (no duplicate)
   - If an equivalent memory exists but contradicts the new item → replace with the newer version
   - If no equivalent exists → add to the correct semantic section:
     - Writing style choices → `## Estilo de Escrita`
     - Visual/design preferences → `## Design Visual`
     - Content structure choices → `## Estrutura de Conteúdo`
     - Explicit rejections or prohibitions → `## Proibições Explícitas`
     - Squad-specific technical patterns → `## Técnico (específico do squad)`

   **Never write to `memories.md`:**
   - Runner inferences ("usuário parece preferir X")
   - Run scores, review grades, output file paths, topics from past runs

   **Technical routing:** For any technical learning (bugs, workarounds, API behavior):
   - If it affects any squad (Playwright bugs, OS rendering quirks, API limits) → write to the appropriate `_opensquad/core/best-practices/` file instead of `memories.md`
   - If it is specific to this squad's output type or toolchain → add to `## Técnico (específico do squad)` following the dedup rules above

   After applying all candidates, write the updated `memories.md`.

   If no candidates are found (the run had no explicit user feedback), skip writing `memories.md` entirely — do not write an unmodified copy. Always proceed to step 2b regardless.

   ### 2b. Prepend to `runs.md` (reverse-chronological log — newest run first)

   If `squads/{name}/_memory/runs.md` does not exist, create it first with:
   ```markdown
   # Run History: {squad-name}

   | Data | Run ID | Tema | Output | Resultado |
   |------|--------|------|--------|-----------|
   ```
   Then proceed to prepend the new row.

   Read `squads/{name}/_memory/runs.md`. Prepend one new row to the table (immediately after the header row), with:
   - `Data`: today's date in YYYY-MM-DD format
   - `Run ID`: the `run_id` for this execution
   - `Tema`: the topic or user request from this run (1 sentence max)
   - `Output`: brief description of what was generated (e.g., "Carrossel 9 slides", "Thread 7 posts")
   - `Resultado`: one of — `Aprovado` / `Rejeitado` / `Publicado` / `Abortado`

   No other data. Do not add preferences, scores, file paths, or technical notes to `runs.md`.

3. Present completion summary:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ✅ Pipeline complete!
   📄 Documento do projeto: {project_dir}/documentos/documento-do-projeto.pdf
   📄 Apresentacao da campanha: {project_dir}/documentos/apresentacao-da-campanha.pdf
   📁 Pasta da campanha: {project_dir}/
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   What would you like to do?
   ● Run again (new topic)
   ○ Edit this content
   ○ Back to menu
   ```

## Error Handling

- If a subagent fails, retry once. If it fails again, inform the user and offer to skip the step or abort.
- If a step file is missing, inform the user and suggest running `/opensquad edit {squad}` to fix.
- If company.md is empty, stop and redirect to onboarding.
- Never continue past a checkpoint without user input.

## Pipeline State

Track pipeline state in memory during execution:
- Run ID (run_id) — stable execution identifier
- Project folder (project_dir) — the user-facing campaign folder under `Campanhas/`
- Current step index
- Outputs from each completed step (file paths)
- User choices at checkpoints
- Review cycle count
- Start time

This state does NOT persist to disk — it exists only during the current run.
