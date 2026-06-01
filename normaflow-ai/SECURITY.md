# Política de seguridad

## Gestión de secretos

- `GEMINI_API_KEY` se configura únicamente como secret del Cloudflare Worker.
- El frontend solo recibe `VITE_API_BASE_URL`.
- Ninguna clave debe almacenarse en commits, documentación, capturas o variables `VITE_*`.
- `.env`, `.env.local`, `.dev.vars`, `node_modules`, `dist` y `.wrangler` están excluidos de Git.

## Controles implementados

- Proxy desacoplado en Cloudflare Workers.
- Validación del módulo, payload JSON y tamaño máximo de entrada.
- CORS restringido a GitHub Pages y localhost de desarrollo.
- Clave transmitida a Gemini en la cabecera `x-goog-api-key`, no en la URL.
- Errores sanitizados sin detalles del proveedor ni secretos.
- Prompts internos que prohíben inventar referencias normativas o datos.

## Respuesta ante exposición accidental

1. Revoca inmediatamente la clave expuesta.
2. Genera una clave nueva.
3. Configúrala con `npx wrangler secret put GEMINI_API_KEY`.
4. Revisa el historial Git y los logs antes de publicar.

## Alcance

NormaFlow AI es una demostración. No procesa datos personales reales ni información reservada. Toda salida requiere revisión profesional antes de su uso formal.
