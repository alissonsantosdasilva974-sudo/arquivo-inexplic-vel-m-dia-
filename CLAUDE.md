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

## Estado atual

| Episódio | Pasta | Status |
|---|---|---|
| 1 — "Já volto" | `video/` (motor em `video/web9/`) | v5 entregue (`video/out/ja_volto_v5_tiktok*.mp4`). **Usa o Polo antigo** (moletom `#F2C230`, sapato preto, sem jeans). Re-renderizar se quiser a série uniforme. |
| 2 — "Quem devolve a nota vira o cobrador" (parte 2) | `ep2/` | v3: Polo sem barba, placar de notas (HUD em `shots.js`), música com ducking, "whoosh" nos cortes e capa centralizada (`ep2/out/cobrador_ep2_tiktok*.mp4`). |
| 3 | — | O usuário vai decidir pelos comentários (COBRA ou AVISA). |

**Estratégia:** `claude/estrategia-viral.md` tem a análise do vídeo "8 etapas pra viralizar" e um **checklist obrigatório** para todo episódio (roteiro e produção). Os pontos principais: gancho sem explicação, placar ou contador, voto só se mudar a história (e mostrar o resultado no episódio seguinte), música a −20 dB da voz subindo nas pausas (`ep2/duck_music.py`), "whoosh" nos cortes e capa com título e Polo no quadrado central.

**Ep. 3:** precisa mostrar o resultado do voto COBRA ou AVISA da parte 2.

## Ficha de personagens (reutilizável)

`claude/personagens-code.md`: cores, proporções e SVGs (frente, lado, costas, 3 expressões) de 16 personagens + 11 objetos, mais o código (`claude/personagens/codigo/`). Para gerar de novo: `node video/tools/export_fichas.js`.

## Como fazer um episódio novo (receita)

1. Criar `epN/` copiando `ep2/web/` (motor + personagens + cidade) e os scripts `ep2/render_all.sh` e `ep2/encode.sh` (trocar `ep2` e o número de quadros).
2. Áudio: copiar a narração para `epN/input/voiceover_original.wav` (somente leitura). Medir com `ffprobe` e `ebur128`. Quadros = round(duração × 30).
3. Transcrição: faster-whisper `small` (pt) com `word_timestamps`. Passar o áudio como array numpy (o PyAV instalado quebra com caminho de arquivo). Se o começo não sair, transcrever os primeiros segundos à parte.
4. Legendas: salvar o roteiro do usuário em `epN/work/transcript.txt` e rodar `python3 video/tools/align_captions.py epN/work/words.json epN/work/transcript.txt epN/web/words.js`.
5. Cenas: escrever `epN/web/shots.js` (lista `SHOTS` com `t0` e `draw(t, T)`). Um corte a cada 2–3 s, gancho no primeiro segundo e final que emenda no começo (loop).
6. Prévia: renderizar um quadro por cena com `WEBDIR=../epN/web VW=1080 VH=1920 node video/tools/render9.js epN/work/preview <quadros>` e montar uma folha de prévias. Conferir enquadramento, mãos e objetos.
7. Som: efeitos sintetizados (modelo em `ep2/sfx_ep2.py`, com "whoosh" automático em cada corte lido do `shots.js`) e trilha (`ep2/music_ep2.py` → `ep2/duck_music.py`, que deixa a trilha 20 dB abaixo da voz e a faz subir nas pausas). Mixar com e sem música (comandos em `ep2/` e no histórico do git); alvo de −14 LUFS e pico de no máximo −1 dBFS.
8. Render 4K: `epN/render_all.sh` (4 processos, JPEG, retomável). Codificação: `epN/encode.sh` (TikTok em duas passadas a 3,2 Mbps, versão sem música e versão HQ em `epN/renders/`).
9. Verificação: duração = narração, quadros, sem quadros pretos (`blackdetect`) nem trechos congelados (`freezedetect`), loudness. Revisar o vídeo inteiro a 1 quadro por segundo.
10. Capa: `epN/web/cover.html` → `epN/out/capa_epN.png`.

## Mapa do motor (`ep2/web/`, igual a `video/web9/` + cidade)

- `lib.js`: easing, `kf`, `mix`, `rng`, câmera `layerT` (camadas com parallax).
- `characters2.js`: `person(id, opções)`, com vista de frente, `side: true`, `back: true`, expressões, mãos (`fist`, `open`, `point`), `hat`, `pale`, `tears` e `fade`. Também `CAST2` (elenco), objetos (`wallet`, `noteNamed`, `suitcase`, `dog`, `fedoraProp`), `povHands` e `steeringWheel`.
- `characters.js`: `face9` (rosto do Polo) e `emote()` (símbolos de emoção). `characters_v1.js`: `note10()` e `bread()`.
- `environments.js`: casas, padaria, ônibus (`door`, `emptySeat`), torre do relógio, céu, ruas.
- `city.js`: `cityRow`, `cityBack`, `perspStreet` + `onStreet`, `cityAerial`, `lampLight`.
- `scenes.js`: auxiliares de câmera (`focus`, `frameG`, `push`, `lerpCam`), `comic()` (onomatopeias) e cenários.
- `main.js`: compositor, legendas (com encolhimento automático), selo "POLO", textura de papel e granulação, transições com desfoque.

O motor do ep. 1 (`video/web9/`) não tem `city.js` nas cenas, mas compartilha os personagens.
