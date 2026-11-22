# Music bed: ~20 dB under the voice while there is speech, rising ~8 dB in pauses (>=0.35 s). Voice is not altered.
import numpy as np, wave, subprocess, sys
SR = 48000
def rd(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', str(ch), '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, ch)
v = rd('ep2/audio/voice_limited.wav', 1)[:, 0]; m = rd('ep2/audio/music_ep2.wav', 2)
n = min(len(v), len(m)); v = v[:n]; m = m[:n]
# speech activity from a 50 ms RMS envelope
hop = int(0.05 * SR); rms = np.sqrt(np.convolve(v ** 2, np.ones(hop) / hop, 'same'))
db = 20 * np.log10(rms + 1e-9); active = db > -42
# fill speech gaps shorter than 0.35 s (they are not pauses)
gap = int(0.35 * SR); idx = np.flatnonzero(active)
act = np.zeros(n, bool)
if len(idx):
    starts = [idx[0]]; ends = []
    for a, b in zip(idx[:-1], idx[1:]):
        if b - a > gap: ends.append(a); starts.append(b)
    ends.append(idx[-1])
    for a, b in zip(starts, ends): act[a:b + 1] = True
BASE = float(sys.argv[1]) if len(sys.argv) > 1 else -16.5   # dB gain on the music during speech (≈ −20 dB under the voice)
LIFT = 8.0                                                   # extra dB in pauses
g_db = np.where(act, BASE, BASE + LIFT).astype(np.float64)
k = int(0.25 * SR); g_db = np.convolve(np.pad(g_db, (k, k), mode='edge'), np.ones(2 * k + 1) / (2 * k + 1), 'valid')[:n]
out = m * (10 ** (g_db / 20))[:, None]
with wave.open('ep2/audio/music_ducked.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(out, -1, 1) * 32767).astype('<i2').tobytes())
print('speech fraction', round(act.mean(), 3))
