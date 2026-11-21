#!/usr/bin/env bash
# Instala e configura o OmniRoute com Gemini + combo "fallback".
# Uso:  export GEMINI_API_KEY="sua-chave"   (opcional: o script pergunta)
#       bash omniroute/instalar.sh
# Pode ser executado de novo sem duplicar nada.
set -euo pipefail

MODELO_PADRAO="gemini-3.5-flash"
COMBO_NOME="fallback"
COMBO_MODELOS="gemini/gemini-3.5-flash,ddgw/gpt-5-mini,ddgw/gpt-4o-mini"
LOG="$HOME/.omniroute/servidor.log"

# Só escuta neste computador (por padrão o OmniRoute abre para a rede sem senha).
export OMNIROUTE_SERVER_HOST="${OMNIROUTE_SERVER_HOST:-127.0.0.1}"

om() { omniroute "$@" 2>&1 | grep -v -e "Loaded env" -e "is ignored" || true; }

echo "==> Verificando Node.js"
if ! command -v node >/dev/null || ! command -v npm >/dev/null; then
  echo "ERRO: instale o Node.js 20 ou mais novo: https://nodejs.org" >&2; exit 1
fi
if [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 20 ]; then
  echo "ERRO: Node.js $(node -v) é antigo; instale a versão 20 ou mais nova." >&2; exit 1
fi

if [ -z "${GEMINI_API_KEY:-}" ]; then
  echo "Crie uma chave grátis em https://aistudio.google.com/apikey"
  read -r -s -p "Cole sua GEMINI_API_KEY: " GEMINI_API_KEY; echo
  [ -n "$GEMINI_API_KEY" ] || { echo "ERRO: chave vazia." >&2; exit 1; }
  export GEMINI_API_KEY
fi

echo "==> Instalando omniroute (npm install -g omniroute)"
if ! npm install -g omniroute; then
  echo "Falhou sem permissão; tentando com sudo..."
  sudo npm install -g omniroute
fi

echo "==> Iniciando o servidor"
mkdir -p "$(dirname "$LOG")"
if omniroute health >/dev/null 2>&1; then
  echo "Servidor já está rodando."
else
  nohup omniroute serve --no-open --no-tray >"$LOG" 2>&1 &
  for _ in $(seq 1 40); do
    omniroute health >/dev/null 2>&1 && break
    sleep 3
  done
  omniroute health >/dev/null 2>&1 || { echo "ERRO: servidor não subiu. Veja $LOG" >&2; exit 1; }
  echo "Servidor rodando (log: $LOG)."
fi

echo "==> Cadastrando o provedor gemini ($MODELO_PADRAO)"
if omniroute providers list --json 2>/dev/null | grep -q '"name": "gemini"'; then
  om providers edit gemini --credential-env GEMINI_API_KEY --default-model "$MODELO_PADRAO" --active
else
  om providers add gemini --credential-env GEMINI_API_KEY --default-model "$MODELO_PADRAO"
fi

echo "==> Criando o combo '$COMBO_NOME': $COMBO_MODELOS"
if omniroute combo list --output json 2>/dev/null | grep -q "\"name\": \"$COMBO_NOME\""; then
  om combo delete "$COMBO_NOME" --yes
fi
om combo create "$COMBO_NOME" --strategy priority --models "$COMBO_MODELOS"

echo "==> Teste de chat"
om chat "Responda em uma frase curta: qual é a capital do Brasil?" --model "$COMBO_NOME" --no-history

cat <<EOF

Pronto!
  Conversar:    omniroute chat "sua pergunta" --model $COMBO_NOME
  API (OpenAI): http://localhost:20128/v1   modelo: $COMBO_NOME
  Painel:       http://localhost:20128
  Parar:        omniroute stop
  Ligar de novo depois de reiniciar o PC: rode este script outra vez.
EOF
