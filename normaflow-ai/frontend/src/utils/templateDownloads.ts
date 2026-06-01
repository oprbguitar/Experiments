import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";

type TemplateFormat = "DOCX" | "XLS";

interface TemplateFile {
  name: string;
  format: TemplateFormat;
  purpose: string;
}

const sections = [
  ["1. Datos generales", ["Entidad o empresa:", "Área usuaria:", "Responsable de revisión:", "Fecha y versión:"]],
  ["2. Antecedentes", ["Describir el contexto y la necesidad documentada."]],
  ["3. Alcance", ["Precisar actividades, límites y exclusiones."]],
  ["4. Entregables o evidencias", ["Definir evidencias verificables y criterios de aceptación."]],
  ["5. Riesgos y supuestos", ["Registrar vacíos de información y validaciones pendientes."]],
] as const;

export async function downloadTemplate(file: TemplateFile): Promise<void> {
  if (file.format === "DOCX") return downloadDocx(file);
  return downloadSpreadsheet(file);
}

export function previewTemplate(file: TemplateFile): string {
  return `# ${file.name}

**Tipo documental:** ${file.format}

**Objetivo:** ${file.purpose || "Completar con el objetivo verificable del documento."}

${sections.map(([title, rows]) => `## ${title}\n${rows.map((row) => `- ${row}`).join("\n")}`).join("\n\n")}

> Esta plantilla es una referencia inicial y requiere revisión profesional antes de su uso formal.`;
}

export function customTemplateFormat(type: string): TemplateFormat {
  return ["SST", "Checklist técnico"].includes(type) ? "XLS" : "DOCX";
}

async function downloadDocx(file: TemplateFile): Promise<void> {
  const children = [
    new Paragraph({ text: file.name, heading: HeadingLevel.TITLE }),
    new Paragraph({ children: [new TextRun({ text: "Tipo documental: ", bold: true }), new TextRun(file.format)] }),
    new Paragraph({ children: [new TextRun({ text: "Objetivo: ", bold: true }), new TextRun(file.purpose || "Completar con el objetivo verificable del documento.")] }),
    ...sections.flatMap(([title, rows]) => [
      new Paragraph({ text: title, heading: HeadingLevel.HEADING_1 }),
      ...rows.map((row) => new Paragraph({ text: row, bullet: { level: 0 } })),
    ]),
    new Paragraph({ text: "Advertencia", heading: HeadingLevel.HEADING_1 }),
    new Paragraph("Esta plantilla es una referencia inicial y requiere revisión profesional antes de su uso formal."),
  ];
  const blob = await Packer.toBlob(new Document({ sections: [{ children }] }));
  triggerDownload(blob, `${slug(file.name)}.docx`);
}

function downloadSpreadsheet(file: TemplateFile): void {
  const rows = file.name.toLowerCase().includes("iperc") || file.name.toLowerCase().includes("sst")
    ? [["Actividad", "Peligro", "Riesgo", "Control existente", "Control propuesto", "Nivel de riesgo", "Responsable", "Evidencia"]]
    : [["Ítem", "Criterio de revisión", "Evidencia requerida", "Estado", "Observaciones", "Responsable"]];
  rows.push(["", "", "", "", "", "", "", ""].slice(0, rows[0].length));
  rows.push(["", "", "", "", "", "", "", ""].slice(0, rows[0].length));
  const xml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
  <Worksheet ss:Name="Plantilla">
    <Table>${rows.map((row) => `<Row>${row.map((cell) => `<Cell><Data ss:Type="String">${escapeXml(cell)}</Data></Cell>`).join("")}</Row>`).join("")}</Table>
  </Worksheet>
</Workbook>`;
  triggerDownload(new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8" }), `${slug(file.name)}.xls`);
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function slug(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
