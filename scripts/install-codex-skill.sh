#!/usr/bin/env bash

set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
source_dir="$repo_root/.codex/skills/black-tonny-frontend-standards"
codex_home="${CODEX_HOME:-$HOME/.codex}"
dest_dir="$codex_home/skills"
target="$dest_dir/black-tonny-frontend-standards"

if [ ! -d "$source_dir" ]; then
  echo "Skill source not found: $source_dir" >&2
  exit 1
fi

mkdir -p "$dest_dir"

if [ -e "$target" ] && [ ! -L "$target" ]; then
  echo "Target already exists and is not a symlink: $target" >&2
  echo "Please move or remove it first, then rerun this script." >&2
  exit 1
fi

ln -sfn "$source_dir" "$target"

echo "Installed Codex skill:"
echo "  $target -> $source_dir"
echo "Restart Codex to pick up the shared repo skill."
