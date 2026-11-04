#!/bin/bash
# PreToolUse hook (Agent): append every dispatched subagent brief, verbatim, to log/raw/.
# A safety net; the approved copy lives in log/PROMPTS.md. Prints nothing, never blocks.

input=$(cat)
agent=$(echo "$input" | jq -r '.tool_input.subagent_type // "general-purpose"')
brief=$(echo "$input" | jq -r '.tool_input.prompt // ""')

dir="${CLAUDE_PROJECT_DIR:-.}/log/raw"
mkdir -p "$dir"
file="$dir/$(date +%Y-%m-%d)_agent-briefs.md"

{
  echo "## $(date +%H:%M:%S) — ${agent}"
  echo
  echo '```text'
  echo "$brief"
  echo '```'
  echo
} >> "$file"

exit 0
