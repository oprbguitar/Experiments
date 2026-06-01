# Guía local de NormaFlow AI

## Acceso rápido

La aplicación puede ejecutarse en dos modalidades:

- **Modo demostración:** funciona sin credenciales y devuelve resultados sintéticos.
- **Modo Gemini local:** conecta el frontend con un Cloudflare Worker local y utiliza una clave guardada únicamente en `worker/.dev.vars`.

## Modo demostración

Desde PowerShell:

```powershell
cd "C:\Users\oprbg\Documents\Proyectos Codex\Experiments\normaflow-ai\frontend"
npm run dev -- --host 127.0.0.1
```

Abre:

```text
http://127.0.0.1:5173
```

## Activar Gemini localmente

La opción recomendada es ejecutar el asistente local:

```powershell
cd "C:\Users\oprbg\Documents\Proyectos Codex\Experiments\normaflow-ai"
.\configurar-gemini-local.ps1
```

La clave se solicitará de forma interactiva y no aparecerá en pantalla. Después de ejecutarlo, reinicia el Worker y el frontend.

### Configuración manual alternativa

### 1. Crear el archivo protegido del Worker

Desde la raíz del proyecto:

```powershell
Copy-Item ".\worker\.dev.vars.example" ".\worker\.dev.vars"
notepad ".\worker\.dev.vars"
```

Edita el archivo y reemplaza el placeholder:

```text
GEMINI_API_KEY=TU_CLAVE_REGENERADA
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://oprbguitar.github.io
```

`worker/.dev.vars` está excluido de Git. No copies la clave al frontend, al README ni a variables que comiencen con `VITE_`.

### 2. Configurar el frontend local

```powershell
Copy-Item ".\frontend\.env.example" ".\frontend\.env.local"
notepad ".\frontend\.env.local"
```

Usa este valor:

```text
VITE_API_BASE_URL=http://127.0.0.1:8787
```

### 3. Iniciar el Worker

En una nueva ventana de PowerShell:

```powershell
cd "C:\Users\oprbg\Documents\Proyectos Codex\Experiments\normaflow-ai\worker"
npm run dev -- --ip 127.0.0.1 --port 8787
```

### 4. Reiniciar el frontend

En otra ventana de PowerShell:

```powershell
cd "C:\Users\oprbg\Documents\Proyectos Codex\Experiments\normaflow-ai\frontend"
npm run dev -- --host 127.0.0.1
```

## Uso básico

1. Abre `http://127.0.0.1:5173`.
2. Selecciona `Generador de TDR`, `Generador de EETT`, `Cumplimiento SST` o `Análisis técnico`.
3. Registra información verificable.
4. Pulsa `Generar propuesta`.
5. Revisa los hechos, supuestos, recomendaciones y riesgos.
6. Usa el botón de copia únicamente después de validar el contenido.

## Detener la aplicación

Presiona `Ctrl+C` en cada ventana de PowerShell utilizada para ejecutar Vite o Wrangler.

## Seguridad

- No almacenes datos personales reales ni información reservada.
- No publiques `worker/.dev.vars`, `.env` o `.env.local`.
- Revoca inmediatamente cualquier clave compartida en texto plano.
- Los resultados son preliminares y requieren revisión profesional antes de su uso formal.
