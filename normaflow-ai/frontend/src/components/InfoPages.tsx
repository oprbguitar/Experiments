import { ArrowDownToLine, CheckCircle2, ExternalLink, FilePlus2, Github, LockKeyhole, Mail, Server, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { useState, type FormEvent } from "react";
import { templates } from "../data/content";

export function Templates() {
  const [custom, setCustom] = useState({ name: "", type: "TDR", purpose: "" });
  const [generated, setGenerated] = useState("");
  const contentFor = (name: string, type: string, purpose: string) => `NORMAFLOW AI

PLANTILLA DEMOSTRATIVA: ${name}
TIPO DOCUMENTAL: ${type}
OBJETIVO: ${purpose || "Completar con el objetivo verificable del documento."}

1. DATOS GENERALES
- Entidad o empresa:
- Área usuaria:
- Responsable de revisión:
- Fecha y versión:

2. ANTECEDENTES
- Describir el contexto y la necesidad documentada.

3. ALCANCE
- Precisar actividades, límites y exclusiones.

4. ENTREGABLES O EVIDENCIAS
- Definir evidencias verificables y criterios de aceptación.

5. RIESGOS Y SUPUESTOS
- Registrar vacíos de información y validaciones pendientes.

ADVERTENCIA
Esta plantilla es una referencia inicial y requiere revisión profesional antes de su uso formal.`;
  const download = (name: string, type: string, purpose: string) => {
    const content = contentFor(name, type, purpose);
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = `${name.toLowerCase().replace(/ /g, "-")}.txt`; link.click();
    URL.revokeObjectURL(url);
  };
  const generate = (event: FormEvent) => {
    event.preventDefault();
    if (!custom.name.trim()) return;
    setGenerated(contentFor(custom.name, custom.type, custom.purpose));
  };
  return <div className="space-y-5"><PageHeading kicker="Biblioteca técnica" title="Plantillas autogeneradas" description="Genera recursos editables para acelerar la preparación y revisión de documentos técnicos." /><section className="panel grid gap-5 p-5 lg:grid-cols-[0.85fr_1.15fr]"><form onSubmit={generate}><div className="flex items-center gap-3"><FilePlus2 className="text-teal" size={20} /><div><h2 className="font-bold text-navy">Nueva plantilla</h2><p className="text-xs text-slate-500">Define un objetivo y genera una estructura editable.</p></div></div><div className="mt-5 space-y-4"><label><span className="label">Nombre de la plantilla</span><input className="field" placeholder="Ej. Checklist de supervisión de campo" value={custom.name} onChange={(event) => setCustom({ ...custom, name: event.target.value })} /></label><label><span className="label">Tipo documental</span><select className="field" value={custom.type} onChange={(event) => setCustom({ ...custom, type: event.target.value })}><option>TDR</option><option>EETT</option><option>SST</option><option>Checklist técnico</option></select></label><label><span className="label">Objetivo</span><textarea className="field resize-y" rows={4} placeholder="Describe el propósito verificable..." value={custom.purpose} onChange={(event) => setCustom({ ...custom, purpose: event.target.value })} /></label></div><button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-3 text-sm font-semibold text-white"><Sparkles size={16} /> Generar plantilla</button></form><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">{generated ? <><pre className="max-h-[350px] overflow-auto whitespace-pre-wrap font-sans text-xs leading-5 text-slate-600">{generated}</pre><button onClick={() => download(custom.name, custom.type, custom.purpose)} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal"><ArrowDownToLine size={16} /> Descargar plantilla generada</button></> : <div className="grid h-full min-h-52 place-items-center text-center text-sm text-slate-400">La estructura autogenerada aparecerá aquí.</div>}</div></section><div className="grid gap-4 md:grid-cols-2">{templates.map(([name, type, description]) => <article className="panel p-5" key={name}><div className="flex items-start justify-between"><div><p className="text-xs font-bold tracking-wider text-teal">{type}</p><h2 className="mt-2 font-bold text-navy">{name}</h2></div><ArrowDownToLine size={19} className="text-slate-400" /></div><p className="mt-3 text-sm leading-6 text-slate-500">{description}</p><button onClick={() => download(name, type, description)} className="mt-5 text-sm font-semibold text-teal">Descargar plantilla base</button></article>)}</div></div>;
}

export function Security() {
  return <div className="space-y-5"><PageHeading kicker="Arquitectura y seguridad" title="Diseñada para proteger credenciales" description="El navegador nunca recibe la clave de Gemini. La integración utiliza un proxy desacoplado y secretos de entorno." /><section className="panel p-5 md:p-7"><div className="grid gap-5 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center">{[[ShieldCheck, "Frontend público", "React + GitHub Pages", "Solo envía datos del formulario."], [Server, "Worker seguro", "Cloudflare Worker", "Valida payload y gestiona CORS."], [LockKeyhole, "Gemini API", "Secret GEMINI_API_KEY", "La clave vive fuera del repositorio."]].map(([Icon, title, subtitle, description], index) => <div className="contents" key={String(title)}><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><Icon className="text-teal" size={22} /><h2 className="mt-4 font-bold text-navy">{title as string}</h2><p className="mt-1 text-xs font-semibold text-teal">{subtitle as string}</p><p className="mt-3 text-xs leading-5 text-slate-500">{description as string}</p></div>{index < 2 && <Workflow className="mx-auto hidden text-slate-300 md:block" size={20} />}</div>)}</div></section><section className="grid gap-4 md:grid-cols-3">{["Sin claves en el bundle público", "CORS limitado a orígenes autorizados", "Prompts con advertencias de validación"].map((item) => <div className="flex items-start gap-3 bg-white p-4 text-sm font-medium text-slate-600" key={item}><CheckCircle2 size={18} className="mt-0.5 shrink-0 text-teal" />{item}</div>)}</section></div>;
}

export function Contact() {
  return <div className="space-y-5"><PageHeading kicker="Contacto profesional" title="Ingeniería documental con IA aplicada" description="Una demostración orientada a reducir tiempos de elaboración y mejorar la trazabilidad de entregables técnicos." /><section className="panel grid gap-6 p-6 lg:grid-cols-[1fr_0.8fr] lg:p-8"><div><h2 className="text-xl font-bold text-navy">Conversemos sobre tu flujo documental</h2><p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">NormaFlow AI puede adaptarse a plantillas institucionales, controles internos y flujos de validación específicos.</p><div className="mt-6 flex flex-wrap gap-3"><a className="inline-flex items-center gap-2 rounded-xl bg-teal px-4 py-3 text-sm font-semibold text-white" href="mailto:contacto@example.com"><Mail size={17} /> Solicitar demostración</a><a className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600" href="https://github.com/oprbguitar/Experiments" target="_blank" rel="noreferrer"><Github size={17} /> Ver repositorio <ExternalLink size={14} /></a></div></div><div className="rounded-2xl bg-navy p-5 text-white"><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-300">Propuesta de valor</p><p className="mt-4 text-lg font-semibold leading-7">Transformo requerimientos dispersos en documentos técnicos, matrices de cumplimiento y reportes listos para revisión.</p></div></section></div>;
}

function PageHeading({ kicker, title, description }: { kicker: string; title: string; description: string }) {
  return <section><p className="text-sm font-semibold text-teal">{kicker}</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-navy">{title}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p></section>;
}
