# AI use

**Main session (orchestrator):** Claude Opus 5.5 (`claude-opus-5-5`)
**Framework:** Claude Code with subagents (`.claude/agents/`), skills (`.claude/skills/`) and hooks. MCP servers: none yet.

## Agents
| Agent | Model | Does |
|---|---|---|
| researcher | Sonnet 5.5 | Finds and downloads sources: data, GIS layers, model comparisons |
| historian | Opus 5.5 | Checks historical claims, cites sources |
| data-analyst | Sonnet 5.5 | Profiles and queries data; writes `SOURCES.md` |
| coder | Opus 5.5 | Writes code from an approved task in `tasks/` |
| code-tutor | Opus 5.5 | Reviews code Lara writes; doesn't edit it |
| scribe | Sonnet 5.5 | Logs decisions and prompts after each session |

## Processing models
Models that process project data (not the Claude agents above). Each must be approved by Lara first.

| Model | Used for | Approved | Decision |
|---|---|---|---|
| — | — | — | — |

## Process
1. The orchestrator drafts a brief, Lara approves it, then the agent runs. Briefs are logged in `log/PROMPTS.md`.
2. Workstream jobs need an approved task in `tasks/` first.
3. Prompts and dispatched briefs are logged automatically to `log/raw/` (kept local, not in git).
4. Decisions and why: `log/DECISIONS.md`. Diagram: `diagram/decisions.mmd`.
5. Lara reviews `git diff`, then commits and pushes.
