#!/bin/bash
# Renders frames 0..2687 with 4 parallel workers; resumable.
cd "$(dirname "$0")/.."
pids=()
for w in 0 1 2 3; do node tools/render.js frames 0-2687 $w 4 > renders/worker$w.log 2>&1 & pids+=($!); done
rc=0; for p in "${pids[@]}"; do wait $p || rc=1; done
echo "EXIT $rc; frames: $(ls frames | grep -c 'png$')"
