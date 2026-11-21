# Builds web/words.js: caption groups with word timings (audio timing, script wording).
import json, math
w = json.load(open('work/words.json'))
out = [{'w': x['word'], 's': x['start'], 'e': x['end']} for x in w]
# replace sequences to match the user's script (TTS read the script; ASR variants fixed)
REPL = [
  (['volta.'], ['volta!']), (['10'], ['dez']), (['falou,', 'já', 'volto.'], ['falou:', 'já', 'volto!']),
  (['olhou', 'para', 'a', 'porta'], ['olhou', 'pra', 'porta']), (['falou,', 'esse'], ['falou:', 'esse']),
  (['passar.', 'E'], ['passar,', 'e']), (['tava', 'o', 'Polo'], ['estava', 'o', 'Polo']), (['acenando.'], ['acenando!']),
  (['braços', 'e'], ['braços...', 'e']), (['com', 'quem', 'disse,'], ['como', 'quem', 'diz:']),
  (['dizia', 'já', 'volto.'], ['dizia', '"já', 'volto"!']), (['brincou,', 'já', 'volto.'], ['brincou:', 'já', 'volto!']), (['gritou,', 'já', 'volto.'], ['gritou:', 'já', 'volto!']),
  (['inteiro.'], ['inteiro!']), (['riu.', 'Já'], ['riu:', 'já']), (['volto,', 'já', 'volto.'], ['volto,', 'já', 'volto!']),
  (['baixinho,', 'já', 'volto.'], ['baixinho:', 'já', 'volto...']), (['volto...', 'E'], ['volto...', 'e']),
  (['sorridente.', 'Já', 'voltei.'], ['sorridente:', 'já', 'voltei!']), (['pão', 'tava'], ['pão', 'estava']), (['pedra.', 'E'], ['pedra,', 'e']),
  (['padeira,', 'que', 'tinha', 'falado,', 'já', 'era,', 'tava'], ['padeira', 'que', 'tinha', 'falado', '"já', 'era"', 'estava']),
  (['passado.'], ['passado!']), (['disse,', 'já', 'volto'], ['disse', '"já', 'volto"']), (['Comenta.', 'Volto'], ['Comenta', 'VOLTO']),
]
for old, new in REPL:
    for i in range(len(out) - len(old) + 1):
        if [x['w'] for x in out[i:i+len(old)]] == old:
            seg = out[i:i+len(old)]; s0, e0 = seg[0]['s'], seg[-1]['e']
            if len(new) == len(old): rep = [{'w': n, 's': o['s'], 'e': o['e']} for n, o in zip(new, seg)]
            else:
                rep = []; d = (e0 - s0) / len(new)
                for k, n in enumerate(new): rep.append({'w': n, 's': round(s0 + k*d, 3), 'e': round(s0 + (k+1)*d, 3)})
            out[i:i+len(old)] = rep; break
    else: raise SystemExit(f'not found: {old}')
cl = []; cur = []
for i, x in enumerate(out):
    cur.append(x); nxt = out[i+1] if i+1 < len(out) else None
    if x['w'][-1] in '.?!,:' or nxt is None or nxt['s'] - x['e'] > 0.45: cl.append(cur); cur = []
merged = []
for c in cl:
    if merged and len(' '.join(x['w'] for x in merged[-1])) <= 12 and c[0]['s'] - merged[-1][-1]['e'] < 0.7 and len(' '.join(x['w'] for x in merged[-1] + c)) <= 30:
        merged[-1] = merged[-1] + c
    else: merged.append(c)
chunks = []
for c in merged:
    L = len(' '.join(x['w'] for x in c)); n = math.ceil(L / 30)
    if n <= 1: chunks.append(c); continue
    target = L / n; part = []; acc = 0
    for x in c:
        openq = part and part[-1]['w'].startswith('"') and part[-1]['w'].count('"') == 1
        if part and not openq and acc + len(x['w']) / 2 > target and acc >= target * 0.6: chunks.append(part); part = []; acc = 0
        part.append(x); acc += len(x['w']) + 1
    chunks.append(part)
caps = []
for k, c in enumerate(chunks):
    nxt = chunks[k+1][0]['s'] if k+1 < len(chunks) else 89.6
    caps.append({'s': round(c[0]['s'], 3), 'e': round(min(nxt, c[-1]['e'] + 0.6), 3), 'words': c})
open('web/words.js', 'w').write('const CAPTIONS = ' + json.dumps(caps, ensure_ascii=False) + ';\n')
print(len(caps), 'groups'); [print(f"{c['s']:6.2f}  " + ' '.join(x['w'] for x in c['words'])) for c in caps]
