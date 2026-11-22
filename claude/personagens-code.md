# Personagens — "Já volto" (canal Arquivo Inexplicável)

Ficha reutilizável dos personagens criados nos episódios **"Já volto"** e **"Quem devolve a nota vira o cobrador"** (parte 2). Tudo aqui foi gerado pelo mesmo código que desenhou o episódio, então cores, proporções e traço são idênticos aos do vídeo.

> **Onde está salvo:** este arquivo e a pasta `claude/personagens/` estão no repositório `arquivo-inexplic-vel-m-dia-`, branch `claude/beautiful-keller-qxgio4`. Esta sessão **não tem acesso ao Projeto "Arquivo com polo" do claude.ai**. Para usar lá, envie este `.md` e os arquivos da pasta `claude/personagens/` para o conhecimento do Projeto (ou anexe-os no outro chat).

## Arquivos

| Caminho | O que é |
|---|---|
| `claude/personagens-code.md` | Este documento (ficha + guia do código). |
| `claude/personagens/ficha_preview.png` | Prévia de todos os SVGs sobre fundo quadriculado (para conferir a transparência). |
| `claude/personagens/medidas.json` | Caixa delimitadora medida de cada personagem (vista de frente, unidades do rig). |
| `claude/personagens/svg/<nome>_frente.svg` | Corpo inteiro, de frente, expressão neutra. |
| `claude/personagens/svg/<nome>_lado.svg` | Corpo inteiro, vista lateral (3/4), voltado para a direita. |
| `claude/personagens/svg/<nome>_costas.svg` | Corpo inteiro, de costas (para planos por cima do ombro). |
| `claude/personagens/svg/<nome>_expr_neutra.svg` | Busto, expressão neutra. |
| `claude/personagens/svg/<nome>_expr_surpreso.svg` | Busto, emoção forte: surpresa/susto. |
| `claude/personagens/svg/<nome>_expr_rindo.svg` | Busto, emoção forte: riso. |
| `claude/personagens/codigo/` | Código para desenhar e animar (ver seção **Código**). |

São **16 personagens × 6 arquivos = 96 SVGs**, mais **11 objetos** em `svg/objetos/`. Todos têm **fundo transparente** (nenhum retângulo de fundo), são vetoriais e autossuficientes (cada SVG carrega os próprios padrões de estampa/textura em `<defs>`). **Não há verde em nenhum arquivo**: verifiquei todas as cores; o vestido da mulher de óculos, que era verde no vídeo, virou azul `#4a74c0` por causa do chroma key.

> **Diferenças em relação ao vídeo v5 do episódio:** ao montar esta ficha corrigi três coisas no rig: (1) a pálpebra agora acompanha o formato do olho (no v5 ela aparecia como um retângulo mais escuro); (2) o brilho do cabelo curto, do boné e do cabelo longo ficava um pouco acima do cabelo; (3) o vestido verde da mulher de óculos virou azul. O boné do menino também subiu, para não cobrir as sobrancelhas. Os SVGs e o código desta ficha já estão corrigidos; o MP4 do v5 ainda não.

## Proporções (valem para todos)

O rig desenha cada personagem em "unidades" com os pés em (0,0). Em escala `s = 1`:

| Medida | Valor | Em relação à cabeça |
|---|---|---|
| Altura total (pé até topo da cabeça, sem chapéu/cabelo alto) | 410 u | ≈ **2,4 cabeças** de altura |
| Cabeça (altura × largura) | 168 × 168 u | a cabeça ocupa ≈ **41%** da altura |
| Ombros (largura total, com mangas) | (92·w + 40) u | 0,79 a 0,95 da altura da cabeça (tabela abaixo) |
| Mão (palma) | 34 × 32 u; com dedos abertos até ≈ 60 u | palma ≈ 0,20 cabeça |
| Pé/sapato (comprimento × altura) | ≈ 56 × 32 u | ≈ 0,33 cabeça |
| Contorno | 6 u (corpo), 4,5–5 u (detalhes do rosto) | — |

`w` é a "largura de corpo" de cada personagem e `scale` é o tamanho relativo (o menino é 0,74; a moça, 0,95). Para desenhar maior ou menor, use a opção `s` da função `person()`.

## Fichas

### Polo  (`polo`, id no código: `polo`)

**Papel:** Protagonista. Sai da padaria dizendo "já volto" para comprar pão e só volta 9 dias depois.

| Cor | Hex |
|---|---|
| Pele | `#f4c4a1` |
| Cabelo | careca (sem cabelo) |
| Roupa — moletom com capuz, bolso canguru e cordões | `#ffc928` (sombra `#e0a514`) |
| Calça/bermuda | `#4a6fa8` (jeans, textura `pDenim` + costura `#e0a050`) |
| Sapatos | `#f6f4ee` (tênis branco, sola `#b8b4ac`) |
| Mãos (luvas) | `#1d1a22` |
| Contorno | `#1e1820` |

**Proporções:** altura 410 u · cabeça 168 u (≈ 2.4 cabeças) · ombros 132 u (0.79 da cabeça) · mão (palma) 34×32 u · sapato ≈ 56×32 u.

**Arquivos:** `svg/polo_frente.svg`, `svg/polo_lado.svg`, `svg/polo_expr_neutra.svg`, `svg/polo_expr_surpreso.svg`, `svg/polo_expr_rindo.svg`

**Conformidade com a ficha do Projeto** (atualizado no episódio 2 v2; regra atual do usuário: **Polo sem barba**):

| Ficha do Projeto | Polo atual |
|---|---|
| Careca, cabeça redonda | Igual. |
| Sobrancelhas grossas | Igual (traço de 10 u). |
| Barba rala | **Diferente, por decisão do usuário: o Polo NÃO tem barba.** A opção existe no código (`stubble: 1` em `CAST2.polo`), mas fica desligada (`stubble: 0`). |
| Moletom amarelo `#FFC928` com bolso | Igual: `#FFC928` (sombra `#E0A514`), bolso canguru com costura e cordões brancos. |
| Calça jeans | Igual: `#4A6FA8` com textura de sarja e costura laranja. |
| Tênis branco | Igual: `#F6F4EE` com sola cinza e cadarço. |
| Mãos de luva com polegar | Igual: luva preta `#1D1A22` com polegar (e dedos ao abrir a mão ou apontar). |
| Nota de R$ 10 no bolso | Igual quando você usa a opção `pocketNote: true` (aparece saindo do bolso canguru, como em `svg/polo_frente.svg`). No ep. 2 ele entrega a nota e passa a usar o chapéu fedora (`hat: 'fedora'`). |

O Polo do vídeo "Já volto" (v5) ainda é a versão antiga (moletom `#F2C230`, calça lisa, sapato preto, sem barba); o episódio 2 v2 e esta ficha usam a versão nova.

### Mãe do Polo  (`mae`, id no código: `mae`)

**Papel:** Procura o Polo pela rua no 2º dia e corre atrás do ônibus.

| Cor | Hex |
|---|---|
| Pele | `#c98b5e` |
| Cabelo | coque volumoso: `#3a2018` |
| Roupa — vestido florido | `#7b52b8` (sombra `#5e3c98`) |
| Saia do vestido | `#7b52b8` |
| Sapatos | `#e07a9a` |
| Brincos | `#f2c230` |
| Contorno | `#1e1820` |

**Proporções:** altura 410 u · cabeça 168 u (≈ 2.4 cabeças) · ombros 152 u (0.91 da cabeça) · mão (palma) 34×32 u · sapato ≈ 56×32 u.

**Arquivos:** `svg/mae_frente.svg`, `svg/mae_lado.svg`, `svg/mae_expr_neutra.svg`, `svg/mae_expr_surpreso.svg`, `svg/mae_expr_rindo.svg`

### Padeira  (`padeira`, id no código: `padeira`)

**Papel:** Dona da padaria; diz "esse aí já era" (sem nome no roteiro).

| Cor | Hex |
|---|---|
| Pele | `#f1c08f` |
| Cabelo | cabelo sob touca de chef: `#5a3424 (touca #fffbf2 / #f6efe2)` |
| Roupa — vestido de bolinhas + avental | `#e0787a` (sombra `#c05a5e`) |
| Saia do vestido | `#e0787a` |
| Sapatos | `#7a3a2a` |
| Brincos | `#f2c230` |
| Contorno | `#1e1820` |

**Proporções:** altura 410 u · cabeça 168 u (≈ 2.4 cabeças) · ombros 158 u (0.94 da cabeça) · mão (palma) 34×32 u · sapato ≈ 56×32 u.

**Arquivos:** `svg/padeira_frente.svg`, `svg/padeira_lado.svg`, `svg/padeira_expr_neutra.svg`, `svg/padeira_expr_surpreso.svg`, `svg/padeira_expr_rindo.svg`

### Padeira aposentada  (`padeira_aposentada`, id no código: `padeira` + `old: true`)

**Papel:** A mesma padeira, 9 dias depois, já aposentada (versão idosa).

| Cor | Hex |
|---|---|
| Pele | `#f1c08f` |
| Cabelo | coque branco volumoso: `#e8e4f2` |
| Roupa — vestido florido + óculos | `#9b84c8` (sombra `#7a62aa`) |
| Saia do vestido | `#9b84c8` |
| Sapatos | `#8a5a8a` |
| Brincos | `#f2c230` |
| Contorno | `#1e1820` |

**Proporções:** altura 410 u · cabeça 168 u (≈ 2.4 cabeças) · ombros 160 u (0.95 da cabeça) · mão (palma) 34×32 u · sapato ≈ 56×32 u.

**Arquivos:** `svg/padeira_aposentada_frente.svg`, `svg/padeira_aposentada_lado.svg`, `svg/padeira_aposentada_expr_neutra.svg`, `svg/padeira_aposentada_expr_surpreso.svg`, `svg/padeira_aposentada_expr_rindo.svg`

### Padeiro novo  (`padeiro_novo`, id no código: `padeiro2`)

**Papel:** Assume a padaria depois da aposentadoria (figurante).

| Cor | Hex |
|---|---|
| Pele | `#c98b5e` |
| Cabelo | cabelo sob touca de chef: `#1d1a22 (touca #fffbf2)` |
| Roupa — camisa + avental | `#f6efe2` (sombra `#dcd2bc`) |
| Calça/bermuda | `#3a3a4a` |
| Sapatos | `#2a2228` |
| Contorno | `#1e1820` |

**Proporções:** altura 410 u · cabeça 168 u (≈ 2.4 cabeças) · ombros 139 u (0.83 da cabeça) · mão (palma) 34×32 u · sapato ≈ 56×32 u.

**Arquivos:** `svg/padeiro_novo_frente.svg`, `svg/padeiro_novo_lado.svg`, `svg/padeiro_novo_expr_neutra.svg`, `svg/padeiro_novo_expr_surpreso.svg`, `svg/padeiro_novo_expr_rindo.svg`

### Motorista do ônibus  (`motorista`, id no código: `motorista`)

**Papel:** Acena de volta "como quem diz: já volto também".

| Cor | Hex |
|---|---|
| Pele | `#f3cfae` |
| Cabelo | boné de motorista: `boné #3c5a8a / aba #14203a; bigode #4a2a1a` |
| Roupa — camisa de uniforme + gravata | `#3c5a8a` (sombra `#2a426c`); gravata `#c8443c` |
| Calça/bermuda | `#28324c` |
| Sapatos | `#1d1a22` |
| Contorno | `#1e1820` |

**Proporções:** altura 410 u · cabeça 168 u (≈ 2.4 cabeças) · ombros 149 u (0.88 da cabeça) · mão (palma) 34×32 u · sapato ≈ 56×32 u.

**Arquivos:** `svg/motorista_frente.svg`, `svg/motorista_lado.svg`, `svg/motorista_expr_neutra.svg`, `svg/motorista_expr_surpreso.svg`, `svg/motorista_expr_rindo.svg`

### Seu Barnabé  (`barnabe`, id no código: `barnabe`)

**Papel:** Morador antigo; brinca "já volto" e o relógio pula 2 horas.

| Cor | Hex |
|---|---|
| Pele | `#eab88a` |
| Cabelo | laterais brancas + chapéu de palha: `#f6f3ec; chapéu #e8c46a; bigode #f6f3ec` |
| Roupa — camisa + colete com botões + bengala | `#f4efe2` (sombra `#d6cfbe`); colete `#8a6a3a` |
| Calça/bermuda | `#5a5a6a` |
| Sapatos | `#3a2a20` |
| Contorno | `#1e1820` |

**Proporções:** altura 410 u · cabeça 168 u (≈ 2.4 cabeças) · ombros 143 u (0.85 da cabeça) · mão (palma) 34×32 u · sapato ≈ 56×32 u.

**Arquivos:** `svg/barnabe_frente.svg`, `svg/barnabe_lado.svg`, `svg/barnabe_expr_neutra.svg`, `svg/barnabe_expr_surpreso.svg`, `svg/barnabe_expr_rindo.svg`

### Menino da esquina  (`menino`, id no código: `menino`)

**Papel:** Grita "já volto" e o relógio pula um dia inteiro.

| Cor | Hex |
|---|---|
| Pele | `#8d5a34` |
| Cabelo | cabelo curto sob boné: `#1e1410; boné #3a6ab8` |
| Roupa — camiseta listrada + bermuda | `#e86a4a` (sombra `#c24a32`) |
| Calça/bermuda | `#3d5a9e` |
| Sapatos | `#f4f1ea` |
| Contorno | `#1e1820` |

**Proporções:** altura 303 u · cabeça 124 u (≈ 2.4 cabeças) · ombros 98 u (0.79 da cabeça) · mão (palma) 25×24 u · sapato ≈ 41×24 u.

**Arquivos:** `svg/menino_frente.svg`, `svg/menino_lado.svg`, `svg/menino_expr_neutra.svg`, `svg/menino_expr_surpreso.svg`, `svg/menino_expr_rindo.svg`

### Mulher de óculos  (`mulher_oculos`, id no código: `mulher`)

**Papel:** Ri e diz "já volto" três vezes.

| Cor | Hex |
|---|---|
| Pele | `#e0ac79` |
| Cabelo | cabelo cacheado volumoso: `#6a3a24; óculos #d0604a` |
| Roupa — vestido de bolinhas | `#4a74c0` (sombra `#3458a0`) |
| Saia do vestido | `#4a74c0` |
| Sapatos | `#c8443c` |
| Brincos | `#f2c230` |
| Contorno | `#1e1820` |

**Proporções:** altura 410 u · cabeça 168 u (≈ 2.4 cabeças) · ombros 149 u (0.88 da cabeça) · mão (palma) 34×32 u · sapato ≈ 56×32 u.

**Arquivos:** `svg/mulher_oculos_frente.svg`, `svg/mulher_oculos_lado.svg`, `svg/mulher_oculos_expr_neutra.svg`, `svg/mulher_oculos_expr_surpreso.svg`, `svg/mulher_oculos_expr_rindo.svg`

### Moça  (`moca`, id no código: `moca`)

**Papel:** Fala "já volto" baixinho e o relógio enlouquece.

| Cor | Hex |
|---|---|
| Pele | `#f5d0b0` |
| Cabelo | cabelo longo com laço: `#7a4426; laço #f2c230` |
| Roupa — camiseta + calça | `#ee8aaa` (sombra `#d06a8c`) |
| Calça/bermuda | `#4f72b8` |
| Sapatos | `#f4f1ea` |
| Brincos | `#ee8aaa` |
| Contorno | `#1e1820` |

**Proporções:** altura 390 u · cabeça 160 u (≈ 2.4 cabeças) · ombros 125 u (0.79 da cabeça) · mão (palma) 32×30 u · sapato ≈ 53×30 u.

**Arquivos:** `svg/moca_frente.svg`, `svg/moca_lado.svg`, `svg/moca_expr_neutra.svg`, `svg/moca_expr_surpreso.svg`, `svg/moca_expr_rindo.svg`

### Vizinho 1  (`vizinho1`, id no código: `viz1`)

**Papel:** Figurante (rua/praça).

| Cor | Hex |
|---|---|
| Pele | `#c98b5e` |
| Cabelo | curto: `#1d1a22` |
| Roupa — camisa | `#6a9ad0` (sombra `#4c7ab0`) |
| Calça/bermuda | `#5a4a3a` |
| Sapatos | `#2a2228` |
| Contorno | `#1e1820` |

**Proporções:** altura 410 u · cabeça 168 u (≈ 2.4 cabeças) · ombros 141 u (0.84 da cabeça) · mão (palma) 34×32 u · sapato ≈ 56×32 u.

**Arquivos:** `svg/vizinho1_frente.svg`, `svg/vizinho1_lado.svg`, `svg/vizinho1_expr_neutra.svg`, `svg/vizinho1_expr_surpreso.svg`, `svg/vizinho1_expr_rindo.svg`

### Vizinho 2  (`vizinho2`, id no código: `viz2`)

**Papel:** Figurante (rua/praça).

| Cor | Hex |
|---|---|
| Pele | `#f1c08f` |
| Cabelo | curto: `#8a5a2a` |
| Roupa — camiseta listrada | `#d0704a` (sombra `#a8502e`) |
| Calça/bermuda | `#3a3a4a` |
| Sapatos | `#2a2228` |
| Contorno | `#1e1820` |

**Proporções:** altura 410 u · cabeça 168 u (≈ 2.4 cabeças) · ombros 146 u (0.87 da cabeça) · mão (palma) 34×32 u · sapato ≈ 56×32 u.

**Arquivos:** `svg/vizinho2_frente.svg`, `svg/vizinho2_lado.svg`, `svg/vizinho2_expr_neutra.svg`, `svg/vizinho2_expr_surpreso.svg`, `svg/vizinho2_expr_rindo.svg`

### Vizinha 3  (`vizinha3`, id no código: `viz3`)

**Papel:** Figurante (rua/praça).

| Cor | Hex |
|---|---|
| Pele | `#8d5a34` |
| Cabelo | cacheado volumoso: `#1d1a22` |
| Roupa — vestido florido | `#e8b03a` (sombra `#c08a1e`) |
| Saia do vestido | `#e8b03a` |
| Sapatos | `#6a3a28` |
| Brincos | `#e86a6a` |
| Contorno | `#1e1820` |

**Proporções:** altura 410 u · cabeça 168 u (≈ 2.4 cabeças) · ombros 150 u (0.90 da cabeça) · mão (palma) 34×32 u · sapato ≈ 56×32 u.

**Arquivos:** `svg/vizinha3_frente.svg`, `svg/vizinha3_lado.svg`, `svg/vizinha3_expr_neutra.svg`, `svg/vizinha3_expr_surpreso.svg`, `svg/vizinha3_expr_rindo.svg`

### Homem de terno  (`homem_terno`, id no código: `terno`)

**Papel:** Episódio 2. Recebe a nota de R$ 10 do Polo, entrega a ele o chapéu e a carteira (tornando o Polo o novo "cobrador") e some no fim, depois de pegar a última nota.

| Cor | Hex |
|---|---|
| Pele | `#e9d8c8` (pálida, de propósito) |
| Cabelo | curto `#1d1a22`; chapéu fedora `#332c3c` / aba `#2a2430` / fita `#8a1c2c` |
| Roupa — terno com gravata | `#2c2a3a` (sombra `#1c1a28`); gravata `#8a1c2c` |
| Calça | `#2c2a3a` |
| Sapatos | `#121016` |
| Contorno | `#1e1820` |

**Proporções:** é o mais alto do elenco (`scale` 1,1): altura 451 u · cabeça 185 u (≈ 2,4 cabeças) · ombros 151 u (0,82 da cabeça) · mão (palma) 37×35 u · sapato ≈ 62×35 u.

**Arquivos:** `svg/homem_terno_frente.svg`, `svg/homem_terno_lado.svg`, `svg/homem_terno_expr_neutra.svg`, `svg/homem_terno_expr_surpreso.svg`, `svg/homem_terno_expr_rindo.svg`. O chapéu já vem na cabeça; use `hat: null` para tirá-lo e `fedoraProp()` para desenhá-lo na mão.

### Senhora  (`senhora`, id no código: `senhora`)

**Papel:** Episódio 2. Senhora da praça, dona do cachorro; recebe a nota com o nome dela (sem nome no roteiro).

| Cor | Hex |
|---|---|
| Pele | `#d9a27a` |
| Cabelo | coque volumoso grisalho `#c8c2d4` |
| Roupa — vestido florido | `#c8506a` (sombra `#a63c54`) |
| Saia do vestido | `#c8506a` |
| Sapatos | `#6a3a5a` |
| Brincos | `#f2c230` |
| Contorno | `#1e1820` |

**Proporções:** altura 410 u · cabeça 168 u (≈ 2,4 cabeças) · ombros 155 u (0,92 da cabeça) · mão (palma) 34×32 u · sapato ≈ 56×32 u.

**Arquivos:** `svg/senhora_frente.svg`, `svg/senhora_lado.svg`, `svg/senhora_expr_neutra.svg`, `svg/senhora_expr_surpreso.svg`, `svg/senhora_expr_rindo.svg`

### Vulto  (`vulto`, id no código: `vulto`)

**Papel:** Episódio 2. A pessoa que chega pela estrada no final, com uma nota de dez dobrada no bolso (gancho para a parte 3). Silhueta escura de propósito.

| Cor | Hex |
|---|---|
| Pele | `#4a4258` |
| Cabelo | curto `#16121e` |
| Roupa — camisa | `#2a2436` (sombra `#1c1828`) |
| Calça | `#241f30` |
| Sapatos | `#141018` |
| Contorno | `#1e1820` |

**Proporções:** altura 410 u · cabeça 168 u (≈ 2,4 cabeças) · ombros 139 u (0,83 da cabeça) · mão (palma) 34×32 u · sapato ≈ 56×32 u.

**Arquivos:** `svg/vulto_frente.svg`, `svg/vulto_lado.svg`, `svg/vulto_expr_neutra.svg`, `svg/vulto_expr_surpreso.svg`, `svg/vulto_expr_rindo.svg`

### Objetos (`svg/objetos/`)

| Arquivo | Função no código | Uso |
|---|---|---|
| `nota_10.svg` | `note10()` | Nota de R$ 10 simples (ep. 1). |
| `nota_10_nome.svg` | `noteNamed('PADEIRO', brilho)` | Nota com nome brilhando no canto (ep. 2). Troque o texto. |
| `nota_10_chapeu.svg` | `noteNamed('@hat', brilho)` | Nota com o símbolo do chapéu do homem de terno. |
| `carteira_fechada.svg` / `carteira_aberta.svg` | `wallet({ open, n, labels, glow, light })` | Carteira; `light` 0–1 deixa ela mais fina ("ficando leve"). |
| `chapeu_fedora.svg` | `fedoraProp()` / opção `hat: 'fedora'` | Chapéu do homem de terno; depois do ep. 2 o Polo usa. |
| `mala.svg` | `suitcase()` | Mala do padeiro. |
| `cachorro_rosnando.svg` / `cachorro_feliz.svg` | `dog(x, y, { growl, wag, t })` | Cachorro da senhora. |
| `pao.svg` / `pao_pedra.svg` | `bread({ stone, cracks })` | Pão / pão duro como pedra (ep. 1). |

### Continuidade entre episódios

- **Polo:** a partir do episódio 2 ele usa o chapéu fedora do homem de terno (`hat: 'fedora'`).
- **Padeiro:** o padeiro do episódio 2 é o "padeiro novo" (`padeiro2`), que assumiu a padaria quando a padeira se aposentou no episódio 1.
- **Opções novas de `person()`:** `hat` (`'fedora'` ou `null`), `hatLift` (levanta o chapéu, em u), `pale` (0–1, deixa a pele pálida), `tears` (0–1, lágrimas escorrendo), `fade` (0–1, opacidade, para sumir), `back: true` (vista de costas), `pocketNote: true` (nota de R$ 10 no bolso do moletom).
- **Outras funções novas:** `povHands(x, y, escala, svg)` (luvas do Polo em primeira pessoa segurando um objeto), `steeringWheel()` (volante), `bus(..., { door: 0–1, emptySeat: true })` (ônibus com porta sanfonada e banco do motorista vazio).
- **Cidade (`codigo/city.js`):** `bldg()` (prédio com loja, sobrado ou prédio de 4 andares), `cityRow()` (quarteirão lateral com postes, árvores e bandeirinhas; opções `night`, `closed`, `signs`), `cityBack()` (fileira de fundo + torre do relógio como referência), `perspStreet()` + `onStreet()` (rua em perspectiva com ponto de fuga; `camH` alto = câmera alta) e `cityAerial()` (cidade vista do alto), além de `lampLight()` (cone e poça de luz dos postes à noite).

## Código

Tudo é JavaScript puro que gera texto SVG; não precisa de biblioteca nem de servidor. Ordem de carregamento (veja `codigo/exemplo.html`, que funciona aberto direto no navegador):

1. `lib.js`: utilidades (easing `E`, `clamp`, `lerp`, `mix` de cores, `rng`, `autoBlink`, `layerT` da câmera).
2. `defs.js`: `DEFS`, o bloco `<defs>` com texturas e estampas (`pFabric`, `pSkin`, `pFlowers`, `pDots`, `pStripeH`…). Coloque `DEFS` uma vez em cada `<svg>`.
3. `characters_v1.js`: objetos de cena: `note10()` (nota de R$ 10) e `bread({stone, cracks})` (pão / pão de pedra).
4. `characters.js`: rosto do Polo (`face9`), mãos (`hand9`) e símbolos de emoção (`emote`).
5. `characters2.js`: **rig atual**: `CAST2` (cores e medidas de cada personagem), `person()`, `personSide2()` e `personBack2()`.
6. `environments.js` e `city.js` (opcionais): cenários (casas, padaria, ônibus, torre do relógio, cidade).

### `person(id, opções)` → string SVG

Ids: `polo`, `mae`, `padeira` (com `old: true` vira a aposentada), `padeiro2`, `motorista`, `barnabe`, `menino`, `mulher`, `moca`, `viz1`, `viz2`, `viz3`.

| Opção | Efeito |
|---|---|
| `x, y` | Posição dos pés. |
| `s` | Escala (1 = 410 u de altura). |
| `t` | Tempo em segundos: controla respiração e piscar automático. Passe o tempo da animação. |
| `face` | Direção do rosto, de −1 (esquerda) a 1 (direita); 0 = de frente. |
| `side: true` | Vista lateral (3/4). Use com `walk` para andar e `run: true` para correr. |
| `walk` | Fase do passo (ex.: `t * 12`). Pernas e braços balançam e o corpo sobe e desce. |
| `expr` | `neutral`, `happy`, `surprised`, `worried`, `sad`, `angry`, `smug` (com `wink: true` pisca um olho), `laugh`, `joy`. |
| `mouth` | 0–1: abertura da boca para falar. Use `talk(T, [[início, fim], …])` do exemplo. |
| `blink` | 0–1: fecha os olhos (além do piscar automático). |
| `lx, ly` | Direção do olhar (−1 a 1). |
| `armL, armR` | Ângulo do ombro: 0 = braço caído, 90 = horizontal, 165 = erguido. Use `wave(T, a, b)` para acenar. |
| `bendL, bendR` | Dobra do cotovelo, em graus. |
| `handL, handR` | `fist`, `open` ou `point`. Se não informar, a mão abre sozinha quando o braço passa de 120°. |
| `holdL, holdR` | SVG preso na mão (ex.: `note10()`, `bread({s:0.5})`). |
| `headTilt, tilt` | Inclinação da cabeça / do corpo. A cabeça também balança sozinha quando `mouth > 0`. |
| `jump, squash` | Pulo (em u) e achatamento (−0,05 a 0,05). |
| `turn` | 0–1: estreita o corpo para simular uma virada rápida entre frente e lado. |
| `shadow` | `false` remove a sombra no chão. |

Exemplo:

```js
const svg = DEFS + person('polo', { x: 300, y: 820, s: 1.6, t: T, expr: 'happy', armR: wave(T, 0.5, 2.5) ?? 14, mouth: talk(T, [[0.6, 1.4]]) });
```

### Símbolos de emoção

`emote(tipo, x, y, idade, escala)`: `sweat` (gota), `excl` (!), `q` (?), `vein` (raiva), `heart`, `sparkle`, `shock` (linhas de susto), `zzz`. `idade` = segundos desde que o símbolo apareceu: ele surge com um pulo e some depois de 2,2 s. Para posicionar acima da cabeça: `y = pés − s × 430`.

### Regenerar os SVGs

`codigo/export_fichas.js` gera de novo os 65 SVGs e o `medidas.json` (requer Node e Playwright). No repositório, rode a partir da raiz: `node video/tools/export_fichas.js`.

### Para adicionar ou alterar um personagem

Edite ou acrescente uma entrada em `CAST2` (`characters2.js`). Os campos são: `skin`, `top`/`topD` (roupa e sombra), `topType` (`hoodie`, `dress`, `shirt`, `tee`, `vest`), `pattern` (`pFlowers`, `pDots`, `pStripeH`), `bottom`, `shoes`, `hands`, `hair` (`bald`, `cloud`, `long`, `short`, `chef`, `cap`, `driverCap`, `sides`), `hairC`, `bun`, `glasses`, `stache`, `ear` (brinco), `blush`, `hat`, `cane`, `apron`, `tie`, `shorts`, `w` (largura) e `scale` (tamanho). Evite verdes, por causa do chroma key.
