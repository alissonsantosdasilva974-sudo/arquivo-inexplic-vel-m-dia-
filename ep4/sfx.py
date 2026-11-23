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
# ---------- CUES do episódio 4 ("Toda mentira pesa nos ombros") — cada som ligado a uma ação visível ----------
def rainbed(d, amp=0.05):
    n = int(d * SR); x = rng.standard_normal(n); x = x - np.convolve(x, np.ones(8) / 8, 'same')
    return amp * x / np.abs(x).max() * np.minimum(1, np.minimum(np.arange(n) / SR / 1.0, (d - np.arange(n) / SR) / 1.0))
def creak_lean(d=0.5, amp=0.07):   # coluna/ombro afundando: rangido grave descendente
    n = int(d * SR); t = np.arange(n) / SR; f = 260 - 140 * t / d; return amp * np.sign(np.sin(2*np.pi*np.cumsum(f)/SR)) * np.sin(np.pi * t / d) * (0.6 + 0.4 * rng.random(n))
def boing(amp=0.12):
    n = int(0.3 * SR); t = np.arange(n) / SR; f = 380 - 180 * t / 0.3 + 40 * np.sin(2*np.pi*14*t); return amp * np.exp(-t * 9) * np.sin(2*np.pi*np.cumsum(f)/SR)
def ring(d=1.4, amp=0.08):   # toque de chamada de vídeo
    n = int(d * SR); t = np.arange(n) / SR; return amp * np.sin(2*np.pi*880*t) * (np.sin(2*np.pi*6*t) > 0) * np.exp(-t * 0.8)
def car_pass(d=1.6, amp=0.1):
    n = int(d * SR); t = np.arange(n) / SR; x = np.convolve(rng.standard_normal(n), np.ones(50) / 50, 'same'); return amp * x / np.abs(x).max() * np.sin(np.pi * t / d) ** 2
def honk(amp=0.1):
    n = int(0.25 * SR); t = np.arange(n) / SR; return amp * np.sign(np.sin(2*np.pi*420*t)) * np.minimum(1, t / 0.01) * np.exp(-t * 6)
# 01 gancho: mentira → pescoço entorta
add(0.35, creak_lean(0.5), 'rangido', 'morador conta a mentira e o pescoço entorta')
add(0.2, boing(0.1), 'boing', 'balão "Foi trânsito!"')
# 02–03
add(3.6, boing(0.08), 'boing', 'moradores tortos na calçada'); steps(3.2, 5.7, 7, 0.1, 'passos', 'Polo caminha apontando')
add(9.6, tick(0.12), 'tick', 'sobrancelha de Polo')
# 04 padaria
add(13.1, click(0.16), 'clique', 'balão "Saiu agora!"'); add(15.1, creak_lean(0.9, 0.08), 'rangido', 'padeiro afunda no balcão')
# 05 prefeito
add(17.8, click(0.16), 'clique', 'prefeito no microfone'); add(19.0, creak_lean(1.2, 0.07), 'rangido', 'seguranças seguram o prefeito')
add(18.2, tick(0.12), 'tick', 'microfone')
# 06 Joãozinho
steps(22.5, 27.0, 6, 0.11, 'passos', 'Joãozinho andando curvado'); add(25.0, boing(0.12), 'boing', 'ponto de interrogação')
# 07–09 Antônio
add(28.0, tick(0.1), 'tick', 'ferramenta sendo limpa'); add(33.61 + 0.1, whoosh(0.25, 0.06))
for T0 in (33.9, 35.9, 37.9): add(T0, whoosh(0.5, 0.05), 'vassoura', 'varrendo a entrada')
add(35.55 - 0.08, whoosh(0.2, 0.06)); add(37.5 - 0.08, whoosh(0.2, 0.06))
add(44.5, click(0.16), 'clique', 'Tô ótimo, Polo!'); add(46.7, creak_lean(1.0, 0.09), 'rangido', 'ombro afunda mais um degrau')
add(46.42 - 0.08, whoosh(0.2, 0.06), 'whoosh', 'corte interno em Antônio')
# 10 cochicho + carros
add(49.0, hiss(0.7, 0.05), 'cochicho', 'vizinhos cochichando'); add(50.0, car_pass(1.6, 0.08), 'carro', 'carro passa direto'); add(53.2, car_pass(1.6, 0.08), 'carro', 'outro carro passa direto')
# 11–12 noite chuvosa
add(56.34 - 0.5, rainbed(90.26 - 55.84, 0.05), 'chuva', 'noite chuvosa até a manhã')
steps(56.6, 60.3, 7, 0.1, 'passos', 'Polo na poça'); add(60.9, creak(0.8), 'porta', 'porta da oficina encostada'); add(61.2, hiss(0.4, 0.05), 'luz', 'feixe de luz quente')
# 13–14 ligação
add(64.3, click(0.18), 'clique', 'luz única da oficina'); add(66.0, wind(3.0, 0.03), 'silêncio da oficina', 'oficina vazia')
add(69.64, wind(2.4, 0.04), 'vazio', 'câmera abre na oficina vazia'); add(73.53 - 0.5, ring(1.4, 0.07), 'chamada', 'celular toca')
add(73.53, click(0.2), 'clique', 'corte para a tela do celular'); add(74.9, shimmer(1.2, 0.03), 'brilho', 'filha sorrindo')
# 15 close dramático: cada "tô ótimo" afunda (música corta seco em 77,28; só chuva)
add(79.15, creak_lean(0.7, 0.1), 'rangido', '1º tô ótimo'); add(81.9, creak_lean(0.9, 0.11), 'rangido', '2º tô ótimo'); add(83.5, creak_lean(1.2, 0.12), 'rangido', 'costas dobram mais')
add(77.28, impact(0.2), 'impacto seco', 'música corta seco em Antônio')
# 16 Polo entende
add(85.8, impact(0.22), 'impacto', 'Polo arregala os olhos'); add(87.7, chime(1319, 0.08), 'sino', 'Polo decide')
# 17 três cortes
for T0 in (90.26, 92.25, 94.25): add(T0 + 0.35, boing(0.1), 'boing', 'moradores reagem')
add(92.25 - 0.08, whoosh(0.2, 0.06)); add(94.25 - 0.08, whoosh(0.2, 0.06))
# 18 fila de carros
add(96.5, car_pass(3.4, 0.09), 'trânsito', 'fila de carros'); 
for T0 in (97.4, 98.6, 99.5): add(T0, honk(0.08), 'buzina', 'carros esperando vaga')
# 19–21
add(102.2, tick(0.12), 'tick', 'Polo pergunta'); add(106.4, hiss(0.9, 0.07), 'respiro', 'respirou fundo')
add(106.4, wind(4.5, 0.03), 'alívio', 'tronco endireita')
add(111.45, chime(1568, 0.12), 'sino', 'ficou retinho'); add(111.55, shimmer(1.6, 0.06), 'brilho', 'alívio')
add(DUR - 0.65, whoosh(0.6, 0.1), 'whoosh', 'loop para o início')
# ---------- saída ----------
pk = np.abs(out).max(); print('peak', round(pk, 3))
os.makedirs('audio', exist_ok=True); os.makedirs('work', exist_ok=True)
with wave.open('audio/sfx_stem.wav', 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(out, -1, 1) * 32767).astype('<i2').tobytes())
with open('work/SOUND_PLAN.md', 'w') as f:
    f.write('# Plano de som\n\nNarração original como trilha mestre (só limitador de pico, −1,5 dBFS). Trilha sintetizada (music.py) 20 dB abaixo da voz, subindo nas pausas (duck_music.py). Efeitos sintetizados (sfx.py), cada um ligado a uma ação visível.\n\n| Início (s) | Duração (s) | Som | Propósito |\n|---|---|---|---|\n')
    for c in sorted(cues): f.write(f'| {c[0]:.2f} | {c[1]:.2f} | {c[2]} | {c[3]} |\n')
