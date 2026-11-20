#!/usr/bin/env bash
# Guarded download helper for the IEEE-CIS Fraud Detection competition data.
#
# Prerequisites (both are USER actions; neither is automated here):
#   1. Accept the competition rules at:
#      https://www.kaggle.com/competitions/ieee-fraud-detection/rules
#   2. Authenticate the Kaggle CLI, e.g. place your token at ~/.kaggle/kaggle.json
#      (chmod 600) or configure the KAGGLE_USERNAME/KAGGLE_KEY environment variables.
#
# Usage:  bash scripts/download_ieee_cis.sh
#
# Raw competition files stay in data/raw/ieee_cis/ and are git-ignored. Never
# commit or redistribute them.
set -euo pipefail

COMPETITION="ieee-fraud-detection"
DEST="data/raw/ieee_cis"

if ! command -v kaggle >/dev/null 2>&1; then
  echo "ERROR: kaggle CLI not found. Install it with: uv tool install kaggle" >&2
  exit 1
fi

if [[ ! -f "$HOME/.kaggle/kaggle.json" ]] && \
   { [[ -z "${KAGGLE_USERNAME:-}" ]] || [[ -z "${KAGGLE_KEY:-}" ]]; }; then
  echo "ERROR: no Kaggle authentication configured (kaggle.json or env vars)." >&2
  echo "Authenticate first; see the prerequisites at the top of this script." >&2
  exit 1
fi

echo "Have you accepted the competition rules at"
echo "  https://www.kaggle.com/competitions/${COMPETITION}/rules"
read -r -p 'Type ACCEPTED to continue: ' confirmation
if [[ "$confirmation" != "ACCEPTED" ]]; then
  echo "Aborted: competition rules were not confirmed." >&2
  exit 1
fi

mkdir -p "$DEST"
kaggle competitions download -c "$COMPETITION" -p "$DEST"
echo "Downloaded into $DEST (git-ignored). Do not commit or redistribute these files."
