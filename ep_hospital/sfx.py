# Efeitos sintetizados (24 kHz mono). Biblioteca de sons + "whoosh" automático em cada corte do shots.js.
# Por episódio: edite só a seção CUES no fim (cada som ligado a uma ação visível). Gera audio/sfx_stem.wav e work/SOUND_PLAN.md.
import numpy as np, wave, math, os, re
os.chdir(os.path.dirname(os.path.abspath(__file__)))
DUR = float(re.search(r'DUR=([0-9.]+)', open('ep.conf').read()).group(1))
SR = 24000; N = int(DUR * SR); out = np.zeros(N); rng = np.random.default_rng(21); cues = []
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
def hiss(d=0.5, amp=0.1):
    n = int(d * SR); x = rng.standard_normal(n); x = x - np.convolve(x, np.ones(4) / 4, 'same'); return amp * x / np.abs(x).max() * np.exp(-np.arange(n) / SR * 5)
def impact(amp=0.32):
    n = int(0.5 * SR); t = np.arange(n) / SR; f = 90 * np.exp(-t * 6) + 40
    return amp * np.exp(-t * 7) * np.sin(2*np.pi*np.cumsum(f)/SR) + whoosh(0.5, 0.05)
def click(amp=0.18):
    n = int(0.05 * SR); t = np.arange(n) / SR; return amp * np.exp(-t * 160) * (np.sin(2*np.pi*1800*t) + 0.4 * rng.standard_normal(n))
# ---------- "whoosh" automático em cada corte (exceto cortes com transição cruzada xf) ----------
_src = open('web/shots.js').read()
_cuts = [float(x) for x in re.findall(r'\{ t0: ([0-9.]+), draw', _src)]
_xf = set(float(x) for x in re.findall(r'\{ t0: ([0-9.]+), xf:', _src))
for i, c in enumerate(_cuts):
    if c > 0.5 and c not in _xf: add(c - 0.08, whoosh(0.22, 0.07), 'whoosh de corte' if i == 1 else None, 'borrão de movimento em cada corte')
# ---------- CUES do episódio: Hospital Santa Clara ----------
def rain_bed(d, amp=0.05):
    n = int(d * SR); x = rng.standard_normal(n); x = x - np.convolve(x, np.ones(3) / 3, 'same'); x = np.convolve(x, np.ones(2) / 2, 'same')
    tt = np.arange(n) / SR; return amp * x / np.abs(x).max() * np.minimum(1, np.minimum(tt / 0.4, (d - tt) / 0.4))
def siren(d, amp=0.08):
    n = int(d * SR); tt = np.arange(n) / SR; f = 900 + 300 * np.sign(np.sin(2*np.pi*1.4*tt)); bell = np.sin(2*np.pi*np.cumsum(f)/SR) * (0.6 + 0.4*np.sign(np.sin(2*np.pi*22*tt)))
    return amp * bell * np.minimum(1, np.minimum(tt / 0.1, (d - tt) / 0.3))
def beep(amp=0.07): n = int(0.14 * SR); tt = np.arange(n) / SR; return amp * np.sin(2*np.pi*1046*tt) * np.minimum(1, (0.14 - tt) / 0.02)
def metal(amp=0.25):
    n = int(0.9 * SR); tt = np.arange(n) / SR; s = sum(np.sin(2*np.pi*f*tt) * np.exp(-tt * k) for f, k in [(420, 5), (1130, 7), (2210, 9), (3170, 12)])
    return amp * s / 4 + impact(amp * 0.6)[:n] if n <= int(0.5 * SR) else amp * s / 4 + np.pad(impact(amp * 0.6), (0, n - int(0.5 * SR)))
def heavy(amp=0.22):
    n = int(0.22 * SR); tt = np.arange(n) / SR; return amp * np.exp(-tt * 22) * (np.sin(2*np.pi*60*tt) + 0.5 * rng.standard_normal(n) * np.exp(-tt * 60))
add(0, rain_bed(18.55), 'chuva', 'fachada sob chuva')
add(98.04, rain_bed(DUR - 98.04), 'chuva', 'volta à fachada (loop)')
add(9.58, siren(3.72), 'alarme', 'o alarme de emergência dispara')
add(15.01, impact(0.4), 'chute', 'Polo chuta a porta'); add(15.04, creak(0.5), 'porta enferrujada', 'porta abre rangendo')
for k in range(10): add(22.85 + k * 0.42, step(0.08), 'passos no vidro' if k == 0 else None, 'Polo anda nos cacos')
add(21.92, hiss(0.3, 0.05), 'cacos', 'cacos sob a lanterna')
add(27.12, creak(1.4), 'rangido da cadeira', 'cadeira de rodas cruza sozinha')
add(29.96, click(0.14), 'lanterna', 'Polo aponta a lanterna')
add(34.19, creak(0.8), 'porta vaivém', 'portas da ala cirúrgica')
for k in range(10): add(52.15 + k * 0.5, beep(), 'bipes do monitor' if k == 0 else None, 'monitor liga sozinho')
add(46.87, whoosh(0.9, 0.1), 'sombra', 'sombra passa atrás da cortina')
add(49.84, whoosh(0.45, 0.16), 'cortina', 'Polo puxa a cortina'); add(49.84, flutter(0.5, 0.08))
add(55.75, impact(0.42), 'porta batendo', 'a porta de vidro bate'); add(56.32, click(0.25), 'trava', 'a porta tranca')
add(58.18, click(0.2), 'luzes apagando', 'as luzes apagam'); add(58.22, hiss(0.4, 0.06))
for k in range(5): add(71.36 + k * 0.75, heavy(), 'passos no duto' if k == 0 else None, 'passos pesados no duto de ar')
for k in range(4): add(74.62 + k * 0.45, heavy(0.18))
add(66.3, metal(0.3), 'grade caindo', 'a grade despenca')
add(70.16, impact(0.42), 'queda', 'a criatura cai na frente de Polo'); add(70.24, growl(1.2, 0.1), 'rosnado', 'criatura')
add(72.2, impact(0.35), 'maca', 'Polo empurra a maca'); add(72.2, metal(0.15))
add(73.51, impact(0.4), 'porta arrombada', 'Polo arromba a porta')
steps(74.03, 76.43, 30, 0.12, 'corrida', 'Polo dispara pelo corredor')
for k in range(9): add(90.62 + k * 0.2, click(0.2), 'cliques do botão' if k == 0 else None, 'Polo aperta o botão')
steps(82.35, 85.44, 24, 0.16, 'passos da criatura', 'a coisa corre na direção dele'); add(82.46, growl(3.0, 0.1))
add(88.26, chime(1318, 0.1), 'ding', 'elevador abre')
add(88.13, creak(0.9), 'grade do elevador', 'grade abre')
add(89.71, whoosh(0.4, 0.2), 'puxão', 'a mão agarra o sobretudo'); add(89.77, impact(0.25))
add(92.32, metal(0.22), 'grade fecha', 'grade do elevador fecha')
add(DUR - 0.65, whoosh(0.6, 0.1), 'whoosh', 'loop para o início')
# ---------- saída ----------
pk = np.abs(out).max(); print('peak', round(pk, 3))
os.makedirs('audio', exist_ok=True); os.makedirs('work', exist_ok=True)
with wave.open('audio/sfx_stem.wav', 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(out, -1, 1) * 32767).astype('<i2').tobytes())
with open('work/SOUND_PLAN.md', 'w') as f:
    f.write('# Plano de som\n\nNarração original como trilha mestre (só limitador de pico, −1,5 dBFS). Trilha sintetizada (music.py) 20 dB abaixo da voz, subindo nas pausas (duck_music.py). Efeitos sintetizados (sfx.py), cada um ligado a uma ação visível.\n\n| Início (s) | Duração (s) | Som | Propósito |\n|---|---|---|---|\n')
    for c in sorted(cues): f.write(f'| {c[0]:.2f} | {c[1]:.2f} | {c[2]} | {c[3]} |\n')
