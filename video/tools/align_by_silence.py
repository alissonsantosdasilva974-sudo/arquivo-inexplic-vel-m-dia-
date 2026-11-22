# Alinha o roteiro do usuário ao áudio sem reconhecimento de fala: usa as pausas reais (silencedetect) e as sílabas.
# uso: python3 align_by_silence.py narracao.wav transcript.txt words.json
import json, re, subprocess, sys, unicodedata
wav, txt, out = sys.argv[1:4]
log = subprocess.run(['ffmpeg', '-hide_banner', '-i', wav, '-af', 'silencedetect=n=-35dB:d=0.12', '-f', 'null', '-'], capture_output=True, text=True).stderr
dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', wav], capture_output=True, text=True).stdout)
ev = [(m.group(1), float(m.group(2))) for m in re.finditer(r'silence_(start|end): ([0-9.]+)', log)]
segs, cur = [], 0.0
for k, v in ev:
    if k == 'start':
        if v - cur > 0.08: segs.append([cur, v])
    else: cur = v
if dur - cur > 0.08 and (not ev or ev[-1][0] == 'end'): segs.append([cur, dur])
words = open(txt).read().split()
num = {'4': 'quatro', '10': 'dez', '3': 'tres'}
def syl(w):
    w = num.get(re.sub(r'\W', '', w), w)
    a = unicodedata.normalize('NFKD', w.lower()).encode('ascii', 'ignore').decode()
    return max(1, len(re.findall(r'[aeiouy]+', a)))
S = [syl(w) + 0.6 for w in words]
punct = [1.0 if re.search(r'[.!?:]$', w) else 0.6 if w.endswith(',') else 0.0 for w in words]
rate = sum(b - a for a, b in segs) / sum(S)
n, m = len(words), len(segs)
INF = 1e18; pre = [0]
for x in S: pre.append(pre[-1] + x)
D = [[INF] * (m + 1) for _ in range(n + 1)]; B = [[0] * (m + 1) for _ in range(n + 1)]; D[0][0] = 0
for j in range(1, m + 1):
    d = segs[j - 1][1] - segs[j - 1][0]
    for k in range(1, n + 1):
        for i in range(max(0, k - 40), k):
            if D[i][j - 1] >= INF: continue
            exp = (pre[k] - pre[i]) * rate
            c = ((d - exp) / max(0.35, (d + exp) / 2)) ** 2 + (0 if k == n else (1 - punct[k - 1]) * 0.35)
            if D[i][j - 1] + c < D[k][j]: D[k][j] = D[i][j - 1] + c; B[k][j] = i
res, k = [None] * n, n
for j in range(m, 0, -1):
    i = B[k][j]; a, b = segs[j - 1]; tot = pre[k] - pre[i]; t = a
    for w in range(i, k):
        e = t + (b - a) * S[w] / tot; res[w] = {'word': words[w], 'start': round(t, 3), 'end': round(e, 3)}; t = e
    k = i
json.dump(res, open(out, 'w'), ensure_ascii=False)
print(f'{m} trechos de fala, {n} palavras, custo {D[n][m]:.2f}')
