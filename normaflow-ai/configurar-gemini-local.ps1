$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$workerVarsPath = Join-Path $projectRoot "worker\.dev.vars"
$frontendEnvPath = Join-Path $projectRoot "frontend\.env.local"

Write-Host ""
Write-Host "NormaFlow AI - Configuracion local de Gemini" -ForegroundColor Cyan
Write-Host "La clave se guardara solo en worker\.dev.vars, archivo excluido de Git."
Write-Host ""

$secureKey = Read-Host "Pega tu GEMINI_API_KEY regenerada" -AsSecureString
$keyPointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureKey)

try {
    $plainKey = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($keyPointer)
    if ([string]::IsNullOrWhiteSpace($plainKey)) {
        throw "No se ingreso ninguna clave."
    }

    @"
GEMINI_API_KEY=$plainKey
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://oprbguitar.github.io
"@ | Set-Content -LiteralPath $workerVarsPath -Encoding utf8

    "VITE_API_BASE_URL=http://127.0.0.1:8787" | Set-Content -LiteralPath $frontendEnvPath -Encoding utf8
}
finally {
    if ($keyPointer -ne [IntPtr]::Zero) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($keyPointer)
    }
    $plainKey = $null
}

Write-Host ""
Write-Host "Configuracion creada correctamente." -ForegroundColor Green
Write-Host "Ahora avisa a Codex para iniciar el Worker y reiniciar el frontend."
Write-Host ""
Read-Host "Presiona Enter para cerrar"
