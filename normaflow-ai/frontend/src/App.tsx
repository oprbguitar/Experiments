import { Bell, CircleHelp, Menu, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { Generator } from "./components/Generator";
import { Contact, Security, Templates } from "./components/InfoPages";
import { Sidebar } from "./components/Sidebar";
import { type AiModule, type ModuleId } from "./data/content";
import { isDemoMode } from "./services/api";

const aiModules: AiModule[] = ["tdr", "eett", "sst", "technical-review"];

function App() {
  const [active, setActive] = useState<ModuleId>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const content = aiModules.includes(active as AiModule)
    ? <Generator module={active as AiModule} />
    : active === "templates" ? <Templates />
    : active === "security" ? <Security />
    : active === "contact" ? <Contact />
    : <Dashboard onSelect={setActive} />;

  return (
    <div className="min-h-screen bg-mist">
      <Sidebar active={active} open={menuOpen} onClose={() => setMenuOpen(false)} onSelect={setActive} />
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur md:px-7">
          <div className="flex items-center gap-3">
            <button aria-label="Abrir menú" className="rounded-lg border border-slate-200 p-2 text-navy lg:hidden" onClick={() => setMenuOpen(true)}><Menu size={18} /></button>
            <div className="hidden items-center gap-2 text-sm font-semibold text-navy sm:flex"><ShieldCheck size={17} className="text-teal" /> Centro de control documental</div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`hidden rounded-full px-2.5 py-1 text-[11px] font-bold sm:inline-flex ${isDemoMode ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{isDemoMode ? "MODO DEMO" : "SERVICIO IA ACTIVO"}</span>
            <button aria-label="Ayuda" className="text-slate-400 hover:text-teal"><CircleHelp size={18} /></button>
            <button aria-label="Notificaciones" className="text-slate-400 hover:text-teal"><Bell size={18} /></button>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-navy text-xs font-bold text-white">NF</span>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] p-4 md:p-7">{content}</main>
        <footer className="mx-auto max-w-[1500px] px-4 pb-7 md:px-7"><p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-xs font-medium leading-5 text-amber-800">Herramienta demostrativa. Los resultados deben ser revisados por un profesional antes de su uso formal.</p></footer>
      </div>
    </div>
  );
}

export default App;
