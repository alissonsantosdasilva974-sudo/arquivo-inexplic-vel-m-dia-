# Arquivo Inexplicável — animações do Polo

Repositório de produção das animações verticais (TikTok/Reels/Shorts) do canal **Arquivo Inexplicável**, com o personagem **Polo**. Este arquivo é lido automaticamente por novas sessões do Claude Code: leia antes de mexer em qualquer coisa.

## Regras do usuário (sempre valem)

- **Premissa da série (aprovada pelo usuário): "Polo quer voltar pra casa."** Todo episódio deve aproximar ou afastar o Polo desse objetivo. Ao sugerir ou revisar roteiros, deixe claro o que, no episódio, o leva para perto ou para longe de casa.

- **Polo NÃO tem barba.** Careca, cabeça redonda, sobrancelhas grossas, moletom amarelo `#FFC928` com bolso canguru, calça jeans, tênis branco, luvas pretas com polegar, nota de R$ 10 no bolso (`pocketNote: true`). Desde o ep. 2 usa o chapéu fedora (`hat: 'fedora'`).
- **Sem verde** em nenhum personagem ou objeto (o usuário usa chroma key).
- Narração do usuário é a trilha mestre: não mudar velocidade, tom nem pausas. Limitador leve de pico (−1,5 dBFS) é **autorizado**.
- Legendas: texto do **roteiro do usuário** com o tempo do áudio (o reconhecimento automático erra palavras).
- Não copiar personagens ou cenas das contas de referência (@orbita.curtas, @aprendendocomvitinho); copiar só o estilo.
- Antes de mudanças grandes, **analisar, propor e perguntar** ao usuário.
- Fazer commit e push de tudo na branch `claude/beautiful-keller-qxgio4` (pedido do usuário para continuar em outras janelas).
- Respostas ao usuário em **português**.

## PADRÃO DO CANAL (aprovado em 22/11/2026)

**A animação do ep. 2 v4 é o padrão oficial do canal a partir de agora.** Todo episódio novo parte de `padrao/` (motor, cidade v3, Polo oficial, scripts de som, render e codificação). Detalhes e passo a passo: `padrao/LEIAME.md`. Para começar:

```bash
bash padrao/novo_episodio.sh N nome_curto caminho/narracao.wav
```

## Estado atual

| Episódio | Pasta | Status |
|---|---|---|
| 1 — "Já volto" | `video/` (motor em `video/web9/`) | v5 entregue (`video/out/ja_volto_v5_tiktok*.mp4`). **Usa o Polo antigo** (moletom `#F2C230`, sapato preto, sem jeans). Re-renderizar se quiser a série uniforme. |
| 2 — "Quem devolve a nota vira o cobrador" (parte 2) | `ep2/` | v4: cidade v3 (ruas em 5 camadas, rua em perspectiva, drone), Polo sem barba, placar de notas (HUD em `shots.js`), música com ducking, "whoosh" nos cortes e capa centralizada (`ep2/out/cobrador_ep2_tiktok*.mp4`). |
| 3 | — | O usuário vai decidir pelos comentários (COBRA ou AVISA). |
| 4 — "Toda mentira pesa nos ombros" | `ep4/` | Etapa 2 pronta (sem render 4K): 21 cenas em `web/shots.js` com os tempos reais do áudio, legendas estimadas (sem Whisper), som e mixagem, capa. Plano e tempos em `ep4/work/PLAN.md`. Usa o rig com `lean`/`three4` (`padrao/web/characters2.js`). |
| Piloto da cidade v3 | `pilot/` (kit em `video/web9/city2.js`, **aprovado e aplicado no ep. 2**) | Cena-piloto entregue (`pilot/out/piloto_cidade.mp4`): descida de drone, rua da padaria em 5 camadas, rua em perspectiva com quarteirões, carros, fios e pedestres, de dia e de noite. Estilo de cidade escolhido pelo usuário: **misto** (casas e lojas baixas na rua, prédios de 5 a 10 andares atrás). O usuário pediu **ajustes antes de aplicar**; aguardando quais. |

**Estratégia:** `claude/estrategia-viral.md` tem a análise do vídeo "8 etapas pra viralizar" e um **checklist obrigatório** para todo episódio (roteiro e produção). Os pontos principais: gancho sem explicação, placar ou contador, voto só se mudar a história (e mostrar o resultado no episódio seguinte), música a −20 dB da voz subindo nas pausas (`ep2/duck_music.py`), "whoosh" nos cortes e capa com título e Polo no quadrado central.

**Ep. 3:** precisa mostrar o resultado do voto COBRA ou AVISA da parte 2.

## Ficha de personagens (reutilizável)

`claude/personagens-code.md`: cores, proporções e SVGs (frente, lado, costas, 3 expressões) de 16 personagens + 11 objetos, mais o código (`claude/personagens/codigo/`). Para gerar de novo: `node video/tools/export_fichas.js`.

## Como fazer um episódio novo (receita)

1. Criar `epN/` com `bash padrao/novo_episodio.sh N nome_curto narracao.wav`. Isso copia `padrao/web/` e os scripts (`render_all.sh`, `encode.sh`, `mix.sh`, `sfx.py`, `music.py`, `duck_music.py`) e preenche `ep.conf` com a duração e os quadros.
2. Áudio: copiar a narração para `epN/input/voiceover_original.wav` (somente leitura). Medir com `ffprobe` e `ebur128`. Quadros = round(duração × 30).
3. Transcrição: faster-whisper `small` (pt) com `word_timestamps`. Passar o áudio como array numpy (o PyAV instalado quebra com caminho de arquivo). Se o começo não sair, transcrever os primeiros segundos à parte.
4. Legendas: salvar o roteiro do usuário em `epN/work/transcript.txt` e rodar `python3 video/tools/align_captions.py epN/work/words.json epN/work/transcript.txt epN/web/words.js`.
5. Cenas: escrever `epN/web/shots.js` (lista `SHOTS` com `t0` e `draw(t, T)`). Um corte a cada 2–3 s, gancho no primeiro segundo e final que emenda no começo (loop).
6. Prévia: renderizar um quadro por cena com `WEBDIR=../epN/web VW=1080 VH=1920 node video/tools/render9.js epN/work/preview <quadros>` e montar uma folha de prévias. Conferir enquadramento, mãos e objetos.
7. Som: editar a seção CUES do `epN/sfx.py` (biblioteca de efeitos, com "whoosh" automático em cada corte lido do `shots.js`) e rodar `python3 epN/sfx.py`, depois `python3 epN/music.py`, depois `bash epN/mix.sh`. O `mix.sh` aplica o limitador na voz, roda o `duck_music.py` (trilha 20 dB abaixo da voz, subindo nas pausas) e gera as mixagens com e sem música a −14 LUFS, com pico de no máximo −1 dBFS.
8. Render 4K: `epN/render_all.sh`, com 4 processos, JPEG e `NOBLUR=1`. No fim ele roda duas etapas. `video/tools/verify_frames.py` compara cada quadro 4K com uma referência 1x e refaz os quadros em branco ou com elementos faltando; isso é necessário porque cenas pesadas fazem o Chromium falhar de vez em quando. Depois, `video/tools/post_blur.py` aplica o desfoque das transições nas imagens e recoloca nítida a camada de legendas, selo e placar, renderizada à parte com `LAYER=overlay`. Não use filtros SVG pesados nem `mix-blend-mode` em objetos repetidos. Codificação: `epN/encode.sh` (TikTok em duas passadas a 3,2 Mbps, versão sem música e versão HQ em `epN/renders/`).
9. Verificação: duração = narração, quadros, sem quadros pretos (`blackdetect`) nem trechos congelados (`freezedetect`), loudness. Revisar o vídeo inteiro a 1 quadro por segundo.
10. Capa: `epN/web/cover.html` → `epN/out/capa_epN.png`.

## Mapa do motor (`padrao/web/` = `ep2/web/`, igual a `video/web9/` + cidade)

- `lib.js`: easing, `kf`, `mix`, `rng`, câmera `layerT` (camadas com parallax).
- `characters2.js`: `person(id, opções)`, com vista de frente, `side: true`, `back: true`, expressões, mãos (`fist`, `open`, `point`), `hat`, `pale`, `tears` e `fade`. Também `CAST2` (elenco), objetos (`wallet`, `noteNamed`, `suitcase`, `dog`, `fedoraProp`), `povHands` e `steeringWheel`.
- `characters.js`: `face9` (rosto do Polo) e `emote()` (símbolos de emoção). `characters_v1.js`: `note10()` e `bread()`.
- `environments.js`: casas, padaria, ônibus (`door`, `emptySeat`), torre do relógio, céu, ruas.
- `city.js`: `cityRow`, `cityBack`, `perspStreet` + `onStreet`, `cityAerial`, `lampLight`.
- `scenes.js`: auxiliares de câmera (`focus`, `frameG`, `push`, `lerpCam`), `comic()` (onomatopeias) e cenários.
- `main.js`: compositor, legendas (com encolhimento automático), selo "POLO", textura de papel e granulação, transições com desfoque.

O motor do ep. 1 (`video/web9/`) não tem `city.js` nas cenas, mas compartilha os personagens.
