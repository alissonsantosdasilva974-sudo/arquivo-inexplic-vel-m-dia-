#!/bin/bash
# Mixagem: voz (só limitador de pico −1,5 dBFS) + efeitos + trilha abaixada. Saída: audio/mix_music.wav e audio/mix_nomusic.wav a −14 LUFS, pico ≤ −1 dBFS.
# Ordem: python3 EP/sfx.py ; python3 EP/music.py ; bash EP/mix.sh  (o mix.sh roda o duck_music.py)
set -e; cd "$(dirname "$0")"; source ep.conf; mkdir -p audio
ffmpeg -v error -y -i input/voiceover_original.wav -af "alimiter=limit=0.84:level=false" -ar 48000 -ac 1 audio/voice_limited.wav
python3 duck_music.py
for m in music nomusic; do
  if [ $m = music ]; then IN="-i audio/voice_limited.wav -i audio/sfx_stem.wav -i audio/music_ducked.wav"; F="[0]aresample=48000,pan=stereo|c0=c0|c1=c0[v];[1]aresample=48000,pan=stereo|c0=c0|c1=c0[s];[v][s][2]amix=inputs=3:normalize=0:duration=first";
  else IN="-i audio/voice_limited.wav -i audio/sfx_stem.wav"; F="[0]aresample=48000,pan=stereo|c0=c0|c1=c0[v];[1]aresample=48000,pan=stereo|c0=c0|c1=c0[s];[v][s]amix=inputs=2:normalize=0:duration=first"; fi
  J=$(ffmpeg -hide_banner $IN -filter_complex "$F,loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
  g(){ echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
  ffmpeg -v error -y $IN -filter_complex "$F,loudnorm=I=-14:TP=-1.5:LRA=11:linear=true:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset),aresample=48000" -ar 48000 audio/mix_$m.wav
  echo "mix_$m: $(ffmpeg -hide_banner -i audio/mix_$m.wav -af ebur128=peak=true -f null - 2>&1 | grep -A14 Summary | grep -E 'I:|Peak:' | tr -s ' ' | tr '\n' ' ')"
done
