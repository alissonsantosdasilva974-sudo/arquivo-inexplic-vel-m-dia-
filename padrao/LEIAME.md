# Padrão do canal (a partir do ep. 2 v4)

Aprovado pelo usuário em 22/11/2026 como o padrão de animação do canal **Arquivo Inexplicável**. Todo episódio novo começa daqui.

## O que está no padrão

- **Visual:** cidade v3, no estilo misto (casas e lojas baixas na rua, prédios de 5 a 10 andares atrás).
  - Ruas laterais em 5 camadas: `sideStreet`.
  - Rua em perspectiva com carros, trânsito e pedestres: `street3D` + `cam3`/`P3`.
  - Descida de drone, céus de noite, amanhecer, dia e entardecer, neblina e luz de poste.
  - Personagens desenhados por código, com o Polo oficial: sem barba, moletom `#FFC928`, jeans, tênis branco, luvas, fedora e nota no bolso.
  - Legenda palavra por palavra, selo "POLO", textura de papel e granulação.
  - Borrão nas transições, aplicado em pós-produção; as legendas ficam nítidas por cima.
- **Som:**
  - A narração é a trilha mestre: recebe só um limitador de pico (−1,5 dBFS).
  - A trilha original fica 20 dB abaixo da voz e sobe nas pausas.
  - Há "whoosh" automático em cada corte, e impacto ou clique nas revelações e no placar.
  - A mixagem final fica em −14 LUFS.
- **Saída:**
  - versão TikTok com música (3,2 Mbps, 2 passadas);
  - versão sem música;
  - versão HQ;
  - capa com título e Polo no quadrado central.

`exemplo_padrao.mp4` é um teste de 12 s feito só com este padrão: novo_episodio, efeitos, trilha, mixagem, render 4K, verificação e codificação.

## Arquivos

| Arquivo | Função |
|---|---|
| `web/` | Motor completo (igual ao `ep2/web/`). `shots.js` traz os cenários padrão (`nightSet`, `duskSet`, `morningSet`, `plazaSetV2`, `hookNote`, céus) e 5 cenas de exemplo para trocar. |
| `ep.conf` | `SLUG` (nome dos arquivos de saída), `DUR` (duração da narração) e `FRAMES` (DUR × 30). |
| `novo_episodio.sh` | Cria `epN/` com tudo copiado, a narração em modo somente leitura, `ep.conf` preenchido e o `.gitignore` atualizado. |
| `sfx.py` | Biblioteca de efeitos e "whoosh" automático nos cortes. Por episódio, edite só a seção **CUES**. |
| `music.py` | Trilha original sintetizada (duração vinda de `ep.conf`). |
| `duck_music.py` | Deixa a trilha 20 dB abaixo da voz e a faz subir nas pausas (rodado pelo `mix.sh`). |
| `mix.sh` | Limitador na voz, abaixamento da trilha e mixagens com e sem música a −14 LUFS. |
| `render_all.sh` | Render 4K com 4 processos, `verify_frames.py` (refaz quadros com falha) e `post_blur.py` (borrão das transições). |
| `encode.sh` | Gera TikTok, sem música e HQ, e confere quadros pretos, congelados e loudness. |

## Passo a passo de um episódio

```bash
bash padrao/novo_episodio.sh 3 nome_curto caminho/narracao.wav
```

1. **Roteiro:** passar pelo checklist de `claude/estrategia-viral.md` (premissa "Polo quer voltar pra casa"; o ep. 3 mostra o resultado do voto COBRA ou AVISA).
2. **Transcrição:** faster-whisper `small` (pt) com `word_timestamps`, passando o áudio como array numpy. Salvar em `epN/work/words.json`.
3. **Legendas:** roteiro do usuário em `epN/work/transcript.txt`, depois `python3 video/tools/align_captions.py epN/work/words.json epN/work/transcript.txt epN/web/words.js`.
4. **Cenas:** escrever `epN/web/shots.js`, com um corte a cada 2–3 s, gancho no primeiro segundo e final que emenda no começo.
5. **Prévia:** rodar o comando abaixo, montar a folha de prévias e conferir mãos, cotovelos, objetos e enquadramento.
   ```bash
   WEBDIR=../epN/web VW=1080 VH=1920 node video/tools/render9.js epN/work/preview <quadros>
   ```
6. **Som:** editar a seção CUES do `epN/sfx.py` e rodar:
   ```bash
   python3 epN/sfx.py
   ```
   ```bash
   python3 epN/music.py
   ```
   ```bash
   bash epN/mix.sh
   ```
7. **Render:**
   ```bash
   bash epN/render_all.sh
   ```
   ```bash
   bash epN/encode.sh
   ```
8. **Revisão:** assistir ao vídeo inteiro a 1 quadro por segundo.
9. **Capa:** `epN/web/cover.html` → `epN/out/capa_epN.png`.
10. **Commit e push** na branch `claude/beautiful-keller-qxgio4`.

## Regras que não mudam

- O Polo não tem barba.
- Nada verde, em personagem nem objeto (chroma key).
- Não mexer na velocidade, no tom nem nas pausas da narração.
- As legendas usam o texto do roteiro.
- Não copiar personagens ou cenas das contas de referência.
- Antes de mudanças grandes: analisar, propor e perguntar.

Para mudar o padrão (cidade, personagem, som), altere primeiro `padrao/` e `video/web9/`, depois copie para os episódios.
