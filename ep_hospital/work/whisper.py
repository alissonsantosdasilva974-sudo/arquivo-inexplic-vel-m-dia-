import json, wave, numpy as np, subprocess
from faster_whisper import WhisperModel
raw = subprocess.run(['ffmpeg','-v','error','-i','input/voiceover_original.wav','-ac','1','-ar','16000','-f','s16le','-'],capture_output=True).stdout
a = np.frombuffer(raw, np.int16).astype(np.float32)/32768
m = WhisperModel('small', device='cpu', compute_type='int8')
segs, _ = m.transcribe(a, language='pt', word_timestamps=True, vad_filter=False)
w = [{'word': x.word.strip(), 'start': x.start, 'end': x.end} for s in segs for x in s.words]
json.dump(w, open('work/words.json','w'), ensure_ascii=False); print(len(w), w[:5], w[-3:])
