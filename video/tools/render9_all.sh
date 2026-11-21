#!/bin/bash
cd "$(dirname "$0")/.."
pids=()
for w in 0 1 2 3; do WEBDIR=web9 VW=1080 VH=1920 node tools/render9.js frames9 0-2687 $w 4 > renders/w9_$w.log 2>&1 & pids+=($!); done
rc=0; for p in "${pids[@]}"; do wait $p || rc=1; done
echo "EXIT $rc; frames: $(ls frames9 | grep -c 'png$')"
