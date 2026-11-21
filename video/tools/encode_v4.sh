#!/bin/bash
set -e
cd "$(dirname "$0")/.."
VF="scale=1080:1920:flags=lanczos+accurate_rnd+full_chroma_int,unsharp=3:3:0.3"
COL="-colorspace bt709 -color_primaries bt709 -color_trc bt709"
cd renders
ffmpeg -v error -y -framerate 30 -i ../frames9/f%05d.jpg -vf "$VF" -c:v libx264 -preset slow -tune animation -b:v 3200k -pass 1 -x264-params aq-mode=3 -pix_fmt yuv420p -r 30 -an -f null /dev/null
ffmpeg -v error -y -framerate 30 -i ../frames9/f%05d.jpg -vf "$VF" -c:v libx264 -preset slow -tune animation -b:v 3200k -pass 2 -x264-params aq-mode=3 -profile:v high -pix_fmt yuv420p -r 30 -fps_mode cfr $COL v4_tiktok_video.mp4
ffmpeg -v error -y -framerate 30 -i ../frames9/f%05d.jpg -vf "$VF" -c:v libx264 -preset slow -tune animation -crf 15 -x264-params aq-mode=3 -profile:v high -pix_fmt yuv420p -r 30 -fps_mode cfr $COL v4_hq_video.mp4
cd ..
ffmpeg -v error -y -i renders/v4_tiktok_video.mp4 -i audio/mix_v4_music.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -ar 48000 -movflags +faststart out/ja_volto_v4_tiktok.mp4
ffmpeg -v error -y -i renders/v4_tiktok_video.mp4 -i audio/mix_v4_nomusic.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -ar 48000 -movflags +faststart out/ja_volto_v4_tiktok_sem_musica.mp4
ffmpeg -v error -y -i renders/v4_hq_video.mp4 -i audio/mix_v4_music.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -ar 48000 -movflags +faststart renders/ja_volto_v4_hq.mp4
for f in out/ja_volto_v4_tiktok.mp4 out/ja_volto_v4_tiktok_sem_musica.mp4 renders/ja_volto_v4_hq.mp4; do
  echo "== $f $(stat -c %s $f)"
  ffprobe -v error -show_entries stream=codec_name,width,height,nb_frames,duration -of compact $f
  echo "black: $(ffmpeg -hide_banner -i $f -vf blackdetect=d=0.1:pix_th=0.1 -an -f null - 2>&1 | grep -c black_start) freeze: $(ffmpeg -hide_banner -i $f -vf freezedetect=n=0.001:d=1.5 -an -f null - 2>&1 | grep -c freeze_start)"
  ffmpeg -hide_banner -i $f -af ebur128=peak=true -vn -f null - 2>&1 | grep -A14 Summary | grep -E "I:|Peak:"
done
