import { demoResult, type AiModule } from "../data/content";

export interface GenerateResponse {
  success: boolean;
  module: AiModule;
  result: string;
  warnings: string[];
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

export const isDemoMode = !apiBaseUrl;

export async function generateDocument(module: AiModule, input: Record<string, string>): Promise<GenerateResponse> {
  if (!apiBaseUrl) {
    await new Promise((resolve) => setTimeout(resolve, 850));
    return {
      success: true,
      module,
      result: demoResult,
      warnings: ["Modo demostración activo: configura VITE_API_BASE_URL para utilizar el Worker."],
    };
  }

  const response = await fetch(`${apiBaseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ module, input }),
  });

  const payload = (await response.json()) as GenerateResponse & { error?: string };
  if (!response.ok || !payload.success) throw new Error(payload.error ?? "No fue posible generar el documento.");
  return payload;
}
