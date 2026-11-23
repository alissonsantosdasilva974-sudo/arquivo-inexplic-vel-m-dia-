# Ep. 4 — "Nessa cidade, toda mentira pesa nos ombros"

Narração: `input/voiceover_original.wav` (113,36 s = 3401 quadros a 30 fps). Roteiro: `work/transcript.txt`.

**Premissa (Polo quer voltar pra casa):** neste episódio Polo não chega mais perto de casa; ele fica mais perto de merecê-la. Contar a verdade pelo Seu Antônio (cena 17) é o gesto que cria o laço com o bairro. O final fica limpo, sem letreiro "A CASA" (decisão do usuário).

**Tempos:** medidos pelas pausas reais do áudio (ffmpeg silencedetect → `work/silences.txt`) + sílabas (`work/estimate_words.py` → `work/words.json` → `web/words.js`). Não havia Whisper (modelo bloqueado no proxy): erro estimado ±0,3 s. Se vier um `words.json` do Whisper, rode de novo `align_captions.py`.

| # | Início | Fim | Cena |
|---|---|---|---|
| 01 | 0:00,00 | 0:03,08 | Morador mente ("Foi trânsito!"), pescoço entorta |
| 02 | 0:03,08 | 0:08,50 | Polo aponta moradores tortos (corte interno 5,7) |
| 03 | 0:08,50 | 0:12,45 | Close: Polo ergue a sobrancelha |
| 04 | 0:12,45 | 0:17,14 | Padaria: padeiro afunda no balcão |
| 05 | 0:17,14 | 0:21,71 | Praça: prefeito e os dois seguranças |
| 06 | 0:21,71 | 0:27,60 | Joãozinho "?" saindo da escola |
| 07 | 0:27,60 | 0:33,61 | Seu Antônio na oficina (lean 12) |
| 08 | 0:33,61 | 0:39,44 | 3 semanas: lean 15 → 24 → 32 |
| 09 | 0:39,44 | 0:48,55 | Polo pergunta, "Tô ótimo!" (corte interno 46,42, lean 37) |
| 10 | 0:48,55 | 0:56,34 | Vizinhos cochicham, carros passam direto |
| 11 | 0:56,34 | 1:00,37 | Noite chuvosa em perspectiva |
| 12 | 1:00,37 | 1:04,45 | Porta encostada, feixe de luz |
| 13 | 1:04,45 | 1:11,23 | Antônio ao telefone, oficina vazia |
| 14 | 1:11,23 | 1:17,31 | Prato na bancada, tela do celular com a filha |
| 15 | 1:17,31 | 1:25,74 | Close: lean 30 → 44 (música corta seco) |
| 16 | 1:25,74 | 1:30,26 | Polo: assustado → decidido |
| 17 | 1:30,26 | 1:36,24 | Padaria, salão, praça (3 cortes de 2 s) |
| 18 | 1:36,24 | 1:40,11 | Aéreo: fila de carros |
| 19 | 1:40,11 | 1:44,37 | "E aí, Seu Antônio… tá tudo bem?" |
| 20 | 1:44,37 | 1:51,53 | Close: lean 38 → 0 |
| 21 | 1:51,53 | 1:53,36 | Antônio reto + Polo tímido (emenda na cena 01) |

**Lean (mecânica central):** `antonioLean(T)` em `web/cast4.js`. O lean cai sempre PARA A FRENTE (sentido do olhar): `ANT()` em `shots.js` inverte o sinal quando ele olha para a esquerda.

**Rig:** `padrao/web/characters2.js` veio da branch `inspiring-archimedes-qi1xc0` (lean, three4, expressões novas). O elenco novo (Antônio, prefeito, segurança, filha, morador) é acrescentado ao `CAST2` em `web/cast4.js`, sem tocar no rig.

**Som:** `sfx.py` (CUES do ep.), `music.py` (dia maior, noite menor, silêncio 77,28–85,74, volta em crescendo, acorde resolvido em 111,53), `mix.sh` → −14 LUFS, pico −1,5 dBFS.

**Falta:** render 4K (`bash ep4/render_all.sh`), `encode.sh`, verificação a 1 quadro/s.
