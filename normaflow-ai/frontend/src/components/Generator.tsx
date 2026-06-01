import { CheckCircle2, Clipboard, FileText, LoaderCircle, RotateCcw, ScrollText, Sparkles, WandSparkles } from "lucide-react";
import { useState, type FormEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { demoInputs, moduleContent, type AiModule } from "../data/content";
import { generateDocument } from "../services/api";

export function Generator({ module }: { module: AiModule }) {
  const config = moduleContent[module];
  const [input, setInput] = useState<Record<string, string>>({});
  const [result, setResult] = useState("");
  const [warning, setWarning] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<{ detail: "standard" | "advanced" }>({ detail: "advanced" });

  const reset = () => { setInput({}); setResult(""); setWarning(""); setError(""); };
  const autofill = () => { setInput(demoInputs[module]); setResult(""); setWarning(""); setError(""); };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!Object.values(input).some((value) => value.trim())) return setError("Completa al menos un campo para generar una propuesta.");
    setLoading(true); setError("");
    try {
      const response = await generateDocument(module, input, options);
      setResult(response.result); setWarning(response.warnings.join(" "));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No fue posible completar la solicitud.");
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-5">
      <section><p className="text-sm font-semibold text-teal">Asistencia documental</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-navy">{config.title}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{config.description}</p></section>
      <div className="grid gap-5 xl:grid-cols-[1fr_0.9fr]">
        <form className="panel p-5" onSubmit={submit}>
          <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4"><config.icon size={20} className="text-teal" /><div><h2 className="font-bold text-navy">Información base</h2><p className="text-xs text-slate-500">Incluye únicamente información verificable.</p></div></div>
          <div className="grid gap-4 md:grid-cols-2">
            {config.fields.map((field) => <label className={field.multiline ? "md:col-span-2" : ""} key={field.name}><span className="label">{field.label}</span>{field.multiline ? <textarea rows={4} className="field resize-y" placeholder={field.placeholder} value={input[field.name] ?? ""} onChange={(event) => setInput({ ...input, [field.name]: event.target.value })} /> : <input className="field" placeholder={field.placeholder} value={input[field.name] ?? ""} onChange={(event) => setInput({ ...input, [field.name]: event.target.value })} />}</label>)}
          </div>
          {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <section className="mt-5 rounded-2xl border border-teal/15 bg-teal/5 p-4"><div className="flex items-center gap-2 text-sm font-bold text-navy"><FileText size={17} className="text-teal" /> Documento asistido por IA</div><label className="mt-3 block"><span className="label">Nivel de detalle</span><select className="field" value={options.detail} onChange={(event) => setOptions({ detail: event.target.value as "standard" | "advanced" })}><option value="advanced">Avanzado</option><option value="standard">Estándar</option></select></label><p className="mt-3 text-xs leading-5 text-slate-600">Cada solicitud crea un solo documento estructurado. Los supuestos y vacíos de información deben quedar expresamente declarados.</p></section>
          <div className="mt-5 flex flex-wrap gap-3"><button disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#126967] disabled:opacity-60">{loading ? <LoaderCircle size={17} className="animate-spin" /> : <WandSparkles size={17} />}{loading ? "Generando..." : "Generar documento"}</button><button type="button" onClick={autofill} className="inline-flex items-center gap-2 rounded-xl border border-teal/30 bg-teal/5 px-4 py-3 text-sm font-semibold text-teal hover:bg-teal/10"><Sparkles size={16} /> Autogenerar ejemplo</button><button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"><RotateCcw size={16} /> Limpiar</button></div>
        </form>
        <section className="panel flex min-h-[560px] flex-col overflow-hidden xl:h-[calc(100vh-10.5rem)]">
          <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-bold text-navy">Resultado estructurado</h2><p className="mt-1 text-xs text-slate-500">Vista Markdown completa con desplazamiento interno</p></div>{result && <button aria-label="Copiar resultado" className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:text-teal" onClick={() => navigator.clipboard.writeText(result)}><Clipboard size={17} /></button>}</div>
          {warning && <p className="mx-5 mt-4 shrink-0 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800">{warning}</p>}
          {result ? <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-6 pr-4"><StructuredResult text={result} /></div> : <div className="grid min-h-[330px] flex-1 place-items-center px-5 text-center"><div><CheckCircle2 size={30} className="mx-auto text-slate-300" /><p className="mt-3 text-sm font-semibold text-slate-500">Aquí aparecerá tu propuesta</p><p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">La respuesta separará hechos, supuestos, recomendaciones, riesgos y texto sugerido.</p></div></div>}
          {result && <div className="flex shrink-0 items-center gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3 text-xs font-medium text-slate-500"><ScrollText size={15} className="text-teal" /> Desplázate dentro de esta ventana para revisar el documento completo.</div>}
        </section>
      </div>
    </div>
  );
}

function StructuredResult({ text }: { text: string }) {
  return <article className="markdown-preview mt-5"><ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown></article>;
}
