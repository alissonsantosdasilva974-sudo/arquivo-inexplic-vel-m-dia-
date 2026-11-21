# Synthesizes an SFX stem (24 kHz mono, same length as the narration). Voice is never touched.
import numpy as np, wave
SR = 24000; N = int(89.6 * SR)
out = np.zeros(N); rng = np.random.default_rng(7)
def add(t, sig):
    i = int(t * SR); j = min(N, i + len(sig)); out[i:j] += sig[:j - i]
def env(n, a=0.002, d=0.05):
    t = np.arange(n) / SR; return np.minimum(1, t / a) * np.exp(-t / d)
def tick(freq=2600, d=0.012, amp=0.25):
    n = int(0.08 * SR); t = np.arange(n) / SR
    return amp * env(n, 0.0005, d) * (np.sin(2*np.pi*freq*t) + 0.5*rng.standard_normal(n))
def clunk(amp=0.35):
    n = int(0.35 * SR); t = np.arange(n) / SR
    return amp * env(n, 0.001, 0.08) * (np.sin(2*np.pi*880*t) + 0.6*np.sin(2*np.pi*1320*t) + 0.3*np.sin(2*np.pi*220*t))
def whoosh(dur, amp=0.18):
    n = int(dur * SR); x = rng.standard_normal(n); k = np.ones(30) / 30
    x = np.convolve(x, k, 'same'); w = np.sin(np.pi * np.arange(n) / n) ** 2
    return amp * x * w / np.abs(x).max()
def thud(amp=0.5):
    n = int(0.25 * SR); t = np.arange(n) / SR
    f = 140 * np.exp(-t * 12) + 60
    return amp * env(n, 0.001, 0.05) * np.sin(2*np.pi*np.cumsum(f)/SR) + tick(1800, 0.006, 0.2)[:n] if n <= len(tick()) else amp * env(n, 0.001, 0.05) * np.sin(2*np.pi*np.cumsum(f)/SR)
def rumble(dur, amp=0.25):
    n = int(dur * SR); x = np.cumsum(rng.standard_normal(n)); x -= np.convolve(x, np.ones(800)/800, 'same')
    w = np.sin(np.pi * np.arange(n) / n); return amp * w * x / np.abs(x).max()
cues = []
for i in range(5): add(11.2 + i*0.22, tick()); cues.append((11.2+i*0.22, 0.08, 'tique', 'relógio de parede: 5 minutos'))
add(12.45, whoosh(0.9, 0.1)); cues.append((12.45, 0.9, 'whoosh leve', 'ponteiro gira uma hora'))
add(40.9, rumble(1.3)); cues.append((40.9, 1.3, 'ronco grave', 'relógio surge do chão'))
for c in [46.88, 52.82, 59.88, 60.40, 60.94]: add(c, clunk()); cues.append((c, 0.35, 'clunk metálico', 'ponteiro salta após "já volto"'))
add(56.76, whoosh(1.0)); cues.append((56.76, 1.0, 'whoosh', 'passa um dia inteiro'))
# accelerating ticks during the crazy spin
t = 64.94; gap = 0.18
while t < 68.25: add(t, tick(2400, 0.008, 0.18)); t += gap; gap = max(0.035, gap * 0.9)
add(68.3, clunk(0.4)); cues.append((64.94, 3.4, 'tiques acelerando + clunk final', 'relógio enlouquece'))
add(65.2, whoosh(3.0, 0.12))
for c in [74.97, 75.45]: add(c, thud()); cues.append((c, 0.25, 'toc grave', 'pão duro como pedra'))
add(88.15, whoosh(0.45, 0.08)); cues.append((88.15, 0.45, 'swish', 'placa vira para VOLTO'))
def bell(amp=0.3):
    n = int(1.4 * SR); t = np.arange(n) / SR
    return amp * np.exp(-t * 3) * (np.sin(2*np.pi*660*t) + 0.5*np.sin(2*np.pi*1320*t*1.01) + 0.25*np.sin(2*np.pi*1980*t))
def engine(dur, amp=0.16):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 55 + 25 * np.sin(np.pi * t / dur)
    x = np.sign(np.sin(2*np.pi*np.cumsum(f)/SR)) * 0.5 + 0.3 * rng.standard_normal(n)
    x = np.convolve(x, np.ones(40)/40, 'same'); w = np.sin(np.pi * np.arange(n) / n) ** 1.5
    return amp * w * x / np.abs(x).max()
add(42.05, bell()); cues.append((42.05, 1.4, 'sino (BLÉM!)', 'relógio termina de surgir'))
add(25.6, engine(2.2)); cues.append((25.6, 2.2, 'motor (VRUUUM)', 'ônibus passa'))
add(34.2, engine(1.4, 0.1)); cues.append((34.2, 1.4, 'motor se afastando', 'ônibus não para'))

import math
def step(amp=0.16):
    n = int(0.09 * SR); t = np.arange(n) / SR
    return amp * np.exp(-t * 55) * (np.sin(2*np.pi*95*t) + 0.5 * rng.standard_normal(n) * np.exp(-t * 120))
def steps(t0, t1, rate, amp=0.14, skip=None):
    k = math.ceil(t0 * rate / math.pi)
    while k * math.pi / rate < t1:
        tt = k * math.pi / rate
        if not (skip and skip(tt)): add(tt, step(amp))
        k += 1
steps(6.85, 7.7, 13); steps(8.7, 10.7, 12); steps(22.3, 25.5, 8, 0.12, skip=lambda tt: math.sin(tt * 1.9) > 0.6)
steps(32.7, 34.7, 16, 0.18); steps(68.7, 71.6, 11); steps(76.4, 78.0, 11)
cues.append((6.85, 30.0, 'passos', 'sincronizados com as caminhadas laterais'))
def doorbell():
    n = int(0.9 * SR); t = np.arange(n) / SR; out_ = np.zeros(n)
    for k, f in enumerate([1568, 1319]):
        i = int(k * 0.16 * SR); tt = t[:n - i]; out_[i:] += 0.12 * np.exp(-tt * 6) * np.sin(2*np.pi*f*tt)
    return out_
add(7.28, doorbell()); cues.append((7.28, 0.9, 'sininho da porta', 'Polo abre a porta da padaria'))
def flutter(dur=0.6, amp=0.12):
    n = int(dur * SR); t = np.arange(n) / SR; x = rng.standard_normal(n)
    x = np.convolve(x, np.ones(12)/12, 'same'); return amp * x / np.abs(x).max() * (0.5 + 0.5 * np.sign(np.sin(2*np.pi*18*t))) * np.exp(-t * 3)
for c in [3.1, 41.0, 52.9, 70.0]: add(c, flutter()); cues.append((c, 0.6, 'asas', 'pombos voam'))
def murmur(dur, amp=0.035):
    n = int(dur * SR); x = rng.standard_normal(n); x = np.convolve(x, np.ones(18)/18, 'same'); x -= np.convolve(x, np.ones(200)/200, 'same')
    t = np.arange(n) / SR; am = 0.6 + 0.4 * np.sin(2*np.pi*0.7*t) * np.sin(2*np.pi*1.3*t + 1)
    w = np.minimum(1, np.minimum(t / 0.8, (dur - t) / 0.8)); return amp * x / np.abs(x).max() * am * w
add(39.6, murmur(74.0 - 39.6)); cues.append((39.6, 34.4, 'burburinho da praça', 'ambiente'))
def chirp(amp=0.05):
    n = int(0.12 * SR); t = np.arange(n) / SR; f = 3200 + 1800 * t / 0.12
    return amp * np.sin(2*np.pi*np.cumsum(f)/SR) * np.sin(np.pi * t / 0.12)
for a0, a1 in [(0.2, 4.0), (8.7, 10.7), (17.1, 22.3), (76.1, 79.6)]:
    tt = a0
    while tt < a1 - 0.3:
        add(tt, chirp()); add(tt + 0.15, chirp(0.04)); tt += 0.9 + rng.random() * 1.2
cues.append((0.2, 0, 'passarinhos', 'ambiente das ruas'))

pk = np.abs(out).max(); print('sfx peak', pk)
pcm = (np.clip(out, -1, 1) * 32767).astype('<i2')
with wave.open('audio/sfx_v3_stem.wav', 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
with open('work/SOUND_PLAN_v3.md', 'w') as f:
    f.write('# Plano de som\n\nNarração original intocada como trilha mestre. Efeitos sintetizados localmente (tools/sfx.py), mixados ~14–20 dB abaixo da voz, só em ações visíveis. Trilha sintetizada à parte (tools/music.py). Voz com limitador de pico autorizado pelo usuário (−1,5 dBFS).\n\n| Início (s) | Duração (s) | Som | Propósito |\n|---|---|---|---|\n')
    for c in sorted(cues): f.write(f'| {c[0]:.2f} | {c[1]:.2f} | {c[2]} | {c[3]} |\n')
