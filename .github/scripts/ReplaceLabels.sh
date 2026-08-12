#!/usr/bin/env bash
# Replace all issue labels in a GitHub repository using the gh CLI.
# Edit the LABELS array below, then run: ./ReplaceLabels.sh
set -euo pipefail

REPOSITORY="oliverperzyk/discord-community"

# Flat triplets: name, color, description (repeat).
# Color is a 6-digit hex (with or without '#'). Description may be "".
LABELS=(
	# Name of a label, color (6-digit hex with or without '#'), description.
	"bug" "d73a4a" "Something isn't working"
	"documentation" "0075ca" "Improvements or additions to documentation"
	"duplicate" "cfd3d7" "This issue or pull request already exists"
	"enhancement" "a2eeef" "New feature or request"
	"good first issue" "7057ff" "Good for newcomers"
	"help wanted" "008672" "Extra attention is needed"
	"invalid" "e4e669" "This doesn't seem right"
	"question" "d876e3" "Further information is requested"
	"wontfix" "ffffff" "This will not be worked on"
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
