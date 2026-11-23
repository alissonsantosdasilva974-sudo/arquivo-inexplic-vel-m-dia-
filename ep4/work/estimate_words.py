# Estima o tempo de cada palavra SEM Whisper: pausas reais (ffmpeg silencedetect, silences.txt) + sílabas.
# 1) alinha as frases do roteiro às pausas por programação dinâmica; 2) divide cada frase entre as palavras por sílaba.
# usage: python3 estimate_words.py transcript.txt silences.txt words.json DUR
import re, sys, json
tx, sf, out, END = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
sil = [tuple(map(float, l.split())) for l in open(sf) if len(l.split()) == 2]
END_SP = sil[-1][0] if sil and sil[-1][1] >= END - 0.05 else END   # a fala termina onde começa o silêncio final
text = open(tx).read().replace('"', '').replace('…', '.')
# frases = trechos entre pontuação; guardamos as palavras de cada uma
phr = []
for seg in re.split(r'(?<=[,.:?!])\s+', text.strip()):
    w = seg.split()
    if w: phr.append(w)
def syl(w): return max(1, len(re.findall(r'[aeiouáéíóúâêôãõà]+', w.lower())))
S = [sum(syl(w) for w in p) for p in phr]; K = len(phr)
cands = [(a + b) / 2 for a, b in sil if b - a >= 0.2 and 0.5 < (a + b) / 2 < END_SP - 0.4]
rate = (END_SP - sum(b - a for a, b in sil)) / sum(S)
pts = sorted([(c, 0.0) for c in cands] + [(x / 10, 1.2) for x in range(5, int(END_SP * 10) - 4)])
bounds = [0.0] + [p[0] for p in pts] + [END_SP]; pen = [0] + [p[1] for p in pts] + [0]; M = len(bounds)
INF = 1e18; dp = [[INF] * M for _ in range(K + 1)]; bk = [[None] * M for _ in range(K + 1)]; dp[0][0] = 0
for i in range(K):
    for j in range(M):
        if dp[i][j] >= INF: continue
        for k in range(j + 1, min(M, j + 90)):
            if (i < K - 1) == (k == M - 1): continue
            exp = S[i] * rate + 0.12
            c = dp[i][j] + ((bounds[k] - bounds[j] - exp) ** 2) / exp + pen[k]
            if c < dp[i + 1][k]: dp[i + 1][k] = c; bk[i + 1][k] = j
j = M - 1; path = []
for i in range(K, 0, -1): path.append(bounds[j]); j = bk[i][j]
path = path[::-1]
def trim(t, side):   # recua/avança até a borda da fala se o limite cai dentro de uma pausa
    for a, b in sil:
        if a - 0.02 <= t <= b + 0.02: return b if side == 's' else a
    return t
words = []; t0 = 0.0
for p, t1 in zip(phr, path):
    a, b = trim(t0, 's'), trim(t1, 'e')
    if b - a < 0.15: a, b = t0, t1
    tot = sum(syl(w) for w in p); acc = 0
    for w in p:
        s = a + (b - a) * acc / tot; acc += syl(w); e = a + (b - a) * acc / tot
        words.append({'word': w, 'start': round(s, 3), 'end': round(e, 3), 'prob': 1.0})
    t0 = t1
json.dump(words, open(out, 'w'), ensure_ascii=False, indent=1)
print(len(words), 'palavras; última termina em', words[-1]['end'])
