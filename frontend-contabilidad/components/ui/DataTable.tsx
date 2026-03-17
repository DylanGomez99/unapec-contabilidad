"use client";

import React from "react";
import { TableColumn } from "@/types";
import { Download, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  keyExtractor: (row: T) => string | number;
  exportable?: boolean;
  tableName?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No hay datos disponibles.",
  keyExtractor,
  exportable = false,
  tableName = "Reporte",
}: DataTableProps<T>) {

  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Filter columns that should appear in exports
  const exportCols = columns.filter(c => !c.excludeFromExport);

  /** Extract plain text from a column for a given row */
  function getExportText(col: typeof exportCols[number], row: T): string {
    // Prefer the explicit exportValue callback
    if (col.exportValue) return String(col.exportValue(row));
    // If accessor is a direct property key, use the raw value
    if (typeof col.accessor !== "function") return String(row[col.accessor] ?? "");
    // Last resort: run the JSX accessor and try to coerce
    const val = col.accessor(row);
    if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") return String(val);
    return "";
  }

  const handleExportPDF = () => {
    const doc = new jsPDF("l", "pt", "a4");
    const today = new Date().toLocaleString("es-DO");

    doc.setFontSize(16);
    doc.text(tableName, 40, 40);
    doc.setFontSize(10);
    doc.text(`Generado: ${today}`, 40, 60);

    const head = [exportCols.map(c => c.header)];
    const body = data.map(row => exportCols.map(col => getExportText(col, row)));

    autoTable(doc, {
      startY: 80,
      head,
      body,
      theme: "striped",
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    doc.save(`${tableName.replace(/\s+/g, "_")}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleExportCSV = () => {
    // col.header could theoretically be a React node in some systems, but our type says string.
    // However, to be completely safe against `[Element]` or objects, we'll explicitly stringify.
    const headers = exportCols.map(c => {
      const h = typeof c.header === "string" ? c.header : (c.header as any)?.toString() || "";
      return `"${h.replace(/"/g, '""')}"`;
    }).join(",");
    
    const rows = data.map(row =>
      exportCols.map(col => {
        const val = getExportText(col, row);
        return `"${val.replace(/"/g, '""')}"`;
      }).join(",")
    ).join("\n");

    const bom = "\uFEFF";
    const blob = new Blob([bom + headers + "\n" + rows], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${tableName.replace(/\s+/g, "_")}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="flex flex-col gap-3">
      {exportable && data.length > 0 && (
        <div className="flex justify-end gap-2">
          <button onClick={handleExportCSV} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/[0.08] text-[11px] font-semibold text-apple-secondary hover:bg-white hover:text-black transition-all bg-apple-gray/30">
            <FileText size={13} /> CSV
          </button>
          <button onClick={handleExportPDF} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/[0.08] text-[11px] font-semibold text-apple-secondary hover:bg-white hover:text-red-600 transition-all bg-apple-gray/30">
            <Download size={13} /> PDF
          </button>
        </div>
      )}
      
      <div className="w-full overflow-hidden rounded-2xl border border-black/[0.06] shadow-apple bg-white">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
          {/* ── Head ─────────────────────────────────────────────────── */}
          <thead>
            <tr className="border-b border-black/[0.06] bg-apple-gray/60">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`px-5 py-3 text-left text-[11px] font-semibold text-apple-secondary uppercase tracking-wider whitespace-nowrap`}
                  style={{ width: col.width, textAlign: col.align }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* ── Body ─────────────────────────────────────────────────── */}
          <tbody>
            {isLoading ? (
              /* Skeleton rows */
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-black/[0.04]">
                  {columns.map((_, j) => (
                    <td key={j} className="px-5 py-3.5">
                      <div className="h-4 rounded-full bg-black/[0.06] animate-pulse" style={{ width: `${60 + (j * 15) % 40}%` }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-14 text-center text-sm text-apple-secondary">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  className="group border-b border-black/[0.04] last:border-0 table-row-hover"
                >
                  {columns.map((col, j) => (
                    <td
                      key={j}
                      className="px-5 py-3.5 text-sm text-apple-text"
                      style={{ textAlign: col.align }}
                    >
                      {typeof col.accessor === "function"
                        ? col.accessor(row)
                        : String(row[col.accessor] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ────────────────────────────────────────── */}
      {data.length > 0 && (
        <div className="flex items-center justify-between px-5 py-2.5 bg-apple-gray/20 text-xs text-apple-secondary">
          <div className="flex items-center gap-1.5">
            <span>Mostrar</span>
            <select 
              value={pageSize} 
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="px-1.5 py-0.5 rounded border border-black/[0.1] bg-white text-apple-text outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {[5, 10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>filas</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage <= 1} 
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-2 py-1 rounded border border-black/[0.08] bg-white hover:bg-black/[0.02] disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              Anterior
            </button>
            <span className="font-medium text-apple-text whitespace-nowrap">Página {currentPage} de {totalPages || 1}</span>
            <button 
              disabled={currentPage >= totalPages} 
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-2 py-1 rounded border border-black/[0.08] bg-white hover:bg-black/[0.02] disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);
}
