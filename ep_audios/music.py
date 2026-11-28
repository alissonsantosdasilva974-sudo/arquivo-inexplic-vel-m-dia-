# Trilha original emotiva (sintetizada): piano suave + cordas + reverb. Gera audio/music.wav (48 kHz estéreo).
# Estrutura ligada à história:
#  0–11 s   abertura: piano esparso, mistério (lá menor com nona)
#  11–44 s  rotina: arpejo Am–F–C–G a 72 bpm
#  44–64 s  silêncio da casa: só cordas graves, notas soltas
#  64–84 s  ouvindo os áudios: piano volta com melodia, cordas crescem
#  84–94 s  corrida e abraço: crescendo e resolução em dó maior (Am → C)
#  94–fim   final suave em lá menor, emendando no começo (loop)
import numpy as np, wave, re, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
DUR = float(re.search(r'DUR=([0-9.]+)', open('ep.conf').read()).group(1))
SR = 48000; N = int(DUR * SR) + SR
L = np.zeros(N); R = np.zeros(N); rng = np.random.default_rng(3)
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
def piano(m, dur, amp):
    n = int(min(dur + 1.6, 5) * SR); t = np.arange(n) / SR; f = hz(m)
    s = sum(a * np.sin(2 * np.pi * f * k * t * (1 + 0.0004 * k)) * np.exp(-t * (1.2 + 0.9 * k)) for k, a in [(1, 1), (2, 0.45), (3, 0.22), (4, 0.1), (5, 0.05)])
    rel = np.ones(n); e = int(dur * SR); rel[e:] = np.exp(-np.arange(n - e) / SR * 6) if e < n else 1
    return amp * s * np.minimum(1, t / 0.005) * rel
def strings(m, dur, amp):
    n = int((dur + 0.8) * SR); t = np.arange(n) / SR; f = hz(m); s = np.zeros(n)
    for d in (-0.12, 0, 0.11):
        ph = 2 * np.pi * f * (1 + d / 100) * t + 0.002 * np.sin(2 * np.pi * 5 * t)
        s += sum(np.sin(ph * k) / k * 0.8 ** k for k in range(1, 7))
    env = np.minimum(1, t / 0.9) * np.minimum(1, np.maximum(0, (dur + 0.8 - t)) / 0.8)
    return amp * s / 3 * env
def put(sig, t0, pan=0.0):
    i = int(t0 * SR); k = min(len(sig), N - i)
    if k <= 0: return
    L[i:i + k] += sig[:k] * (1 - pan) * 0.5 * 2 ** 0.5; R[i:i + k] += sig[:k] * (1 + pan) * 0.5 * 2 ** 0.5
BEAT = 60 / 72; BAR = 4 * BEAT
CH = {'Am': [57, 60, 64, 71], 'F': [53, 57, 60, 67], 'C': [48, 55, 60, 64], 'G': [55, 59, 62, 69], 'Dm': [50, 57, 60, 65], 'Em': [52, 55, 59, 66], 'Fmaj': [53, 57, 60, 64]}
BASS = {'Am': 45, 'F': 41, 'C': 36, 'G': 43, 'Dm': 38, 'Em': 40, 'Fmaj': 41}
def arpeggio(ch, t0, amp=0.12, pat=(0, 1, 2, 3, 2, 1, 2, 3)):
    put(piano(BASS[ch], BAR, amp * 1.3), t0, -0.2)
    for i, p in enumerate(pat): put(piano(CH[ch][p] + 12 * (i >= 4 and p == 3), BEAT * 0.9, amp * (0.9 if i % 2 else 1.0)), t0 + i * BEAT / 2, 0.25 * ((i % 3) - 1))
def pad(ch, t0, dur, amp=0.035): [put(strings(m, dur, amp), t0, (i - 1.5) * 0.3) for i, m in enumerate(CH[ch][:3])]; put(strings(BASS[ch], dur, amp * 0.9), t0)
# 0–11: abertura esparsa
for i, (m, tt) in enumerate([(69, 0.2), (72, 1.6), (76, 3.0), (71, 4.4), (69, 6.2), (64, 7.6), (72, 9.0)]): put(piano(m, 1.6, 0.11), tt, 0.3 * ((i % 3) - 1))
pad('Am', 0, 5.3, 0.028); pad('F', 5.3, 5.8, 0.028)
# 11–44: rotina (arpejo)
prog = ['Am', 'F', 'C', 'G']; t = 11.1; i = 0
while t < 43.8: arpeggio(prog[i % 4], t, 0.1 if t < 26 else 0.085); t += BAR; i += 1
for k, tt in enumerate(np.arange(11.1, 43.8, BAR)): pad(prog[k % 4], tt, BAR, 0.02)
# 44–64: silêncio — cordas graves e notas soltas
for k, (ch, tt) in enumerate([('Dm', 44.0), ('Am', 49.0), ('F', 54.0), ('Em', 59.0)]): pad(ch, tt, 5.2, 0.03)
for m, tt in [(76, 46.5), (74, 51.2), (72, 56.0), (71, 58.6), (69, 61.6)]: put(piano(m, 2.2, 0.08), tt, 0.2)
# 64–84: ouvindo — arpejo + melodia
prog2 = ['F', 'G', 'Em', 'Am', 'Dm', 'G', 'C', 'Am']; t = 64.2; i = 0
mel = [(72, 0), (74, 1), (76, 2), (76, 3.5), (74, 4), (72, 5), (71, 6), (72, 7.5)]
while t < 84.0:
    arpeggio(prog2[i % 8], t, 0.085); pad(prog2[i % 8], t, BAR, 0.03 + 0.003 * i)
    for m, b in mel[(i % 2) * 4:(i % 2) * 4 + 4]: put(piano(m + 12, BEAT * 1.2, 0.07), t + (b % 4) * BEAT, -0.15)
    t += BAR; i += 1
# 84–94: corrida e abraço — crescendo e resolução em dó maior
for k, (ch, tt) in enumerate([('F', 84.2), ('G', 86.6), ('C', 89.0), ('G', 91.4)]):
    arpeggio(ch, tt, 0.1 + 0.01 * k); pad(ch, tt, 2.5, 0.045 + 0.006 * k)
for m, tt in [(76, 89.0), (79, 89.9), (84, 90.8), (83, 91.6), (79, 92.4), (76, 93.2)]: put(piano(m, 1.0, 0.09), tt)
# 94–fim: final suave
pad('Am', 94.2, DUR - 94.2, 0.03); [put(piano(m, 2.0, 0.08), tt) for m, tt in [(69, 94.4), (72, 95.6), (76, 96.8), (71, 98.0)]]
# reverb (impulso exponencial, via FFT)
def reverb(x, sec=2.2, wet=0.28):
    n = int(sec * SR); ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR * 3.2); ir[0] = 0; ir /= np.abs(ir).sum() / 6
    m = len(x) + n; F = 1 << (m - 1).bit_length(); y = np.fft.irfft(np.fft.rfft(x, F) * np.fft.rfft(ir, F), F)[:len(x)]
    return x * (1 - wet) + y * wet
L = reverb(L); R = reverb(R)
L = L[:int(DUR * SR)]; R = R[:int(DUR * SR)]
fade = int(0.4 * SR); env = np.ones(len(L)); env[-fade:] = np.linspace(1, 0.3, fade); L *= env; R *= env
pk = max(np.abs(L).max(), np.abs(R).max()); L *= 0.7 / pk; R *= 0.7 / pk
os.makedirs('audio', exist_ok=True)
with wave.open('audio/music.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.stack([L, R], 1) * 32767).astype('<i2').tobytes())
print('ok', round(DUR, 2))
