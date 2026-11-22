# Robust frame verification for heavy scenes. Renders a 1x reference of every frame, compares it with the 4K frame
# (downscaled) and re-renders any 4K frame that disagrees or is blank, until it matches a fresh reference.
# usage: python3 verify_frames.py <framesDir> <webDir rel. to video/> <nFrames>   (frames must be rendered with NOBLUR=1)
import sys, os, subprocess, shutil, numpy as np
from PIL import Image
from concurrent.futures import ProcessPoolExecutor
D, WEB, N = sys.argv[1], sys.argv[2], int(sys.argv[3])
REF = D + '_ref'
env1 = dict(os.environ, WEBDIR=WEB, VW='1080', VH='1920', DSF='1', JPG='1', NOBLUR='1')
env2 = dict(env1, DSF='2')
def render(outdir, frames, env, workers=4):
    if not frames: return
    procs = [subprocess.Popen(['node', 'video/tools/render9.js', outdir, ','.join(map(str, frames)), str(w), str(workers)], env=env, stdout=subprocess.DEVNULL) for w in range(workers)]
    for p in procs: p.wait()
def small(p): return np.asarray(Image.open(p).convert('RGB').resize((270, 480), Image.BILINEAR), dtype=np.int16)
def check(f):
    a, b = f'{D}/f{f:05d}.jpg', f'{REF}/f{f:05d}.jpg'
    if not os.path.exists(a) or not os.path.exists(b): return f, 'missing'
    A, B = small(a), small(b)
    if A.std() < 6: return f, 'blank'
    if B.std() < 6: return f, 'refblank'
    d = np.percentile(np.abs(A - B), 97)
    return f, ('diff' if d > 28 else None)
os.makedirs(REF, exist_ok=True)
todo_ref = [f for f in range(N) if not os.path.exists(f'{REF}/f{f:05d}.jpg')]
print('rendering reference:', len(todo_ref), flush=True)
render(REF, todo_ref, env1)
for it in range(8):
    with ProcessPoolExecutor(4) as ex: res = list(ex.map(check, range(N), chunksize=50))
    bad = [(f, r) for f, r in res if r]
    print(f'pass {it}: {len(bad)} suspicious', [b for b in bad[:20]], flush=True)
    if not bad: break
    ref_redo = [f for f, r in bad if r in ('refblank', 'diff', 'missing')]
    main_redo = [f for f, r in bad if r in ('blank', 'diff', 'missing')]
    for f in ref_redo: 
        p = f'{REF}/f{f:05d}.jpg'
        if os.path.exists(p): os.remove(p)
    for f in main_redo:
        p = f'{D}/f{f:05d}.jpg'
        if os.path.exists(p): os.remove(p)
    w = 1 if len(main_redo) < 40 else 2           # fewer parallel workers → fewer glitches
    render(REF, ref_redo, env1, w); render(D, main_redo, env2, w)
else:
    print('WARNING: some frames still disagree')
