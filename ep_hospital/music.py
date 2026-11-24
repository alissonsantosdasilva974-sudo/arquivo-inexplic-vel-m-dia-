# Trilha de suspense original (48 kHz estéreo) para o especial do hospital. Duração lida de ep.conf.
# Drone grave em lá menor com segunda menor, batida de coração que acelera na perseguição, cordas em trêmulo agudo e golpe final.
import numpy as np, wave, os, re
os.chdir(os.path.dirname(os.path.abspath(__file__)))
DUR = float(re.search(r'DUR=([0-9.]+)', open('ep.conf').read()).group(1))
SR = 48000; N = int(DUR * SR); t = np.arange(N) / SR
rng = np.random.default_rng(7)
note = lambda m: 440 * 2 ** ((m - 69) / 12)
def seg(a, b, fa=0.8):  # envelope liga de a até b com rampas suaves
    e = np.clip((t - a) / fa, 0, 1) * np.clip((b - t) / fa, 0, 1); return e
L = np.zeros(N); R = np.zeros(N)
# 1) drone: lá grave + mi + si bemol (tensão), detune lento
for m, a, pan in [(33, 0.30, 0.5), (45, 0.18, 0.3), (52, 0.10, 0.7), (46, 0.06, 0.5)]:
    f = note(m); x = np.sin(2*np.pi*f*t + 0.3*np.sin(2*np.pi*0.07*t)) + 0.4*np.sin(2*np.pi*f*1.003*t)
    x *= a * (0.75 + 0.25*np.sin(2*np.pi*0.11*t + m))
    L += x * (1 - pan); R += x * pan
# 2) batida de coração: lenta no início, acelera de 49 s (passos no duto) até 75 s (o fim)
def bpm(tt): return 60 if tt < 51.84 else (80 if tt < 59.9 else (95 if tt < 69.84 else (130 if tt < 86.08 else 70)))
tt = 0.5
while tt < DUR - 1:
    for k, (off, amp) in enumerate([(0, 0.5), (0.18, 0.32)]):
        i = int((tt + off) * SR); n = int(0.25 * SR); u = np.arange(n) / SR
        h = amp * np.exp(-u * 18) * np.sin(2*np.pi*(55 * np.exp(-u * 4) + 30)*u)
        j = min(N, i + n); L[i:j] += h[:j - i]; R[i:j] += h[:j - i]
    tt += 60 / bpm(tt)
# 3) cordas em trêmulo agudo (cluster) nos momentos de tensão
for a, b, amp in [(24.56, 33.71, 0.05), (41.96, 53.07, 0.05), (59.79, 86.08, 0.08)]:
    e = seg(a, b, 1.2); trem = 0.6 + 0.4*np.sign(np.sin(2*np.pi*11*t))
    for m in [76, 77, 81]: x = np.sin(2*np.pi*note(m)*t + rng.random()*6) * amp * e * trem; L += x*0.6; R += x*0.4
# 4) ar e chiado (ambiente de prédio vazio)
air = np.convolve(rng.standard_normal(N), np.ones(200)/200, 'same'); air = air/np.abs(air).max()*0.05
L += air; R += np.roll(air, 900)
# 5) silêncio antes da porta abrir (75,2–77,0) e golpe grave quando abre a porta do elevador (77,06)
cut = seg(86.17, 87.87, 0.2); L *= 1 - 0.85*cut; R *= 1 - 0.85*cut
for hit in [88.1, 94.38]:
    i = int(hit*SR); n = int(2.5*SR); u = np.arange(n)/SR; h = 0.9*np.exp(-u*1.6)*np.sin(2*np.pi*(40+25*np.exp(-u*3))*u)
    j = min(N, i+n); L[i:j] += h[:j-i]; R[i:j] += h[:j-i]
fi = int(0.3*SR); L[:fi] *= np.linspace(0, 1, fi); R[:fi] *= np.linspace(0, 1, fi)
fo = int(0.6*SR); L[-fo:] *= np.linspace(1, 0, fo); R[-fo:] *= np.linspace(1, 0, fo)
st = np.stack([L, R], 1); st /= np.abs(st).max()*1.05
os.makedirs('audio', exist_ok=True)
with wave.open('audio/music.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype('<i2').tobytes())
print('ok')
