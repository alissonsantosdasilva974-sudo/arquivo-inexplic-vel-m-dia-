# Synthesized SFX for episode 2 (24 kHz mono). Every cue is tied to an on-screen action.
import numpy as np, wave, math
SR = 24000; N = int(105.2 * SR); out = np.zeros(N); rng = np.random.default_rng(21); cues = []
def add(t, sig, label=None, why=None):
    i = int(t * SR); j = min(N, i + len(sig)); out[i:j] += sig[:j - i]
    if label: cues.append((t, len(sig) / SR, label, why))
def env(n, a, d): t = np.arange(n) / SR; return np.minimum(1, t / a) * np.exp(-t / d)
def step(amp=0.14):
    n = int(0.09 * SR); t = np.arange(n) / SR; return amp * np.exp(-t * 55) * (np.sin(2*np.pi*95*t) + 0.5 * rng.standard_normal(n) * np.exp(-t * 120))
def steps(t0, t1, rate, amp=0.14, label='passos', why=''):
    k = math.ceil(t0 * rate / math.pi); first = True
    while k * math.pi / rate < t1:
        add(k * math.pi / rate, step(amp), label if first else None, why if first else None); first = False; k += 1
def knock(): n = int(0.12 * SR); t = np.arange(n) / SR; return 0.35 * np.exp(-t * 40) * (np.sin(2*np.pi*160*t) + 0.6 * rng.standard_normal(n) * np.exp(-t * 90))
def creak(d=0.6):
    n = int(d * SR); t = np.arange(n) / SR; f = 300 + 120 * np.sin(2*np.pi*3*t); return 0.06 * np.sign(np.sin(2*np.pi*np.cumsum(f)/SR)) * np.sin(np.pi * t / d) * (0.6 + 0.4 * rng.random(n))
def chime(f0=1568, amp=0.09):
    n = int(1.2 * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for k, f in enumerate([f0, f0 * 1.26, f0 * 1.5]):
        i = int(k * 0.07 * SR); tt = t[:n - i]; s[i:] += amp * np.exp(-tt * 4) * np.sin(2*np.pi*f*tt)
    return s
def whoosh(d, amp=0.14):
    n = int(d * SR); x = np.convolve(rng.standard_normal(n), np.ones(30) / 30, 'same'); return amp * x / np.abs(x).max() * np.sin(np.pi * np.arange(n) / n) ** 2
def engine(d, amp=0.15):
    n = int(d * SR); t = np.arange(n) / SR; f = 55 + 30 * t / d
    x = np.sign(np.sin(2*np.pi*np.cumsum(f)/SR)) * 0.5 + 0.3 * rng.standard_normal(n); x = np.convolve(x, np.ones(40) / 40, 'same')
    return amp * x / np.abs(x).max() * np.sin(np.pi * np.arange(n) / n) ** 1.2
def growl(d, amp=0.12):
    n = int(d * SR); t = np.arange(n) / SR; x = np.convolve(rng.standard_normal(n), np.ones(60) / 60, 'same')
    return amp * x / np.abs(x).max() * (0.6 + 0.4 * np.sin(2*np.pi*28*t)) * np.sin(np.pi * t / d)
def tick(amp=0.2): n = int(0.06 * SR); t = np.arange(n) / SR; return amp * np.exp(-t * 90) * (np.sin(2*np.pi*2600*t) + 0.5 * rng.standard_normal(n))
def shimmer(d=1.2, amp=0.06):
    n = int(d * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for f in [1760, 2217, 2637, 3520]: s += np.sin(2*np.pi*f*t + rng.random() * 6)
    return amp * s / 4 * np.sin(np.pi * t / d) * (0.5 + 0.5 * np.sin(2*np.pi*9*t))
def flutter(d=0.6, amp=0.1):
    n = int(d * SR); t = np.arange(n) / SR; x = np.convolve(rng.standard_normal(n), np.ones(12) / 12, 'same')
    return amp * x / np.abs(x).max() * (0.5 + 0.5 * np.sign(np.sin(2*np.pi*18*t))) * np.exp(-t * 3)
def wind(d, amp=0.04):
    n = int(d * SR); t = np.arange(n) / SR; x = np.convolve(rng.standard_normal(n), np.ones(120) / 120, 'same')
    return amp * x / np.abs(x).max() * (0.6 + 0.4 * np.sin(2*np.pi*0.3*t)) * np.minimum(1, np.minimum(t / 1, (d - t) / 1))
add(0.0, shimmer(1.2), 'brilho', 'nota brilhando (gancho)')
add(1.2, wind(14.0), 'vento noturno', 'rua escura')
steps(11.9, 14.6, 5, 0.1, 'passos lentos', 'homem de terno vai embora')
add(16.1, chime(1319), 'plim', 'Polo põe o chapéu')
add(17.3, whoosh(0.5, 0.08), 'swish', 'carteira abre')
add(19.6, shimmer(1.4), 'brilho', 'nomes brilhando nas notas')
for i, t in enumerate([24.82, 25.0, 25.18]): add(t, knock(), 'toc toc' if i == 0 else None, 'Polo bate na padaria')
add(26.1, creak(), 'porta rangendo', 'padeiro abre a porta')
steps(36.4, 38.6, 16, 0.16, 'passos correndo', 'padeiro foge com a mala')
add(36.6, flutter(), 'asas', 'pombos voam')
steps(38.6, 40.8, 11, 0.12, 'passos', 'Polo vai ao ponto')
steps(45.0, 46.5, 10, 0.12, 'passos', 'motorista vai embora a pé')
def hiss(d=0.5, amp=0.1):
    n = int(d * SR); x = rng.standard_normal(n); x = x - np.convolve(x, np.ones(4) / 4, 'same'); return amp * x / np.abs(x).max() * np.exp(-np.arange(n) / SR * 5)
add(44.7, hiss(), 'chiado pneumático', 'porta do ônibus abre')
add(43.6, knock() * 0.4, 'toque no volante', 'motorista solta o volante')
add(46.5, engine(3.2), 'motor', 'ônibus segue sozinho')
add(52.2, growl(1.0), 'rosnado', 'cachorro rosna')
add(56.6, flutter(), 'asas', 'pombos voam do relógio')
for k in range(4): add(56.6 + k * 0.5, tick(), 'tique-taque' if k == 0 else None, 'relógio volta a andar')
add(68.6, chime(988, 0.1), 'revelação', 'nota do homem de terno')
steps(70.8, 73.4, 16, 0.16, 'passos correndo', 'Polo corre atrás dele')
add(73.4, wind(12.0), 'vento noturno', 'esquina')
add(84.0, shimmer(1.0, 0.08), 'brilho', 'homem some')
add(85.2, wind(4.0, 0.05), 'vento', 'cidade vazia')
for k in range(4): add(89.75 + k * 0.42, step(0.12), 'passos na estrada' if k == 0 else None, 'alguém chega')
add(93.0, shimmer(1.0, 0.05), 'brilho', 'nota dobrada no bolso')
add(96.5, chime(1568, 0.07), 'plim', 'Polo sorri')
add(104.55, whoosh(0.6, 0.1), 'whoosh', 'loop para o início')
import re as _re
_src = open('ep2/web/shots.js').read()
_cuts = [float(x) for x in _re.findall(r'\{ t0: ([0-9.]+), draw', _src)]
_xf = set(float(x) for x in _re.findall(r'\{ t0: ([0-9.]+), xf:', _src))
for i, c in enumerate(_cuts):
    if c > 0.5 and c not in _xf: add(c - 0.08, whoosh(0.22, 0.07), 'whoosh de corte' if i == 1 else None, 'borrão de movimento em cada corte')
def impact(amp=0.32):
    n = int(0.5 * SR); t = np.arange(n) / SR; f = 90 * np.exp(-t * 6) + 40
    return amp * np.exp(-t * 7) * np.sin(2*np.pi*np.cumsum(f)/SR) + whoosh(0.5, 0.05)
for c, why in [(2.4, 'revelação do homem de terno'), (68.55, 'revelação: nota com a marca do homem'), (84.0, 'homem some')]: add(c, impact(), 'impacto', why)
def click(amp=0.18):
    n = int(0.05 * SR); t = np.arange(n) / SR; return amp * np.exp(-t * 160) * (np.sin(2*np.pi*1800*t) + 0.4 * rng.standard_normal(n))
add(19.6, click(), 'clique', 'placar de notas aparece')
for c in [29.5, 41.9, 51.05, 83.2]: add(c, click() + chime(1175, 0.05)[:int(0.05 * SR)], 'clique do placar', 'placar perde uma nota')
pk = np.abs(out).max(); print('peak', round(pk, 3))
with wave.open('ep2/audio/sfx_stem.wav', 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(out, -1, 1) * 32767).astype('<i2').tobytes())
with open('ep2/work/SOUND_PLAN.md', 'w') as f:
    f.write('# Plano de som — episódio 2\n\nNarração original como trilha mestre (limitador de pico leve, −1,5 dBFS, como autorizado no episódio anterior). Trilha sintetizada (ep2/music_ep2.py) ~18 dB abaixo da voz. Efeitos sintetizados (ep2/sfx_ep2.py), cada um ligado a uma ação visível.\n\n| Início (s) | Duração (s) | Som | Propósito |\n|---|---|---|---|\n')
    for c in sorted(cues): f.write(f'| {c[0]:.2f} | {c[1]:.2f} | {c[2]} | {c[3]} |\n')
