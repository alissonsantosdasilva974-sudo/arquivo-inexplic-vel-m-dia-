# Finds frames with the intermittent Chromium black-bar artifact (seen on blurred transition frames),
# deletes them and re-renders until clean. usage: python3 fix_bars.py <framesDir> <webDir rel. to video/> <nFrames>
import numpy as np, sys, os, subprocess
from PIL import Image
from concurrent.futures import ProcessPoolExecutor
D, WEB, N = sys.argv[1], sys.argv[2], int(sys.argv[3])
def bad(f):
    p = f'{D}/f{f:05d}.jpg'
    if not os.path.exists(p): return True
    a = np.asarray(Image.open(p).convert('L').reduce(8))
    return ((a < 12).mean(axis=1) > 0.45).sum() >= 3
for it in range(6):
    with ProcessPoolExecutor(4) as ex: flags = list(ex.map(bad, range(N), chunksize=40))
    todo = [f for f, b in enumerate(flags) if b]
    print('pass', it, 'bad frames:', todo, flush=True)
    if not todo: break
    for f in todo:
        p = f'{D}/f{f:05d}.jpg'
        if os.path.exists(p): os.remove(p)
    env = dict(os.environ, WEBDIR=WEB, VW='1080', VH='1920', DSF='2', JPG='1')
    subprocess.run(['node', 'video/tools/render9.js', D, ','.join(map(str, todo))], env=env, check=True)
