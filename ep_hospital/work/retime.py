# Remapeia tempos da narração antiga (89,76 s) para a nova (102,04 s) palavra por palavra
import json, re, numpy as np
ld = lambda p: json.loads(re.search(r'= (\[.*\]);', open(p).read(), re.S).group(1))
ow = [w for c in ld('work/words_old.js') for w in c['words']]; nw = [w for c in ld('web/words.js') for w in c['words']]
assert len(ow) == len(nw), (len(ow), len(nw))
xo = [0] + [w['s'] for w in ow] + [ow[-1]['e'], 89.76]; xn = [0] + [w['s'] for w in nw] + [nw[-1]['e'], 102.04]
M = lambda t: float(np.interp(t, xo, xn)); r2 = lambda v: f'{v:.2f}'.rstrip('0').rstrip('.')
def sub(p, pats):
    s = open(p).read()
    for pat in pats: s = re.sub(pat, lambda m: m.group(1) + r2(M(float(m.group(2)))), s)
    open(p, 'w').write(s)
sub('web/shots.js', [r'(t0: )([0-9.]+)', r'(T - )([0-9.]+)', r'(comic\(T, )([0-9.]+)'])
s = open('web/shots.js').read().replace('T / 89.76', 'T / 102.04'); open('web/shots.js', 'w').write(s)
s = open('sfx.py').read()
s = s.replace('rain_bed(13.7)', f'rain_bed({r2(M(13.7))})').replace('siren(3.45)', f'siren({r2(M(9.66) - M(6.21))})').replace('DUR - 85.6', f'DUR - {r2(M(85.6))}')
s = re.sub(r'(add\()([0-9]+\.[0-9]+)', lambda m: m.group(1) + r2(M(float(m.group(2)))), s)
s = re.sub(r'(add\()([0-9]+\.[0-9]+)( \+ k)', lambda m: m.group(1) + r2(M(float(m.group(2)))) + m.group(3), s)
s = re.sub(r'steps\(([0-9.]+), ([0-9.]+)', lambda m: f'steps({r2(M(float(m.group(1))))}, {r2(M(float(m.group(2))))}', s)
s = s.replace('add(0.0,', 'add(0.0,'); open('sfx.py', 'w').write(s)
s = open('music.py').read()
def mm(line): return re.sub(r'(?<![\w.])([1-9][0-9]\.[0-9]+)', lambda m: r2(M(float(m.group(1)))), line)
s = '\n'.join(mm(l) if re.search(r'bpm\(tt\)|for a, b, amp|cut = seg|for hit in', l) else l for l in s.split('\n')); open('music.py', 'w').write(s)
print('ok', [round(M(x), 2) for x in [6.21, 45.27, 77.06, 85.58]])
