#!/bin/bash
# Render 4K (2x) em JPEG com 4 processos, retomável. Depois: verificação contra referência 1x e desfoque das transições em pós.
cd "$(dirname "$0")"; EP=$(basename "$PWD"); source ep.conf; cd ..
mkdir -p $EP/frames $EP/renders
# quadros antigos (de outro roteiro/áudio/cenas) seriam reaproveitados e sairiam misturados: apague-os se algo mudou
F1=$(ls $EP/frames/f[0-9][0-9][0-9][0-9][0-9].raw.jpg 2>/dev/null | head -1); [ -z "$F1" ] && F1=$(ls $EP/frames/f*.jpg 2>/dev/null | head -1)
if [ -n "$F1" ] && [ -n "$(find $EP/web $EP/input -newer "$F1" -type f -print -quit)" ]; then echo "AVISO: web/ ou input/ mais novos que os quadros de $EP/frames. Apague os quadros antes de renderizar."; exit 1; fi
L=$((FRAMES-1)); pids=()
for w in 0 1 2 3; do WEBDIR=../$EP/web VW=1080 VH=1920 DSF=2 JPG=1 NOBLUR=1 node video/tools/render9.js $EP/frames 0-$L $w 4 > $EP/renders/w_$w.log 2>&1 & pids+=($!); done
rc=0; for p in "${pids[@]}"; do wait $p || rc=1; done
python3 video/tools/verify_frames.py $EP/frames ../$EP/web $FRAMES || rc=1
python3 video/tools/post_blur.py $EP/frames ../$EP/web $FRAMES || rc=1
echo "EXIT $rc; frames: $(ls $EP/frames | grep -c '^f[0-9]*\.jpg$') de $FRAMES"
