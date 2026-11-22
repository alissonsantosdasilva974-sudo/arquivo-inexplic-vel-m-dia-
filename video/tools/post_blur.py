# Applies the whip-pan transition blur in post (instead of an SVG filter that destabilises Chromium on heavy scenes).
# Reproduces main.js: 4 frames after a hard cut (blur 28→0, dx −60→0) and 2 frames before (blur ~22, dx ~50), in 1080p units.
# Originals are kept as fXXXXX.raw.jpg so the step is idempotent. usage: python3 post_blur.py <framesDir> <webDir rel. to video/> <nFrames>
import sys, os, re, shutil, numpy as np
from PIL import Image, ImageFilter
D, WEB, N = sys.argv[1], sys.argv[2], int(sys.argv[3])
src = open(os.path.join('video', WEB, 'shots.js')).read()
shots = [(float(a), b is not None and b != '') for a, b in re.findall(r'\{ t0: ([0-9.]+),( xf: [0-9.]+,)? draw', src)]
cuts = [t for t, xf in shots if t > 0 and not xf]
FPS = 30; plan = {}
for c in cuts:
    for f in range(int(np.floor(c * FPS)) - 3, int(np.ceil(c * FPS)) + 5):
        if not (0 <= f < N): continue
        T = f / FPS; blur = dx = 0
        if 0 <= T - c < 4 / FPS: k = 1 - (T - c) / (4 / FPS); blur, dx = 28 * k, -60 * k
        elif 0 < c - T <= 2 / FPS: k = 1 - (c - T) / (3 / FPS); blur, dx = 22 * k, 50 * k
        if blur > 0.5: plan[f] = (blur, dx)
def motion(img, sigma, dx):
    sc = img.width / 1080.0; s = sigma * sc
    a = np.asarray(img, dtype=np.float32)
    r = max(1, int(s * 2.2)); xs = np.arange(-r, r + 1); w = np.exp(-xs ** 2 / (2 * s * s)); w /= w.sum()
    out = np.zeros_like(a)
    pad = np.pad(a, ((0, 0), (r, r), (0, 0)), mode='edge')
    for i, wi in zip(xs, w): out += wi * pad[:, r + i:r + i + a.shape[1]]
    out = np.roll(out, int(round(dx * sc)), axis=1)
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(sigma * sc * 0.08))
import subprocess
frames = sorted(plan)
base_env = dict(os.environ, WEBDIR=WEB, VW='1080', VH='1920', DSF='2', JPG='1', NOBLUR='1')
for layer, outd in [('body', D + '_body'), ('overlay', D + '_ovl')]:
    shutil.rmtree(outd, ignore_errors=True); os.makedirs(outd)
    env = dict(base_env, LAYER=layer)
    procs = [subprocess.Popen(['node', 'video/tools/render9.js', outd, ','.join(map(str, frames)), str(w), '2'], env=env, stdout=subprocess.DEVNULL) for w in range(2)]
    for p_ in procs: p_.wait()
def blank(p): return np.asarray(Image.open(p).convert('L').reduce(16), dtype=float).std() < 6
for f in frames:   # body renders are heavy: retry blank ones serially
    for _ in range(5):
        bp = f'{D}_body/f{f:05d}.jpg'
        if os.path.exists(bp) and not blank(bp): break
        subprocess.run(['node', 'video/tools/render9.js', D + '_body', str(f)], env=dict(base_env, LAYER='body'), stdout=subprocess.DEVNULL)
for f, (b, dx) in sorted(plan.items()):
    p, raw = f'{D}/f{f:05d}.jpg', f'{D}/f{f:05d}.raw.jpg'
    if not os.path.exists(raw): shutil.copy(p, raw)
    body = Image.open(f'{D}_body/f{f:05d}.jpg').convert('RGB')
    out = motion(body, b, dx)
    ovl = Image.open(f'{D}_ovl/f{f:05d}.png').convert('RGBA')
    if ovl.size != out.size: ovl = ovl.resize(out.size)
    out.paste(ovl, (0, 0), ovl)
    out.save(p, quality=96)
shutil.rmtree(D + '_body', ignore_errors=True); shutil.rmtree(D + '_ovl', ignore_errors=True)
print('blurred', len(plan), 'transition frames (overlay kept sharp)')
