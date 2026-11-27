import json, subprocess, numpy as np
from faster_whisper import WhisperModel
raw = subprocess.run(['ffmpeg','-v','error','-i','ep_audios/input/voiceover_original.wav','-ac','1','-ar','16000','-f','f32le','-'],capture_output=True).stdout
a = np.frombuffer(raw, np.float32)
m = WhisperModel('small', device='cpu', compute_type='int8')
segs,_ = m.transcribe(a, language='pt', word_timestamps=True)
out=[]
for s in segs:
    for w in s.words: out.append({'word':w.word.strip(),'start':round(w.start,3),'end':round(w.end,3)})
json.dump(out, open('ep_audios/work/words.json','w'), ensure_ascii=False)
print(len(out), out[:5], out[-5:])
