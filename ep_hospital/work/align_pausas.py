# Legendas sem reconhecimento de voz: distribui as palavras do roteiro pelos trechos de fala (entre pausas)
import re, json, subprocess, sys
wav, txt, out = 'input/voiceover_original.wav', 'work/transcript.txt', 'web/words.js'
dur = float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',wav],capture_output=True,text=True).stdout)
log = subprocess.run(['ffmpeg','-v','info','-i',wav,'-af','silencedetect=n=-38dB:d=0.18','-f','null','-'],capture_output=True,text=True).stderr
st = [float(x) for x in re.findall(r'silence_start: ([\d.]+)', log)]; en = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', log)]
segs, cur = [], 0.0
for a, b in zip(st, en + [dur] * (len(st) - len(en))):
    if a - cur > 0.05: segs.append((cur, a))
    cur = b
if dur - cur > 0.05: segs.append((cur, dur))
words = open(txt).read().split()
wt = [len(re.sub(r'\W', '', w)) + 1.5 for w in words]; tot = sum(wt); speech = sum(b - a for a, b in segs)
def at(x):  # posição no eixo de fala -> tempo real
    for a, b in segs:
        if x <= b - a: return a + x
        x -= b - a
    return segs[-1][1]
out_w, acc = [], 0.0
for w, k in zip(words, wt):
    s = at(acc / tot * speech); acc += k; e = at(acc / tot * speech - 1e-6)
    out_w.append({'w': w, 's': round(s, 2), 'e': round(e, 2)})
caps, g = [], []
for i, w in enumerate(out_w):
    g.append(w)
    brk = re.search(r'[.,?!…]$', w['w']) or len(g) >= 3 or (i + 1 < len(out_w) and out_w[i + 1]['s'] - w['e'] > 0.15)
    if brk or i == len(out_w) - 1: caps.append({'s': g[0]['s'], 'e': g[-1]['e'], 'words': g}); g = []
open(out, 'w').write('const CAPTIONS = ' + json.dumps(caps, ensure_ascii=False) + ';\n')
print(len(segs), 'trechos de fala,', len(words), 'palavras,', len(caps), 'legendas; fala', round(speech, 1), 's de', dur)
for c in caps[::12]: print(c['s'], ' '.join(w['w'] for w in c['words']))
