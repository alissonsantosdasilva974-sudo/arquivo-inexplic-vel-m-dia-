#!/bin/bash
# Cria um episódio novo a partir do padrão do canal.
# Uso: bash padrao/novo_episodio.sh 3 nome_curto caminho/da/narracao.wav
#   -> ep3/ com motor, cenários, scripts e a narração em ep3/input/voiceover_original.wav (somente leitura)
set -e
cd "$(dirname "$0")/.."
N=$1; SLUG=${2:-ep$1}; WAV=$3
[ -z "$N" ] && { echo "uso: bash padrao/novo_episodio.sh N slug [narracao.wav]"; exit 1; }
D=ep$N; [ -e "$D" ] && { echo "$D já existe"; exit 1; }
mkdir -p $D/input $D/work $D/out $D/audio $D/renders
cp -r padrao/web $D/web
cp padrao/render_all.sh padrao/encode.sh padrao/mix.sh padrao/sfx.py padrao/music.py padrao/duck_music.py padrao/ep.conf $D/
sed -i "s/^SLUG=.*/SLUG=$SLUG/" $D/ep.conf
if [ -n "$WAV" ]; then
  cp "$WAV" $D/input/voiceover_original.wav; chmod a-w $D/input/voiceover_original.wav
  DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $D/input/voiceover_original.wav)
  FR=$(python3 -c "print(round($DUR*30))")
  sed -i -e "s/^DUR=.*/DUR=$DUR/" -e "s/^FRAMES=.*/FRAMES=$FR/" $D/ep.conf
fi
cat >> .gitignore <<G
$D/frames/
$D/frames_ref/
$D/frames_body/
$D/frames_ovl/
$D/renders/
$D/work/preview/
$D/audio/*.wav
!$D/audio/sfx_stem.wav
G
echo "Criado $D:"; cat $D/ep.conf
echo "Próximos passos: ver padrao/LEIAME.md"
