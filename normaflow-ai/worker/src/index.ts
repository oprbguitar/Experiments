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
      const response = await generateWithFallback(env.GEMINI_API_KEY, prompt);
      if (!response.ok) return json({ success: false, error: "Gemini está temporalmente ocupado. Intenta nuevamente en unos segundos." }, 503, corsHeaders);
      const payload = await response.json() as { candidates?: Array<{ finishReason?: string; content?: { parts?: Array<{ text?: string }> } }> };
      const result = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n").trim();
      if (!result) return json({ success: false, error: "Gemini devolvió una respuesta vacía." }, 502, corsHeaders);
      if (payload.candidates?.[0]?.finishReason === "MAX_TOKENS") return json({ success: false, error: "El documento superó la longitud disponible. Reduce el nivel de detalle o sintetiza los datos de entrada." }, 422, corsHeaders);
      return json({ success: true, module: body.module, result, warnings: ["Resultado preliminar. Requiere revisión profesional antes de su uso formal."] }, 200, corsHeaders);
    } catch {
      return json({ success: false, error: "Error de red al consultar el servicio de IA." }, 502, corsHeaders);
    }
  },
};

async function generateWithFallback(apiKey: string, prompt: string): Promise<Response> {
  const body = JSON.stringify({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.3, maxOutputTokens: 8192 },
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
