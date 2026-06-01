export interface Env {
  GEMINI_API_KEY: string;
  ALLOWED_ORIGINS?: string;
}

type ModuleId = "tdr" | "eett" | "sst" | "technical-review";
interface GenerateBody { module: ModuleId; input: Record<string, unknown> }

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

    const prompt = buildPrompt(body.module, body.input);
    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent", {
        method: "POST",
        headers: { ...JSON_HEADERS, "x-goog-api-key": env.GEMINI_API_KEY },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 2400 },
        }),
      });
      if (!response.ok) return json({ success: false, error: "Gemini no pudo completar la solicitud." }, 502, corsHeaders);
      const payload = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
      const result = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n").trim();
      if (!result) return json({ success: false, error: "Gemini devolvió una respuesta vacía." }, 502, corsHeaders);
      return json({ success: true, module: body.module, result, warnings: ["Resultado preliminar. Requiere revisión profesional antes de su uso formal."] }, 200, corsHeaders);
    } catch {
      return json({ success: false, error: "Error de red al consultar el servicio de IA." }, 502, corsHeaders);
    }
  },
};

function buildPrompt(module: ModuleId, input: Record<string, unknown>): string {
  return `Actúa como asistente técnico documental. ${MODULE_GUIDANCE[module]}

Reglas obligatorias:
- Usa solo los datos proporcionados.
- No inventes normas, fechas, certificaciones ni datos técnicos.
- Cuando falte información, indícalo expresamente.
- Diferencia con títulos claros: Hechos proporcionados, Supuestos declarados, Recomendaciones, Riesgos documentales y Texto sugerido.
- Mantén un estilo formal, verificable y apto para revisión profesional.
- Añade al final una advertencia de validación técnica y legal.

Datos proporcionados:
${JSON.stringify(input, null, 2)}`;
}

function isGenerateBody(value: unknown): value is GenerateBody {
  if (!value || typeof value !== "object") return false;
  const body = value as Record<string, unknown>;
  return ["tdr", "eett", "sst", "technical-review"].includes(String(body.module))
    && !!body.input && typeof body.input === "object" && !Array.isArray(body.input)
    && JSON.stringify(body.input).length <= 20_000;
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
