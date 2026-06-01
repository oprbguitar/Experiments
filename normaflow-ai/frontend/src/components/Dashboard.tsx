import { ArrowRight, CheckCircle2, Clock3, FileCheck2, FileText, ShieldCheck, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartData, valueItems, type ModuleId } from "../data/content";

const activities = [
  ["TDR mantenimiento preventivo", "TDR", "En revisión", "Hace 12 min"],
  ["EETT equipos de protección", "EETT", "Validado", "Hace 1 h"],
  ["Matriz IPERC almacén central", "SST", "Observado", "Ayer"],
  ["Informe de supervisión", "Análisis", "Validado", "28 may"],
];

export function Dashboard({ onSelect }: { onSelect: (id: ModuleId) => void }) {
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
        <div>
          <p className="text-sm font-semibold text-teal">Resumen ejecutivo</p>
          <h1 className="mt-1 max-w-2xl text-3xl font-bold tracking-tight text-navy md:text-4xl">Documentos técnicos claros, trazables y listos para revisión.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Transforma requerimientos dispersos en borradores estructurados, matrices de cumplimiento y reportes preliminares.</p>
        </div>
        <button onClick={() => onSelect("tdr")} className="inline-flex w-fit items-center gap-2 rounded-xl bg-teal px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#126967]">
          Nuevo documento <ArrowRight size={17} />
        </button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Documentos generados", "184", "+18% este mes", FileText],
          ["Cumplimiento SST", "92%", "+8 pts trimestre", ShieldCheck],
          ["Tiempo promedio", "38 min", "-61% elaboración", Clock3],
          ["Listos para revisión", "27", "12 pendientes", FileCheck2],
        ].map(([label, value, detail, Icon]) => (
          <div className="panel p-4" key={String(label)}>
            <div className="flex items-center justify-between text-slate-500"><span className="text-xs font-semibold uppercase tracking-wider">{label as string}</span><Icon size={18} /></div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-navy">{value as string}</p>
            <p className="mt-1 text-xs font-medium text-teal">{detail as string}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
        <div className="panel p-5">
          <div className="flex items-start justify-between gap-3">
            <div><h2 className="font-bold text-navy">Producción documental</h2><p className="mt-1 text-xs text-slate-500">Documentos elaborados durante el semestre</p></div>
            <TrendingUp className="text-teal" size={20} />
          </div>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs><linearGradient id="docFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#167b79" stopOpacity={0.34} /><stop offset="100%" stopColor="#167b79" stopOpacity={0.02} /></linearGradient></defs>
                <CartesianGrid stroke="#e8eef2" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#718096", fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#718096", fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="documents" stroke="#167b79" strokeWidth={3} fill="url(#docFill)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel p-5">
          <h2 className="font-bold text-navy">Control de cumplimiento</h2>
          <p className="mt-1 text-xs text-slate-500">Matriz SST demostrativa por estado</p>
          <div className="mt-6 space-y-5">
            {[["Controles implementados", 82, "bg-teal"], ["En proceso de mejora", 64, "bg-[#d49b47]"], ["Trazabilidad documental", 91, "bg-navy"]].map(([label, value, color]) => (
              <div key={String(label)}>
                <div className="mb-2 flex justify-between text-xs font-semibold text-slate-600"><span>{label as string}</span><span>{value as number}%</span></div>
                <div className="h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${color}`} style={{ width: `${value}%` }} /></div>
              </div>
            ))}
          </div>
          <button onClick={() => onSelect("sst")} className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-teal">Ver matriz SST <ArrowRight size={15} /></button>
        </div>
      </section>

      <section className="panel overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-bold text-navy">Actividad reciente</h2><p className="mt-1 text-xs text-slate-500">Casos anonimizados con datos sintéticos</p></div><CheckCircle2 size={19} className="text-teal" /></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500"><tr>{["Documento", "Módulo", "Estado", "Última actividad"].map((item) => <th className="px-5 py-3 font-semibold" key={item}>{item}</th>)}</tr></thead><tbody>{activities.map(([name, module, status, time]) => <tr className="border-t border-slate-100" key={name}><td className="px-5 py-3.5 font-medium text-ink">{name}</td><td className="px-5 py-3.5 text-slate-500">{module}</td><td className="px-5 py-3.5"><span className="text-xs font-semibold text-teal">{status}</span></td><td className="px-5 py-3.5 text-slate-500">{time}</td></tr>)}</tbody></table></div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {valueItems.map(([Icon, title, description]) => <div key={title} className="border-l-2 border-teal bg-white px-4 py-3"><Icon size={18} className="text-teal" /><h3 className="mt-3 text-sm font-bold text-navy">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{description}</p></div>)}
      </section>
    </div>
  );
}
