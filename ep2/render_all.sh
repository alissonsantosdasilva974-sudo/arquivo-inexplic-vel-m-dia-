#!/bin/bash
# Renders all 3156 frames of episode 2 at 2x (4K) as JPEG, 4 workers, resumable.
cd "$(dirname "$0")/.."
mkdir -p ep2/frames
pids=()
for w in 0 1 2 3; do WEBDIR=../ep2/web VW=1080 VH=1920 DSF=2 JPG=1 node video/tools/render9.js ep2/frames 0-3155 $w 4 > ep2/renders/w_$w.log 2>&1 & pids+=($!); done
rc=0; for p in "${pids[@]}"; do wait $p || rc=1; done
echo "EXIT $rc; frames: $(ls ep2/frames | grep -c 'jpg$')"
