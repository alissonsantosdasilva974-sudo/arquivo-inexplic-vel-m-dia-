# Align the user's script (wording/punctuation) to ASR word timings and build 2–3 word caption groups.
# usage: python3 align_captions.py words.json transcript.txt out_words.js
import json, sys, re, difflib, unicodedata
words = json.load(open(sys.argv[1])); script = open(sys.argv[2]).read().split()
norm = lambda w: re.sub(r'[^a-z0-9]', '', unicodedata.normalize('NFKD', w.lower()).encode('ascii', 'ignore').decode())
NUM = {'10': 'dez', '3': 'tres', '30': 'trinta'}
A = [NUM.get(norm(w['word']), norm(w['word'])) for w in words]; B = [norm(w) for w in script]
sm = difflib.SequenceMatcher(None, A, B, autojunk=False)
tim = [None] * len(script)
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == 'equal' or (tag == 'replace' and i2 - i1 == j2 - j1):
        for k in range(j2 - j1): tim[j1 + k] = (words[i1 + k]['start'], words[i1 + k]['end'])
    elif tag == 'replace' and i2 > i1:
        s0, e0 = words[i1]['start'], words[i2 - 1]['end']; n = j2 - j1
        for k in range(n): tim[j1 + k] = (s0 + (e0 - s0) * k / n, s0 + (e0 - s0) * (k + 1) / n)
for j in range(len(tim)):   # fill gaps by interpolation
    if tim[j] is None:
        prev = next((tim[k] for k in range(j - 1, -1, -1) if tim[k]), (0, 0)); nxt = next((tim[k] for k in range(j + 1, len(tim)) if tim[k]), (prev[1] + 0.3, prev[1] + 0.6))
        tim[j] = (prev[1], max(prev[1] + 0.05, nxt[0]))
out = [{'w': w, 's': round(t[0], 3), 'e': round(t[1], 3)} for w, t in zip(script, tim)]
unmatched = sum(1 for tag, *_ in sm.get_opcodes() if tag != 'equal')
chunks = []; cur = []
for i, x in enumerate(out):
    nxt = out[i + 1] if i + 1 < len(out) else None
    cur.append(x); txt = ' '.join(c['w'] for c in cur)
    openq = x['w'].startswith('"') and x['w'].count('"') == 1
    brk = (x['w'][-1] in '.?!,:' and not openq) or nxt is None or (nxt and nxt['s'] - x['e'] > 0.4) or len(cur) >= 3 or (nxt and len(txt + ' ' + nxt['w']) > 17 and not openq)
    if brk and nxt is not None and norm(x['w']) in ('ja', 'de', 'a', 'o', 'um', 'uma', 'na', 'no', 'da', 'do', 'pela', 'pro') and len(cur) < 4: brk = False
    if brk: chunks.append(cur); cur = []
m = []
for c in chunks:
    if m and len(c) == 1 and len(c[0]['w']) <= 7 and m[-1][-1]['w'][-1] not in '.?!:' and len(' '.join(x['w'] for x in m[-1] + c)) <= 24 and c[0]['s'] - m[-1][-1]['e'] < 0.35:
        m[-1] = m[-1] + c
    else: m.append(c)
chunks = m
caps = []
for k, c in enumerate(chunks):
    nx = chunks[k + 1][0]['s'] if k + 1 < len(chunks) else None
    caps.append({'s': c[0]['s'], 'e': round(min(nx, c[-1]['e'] + 0.5) if nx else c[-1]['e'] + 0.5, 3), 'words': c})
open(sys.argv[3], 'w').write('const CAPTIONS = ' + json.dumps(caps, ensure_ascii=False) + ';\n')
print(len(out), 'words,', len(caps), 'captions; non-equal opcodes:', unmatched)
print(' | '.join(' '.join(x['w'] for x in c['words']) for c in caps))
