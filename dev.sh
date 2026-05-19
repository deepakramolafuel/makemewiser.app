#!/bin/bash
# Run the dev server from the repo root, regardless of who clones it.
set -euo pipefail
cd "$(dirname "$0")"
exec npm run dev
