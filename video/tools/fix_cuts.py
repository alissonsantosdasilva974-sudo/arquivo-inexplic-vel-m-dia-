# Random Chromium compositing glitches (black OR coloured blocks) appear on blurred transition frames, more often
# under parallel load. For every frame within ±3 of a hard cut: re-render serially and accept only when two independent
# renders agree; otherwise keep re-rendering (up to 6 tries). Also catches any frame whose dark-pixel fraction jumps
# compared with both neighbours. usage: python3 fix_cuts.py <framesDir> <webDir rel. to video/> <nFrames>
import sys, os, re, subprocess, shutil, numpy as np
from PIL import Image
D, WEB, N = sys.argv[1], sys.argv[2], int(sys.argv[3])
src = open(os.path.join('video', WEB, 'shots.js')).read()
cuts = [float(x) for x in re.findall(r'\{ t0: ([0-9.]+), draw', src)]
cand = {f for c in cuts if c > 0 for f in range(round(c * 30) - 3, round(c * 30) + 4) if 0 <= f < N}
load = lambda p: np.asarray(Image.open(p).convert('RGB').reduce(4), dtype=np.int16)
dark = lambda p: float((np.asarray(Image.open(p).convert('L').reduce(8)) < 14).mean())
dk = [dark(f'{D}/f{f:05d}.jpg') for f in range(N)]
for f in range(1, N - 1):
    if dk[f] - max(dk[f - 1], dk[f + 1]) > 0.03: cand.add(f)
frames = sorted(cand)
print(len(frames), 'frames to verify', flush=True)
env = dict(os.environ, WEBDIR=WEB, VW='1080', VH='1920', DSF='2', JPG='1')
tmp = D + '_verify'
def render(f):
    shutil.rmtree(tmp, ignore_errors=True)
    subprocess.run(['node', 'video/tools/render9.js', tmp, str(f)], env=env, check=True, stdout=subprocess.DEVNULL)
    return f'{tmp}/f{f:05d}.jpg'
replaced = 0
for f in frames:
    cur = f'{D}/f{f:05d}.jpg'
    for attempt in range(6):
        new = render(f)
        diff = np.percentile(np.abs(load(cur) - load(new)), 99.5)
        if diff < 40: break
        shutil.copy(new, cur); replaced += 1
    else: print('WARNING: frame', f, 'never stabilised', flush=True)
shutil.rmtree(tmp, ignore_errors=True)
print('replaced', replaced, 'glitched renders')
