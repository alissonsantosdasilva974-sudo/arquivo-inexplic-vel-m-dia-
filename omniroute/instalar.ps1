# Instala e configura o OmniRoute com Gemini + combo "fallback" (Windows).
# Uso (PowerShell):
#   $env:GEMINI_API_KEY = "sua-chave"     # opcional: o script pergunta
#   powershell -ExecutionPolicy Bypass -File omniroute\instalar.ps1
# Pode ser executado de novo sem duplicar nada.
# "Continue": no Windows PowerShell 5.1, "Stop" trata qualquer texto em stderr
# de programas (avisos do npm/omniroute) como erro fatal. Erros reais usam throw.
$ErrorActionPreference = "Continue"

$ModeloPadrao = "gemini-3.5-flash"
$ComboNome    = "fallback"
$ComboModelos = "gemini/gemini-3.5-flash,ddgw/gpt-5-mini,ddgw/gpt-4o-mini"
$Pasta        = Join-Path $HOME ".omniroute"
$Log          = Join-Path $Pasta "servidor.log"

# Só escuta neste computador (por padrão o OmniRoute abre para a rede sem senha).
if (-not $env:OMNIROUTE_SERVER_HOST) { $env:OMNIROUTE_SERVER_HOST = "127.0.0.1" }

function Om {
  & omniroute @args 2>&1 | ForEach-Object { "$_" } |
    Where-Object { $_ -notmatch "Loaded env|is ignored" }
}
function Saudavel { & omniroute health *> $null; return ($LASTEXITCODE -eq 0) }

Write-Host "==> Verificando Node.js"
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Instale o Node.js 20 ou mais novo: https://nodejs.org"
}
$versao = [int]((node -p "process.versions.node.split('.')[0]") | Out-String).Trim()
if ($versao -lt 20) { throw "Node.js $(node -v) é antigo; instale a versão 20 ou mais nova." }

if (-not $env:GEMINI_API_KEY) {
  Write-Host "Crie uma chave grátis em https://aistudio.google.com/apikey"
  $seg = Read-Host "Cole sua GEMINI_API_KEY" -AsSecureString
  $env:GEMINI_API_KEY = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($seg))
  if (-not $env:GEMINI_API_KEY) { throw "Chave vazia." }
}

Write-Host "==> Instalando omniroute (npm install -g omniroute)"
npm install -g omniroute
if ($LASTEXITCODE -ne 0) { throw "npm install falhou." }

Write-Host "==> Iniciando o servidor"
New-Item -ItemType Directory -Force -Path $Pasta | Out-Null
if (Saudavel) {
  Write-Host "Servidor já está rodando."
} else {
  Start-Process -FilePath "cmd.exe" -WindowStyle Hidden `
    -ArgumentList "/c omniroute serve --no-open --no-tray > `"$Log`" 2>&1"
  for ($i = 0; $i -lt 40; $i++) { if (Saudavel) { break }; Start-Sleep 3 }
  if (-not (Saudavel)) { throw "Servidor não subiu. Veja $Log" }
  Write-Host "Servidor rodando (log: $Log)."
}

Write-Host "==> Cadastrando o provedor gemini ($ModeloPadrao)"
$provedores = (& omniroute providers list --json 2>$null) -join "`n"
if ($provedores -match '"name":\s*"gemini"') {
  Om providers edit gemini --credential-env GEMINI_API_KEY --default-model $ModeloPadrao --active
} else {
  Om providers add gemini --credential-env GEMINI_API_KEY --default-model $ModeloPadrao
}

Write-Host "==> Criando o combo '$ComboNome': $ComboModelos"
$combos = (& omniroute combo list --output json 2>$null) -join "`n"
if ($combos -match "`"name`":\s*`"$ComboNome`"") { Om combo delete $ComboNome --yes }
Om combo create $ComboNome --strategy priority --models $ComboModelos

Write-Host "==> Teste de chat"
Om chat "Responda em uma frase curta: qual é a capital do Brasil?" --model $ComboNome --no-history

Write-Host @"

Pronto!
  Conversar:    omniroute chat "sua pergunta" --model $ComboNome
  API (OpenAI): http://localhost:20128/v1   modelo: $ComboNome
  Painel:       http://localhost:20128
  Parar:        omniroute stop
  Ligar de novo depois de reiniciar o PC: rode este script outra vez.
"@
