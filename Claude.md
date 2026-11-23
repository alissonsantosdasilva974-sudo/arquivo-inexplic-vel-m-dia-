# CLAUDE.md — Guia de Produção 2D | Arquivo Inexplicável (Padrão Polo + Evolução Órbita Curtas)

Este arquivo define o padrão visual, narrativo e técnico para criar e animar episódios verticais do canal **Arquivo Inexplicável** no **Claude Code**, preservando a identidade atual do **Polo** e elevando a fluidez, o dinamismo de câmera e a expressividade ao nível do **@orbita.curtas**.

Siga estas regras rigorosamente em todas as sessões de código, roteiro e animação.

## 1. Especificações Técnicas do Projeto

| Parâmetro | Padrão Obrigatório |
| :--- | :--- |
| **Formato** | Vertical 9:16 (`1080 × 1920 px`) |
| **Taxa de quadros** | `30 fps` constantes |
| **Duração alvo** | `1min20s` a `2min15s` (80s–135s) |
| **Motor padrão** | HTML5 `<canvas>` + JavaScript modular (exportável para WebM/MP4) |
| **Regra de animação** | 2D cut-out real com articulação completa (nunca bonecos rígidos parados de frente em ping-pong de câmera) |

### Estrutura de arquivos recomendada

```text
/
├── index.html          # Canvas 1080x1920, controles de preview e botão de exportação
├── player.js           # Loop requestAnimationFrame, câmera, parallax, exportação e sincronia com áudio
├── timeline.js         # Mapa de cenas sincronizado por timestamp (start, end, sceneId, camera, lighting)
├── cenas.js            # Renderização de cada plano com 1 ação visual principal por cena
├── rig_polo.js         # Rig articulado do Polo (moletom amarelo, pivôs, cotovelos, 3/4, expressões, lip-sync)
├── personagens.js      # Rigs reutilizáveis de personagens secundários no mesmo traço
├── cenarios.js         # Cenários brasileiros vivos em 3 camadas (rua, padaria, praça, livraria, torre, interior)
├── hud_legendas.js     # Selo POLO, contador de itens, cards de comentário/enquete e legendas dinâmicas
└── assets/audio/       # Narração principal, trilha e SFX
```

## 2. Identidade Visual Oficial — Polo (Visual Atual)

**Atenção:** O Polo **NÃO usa mais o sobretudo/casaco de investigador**. Preserve rigorosamente o visual atual em todas as cenas:

* **Traço:** Contorno escuro uniforme (`#242630`, espessura `5–6 px`, `lineCap = 'round'`, `lineJoin = 'round'`).
* **Cabeça:** Grande, redonda e careca, com brilho especular branco suave no topo esquerdo.
* **Rosto:** Olhos grandes redondos com esclera branca e pupilas pretas nítidas, sobrancelhas grossas e móveis, nariz curvo simples e boca animada (lip-sync + expressões fortes).
* **Vestuário fixo:**
  * **Moletom amarelo** (`#EAB308` / `#FACC15`) com capuz, cordões e bolso canguru frontal (onde objetos da história, como notas ou pistas, podem aparecer).
  * **Calça jeans azul** com linhas de costura.
  * **Luvas pretas** arredondadas.
  * **Tênis brancos/cinza** simples.
* **Acessórios pontuais de episódio** (como chapéu, lanterna ou carteira) só entram quando fazem parte da trama — nunca deixe um acessório flutuando cortado na borda da tela sem conexão física com a mão ou corpo do personagem.

## 3. Upgrades Obrigatórios (O Que Evoluir no Estilo Atual)

O visual atual do canal já acerta no traço limpo, nos planos em perspectiva da rua, nos POVs de 1ª pessoa (mãos segurando objetos) e nos elementos interativos (selo `POLO`, contador e enquete). Para atingir o nível de fluidez do **@orbita.curtas**, o Claude Code deve aplicar obrigatoriamente estas **5 evoluções**:

### 3.1. Quebrar o "ping-pong" frontal em diálogos
* **Proibido:** Deixar dois personagens parados lado a lado, olhando retos para a frente, alternando apenas pan/zoom da câmera por mais de 6 segundos seguidos.
* **Obrigatório:** Variar a posição corporal e o ângulo a cada 2–3 falas — usar **pose 3/4** (virado para o interlocutor), **over-the-shoulder** (por cima do ombro), **plano aberto com caminhada**, **POV de objeto** ou **close dramático** com mudança real de postura.

### 3.2. Rig com articulação real (tronco, ombro, cotovelo e peso)
* **Braços em 2 segmentos:** Desenhar braço superior + antebraço com pivô no ombro e no cotovelo, evitando braços retos girando como alavanca colada ao corpo.
* **Tronco e cabeça vivos:** Inclinar o tronco para frente ao explicar/insistir, recuar o corpo inteiro em susto (`translateX` + leve `rotate`), balançar cabeça e ombros na fala e manter respiração contínua (`Math.sin(t * 3)`).
* **Pernas com intenção:** Dar um passo atrás no espanto, mudar o apoio do pé ou caminhar durante a fala — nunca deixar as duas pernas travadas em paralelo o vídeo inteiro.

### 3.3. Expressões faciais mais marcantes (sem rosto neutro)
* Cada frase importante deve disparar uma **mudança clara de estado emocional** no rig: `curioso`, `desconfiado`, `explicando`, `choque`, `alivio`, `sorriso_ironico`.
* Usar **squash-and-stretch leve** (`scaleX: 1.06, scaleY: 0.94` por `120ms`) no momento de susto ou impacto, pupilas dilatando/encolhendo, sobrancelhas arqueando com força e piscadas automáticas a cada `2.5s–4.0s`.

### 3.4. Cenários vivos com profundidade real em 3 camadas
* **Camada 1 — Fundo (`parallax: 0.3x`):** Céu com gradiente, nuvens lentas, lua/prédios distantes ou torre do relógio.
* **Camada 2 — Plano Médio (`parallax: 1.0x`):** Ação principal + micro-vida no ambiente (carros passando ao fundo, janelas acendendo/apagando, fios elétricos balançando levemente, folhas ou partículas de poeira no feixe de luz do poste).
* **Camada 3 — Primeiro Plano (`parallax: 1.35x–1.6x`):** Postes, plantas, quinas de prédio ou silhuetas cruzando a câmera com desfoque suave (`ctx.filter = 'blur(5px)'`).

### 3.5. Tela limpa (sem briga entre HUD, texto flutuante e legenda)
* **Legendas:** 1 a 3 palavras por bloco, fonte bold branca com contorno preto grosso e destaque em amarelo (`#FACC15`), sempre na zona segura inferior sem cobrir rostos.
* **Textos de impacto / onomatopeias (`TAP... TAP...`, `POLO?!`, `PAROU.`):** Usar com moderação apenas em momentos-chave, nunca empilhando texto flutuante + balão de fala + card de enquete no mesmo segundo sobre o rosto dos personagens.
* **HUD do canal:** Manter discretos o selo `POLO` no topo esquerdo e o contador de item no topo direito, liberando o centro da tela para a atuação dos personagens.

## 4. Fórmula Narrativa e Ritmo

| Bloco | Ritmo / Função |
| :--- | :--- |
| **Gancho (`0:00–0:08`)** | Abrir direto no conflito ou na regra mágica com movimento real (caminhada, câmera em perspectiva ou revelação visual imediata). |
| **Desenvolvimento (`0:08–0:45`)** | Alternar planos a cada **1,5s–3,5s** (plano médio 3/4, POV de mãos/objetos, flashback curto, tomada aérea/isométrica da rua). |
| **Virada / Clímax (`0:45–1:15`)** | Mudança brusca de luz (ex.: rua escurecendo, relógio parando) + corte seco de trilha antes da revelação + close forte de reação. |
| **Fechamento (`1:15+`)** | Resolução circular ou gancho interativo limpo (card de enquete sem poluir a ação principal). |

### Paleta de iluminação (Dia vs. Noite)

| Elemento | Dia / Comédia | Noite / Mistério |
| :--- | :--- | :--- |
| **Céu / Fundo** | `#7DD3FC` → `#E0F2FE` | `#0F172A` → `#1E293B` |
| **Overlay** | Luz solar quente suave (`rgba(255, 247, 200, 0.08)`) | Azul noturno (`rgba(15, 23, 55, 0.45)`) |
| **Luzes pontuais** | Sombras direcionais limpas no chão | Feixes de poste e gradientes radiais quentes (`#FDE047` / `#FB923C`) com partículas sutis |

## 5. Fluxo de Trabalho para o Claude Code

Ao receber um novo episódio ou ajuste, siga esta ordem:

1. **Planejar `timeline.js` primeiro:** Listar todos os planos com timestamp (`1,5s–3,5s`), tipo de enquadramento (proibir 3 planos frontais iguais seguidos), pose do personagem e emoção.
2. **Reaproveitar o rig e cenários:** Estender `rig_polo.js` (adicionando poses 3/4, articulação de cotovelo e novas expressões) sem quebrar o visual oficial do moletom amarelo.
3. **Animar o ambiente:** Garantir ao menos 2 elementos vivos no fundo/foreground em cada cena (luz piscando, partículas no feixe do poste, fio balançando, carro ou silhueta distante).
4. **Revisar composição antes de finalizar:**
   * [ ] Polo está com moletom amarelo, calça jeans azul, luvas pretas e tênis brancos/cinza (sem casaco de investigador).
   * [ ] Nenhum diálogo fica em ping-pong frontal rígido por mais de 2 cortes seguidos.
   * [ ] Braços têm cotovelo e o tronco/cabeça reagem às falas.
   * [ ] Nenhum objeto (como chapéu ou nota) fica flutuando desconectado na borda do quadro.
   * [ ] Legendas em blocos de 1–3 palavras, legíveis e sem colisão com cards ou rostos.

## 6. Prompt Rápido para Disparar um Episódio no Claude Code

```text
Leia o CLAUDE.md e produza/atualize o episódio "[TÍTULO DO EPISÓDIO]" usando o áudio em assets/audio/[ARQUIVO].
Mantenha o visual atual oficial do Polo (moletom amarelo com bolso canguru, calça jeans, luvas pretas e tênis brancos — sem casaco de investigador) e aplique os 5 upgrades do guia: poses 3/4 e variação de planos (sem ping-pong frontal), rig com cotovelos e inclinação de tronco, expressões fortes, cenário vivo em 3 camadas e tela limpa.
Antes de codar cenas.js, me mostre a tabela de timeline.js com timestamps, enquadramento, pose e ação principal de cada cena.
```
