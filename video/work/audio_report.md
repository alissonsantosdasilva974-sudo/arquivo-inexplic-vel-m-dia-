# Relatório de áudio

- Arquivo: `input/voiceover_original.wav` (cópia somente-leitura do upload `Generated_Audio_November_21_2026_-_9_35AM.wav`)
- Formato: WAV PCM s16le, 24 000 Hz, mono, 384 kb/s
- Duração: **89,600 s** → **2688 frames** a 30 fps
- Loudness integrado: −16,7 LUFS · LRA 4,9 LU
- True peak: **+2,1 dBFS** — o arquivo original já tem picos inter-amostra acima de 0 dBFS. Não foi aplicado limitador nem normalização (a voz não é processada). A codificação AAC pode reproduzir esses picos levemente saturados; isso vem da fonte.
- Silêncio inicial: nenhum (fala começa em 0,00 s). Silêncio final: 89,29–89,60 s.

## Pausas (> 0,3 s, −40 dB)
3.82–4.33 · 8.32–9.02 · 10.26–11.05 · 13.33–13.93 · 16.74–17.51 · 21.94–22.66 · 26.87–27.23 · 30.79–31.28 · 33.89–34.20 · 35.26–35.72 · 39.20–39.88 · 42.85–43.33 · 44.43–44.86 · 47.67–48.23 · 51.92–52.26 · 54.24–54.70 · 56.32–56.65 · 57.76–58.40 · 61.40–61.98 · 63.13–63.60 · 64.09–64.48 · 68.32–69.01 · 70.27–70.72 · 72.53–72.87 · 73.40–74.27 · 79.26–80.02 · 81.33–81.69 · 83.26–84.25 · 87.29–87.89 · 89.29–89.60

## Alinhamento
faster-whisper `small` (pt, int8, CPU) com timestamps por palavra. A transcrição bate com o roteiro do usuário; diferenças só de fala coloquial ("pra"/"para a", "tava"/"estava", "com quem disse"/"como quem diz"). O roteiro do usuário é o texto de referência; o áudio é a autoridade de tempo.

Palavras com probabilidade < 0,6 (todas confirmadas pelo roteiro, usadas só como timing): já@1.60, nunca@2.42, já@7.76, cinco@11.36, já@46.88, já@55.86, Já@59.88, E@83.80, entre outras. Pontos críticos de sincronia (saltos do relógio) foram conferidos contra as pausas detectadas.

## Pontos de sincronia usados
| Evento | Tempo (s) |
|---|---|
| Polo: "já volto" | 7.76 |
| Padeira: "já era" | 16.24 |
| Ônibus passa / Polo acena | 26.24 / 29.90 |
| Motorista: "já volto também" | 38.32 |
| Relógio aparece | 41.44 |
| "já volto" → ponteiro anda | 46.88 |
| Barnabé "já volto" / pulou duas horas | 51.30 / 52.82 |
| Menino "já volto" / pulou um dia | 55.86 / 56.76 |
| Mulher ×3 | 59.88 · 60.40 · 60.94 |
| Moça "já volto" / relógio enlouquece | 63.44 / 64.94 |
| Polo "já voltei" | 72.88 |
| "duro como pedra" | 74.94 |
| "aposentada" | 78.62 |
| "Nove dias" | 81.68 |
| "Volto" (CTA) | 88.48 |
