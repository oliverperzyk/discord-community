#!/usr/bin/env bash
# Deploy the application on the server: pull the tagged image, recreate containers, prune old images.
# Requires IMAGE_TAG in the environment (set by the workflow from github.sha).
set -euo pipefail

cd ~/discord-bot
export IMAGE_TAG="${IMAGE_TAG:?IMAGE_TAG is required}"

docker compose pull
docker compose up -d
docker image prune -f
