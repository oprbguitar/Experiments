import { demoResult, type AiModule } from "../data/content";

export interface GenerateResponse {
  success: boolean;
  module: AiModule;
  result: string;
  warnings: string[];
}

export interface GenerateOptions {
  detail: "standard" | "advanced";
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

export const isDemoMode = !apiBaseUrl;

export async function generateDocument(module: AiModule, input: Record<string, string>, options: GenerateOptions): Promise<GenerateResponse> {
  if (!apiBaseUrl) {
    await new Promise((resolve) => setTimeout(resolve, 850));
    return {
      success: true,
      module,
      result: demoResult,
      warnings: ["Vista demostrativa: esta propuesta utiliza datos sintéticos. La integración asistida estará disponible cuando el servicio seguro se encuentre activo."],
    };
  }

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(`${apiBaseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ module, input, options }),
    });
    const payload = (await response.json()) as GenerateResponse & { error?: string };
    if (response.ok && payload.success) return payload;
    if (response.status !== 503 || attempt === 2) throw new Error(payload.error ?? "No fue posible generar el documento.");
    await new Promise((resolve) => setTimeout(resolve, 1800 * (attempt + 1)));
  }
  throw new Error("No fue posible generar el documento.");
}
