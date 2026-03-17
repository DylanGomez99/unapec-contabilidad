"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, RefreshCw, Settings, Building2, BookOpen, Bell } from "lucide-react";
import Header from "@/components/layout/Header";
import { ConfiguracionSistema } from "@/types";
import { getConfiguraciones, updateConfiguracion, MOCK_CONFIG } from "@/lib/configuracionService";
import { useTenant } from "@/lib/tenantService";

const GRUPOS = [
  { key: "GENERAL",         label: "General",         icon: Building2 },
  { key: "CONTABILIDAD",    label: "Contabilidad",    icon: BookOpen },
  { key: "NOTIFICACIONES",  label: "Notificaciones",  icon: Bell },
];

function ConfigRow({ config, onSave }: { config: ConfiguracionSistema; onSave: (id: number, val: string) => Promise<void> }) {
  const [val, setVal] = useState(config.valor);
  const [saving, setSaving] = useState(false);
  const changed = val !== config.valor;

  const save = async () => {
    setSaving(true);
    await onSave(config.id, val);
    setSaving(false);
  };

  return (
    <div className="grid grid-cols-12 gap-4 items-center px-4 py-3 border-b border-black/[0.04] last:border-0 table-row-hover">
      <div className="col-span-3">
        <code className="text-xs font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{config.clave}</code>
        {config.descripcion && <p className="text-xs text-apple-secondary mt-0.5 leading-tight">{config.descripcion}</p>}
      </div>
      <div className="col-span-7">
        {!config.editable ? (
          <span className="text-sm text-apple-secondary px-3 py-2 rounded-xl bg-black/[0.03] border border-black/[0.06] block">{config.valor}</span>
        ) : config.tipo === "BOOLEAN" ? (
          <button
            onClick={() => setVal(val === "true" ? "false" : "true")}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${val === "true" ? "bg-green-50 border-green-200 text-green-700" : "bg-gray-50 border-gray-200 text-gray-500"}`}
          >
            <span className={`w-2 h-2 rounded-full ${val === "true" ? "bg-green-500" : "bg-gray-400"}`} />
            {val === "true" ? "Activado" : "Desactivado"}
          </button>
        ) : (
          <input
            value={val}
            onChange={e => setVal(e.target.value)}
            type={config.tipo === "NUMBER" ? "number" : config.tipo === "EMAIL" ? "email" : "text"}
            className="w-full px-3 py-2 rounded-xl border border-black/[0.10] bg-white text-sm text-apple-text outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        )}
      </div>
      <div className="col-span-2 flex justify-end">
        {config.editable && (
          <button
            onClick={save}
            disabled={!changed || saving}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${changed ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm" : "bg-black/[0.04] text-apple-secondary cursor-not-allowed"}`}
          >
            <Save size={12} /> {saving ? "…" : "Guardar"}
          </button>
        )}
        {!config.editable && <span className="text-xs text-apple-secondary italic">Solo lectura</span>}
      </div>
    </div>
  );
}

export default function ConfiguracionPage() {
  const { activeTenant } = useTenant();
  const [configs, setConfigs] = useState<ConfiguracionSistema[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGrupo, setActiveGrupo] = useState("GENERAL");
  const [savedMsg, setSavedMsg] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getConfiguraciones();
      setConfigs(data);
    } catch {
      setConfigs(MOCK_CONFIG);
    } finally {
      setLoading(false);
    }
  }, [activeTenant.id]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSave = async (id: number, valor: string) => {
    try {
      const updated = await updateConfiguracion(id, valor);
      setConfigs(prev => prev.map(c => c.id === id ? updated : c));
    } catch {
      setConfigs(prev => prev.map(c => c.id === id ? { ...c, valor } : c));
    }
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const filtradas = configs.filter(c => c.grupo === activeGrupo);

  return (
    <div className="flex flex-col h-full">
      <Header title="Configuración" subtitle="Parámetros del sistema de contabilidad" />

      <div className="flex-1 p-8 space-y-5">
        {/* Tab pills */}
        <div className="flex items-center gap-2">
          {GRUPOS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveGrupo(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeGrupo === key ? "bg-blue-600 text-white shadow-sm" : "bg-white border border-black/[0.08] text-apple-secondary hover:text-apple-text"}`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
          <button onClick={fetch} disabled={loading} className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/[0.08] text-sm text-apple-secondary hover:bg-white transition-all">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Save confirmation */}
        {savedMsg && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm">
            ✓ Configuración guardada correctamente.
          </div>
        )}

        {/* Config table */}
        <div className="bg-white rounded-2xl border border-black/[0.06] shadow-apple overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-black/[0.06] bg-apple-gray/60">
            {["Clave / Descripción", "Valor", "Acción"].map((h, i) => (
              <div key={h} className={`text-[11px] font-semibold text-apple-secondary uppercase tracking-wider ${i === 0 ? "col-span-3" : i === 1 ? "col-span-7" : "col-span-2 text-right"}`}>{h}</div>
            ))}
          </div>

          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-black/[0.04]">
                <div className="col-span-3 h-4 rounded-full bg-black/[0.06] animate-pulse" />
                <div className="col-span-7 h-4 rounded-full bg-black/[0.06] animate-pulse" />
              </div>
            ))
          ) : filtradas.length === 0 ? (
            <div className="py-10 text-center text-sm text-apple-secondary flex flex-col items-center gap-2">
              <Settings size={24} className="text-apple-secondary/40" />
              No hay configuraciones en este grupo.
            </div>
          ) : (
            filtradas.map((c) => <ConfigRow key={c.id} config={c} onSave={handleSave} />)
          )}
        </div>

        <p className="text-xs text-apple-secondary">
          Los campos marcados como "Solo lectura" son gestionados por el administrador del sistema.
        </p>
      </div>
    </div>
  );
}
