import { demoResult, type AiModule } from "../data/content";

export interface GenerateResponse {
  success: boolean;
  module: AiModule;
  result: string;
  warnings: string[];
}

export interface GenerateOptions {
  count: number;
  detail: "standard" | "advanced";
  variation: boolean;
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

export const isDemoMode = !apiBaseUrl;

export async function generateDocument(module: AiModule, input: Record<string, string>, options: GenerateOptions): Promise<GenerateResponse> {
  if (!apiBaseUrl) {
    await new Promise((resolve) => setTimeout(resolve, 850));
    const result = Array.from({ length: options.count }, (_, index) =>
      options.count > 1 ? `# DOCUMENTO ${index + 1}\n\n${demoResult}` : demoResult,
    ).join("\n\n---\n\n");
    return {
      success: true,
      module,
      result,
      warnings: ["Vista demostrativa: esta propuesta utiliza datos sintéticos. La integración asistida estará disponible cuando el servicio seguro se encuentre activo."],
    };
  }

  const response = await fetch(`${apiBaseUrl}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ module, input, options }),
  });

  const payload = (await response.json()) as GenerateResponse & { error?: string };
  if (!response.ok || !payload.success) throw new Error(payload.error ?? "No fue posible generar el documento.");
  return payload;
}
