#!/usr/bin/env bash
# Replace all issue labels in a GitHub repository using the gh CLI.
# Edit the LABELS array below, then run: ./ReplaceLabels.sh
set -euo pipefail

REPOSITORY="oliverperzyk/discord-community"

# Flat triplets: name, color, description (repeat).
# Color is a 6-digit hex (with or without '#'). Description may be "".
LABELS=(
	# Name of a label, color (6-digit hex with or without '#'), description.

    # Labels related to dependencies.
    "deps" "000000" "Dependencies"
    "deps/bun" "ddeedd" "Bun"
    "deps/docker" "ddddee" "Docker"
    "deps/docker-compose" "ffddff" "Docker Compose"
    "deps/actions" "ddffdd" "GitHub Actions"

    # Labels related to issues.
    "bug" "ff5555" "Something isn't working, not optimized enough, etc."
    "enhancement" "5555ff" "New feature or request to the codebase or the application itself."
    "documentation" "55ff55" "Improvements or additions to documentation."
    "question" "ddcc55" "Further information is requested."
    "translation" "ff55ff" "Issue related to translations."
)

if (( ${#LABELS[@]} % 3 != 0 )); then
	echo "error: LABELS must be name/color/description triplets (got ${#LABELS[@]} values)" >&2
	exit 1
fi

if ! command -v gh >/dev/null 2>&1; then
	echo "error: gh CLI is required (https://cli.github.com/)" >&2
	exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
	echo "error: not authenticated — run: gh auth login" >&2
	exit 1
fi

echo "Deleting existing labels in ${REPOSITORY}..."
while IFS= read -r name; do
	[[ -z "${name}" ]] && continue
	echo "  - ${name}"
	gh label delete "${name}" --repo "${REPOSITORY}" --yes
done < <(gh label list --repo "${REPOSITORY}" --limit 1000 --json name --jq '.[].name')

echo "Creating labels..."
for ((i = 0; i < ${#LABELS[@]}; i += 3)); do
	name="${LABELS[i]}"
	color="${LABELS[i + 1]#\#}"
	description="${LABELS[i + 2]}"

	if [[ -z "${name}" || -z "${color}" ]]; then
		echo "error: invalid label at index ${i}: name='${name}' color='${color}'" >&2
		exit 1
	fi

	echo "  + ${name} (#${color})"
	args=(label create "${name}" --repo "${REPOSITORY}" --color "${color}" --force)
	if [[ -n "${description}" ]]; then
		args+=(--description "${description}")
	fi
	gh "${args[@]}"
done

echo "Done. Current labels:"
gh label list --repo "${REPOSITORY}" --limit 1000
