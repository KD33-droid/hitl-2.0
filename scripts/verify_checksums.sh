#!/usr/bin/env bash
# Explicit full SHA-256 integrity check for local IBM AML raw files.
#
# This reads every file under data/raw/ibm_aml/ (~46 GB) and is deliberately
# NOT part of the routine pytest suite. Run it only when an integrity check is
# actually needed, e.g. after copying or moving the raw data.
set -euo pipefail

cd "$(dirname "$0")/.."
sha256sum -c data/metadata/checksums.sha256
