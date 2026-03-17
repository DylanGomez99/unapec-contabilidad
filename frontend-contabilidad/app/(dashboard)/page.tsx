"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Building2,
  ArrowRight,
  Activity,
  BookOpen,
  FileText,
  BarChart3,
} from "lucide-react";
import Header from "@/components/layout/Header";
import { BentoCard } from "@/components/ui/BentoCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useTenant } from "@/lib/tenantService";
import { getMonedas } from "@/lib/monedaService";
import { Moneda } from "@/types";

export default function DashboardPage() {
  const { activeTenant } = useTenant();
  const [monedas, setMonedas] = useState<Moneda[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMonedas()
      .then(setMonedas)
      .catch(() => setMonedas([]))
      .finally(() => setLoading(false));
  }, [activeTenant.id]);

  const monedasActivas = monedas.filter((m) => m.estado).length;
  const dopRate = monedas.find((m) => m.codigoIso === "DOP")?.tasaCambio;
  const usdRate = monedas.find((m) => m.codigoIso === "USD")?.tasaCambio;

  const quickLinks = [
    { href: "/monedas",   label: "Monedas",       icon: DollarSign, desc: "Gestión de divisas y tasas" },
    { href: "/cuentas",   label: "Plan de Cuentas", icon: BookOpen,  desc: "Catálogo de cuentas contables" },
    { href: "/asientos",  label: "Asientos",       icon: FileText,  desc: "Registro de transacciones" },
    { href: "/reportes",  label: "Reportes",       icon: BarChart3, desc: "Estados financieros" },
  ];

  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" subtitle={`Resumen ejecutivo — ${activeTenant.name}`} />

      <div className="flex-1 p-8 space-y-8">

        {/* ── Bento Grid ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-12 gap-4">

          {/* Card 1 — Tenant (accent, wide) */}
          <div className="col-span-12 md:col-span-5">
            <BentoCard
              accent
              title="Empresa activa"
              value={activeTenant.name}
              subtitle="Tenant seleccionado actualmente"
              icon={Building2}
              className="h-full"
            />
          </div>

          {/* Card 2 — Monedas Activas */}
          <div className="col-span-6 md:col-span-3">
            <BentoCard
              title="Monedas Activas"
              value={loading ? "—" : monedasActivas}
              subtitle="divisas registradas"
              icon={DollarSign}
              iconColor="#34c759"
              className="h-full"
            />
          </div>

          {/* Card 3 — Tasa DOP */}
          <div className="col-span-6 md:col-span-2">
            <BentoCard
              title="Tasa DOP"
              value={loading ? "—" : dopRate ? `${dopRate}` : "N/A"}
              subtitle="vs USD"
              icon={TrendingUp}
              iconColor="#ff9f0a"
              className="h-full"
            />
          </div>

          {/* Card 4 — Tasa USD */}
          <div className="col-span-6 md:col-span-2">
            <BentoCard
              title="Tasa USD"
              value={loading ? "—" : usdRate ? `${usdRate}` : "N/A"}
              subtitle="base"
              icon={Activity}
              iconColor="#0071e3"
              className="h-full"
            />
          </div>
        </div>

        {/* ── Monedas snapshot ────────────────────────────────────────── */}
        {!loading && monedas.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-apple-text">Monedas recientes</h2>
              <Link
                href="/monedas"
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Ver todas <ArrowRight size={12} />
              </Link>
            </div>
            <div className="bg-white rounded-2xl border border-black/[0.06] shadow-apple overflow-hidden">
              {monedas.slice(0, 4).map((m) => (
                <div
                  key={m.id}
                  className="flex items-center px-5 py-3.5 border-b border-black/[0.04] last:border-0 table-row-hover"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600 flex-shrink-0">
                    {m.codigoIso}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-apple-text truncate">{m.nombre}</p>
                    <p className="text-xs text-apple-secondary truncate">{m.descripcion}</p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-sm font-medium text-apple-text">{m.tasaCambio}</span>
                    <StatusBadge active={m.estado} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Quick Links Grid ──────────────────────────────────────────── */}
        <div>
          <h2 className="text-sm font-semibold text-apple-text mb-3">Módulos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickLinks.map(({ href, label, icon: Icon, desc }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col gap-3 p-5 bg-white rounded-2xl border border-black/[0.06] shadow-apple card-hover hover:border-blue-200 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <Icon size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-apple-text">{label}</p>
                  <p className="text-xs text-apple-secondary mt-0.5">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
