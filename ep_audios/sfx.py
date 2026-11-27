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
_src = open('web3d/shots3d.js').read()
_cuts = [float(x) for x in re.findall(r'\{ t0: ([0-9.]+), (?:async )?draw', _src)]
_xf = set(float(x) for x in re.findall(r'\{ t0: ([0-9.]+), xf:', _src))
for i, c in enumerate(_cuts):
    if c > 0.5 and c not in _xf: add(c - 0.08, whoosh(0.22, 0.07), 'whoosh de corte' if i == 1 else None, 'borrão de movimento em cada corte')
# ---------- CUES do episódio ----------
def whistle(d=0.5, amp=0.08):
    n = int(d * SR); t = np.arange(n) / SR; f = 2900 + 180 * np.sign(np.sin(2*np.pi*28*t)); return amp * np.sin(2*np.pi*np.cumsum(f)/SR) * np.minimum(1, t/0.02) * np.minimum(1, (d-t)/0.05)
def stretch(d=0.6, amp=0.08, up=True):
    n = int(d * SR); t = np.arange(n) / SR; f = (200 + 500 * t / d) if up else (700 - 500 * t / d); return amp * np.sin(2*np.pi*np.cumsum(f)/SR) * np.sin(np.pi * t / d)
def kick(amp=0.3): n = int(0.15 * SR); t = np.arange(n) / SR; return amp * np.exp(-t * 35) * (np.sin(2*np.pi*80*t) + 0.4 * rng.standard_normal(n) * np.exp(-t * 80))
def yelp(amp=0.07):
    n = int(0.35 * SR); t = np.arange(n) / SR; f = 1400 - 700 * t / 0.35; return amp * np.sin(2*np.pi*np.cumsum(f)/SR) * np.sin(np.pi * t / 0.35)
add(1.8, stretch(0.8), 'estica', 'Freitas cresce no gancho')
add(4.75, whistle(0.45), 'apito', 'Polo apita')
steps(17.5, 17.95, 12, 0.1, 'passos', 'corrida da bicicleta'); add(18.15, whoosh(0.8), 'giro', 'bicicleta'); add(18.92, kick(0.4), 'TUM', 'contato'); add(19.25, impact(0.22), 'queda', 'cai de costas'); add(19.45, hiss(0.5, 0.08), 'rede', 'bola na rede')
def crowd(d, amp=0.05):
    n = int(d * SR); x = np.convolve(rng.standard_normal(n), np.ones(12) / 12, 'same'); return amp * x / np.abs(x).max() * np.sin(np.pi * np.arange(n) / n) ** 0.5
add(0.2, shimmer(2.5, 0.05), 'brilho', 'áudios saindo da caixa')
add(5.6, chime(1568, 0.07), 'plim', 'Polo acena')
add(8.9, click(0.15), 'clique', 'áudio entra na fenda')
steps(11.2, 14.1, 6.5, 0.1, 'passos rápidos', 'Caio correndo')
for t in [17.7, 18.7, 19.3, 20.3, 21.4, 22.3]: add(t, tick(0.12), 'notificação', 'áudio/ícone chega')
add(25.4, chime(988, 0.06), 'plim', 'Depois eu ouço')
for k in range(5): add(26.9 + k * 0.37, click(0.12), 'virada', 'calendário')
for t in [29.9, 30.1, 30.3, 30.5]: add(t, tick(0.1), 'visto', 'ticks azuis')
for k in range(8): add(32.8 + k * 0.6, click(0.08), 'plic', 'áudio cai na caixa')
add(35.0, shimmer(2.5, 0.06), 'brilho', 'caixa cheia')
add(41.5, tick(0.12), 'mensagem', 'Tudo bem, filho'); add(42.5, tick(0.12), 'mensagem', 'Sem pressa')
add(44.3, knock(), 'celular', 'larga o celular'); add(45.0, wind(3.0, 0.05), 'silêncio', 'casa silenciosa')
add(60.4, creak(0.9), 'rangido', 'portas da caixa abrem'); add(60.6, shimmer(2.0, 0.08), 'brilho', 'luz dos áudios')
add(64.9, click(0.12), 'fone', 'coloca o fone')
add(76.6, shimmer(2.6, 0.05), 'brilho', 'áudios em fila')
steps(84.8, 88.2, 7, 0.12, 'corrida', 'Caio corre pra casa')
add(88.3, creak(0.5), 'porta', 'porta abre')
add(97.2, impact(0.2), 'pof', 'botões ESCUTO/PULO')
add(DUR - 0.65, whoosh(0.6, 0.1), 'whoosh', 'loop para o início')
# ---------- saída ----------
pk = np.abs(out).max(); print('peak', round(pk, 3))
os.makedirs('audio', exist_ok=True); os.makedirs('work', exist_ok=True)
with wave.open('audio/sfx_stem.wav', 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(out, -1, 1) * 32767).astype('<i2').tobytes())
with open('work/SOUND_PLAN.md', 'w') as f:
    f.write('# Plano de som\n\nNarração original como trilha mestre (só limitador de pico, −1,5 dBFS). Trilha sintetizada (music.py) 20 dB abaixo da voz, subindo nas pausas (duck_music.py). Efeitos sintetizados (sfx.py), cada um ligado a uma ação visível.\n\n| Início (s) | Duração (s) | Som | Propósito |\n|---|---|---|---|\n')
    for c in sorted(cues): f.write(f'| {c[0]:.2f} | {c[1]:.2f} | {c[2]} | {c[3]} |\n')
