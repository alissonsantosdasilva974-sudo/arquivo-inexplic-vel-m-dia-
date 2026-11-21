# Guia de estilo — "Já volto"

## Paleta
| Nome | Hex | Uso |
|---|---|---|
| Tinta (contorno) | `#2a2233` | Contornos, corpo dos personagens |
| Corpo sombra | `#3b3147` | Sombra interna dos corpos |
| Corpo luz | `#4e4260` | Rim light dos corpos |
| Creme | `#f4e6c8` | Paredes, papel, olhos |
| Terracota | `#c8643c` | Telhados, toldo |
| Mostarda | `#e0a83a` | Acentos, luz quente, pão |
| Pão | `#d9893f` / `#b8682a` | Pão e crosta |
| Verde oliva | `#7a8a4a` | Plantas, praça |
| Azul manhã | `#7fa3b8` | Céu dia 2 |
| Céu dourado | `#f2c27a` → `#f7e3b5` | Céu dia 1/3 |
| Noite | `#1d2340` → `#3a3a6a` | Céu noturno |
| Pedra | `#8c8a86` | Pão-pedra, calçada |

Cada locação tem uma dominante: A dourada/terracota, B âmbar de forno, C azul frio, D dourado com ciclos noite, E rosa-entardecer.

## Contorno
Traço `#2a2233`, 4 px para personagens e objetos principais a 1080p, 3 px em cenário médio, sem traço no fundo distante (só formas mais claras + névoa).

## Formas
Personagens: feijão arredondado, cabeça e corpo num só volume (≈ 1,6 cabeças de altura), pés curtos ovais, braços em tubo com mãos redondas. Cenário: geometria levemente torta, cantos arredondados, telhados inclinados.

## Rostos
Olhos: oval branco pequeno + pupila escura, brilho branco. Boca: linha curta ou oval escuro (aberta). Sobrancelhas: traço curto para expressão. Expressões: neutro, feliz, surpreso (olhos maiores, boca O), preocupado (sobrancelhas inclinadas), malandro (piscadela).

## Personagens (IDs fixos)
- `polo` — corpo tinta, cachecol mostarda, boné vermelho-terracota. Máscara azul-clara só no ônibus.
- `padeira` — corpo tinta, avental e chapéu de padeiro creme, bochechas rosadas. Versão idosa: cabelo branco em coque, óculos, xale lilás.
- `mae` — corpo tinta, lenço verde-oliva na cabeça, bolsa.
- `motorista` — boné azul de motorista, bigode.
- `barnabe` — bigode branco grande, chapéu de palha, bengala.
- `menino` — menor (0,7×), boné virado, camiseta mostarda.
- `mulher` — óculos redondos grandes, cabelo em coque castanho, colar.
- `moca` — cabelo longo, laço rosa.

## Material e textura
Gradientes lineares suaves (2–3 paradas) em céu, paredes e corpos; manchas de textura discretas (pontilhado semitransparente) nas paredes. Sem fotos.

## Luz
Um key light motivado por cena (sol, forno, vitrine). Sombras de contato elípticas sob personagens. Névoa = retângulo com gradiente para o horizonte. Poeira em suspensão em feixes de luz.

## Profundidade
Camadas com fator de parallax: céu 0.1 · morros 0.25 · fachadas 0.5 · ação 1.0 · primeiro plano 1.4. Primeiro plano levemente mais escuro.

## Câmera e animação
Câmera = função do frame (x, y, zoom, rot). Easing cúbico/back para gestos; antecipação → ação → assentamento. Idle: respiração (escala 1–2%), piscar a cada ~3 s, leve balanço. Saltos do relógio com overshoot. O maior movimento (push + giro) fica reservado para a cena 17.

## Revisão 2 (pedido do usuário)
- Personagens deixaram de ser corpos escuros: cada um tem tom de pele no rosto/mãos e roupa com cor própria (Polo `#3c8a86`/pele `#e0ac69`, padeira `#d46a6a`, mãe `#8a5a9a`, motorista `#3c5a8a`, Barnabé `#8a5a34`, menino `#4f7a9a`, mulher `#4f8a5e`, moça `#e07a96`). Contorno tinta e sombreamento em gradiente suave mantidos.
- Legendas queimadas: Inter Display Black 66 px, branco com contorno tinta, palavra atual em amarelo `#ffd23f`, centralizadas em y=990. Texto do roteiro com tempos do alinhamento por palavra (`tools/captions.py` → `web/words.js`).
