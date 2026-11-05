#!/bin/bash
# UserPromptSubmit hook: append every prompt to log/raw/<date>_<session>.md.
# Raw log only — never edited by hand. The scribe agent curates from it.
# Must print nothing: stdout from this hook is injected into Claude's context.
# Off unless the local flag file exists (toggle with /log; see .claude/local/).

[ -f "${CLAUDE_PROJECT_DIR:-.}/.claude/local/prompt-log.on" ] || exit 0

input=$(cat)
session=$(echo "$input" | jq -r '.session_id // "unknown"' | cut -c1-8)
prompt=$(echo "$input" | jq -r '.prompt // ""')
transcript=$(echo "$input" | jq -r '.transcript_path // ""')

dir="${CLAUDE_PROJECT_DIR:-.}/log/raw"
mkdir -p "$dir"
file="$dir/$(date +%Y-%m-%d)_${session}.md"

if [ ! -f "$file" ]; then
  {
    echo "# Raw session log — $(date +%Y-%m-%d) — session ${session}"
    echo
    echo "- Transcript: \`${transcript}\`"
    echo
  } > "$file"
fi

{
  echo "## $(date +%H:%M:%S)"
  echo
  echo '```text'
  echo "$prompt"
  echo '```'
  echo
} >> "$file"

exit 0
