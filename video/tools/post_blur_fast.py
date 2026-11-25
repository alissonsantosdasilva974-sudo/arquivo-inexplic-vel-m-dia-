# Versão rápida do post_blur.py (mesmo plano de quadros e mesmo efeito): borrão horizontal por soma acumulada
# (duas passadas de caixa ≈ gaussiana), O(n) em vez de um laço por deslocamento. Usa as camadas body/ovl já renderizadas.
# usage: python3 post_blur_fast.py <framesDir> <webDir rel. to video/> <nFrames>
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
def box(a, r):
    p = np.pad(a, ((0, 0), (r + 1, r), (0, 0)), mode='edge')
    c = np.cumsum(p, axis=1, dtype=np.float32)
    return (c[:, 2 * r + 1:] - c[:, :-2 * r - 1]) / (2 * r + 1)
def motion(img, sigma, dx):
    sc = img.width / 1080.0; s = sigma * sc
    a = np.asarray(img, dtype=np.float32)
    r = max(1, int(round(s * 1.25)))
    out = box(box(a, r), r)
    out = np.roll(out, int(round(dx * sc)), axis=1)
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(sigma * sc * 0.08))
import subprocess
frames = sorted(plan)
base_env = dict(os.environ, WEBDIR=WEB, VW='1080', VH='1920', DSF='2', JPG='1', NOBLUR='1')
if '--render' in sys.argv:   # renderiza as camadas body/overlay (como o post_blur.py)
    for layer, outd in [('body', D + '_body'), ('overlay', D + '_ovl')]:
        os.makedirs(outd, exist_ok=True)
        procs = [subprocess.Popen(['node', 'video/tools/render9.js', outd, ','.join(map(str, frames)), str(w), '2'], env=dict(base_env, LAYER=layer), stdout=subprocess.DEVNULL) for w in range(2)]
        for p_ in procs: p_.wait()
for f, (b, dx) in sorted(plan.items()):
    p, raw = f'{D}/f{f:05d}.jpg', f'{D}/f{f:05d}.raw.jpg'
    if not os.path.exists(raw): shutil.copy(p, raw)
    out = motion(Image.open(f'{D}_body/f{f:05d}.jpg').convert('RGB'), b, dx)
    ovl = Image.open(f'{D}_ovl/f{f:05d}.png').convert('RGBA')
    if ovl.size != out.size: ovl = ovl.resize(out.size)
    out.paste(ovl, (0, 0), ovl); out.save(p, quality=96)
print('blurred', len(plan), 'transition frames (overlay kept sharp)')
