export interface Env {
  GEMINI_API_KEY: string;
  ALLOWED_ORIGINS?: string;
}

type ModuleId = "tdr" | "eett" | "sst" | "technical-review";
interface GenerateBody {
  module: ModuleId;
  input: Record<string, unknown>;
  options?: { detail?: "standard" | "advanced" };
}

const MODULE_GUIDANCE: Record<ModuleId, string> = {
  tdr: "Redacta una propuesta preliminar de Términos de Referencia con antecedentes, objeto, alcance, actividades, entregables, plazo, perfil y criterios de conformidad.",
  eett: "Redacta especificaciones técnicas preliminares con uso previsto, características mínimas, entrega, garantía, compatibilidad y criterios de aceptación verificables.",
  sst: "Construye una matriz SST preliminar con actividad, peligro, riesgo, controles existentes, controles propuestos, nivel de riesgo y responsable.",
  "technical-review": "Analiza el texto técnico e identifica claridad, coherencia, formalidad, riesgos documentales y oportunidades de mejora.",
};

const JSON_HEADERS = { "Content-Type": "application/json; charset=UTF-8" };
type GeminiPayload = { candidates?: Array<{ finishReason?: string; content?: { parts?: Array<{ text?: string }> } }> };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") ?? "";
    const corsHeaders = getCorsHeaders(origin, env);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
    if (new URL(request.url).pathname !== "/api/generate") return json({ success: false, error: "Ruta no encontrada." }, 404, corsHeaders);
    if (request.method !== "POST") return json({ success: false, error: "Método no permitido." }, 405, corsHeaders);
    if (!isAllowedOrigin(origin, env)) return json({ success: false, error: "Origen no autorizado." }, 403, corsHeaders);
    if (!env.GEMINI_API_KEY) return json({ success: false, error: "El servicio de IA no está configurado." }, 503, corsHeaders);

    let body: unknown;
    try { body = await request.json(); } catch { return json({ success: false, error: "El cuerpo debe ser JSON válido." }, 400, corsHeaders); }
    if (!isGenerateBody(body)) return json({ success: false, error: "Payload inválido. Revisa module e input." }, 400, corsHeaders);

    const prompt = buildPrompt(body.module, body.input, body.options);
    try {
      const { response, payload } = await generatePayload(env.GEMINI_API_KEY, prompt);
      if (!response.ok) return degradedResponse(body.module, body.input, corsHeaders, "Gemini está temporalmente ocupado. Se generó una estructura preliminar para mantener disponible la simulación.");
      const result = getResult(payload);
      if (!result || payload.candidates?.[0]?.finishReason === "MAX_TOKENS" || result.length > 20_000) {
        return degradedResponse(body.module, body.input, corsHeaders, "Gemini intentó producir una respuesta excesiva. Se aplicó una síntesis estructurada para mantener el documento completo.");
      }
      return json({ success: true, module: body.module, result, warnings: ["Resultado preliminar. Requiere revisión profesional antes de su uso formal."] }, 200, corsHeaders);
    } catch {
      return json({ success: false, error: "Error de red al consultar el servicio de IA." }, 502, corsHeaders);
    }
  },
};

async function generateWithFallback(apiKey: string, prompt: string, maxOutputTokens = 4096): Promise<Response> {
  const body = JSON.stringify({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens,
      thinkingConfig: { thinkingBudget: 0 },
    },
  });
  for (const model of ["gemini-2.5-flash-lite", "gemini-2.5-flash"]) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { ...JSON_HEADERS, "x-goog-api-key": apiKey },
        body,
      });
      if (response.ok || (response.status !== 429 && response.status < 500)) return response;
      await new Promise((resolve) => setTimeout(resolve, 900 * (attempt + 1)));
    }
  }
  return new Response(null, { status: 503 });
}

async function generatePayload(apiKey: string, prompt: string): Promise<{ response: Response; payload: GeminiPayload }> {
  let response = await generateWithFallback(apiKey, prompt);
  if (!response.ok) return { response, payload: {} };
  let payload = await response.json() as GeminiPayload;
  if (payload.candidates?.[0]?.finishReason !== "MAX_TOKENS" && getResult(payload).length <= 20_000) return { response, payload };

  response = await generateWithFallback(apiKey, `${prompt}

Corrección obligatoria de extensión:
- La respuesta anterior excedió la longitud permitida.
- Reescribe el documento completo desde el inicio en un máximo de 1200 palabras.
- No repitas párrafos, filas ni recomendaciones.
- Finaliza todas las secciones y prioriza contenido verificable y conciso.`, 2048);
  if (!response.ok) return { response, payload: {} };
  payload = await response.json() as GeminiPayload;
  return { response, payload };
}

function getResult(payload: GeminiPayload): string {
  return payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n").trim() ?? "";
}

function degradedResponse(module: ModuleId, input: Record<string, unknown>, headers: Record<string, string>, warning: string): Response {
  return json({ success: true, module, result: buildSafeDocument(module, input), warnings: [`${warning} Requiere revisión profesional antes de su uso formal.`] }, 200, headers);
}

function buildSafeDocument(module: ModuleId, input: Record<string, unknown>): string {
  const facts = Object.entries(input).map(([key, value]) => `| ${key} | ${String(value)} |`).join("\n");
  return `# Documento técnico preliminar

## Resumen ejecutivo
${MODULE_GUIDANCE[module]}

## Hechos proporcionados
| Campo | Información registrada |
| --- | --- |
${facts}

## Supuestos declarados
- No se incorporan normas, fechas ni datos que no hayan sido proporcionados.
- Los campos no registrados deben ser completados por el área responsable.

## Recomendaciones
1. Validar el alcance y los criterios de aceptación con el responsable técnico.
2. Verificar las referencias normativas aplicables antes del uso formal.
3. Registrar responsables de elaboración, revisión y aprobación.

## Riesgos documentales
- Puede existir ambigüedad si faltan evidencias verificables.
- El documento requiere validación técnica y legal antes de su aprobación.

## Texto sugerido
La información registrada constituye una estructura preliminar para revisión profesional. El área responsable deberá completar los vacíos identificados, validar los criterios técnicos y aprobar la versión final antes de su uso formal.

## Advertencia
Documento demostrativo sujeto a validación técnica y legal.`;
}

function buildPrompt(module: ModuleId, input: Record<string, unknown>, options?: GenerateBody["options"]): string {
  const detail = options?.detail === "standard" ? "estándar" : "avanzado";
  return `Actúa como asistente técnico documental. ${MODULE_GUIDANCE[module]}

Reglas obligatorias:
- Usa solo los datos proporcionados.
- Copia literalmente cifras, plazos, unidades y nombres proporcionados. No corrijas, completes ni reformules valores numéricos.
- No inventes normas, fechas, certificaciones ni datos técnicos.
- Cuando falte información, indícalo expresamente.
- Diferencia con títulos claros: Hechos proporcionados, Supuestos declarados, Recomendaciones, Riesgos documentales y Texto sugerido.
- Mantén un estilo formal, verificable y apto para revisión profesional.
- Añade al final una advertencia de validación técnica y legal.
- Genera exactamente un documento con nivel de detalle ${detail}.
- No generes variantes ni documentos adicionales.
- Incluye secciones, tablas Markdown o listas de verificación cuando ayuden a la revisión.
- Devuelve Markdown limpio. Usa # para el título, ## para secciones y ### para subsecciones. No simules títulos usando solo negritas.
- Completa todas las secciones antes de finalizar. No termines en medio de una tabla, lista, frase o apartado.
- Si el documento es extenso, prioriza una estructura completa y concisa antes que desarrollar excesivamente una sección.
- Limita la extensión total a un máximo de ${detail === "avanzado" ? "1800" : "1000"} palabras.
- No repitas párrafos, recomendaciones, filas ni apartados.
- Limita cada tabla a un máximo de 12 filas y cada lista a un máximo de 8 elementos.

Datos proporcionados:
${JSON.stringify(input, null, 2)}`;
}

function isGenerateBody(value: unknown): value is GenerateBody {
  if (!value || typeof value !== "object") return false;
  const body = value as Record<string, unknown>;
  return ["tdr", "eett", "sst", "technical-review"].includes(String(body.module))
    && !!body.input && typeof body.input === "object" && !Array.isArray(body.input)
    && JSON.stringify(body.input).length <= 20_000
    && (!body.options || (typeof body.options === "object" && !Array.isArray(body.options)));
}

function allowedOrigins(env: Env): string[] {
  return (env.ALLOWED_ORIGINS ?? "http://localhost:5173,https://oprbguitar.github.io").split(",").map((value) => value.trim());
}

function isAllowedOrigin(origin: string, env: Env): boolean {
  return origin === "" || allowedOrigins(env).includes(origin);
}

function getCorsHeaders(origin: string, env: Env): Record<string, string> {
  const headers: Record<string, string> = {
    ...JSON_HEADERS,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
  if (isAllowedOrigin(origin, env) && origin) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function json(body: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), { status, headers });
}
