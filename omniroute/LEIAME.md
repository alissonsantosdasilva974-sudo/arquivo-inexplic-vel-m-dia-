# OmniRoute: Gemini com reserva automática

Instala o [OmniRoute](https://www.npmjs.com/package/omniroute) no seu computador e configura:

- o provedor **gemini** com o modelo padrão `gemini-3.5-flash`;
- o combo **`fallback`**, que tenta nesta ordem:
  1. `gemini/gemini-3.5-flash`
  2. `ddgw/gpt-5-mini` (DuckDuckGo AI Chat, sem chave)
  3. `ddgw/gpt-4o-mini` (DuckDuckGo AI Chat, sem chave)

Se o Gemini falhar ou atingir o limite, o pedido passa sozinho para o próximo.

## Antes de começar

- Node.js 20 ou mais novo: https://nodejs.org
- Uma chave do Gemini (grátis): https://aistudio.google.com/apikey

## Instalar

**Linux / macOS**

```bash
export GEMINI_API_KEY="sua-chave"
bash omniroute/instalar.sh
```

**Windows (PowerShell)**

```powershell
$env:GEMINI_API_KEY = "sua-chave"
powershell -ExecutionPolicy Bypass -File omniroute\instalar.ps1
```

Se você não definir `GEMINI_API_KEY`, o script pede a chave sem mostrá-la na tela.
Pode rodar o script de novo quando quiser: ele não duplica o provedor nem o combo.

## Usar

```bash
omniroute chat "sua pergunta" --model fallback
```

Em outros programas (Cline, OpenCode, Cursor etc.), use a API compatível com OpenAI em
`http://localhost:20128/v1` com o modelo `fallback`.

- Use `--model fallback`. A opção `--combo fallback` **não** usa estes modelos.
- O servidor fica ligado só neste computador (`127.0.0.1`). Depois de reiniciar o PC,
  rode o script de novo para ligá-lo. Para parar: `omniroute stop`.

## Limitações

- A reserva depende do DuckDuckGo AI Chat, que tem limite de uso próprio, e o nome de modelo
  pedido a ele pode não ser o modelo que responde de fato.
- Para uma reserva mais forte, cadastre outra IA com chave, por exemplo:
  `omniroute providers add groq --credential-env GROQ_API_KEY`, e acrescente o modelo
  à variável `COMBO_MODELOS` (ou `$ComboModelos`) no script.
- Os nomes de modelo do Gemini mudam: em novembro de 2026, o `gemini-2.5-flash` já não
  estava disponível para contas novas. Se o teste falhar com erro 404, troque o modelo no script.
