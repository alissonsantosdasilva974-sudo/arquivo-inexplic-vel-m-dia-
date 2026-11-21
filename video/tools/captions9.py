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

chunks=[]; cur=[]
for i,x in enumerate(out):
    nxt = out[i+1] if i+1 < len(out) else None
    cur.append(x)
    txt=' '.join(c['w'] for c in cur)
    openq = x['w'].startswith('"') and x['w'].count('"') == 1
    brk = (x['w'][-1] in '.?!,:' and not openq) or nxt is None or (nxt and nxt['s']-x['e']>0.4) or len(cur)>=3 or (nxt and len(txt+' '+nxt['w'])>17 and not openq)
    if brk and nxt is not None and x['w'].lower().strip('"') == 'já' and len(cur) < 4: brk = False
    if brk: chunks.append(cur); cur=[]
# avoid a lone tiny word at the end of a clause: merge 1-word chunk <=3 chars into previous if previous has <3 words and same clause
m=[]
for c in chunks:
    if m and len(c)==1 and len(c[0]['w'])<=3 and len(m[-1])<3 and m[-1][-1]['w'][-1] not in '.?!,:' and c[0]['s']-m[-1][-1]['e']<0.3: m[-1]=m[-1]+c
    else: m.append(c)
caps=[]
for k,c in enumerate(m):
    nxt = m[k+1][0]['s'] if k+1 < len(m) else 89.6
    caps.append({'s': round(c[0]['s'],3), 'e': round(min(nxt, c[-1]['e']+0.5),3), 'words': c})
open('web9/words.js','w').write('const CAPTIONS = ' + json.dumps(caps, ensure_ascii=False) + ';\n')
print(len(caps),'groups'); print(' | '.join(' '.join(x['w'] for x in c['words']) for c in caps[:40]))
