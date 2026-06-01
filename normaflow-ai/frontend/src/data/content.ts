import { ClipboardCheck, FileSearch, FileText, Gauge, HardHat, Library, LockKeyhole, Mail, PackageCheck, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ModuleId = "dashboard" | "tdr" | "eett" | "sst" | "technical-review" | "templates" | "security" | "contact";
export type AiModule = Extract<ModuleId, "tdr" | "eett" | "sst" | "technical-review">;

export interface NavItem { id: ModuleId; label: string; icon: LucideIcon }
export interface FormField { name: string; label: string; placeholder: string; multiline?: boolean }

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Indicadores", icon: Gauge },
  { id: "tdr", label: "Generador de TDR", icon: FileText },
  { id: "eett", label: "Generador de EETT", icon: PackageCheck },
  { id: "sst", label: "Cumplimiento SST", icon: HardHat },
  { id: "technical-review", label: "Análisis técnico", icon: FileSearch },
  { id: "templates", label: "Plantillas", icon: Library },
  { id: "security", label: "Arquitectura segura", icon: LockKeyhole },
  { id: "contact", label: "Contacto", icon: Mail },
];

export const moduleContent: Record<AiModule, { title: string; description: string; icon: LucideIcon; fields: FormField[] }> = {
  tdr: {
    title: "Generador de TDR",
    description: "Convierte un requerimiento disperso en una estructura preliminar lista para revisión.",
    icon: FileText,
    fields: [
      { name: "entity", label: "Entidad o empresa", placeholder: "Ej. Municipalidad Provincial de Ejemplo" },
      { name: "service", label: "Objeto del servicio", placeholder: "Ej. Supervisión técnica de mantenimiento preventivo" },
      { name: "background", label: "Antecedentes", placeholder: "Describe la necesidad y el contexto...", multiline: true },
      { name: "scope", label: "Alcance y actividades", placeholder: "Indica actividades, entregables y límites del servicio...", multiline: true },
      { name: "term", label: "Plazo", placeholder: "Ej. 45 días calendario" },
      { name: "provider", label: "Perfil del proveedor", placeholder: "Experiencia, formación y capacidades mínimas..." },
      { name: "acceptance", label: "Criterios de conformidad", placeholder: "Condiciones para la aprobación de entregables...", multiline: true },
    ],
  },
  eett: {
    title: "Generador de EETT",
    description: "Organiza especificaciones mínimas, condiciones de entrega y criterios verificables.",
    icon: PackageCheck,
    fields: [
      { name: "goodType", label: "Tipo de bien", placeholder: "Ej. Equipo de protección personal" },
      { name: "intendedUse", label: "Uso previsto", placeholder: "Área usuaria y finalidad operativa..." },
      { name: "features", label: "Características técnicas mínimas", placeholder: "Materiales, capacidad, medidas, desempeño...", multiline: true },
      { name: "delivery", label: "Condiciones de entrega", placeholder: "Lugar, plazo, embalaje y documentación..." },
      { name: "warranty", label: "Garantía", placeholder: "Ej. 12 meses contra defectos de fabricación" },
      { name: "compatibility", label: "Compatibilidad", placeholder: "Normas o equipos existentes relacionados..." },
      { name: "acceptance", label: "Criterios de aceptación", placeholder: "Evidencias y verificaciones requeridas...", multiline: true },
    ],
  },
  sst: {
    title: "Matriz de cumplimiento SST",
    description: "Documenta peligros, riesgos y controles con responsables claramente identificados.",
    icon: HardHat,
    fields: [
      { name: "activity", label: "Actividad", placeholder: "Ej. Inspección de tableros eléctricos" },
      { name: "hazard", label: "Peligro", placeholder: "Ej. Energía eléctrica expuesta" },
      { name: "risk", label: "Riesgo", placeholder: "Ej. Contacto directo o arco eléctrico" },
      { name: "currentControl", label: "Control existente", placeholder: "Control actualmente implementado..." },
      { name: "proposedControl", label: "Control propuesto", placeholder: "Acción complementaria o mejora...", multiline: true },
      { name: "riskLevel", label: "Nivel de riesgo", placeholder: "Ej. Alto" },
      { name: "owner", label: "Responsable", placeholder: "Ej. Responsable SST / supervisor" },
    ],
  },
  "technical-review": {
    title: "Analizador técnico",
    description: "Identifica vacíos, ambigüedades y oportunidades de mejora documental.",
    icon: FileSearch,
    fields: [
      { name: "reviewType", label: "Tipo de revisión", placeholder: "Claridad, coherencia, formalidad, riesgos o mejora documental" },
      { name: "sourceText", label: "Texto fuente", placeholder: "Pega aquí el fragmento técnico que deseas revisar...", multiline: true },
      { name: "expectedResult", label: "Resultado esperado", placeholder: "Ej. observaciones priorizadas y propuesta de redacción", multiline: true },
    ],
  },
};

export const chartData = [
  { month: "Ene", documents: 18, compliance: 71 },
  { month: "Feb", documents: 25, compliance: 76 },
  { month: "Mar", documents: 31, compliance: 80 },
  { month: "Abr", documents: 39, compliance: 84 },
  { month: "May", documents: 46, compliance: 89 },
  { month: "Jun", documents: 54, compliance: 92 },
];

export const templates = [
  ["TDR de servicio especializado", "DOCX", "Estructura editable para contratación de servicios."],
  ["EETT de bienes operativos", "DOCX", "Ficha base con criterios de aceptación verificables."],
  ["Matriz IPERC demostrativa", "XLSX", "Registro sintético para evaluación y control SST."],
  ["Checklist de revisión técnica", "XLSX", "Control previo para expedientes y documentos."],
];

export const demoInputs: Record<AiModule, Record<string, string>> = {
  tdr: {
    entity: "Entidad pública demostrativa",
    service: "Servicio de supervisión técnica de mantenimiento preventivo",
    background: "El área usuaria requiere verificar el estado operativo de instalaciones y reducir incidencias recurrentes mediante una supervisión documentada.",
    scope: "Revisión del plan de trabajo, inspecciones programadas, registro de hallazgos, seguimiento de acciones correctivas y entrega de informe consolidado.",
    term: "45 días calendario",
    provider: "Profesional titulado con experiencia demostrable en supervisión técnica y elaboración de informes.",
    acceptance: "Informe inicial, reportes de inspección e informe final aprobados por el responsable técnico.",
  },
  eett: {
    goodType: "Equipo de protección personal para labores de inspección",
    intendedUse: "Uso operativo del personal técnico durante visitas de campo y actividades de supervisión.",
    features: "Material resistente, identificación visible, talla configurable y ficha técnica del fabricante.",
    delivery: "Entrega en almacén institucional con guía de remisión y verificación física.",
    warranty: "12 meses contra defectos de fabricación",
    compatibility: "Compatibilidad con el equipamiento de seguridad existente, sujeta a validación del área usuaria.",
    acceptance: "Inspección visual, revisión de ficha técnica y conformidad documentada.",
  },
  sst: {
    activity: "Inspección de tableros eléctricos",
    hazard: "Energía eléctrica expuesta",
    risk: "Contacto directo o arco eléctrico",
    currentControl: "Procedimiento de inspección y uso de EPP básico.",
    proposedControl: "Implementar verificación previa de bloqueo, señalización y registro fotográfico controlado.",
    riskLevel: "Alto",
    owner: "Responsable SST y supervisor técnico",
  },
  "technical-review": {
    reviewType: "Claridad, coherencia y riesgos documentales",
    sourceText: "El proveedor realizará las actividades necesarias y presentará los documentos que correspondan dentro del plazo establecido.",
    expectedResult: "Identificar ambigüedades, proponer criterios verificables y sugerir una redacción más precisa.",
  },
};

export const demoResult = `## Resumen ejecutivo
Se propone una estructura documental preliminar basada únicamente en la información registrada. Antes de su uso formal, debe completarse la validación técnica y legal aplicable.

## Hechos proporcionados
- El requerimiento fue registrado mediante el formulario del módulo.
- Se solicita una propuesta estructurada para revisión profesional.

## Supuestos declarados
- No se han verificado referencias normativas específicas.
- Los datos omitidos deben ser completados por el área usuaria.

## Recomendaciones
1. Validar alcance, entregables y criterios de aceptación con el responsable técnico.
2. Incorporar únicamente referencias normativas verificadas y vigentes.
3. Registrar versiones y responsables de aprobación.

## Riesgos documentales
- Ambigüedad si los criterios de conformidad no contienen evidencias verificables.
- Observaciones posteriores si no se delimitan exclusiones y responsabilidades.

## Texto sugerido
El documento deberá ser revisado por el área técnica competente antes de su aprobación y uso formal.`;

export const valueItems = [
  [Sparkles, "Menos reproceso", "Convierte requisitos base en borradores estructurados y trazables."],
  [ClipboardCheck, "Mayor consistencia", "Separa hechos, supuestos, recomendaciones y riesgos documentales."],
  [LockKeyhole, "IA con proxy seguro", "La clave se mantiene fuera del navegador y del repositorio."],
] as const;
