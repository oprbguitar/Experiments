import { ShieldCheck, X } from "lucide-react";
import { navItems, type ModuleId } from "../data/content";

interface SidebarProps {
  active: ModuleId;
  open: boolean;
  onClose: () => void;
  onSelect: (id: ModuleId) => void;
}

export function Sidebar({ active, open, onClose, onSelect }: SidebarProps) {
  return (
    <>
      {open && <button aria-label="Cerrar menú" className="fixed inset-0 z-30 bg-navy/30 lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-navy px-4 py-5 text-white transition-transform lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-7 flex items-center justify-between px-2">
          <button className="flex items-center gap-3 text-left" onClick={() => onSelect("dashboard")}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal text-white"><ShieldCheck size={21} /></span>
            <span><strong className="block text-base tracking-tight">NormaFlow AI</strong><small className="text-xs text-slate-300">Gestión documental</small></span>
          </button>
          <button aria-label="Cerrar menú" className="lg:hidden" onClick={onClose}><X size={20} /></button>
        </div>
        <nav className="space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => { onSelect(id); onClose(); }} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${active === id ? "bg-white/14 text-white" : "text-slate-300 hover:bg-white/8 hover:text-white"}`}>
              <Icon size={17} strokeWidth={1.9} />{label}
            </button>
          ))}
        </nav>
        <div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-3.5">
          <p className="text-xs font-semibold text-white">Modo demostración</p>
          <p className="mt-1 text-[11px] leading-5 text-slate-300">Datos sintéticos y resultados sujetos a validación profesional.</p>
        </div>
      </aside>
    </>
  );
}
