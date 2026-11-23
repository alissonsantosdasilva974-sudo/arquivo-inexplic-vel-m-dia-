# Trilha original sintetizada (48 kHz estéreo), duração lida de ep.conf. Mude BPM, melodia e END por episódio se quiser.
import numpy as np, wave, os, re
os.chdir(os.path.dirname(os.path.abspath(__file__)))
DUR = float(re.search(r'DUR=([0-9.]+)', open('ep.conf').read()).group(1))
SR = 48000; N = int(DUR * SR)
rng = np.random.default_rng(11)
BPM = 100; beat = 60 / BPM
def ks(freq, dur, bright=0.5, amp=0.3):
    n = int(dur * SR); p = max(2, int(SR / freq)); buf = rng.uniform(-1, 1, p) * amp
    out = np.zeros(n); dec = 0.996 - (1 - bright) * 0.004
    for i in range(n):
        out[i] = buf[i % p]; buf[i % p] = dec * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return out
def note(m): return 440 * 2 ** ((m - 69) / 12)
# chord progression C - Am - F - G (ukulele voicings around C4)
CH = [[60, 64, 67, 72], [57, 60, 64, 69], [53, 57, 60, 65], [55, 59, 62, 67]]
BASS = [36, 33, 29, 31]
def render_bar(ci, swing=True, CH=CH, BASS=BASS):
    L = int(4 * beat * SR); l = np.zeros(L); r = np.zeros(L)
    ch = CH[ci]; patt = [0, 2, 1, 3, 2, 1, 3, 2]
    cache = {}
    for k in range(8):
        t = k * beat / 2 + (0.03 if (swing and k % 2) else 0)
        m = ch[patt[k]]
        if m not in cache: cache[m] = ks(note(m), 1.2, 0.6, 0.25)
        s = cache[m]; i = int(t * SR); j = min(L, i + len(s)); pan = 0.35 + 0.3 * (patt[k] / 3)
        l[i:j] += s[:j - i] * (1 - pan); r[i:j] += s[:j - i] * pan
    # bass on beats 1 and 3
    for b in (0, 2):
        n = int(beat * 1.6 * SR); tt = np.arange(n) / SR; f = note(BASS[ci])
        bs = 0.22 * np.exp(-tt * 2.5) * (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt))
        i = int(b * beat * SR); j = min(L, i + n); l[i:j] += bs[:j - i]; r[i:j] += bs[:j - i]
    # shaker on off-beats
    for k in range(8):
        n = int(0.06 * SR); x = rng.standard_normal(n); x = x - np.convolve(x, np.ones(6) / 6, 'same'); x *= np.exp(-np.arange(n) / SR * 60) * (0.05 if k % 2 else 0.025)
        i = int((k * beat / 2) * SR); j = min(L, i + n); l[i:j] += x[:j - i] * 0.8; r[i:j] += x[:j - i]
    return l, r
bars = [render_bar(i) for i in range(4)]
loopL = np.concatenate([b[0] for b in bars]); loopR = np.concatenate([b[1] for b in bars])
# little bell melody layered every other loop
def bell(f, amp=0.08):
    n = int(1.0 * SR); t = np.arange(n) / SR; return amp * np.exp(-t * 4) * (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2.76 * f * t))
mel = [(0, 79), (1.5, 76), (2, 77), (4, 81), (6, 79), (8, 77), (9.5, 76), (10, 74), (12, 74), (13.5, 76), (14, 79)]
melL = np.zeros_like(loopL)
for b, m in mel:
    s = bell(note(m)); i = int(b * beat * SR); j = min(len(melL), i + len(s)); melL[i:j] += s[:j - i]
def tile(sig, n, offset=0):
    out = np.zeros(n); L = len(sig); pos = 0
    while pos < n: k = min(L, n - pos); out[pos:pos + k] = sig[:k]; pos += k
    return out
# ---- Estrutura do ep. 4 (acompanha a história) ----
# 0–56,34 dia cômico (ukulele maior) | 56,34–77,28 noite (menor, esparso) | 77,28–85,74 SILÊNCIO (corte seco: só a voz firme do Antônio)
# 85,74–90,26 pad solitário (Polo entende) | 90,26–111,53 manhã: volta maior com crescendo (fila de carros em 96,24) | 111,53 acorde final resolvido
CHm = [[57, 60, 64, 69], [53, 57, 60, 65], [50, 53, 57, 62], [52, 56, 59, 64]]; BASSm = [33, 29, 26, 28]
barsm = [render_bar(i, False, CHm, BASSm) for i in range(4)]
minL = np.concatenate([b[0] for b in barsm]) * 0.7; minR = np.concatenate([b[1] for b in barsm]) * 0.7
L = np.zeros(N); R = np.zeros(N)
def seg(t0, t1, sl, sr, mel_on=True, g0=1.0, g1=1.0):
    i, j = int(t0 * SR), int(t1 * SR); n = j - i
    l = tile(sl, n); r = tile(sr, n)
    if mel_on:
        ml = tile(melL, n) * (np.arange(n) // len(loopL) % 2); l = l + ml; r = r + ml
    g = np.linspace(g0, g1, n); f = min(int(0.12 * SR), n // 2); g[:f] *= np.linspace(0, 1, f); g[-f:] *= np.linspace(1, 0, f)
    L[i:j] += l * g; R[i:j] += r * g
seg(0, 56.34, loopL, loopR)
seg(56.34, 77.28, minL, minR, False, 1.0, 0.8)
# pad solitário (acordes longos suaves) em 85,74–90,26 + sino quando Polo decide (87,7)
n_pad = int((90.26 - 85.74) * SR); tp = np.arange(n_pad) / SR
pad = sum(np.sin(2 * np.pi * note(m) * tp) for m in (45, 52, 57, 60)) * 0.045 * np.minimum(1, tp / 1.0) * np.minimum(1, (4.52 - tp) / 0.5)
i0 = int(85.74 * SR); L[i0:i0 + n_pad] += pad; R[i0:i0 + n_pad] += pad
bb = bell(note(81), 0.12); i1 = int(87.7 * SR); L[i1:i1 + len(bb)] += bb; R[i1:i1 + len(bb)] += bb
seg(90.26, 111.53, loopL, loopR, True, 0.55, 1.25)
# acorde final resolvido em 111,53 ("ficou retinho") sustentado até o fim
fin = int(111.53 * SR)
hitL = np.zeros(N - fin)
for m in [48, 60, 64, 67, 72, 76]: hitL += ks(note(m), DUR - 111.53 + 0.01, 0.7, 0.22)[:N - fin]
b2 = bell(note(84), 0.14); hitL[:len(b2)] += b2[:len(hitL)]
L[fin:] = hitL; R[fin:] = hitL
# fade in first 0.3 s, out last 0.6 s
fi = int(0.3 * SR); L[:fi] *= np.linspace(0, 1, fi); R[:fi] *= np.linspace(0, 1, fi)
fo = int(0.6 * SR); L[-fo:] *= np.linspace(1, 0, fo); R[-fo:] *= np.linspace(1, 0, fo)
st = np.stack([L, R], 1); st /= np.abs(st).max() * 1.05
with wave.open('audio/music.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype('<i2').tobytes())
print('ok')
