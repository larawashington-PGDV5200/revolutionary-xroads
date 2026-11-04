# Revolution Crossroads

Lara's Parsons data-viz project: Revolutionary War veterans moving west onto ceded Native land,
1763–1840, using the Revolution Crossroads datasets (https://huggingface.co/RevolutionCrossroads).
Plan: `docs/PLAN.md`. Dataset facts and caveats: `docs/DATA.md` (read before any data work).
AI setup: `AI-USE.md`.

## Who writes what
- Lara writes the coached notebooks and the viz code herself. The code-tutor reviews; it never edits her files.
- Agents write only what an approved brief or task names.
- Lara commits and pushes. Agents never run `git commit` or `git push`.

## Orchestrator rules (the main session)
1. **Brief before dispatch.** Draft each subagent brief in the format below and show it to Lara.
   Dispatch only after she approves it, and add it verbatim to `log/PROMPTS.md` under *Agent briefs*.
2. **Task before handoff.** Any workstream job for coder or data-analyst needs an approved
   `tasks/T-NNN-name.md` with **Goal**, **Files**, **Done when** and **Why an agent**.
3. **Model gate.** No ML or LLM model processes project data (NER, embeddings, classifiers,
   LLM labelling) until Lara approves it. First the researcher compares options (Hugging Face,
   Ollama: size, speed, accuracy, licence, runs locally). Then Lara decides, and the choice is
   recorded in `AI-USE.md` and `log/DECISIONS.md`.
4. **End of session.** Run the scribe.

Brief format (keep it short):
```text
Goal: one sentence.
Context: 1–3 lines; point to files instead of restating them.
Do: concrete steps or questions.
Don't: limits (files, writes, downloads, sources).
Output: file path + format.
Report back: what to say when done.
```

## Data
`data/` holds raw → interim → processed. Never edit raw. It is git-ignored.

## Working preferences
- Chicago author-date for citations. Concise, topline answers; ask clarifying questions.
- Viz principles: datavizproject.com formats, Tufte data-ink ratio, stay true to real data dimensions.
- Docs stay short and human-readable: decisions and why, nothing more.
