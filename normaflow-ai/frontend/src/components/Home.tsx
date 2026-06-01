import { ArrowRight, BarChart3, FileText, HardHat, LockKeyhole, Mail, PackageCheck, PenLine, ShieldCheck, Sparkles } from "lucide-react";
import type { ModuleId } from "../data/content";

const services = [
  ["tdr", "Generador de TDR", "Estructura términos de referencia claros, completos y listos para revisión.", FileText, "text-emerald-600", "bg-emerald-50", "bg-emerald-50 text-emerald-700"],
  ["eett", "Generador de EETT", "Desarrolla especificaciones técnicas organizadas y alineadas al requerimiento.", PackageCheck, "text-blue-600", "bg-blue-50", "bg-blue-50 text-blue-700"],
  ["sst", "Cumplimiento SST", "Evalúa criterios y controles de seguridad y salud en el trabajo.", HardHat, "text-green-600", "bg-green-50", "bg-green-50 text-green-700"],
  ["technical-review", "Análisis técnico", "Consolida observaciones, criterios y sustento técnico para la toma de decisiones.", BarChart3, "text-violet-600", "bg-violet-50", "bg-violet-50 text-violet-700"],
] as const;

export function Home({ onSelect }: { onSelect: (id: ModuleId) => void }) {
  return <div className="space-y-3">
    <section className="panel flex flex-col gap-3 px-5 py-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-slate-50 text-navy"><PenLine size={19} /></span><p className="text-sm font-bold text-navy">Elaborado por el consultor Pierre R.</p></div>
      <div className="flex items-center gap-3 border-slate-200 md:border-l md:px-6"><ShieldCheck size={18} className="text-slate-500" /><p className="max-w-md text-xs leading-5 text-slate-500">Autoría reservada. Uso demostrativo con enfoque profesional y tratamiento responsable de datos.</p></div>
      <a href="mailto:peru.labs.pe@gmail.com" className="flex items-center gap-2 text-sm font-medium text-slate-600"><Mail size={18} /> peru.labs.pe@gmail.com</a>
    </section>

    <section className="grid gap-5 px-1 py-1 lg:grid-cols-[1.3fr_0.75fr] lg:items-center">
      <div>
        <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-navy">Centro de generación<br />documental inteligente</h1>
        <p className="mt-2 max-w-2xl text-sm leading-5 text-slate-600">Plataforma especializada para elaborar TDR, EETT, matrices de cumplimiento SST y análisis técnicos con enfoque estructurado, trazable y profesional.</p>
        <div className="mt-3 flex max-w-2xl items-center gap-4 rounded-xl border border-teal/20 bg-teal/5 px-4 py-2.5"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal text-white"><Sparkles size={19} /></span><p className="text-sm font-semibold leading-5 text-teal">Automatiza la elaboración documental y mejora la consistencia técnica de tus entregables.</p></div>
      </div>
      <div className="mx-auto flex w-full max-w-xs items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-panel"><Sparkles size={35} className="text-violet-500" /><div><p className="text-sm font-bold text-navy">Potenciado por</p><p className="text-2xl font-bold text-blue-600">Gemini AI</p></div></div>
    </section>

    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {services.map(([id, title, description, Icon, iconColor, circle, action]) => <article className="panel flex min-h-[248px] flex-col p-4 text-center" key={id}>
        <span className={`mx-auto grid h-14 w-14 place-items-center rounded-full ${circle}`}><Icon size={28} className={iconColor} /></span>
        <h2 className={`mt-3 text-base font-bold ${iconColor}`}>{title}</h2>
        <p className="mx-auto mt-2 max-w-52 text-xs leading-5 text-slate-600">{description}</p>
        <button onClick={() => onSelect(id)} className={`mt-auto flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold ${action}`}>Ingresar <ArrowRight size={15} /></button>
      </article>)}
    </section>

    <button onClick={() => onSelect("security")} className="panel flex w-full items-center gap-4 px-5 py-4 text-left"><span className="grid h-10 w-10 place-items-center rounded-full bg-blue-50 text-navy"><LockKeyhole size={19} /></span><span><strong className="block text-sm text-navy">Seguridad y confianza en cada entrega</strong><small className="text-xs text-slate-500">Infraestructura segura, trazabilidad documental y respaldo responsable de la información.</small></span><ArrowRight className="ml-auto text-teal" size={18} /></button>
  </div>;
}
