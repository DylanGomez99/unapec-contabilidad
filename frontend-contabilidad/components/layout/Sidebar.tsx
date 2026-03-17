"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  DollarSign,
  BookOpen,
  FileText,
  Settings,
  ChevronLeft,
  Building2,
  BarChart3,
  Users,
  Layers,
} from "lucide-react";
import TenantSwitcher from "./TenantSwitcher";

const navItems = [
  { href: "/",             label: "Dashboard",       icon: LayoutDashboard },
  { href: "/monedas",      label: "Monedas",         icon: DollarSign },
  { href: "/auxiliares",   label: "Auxiliares",      icon: Users },
  { href: "/tipos-cuenta", label: "Tipos de Cuenta", icon: Layers },
  { href: "/cuentas",      label: "Plan de Cuentas", icon: BookOpen },
  { href: "/asientos",     label: "Asientos",        icon: FileText },
  { href: "/reportes",     label: "Reportes",        icon: BarChart3 },
  { href: "/configuracion",label: "Configuración",   icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative flex-shrink-0 h-screen overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRight: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "2px 0 12px rgba(0,0,0,0.04)",
      }}
    >
      {/* ── Brand ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-4 border-b border-black/5">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm">
          <Building2 size={18} className="text-white" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <p className="text-sm font-semibold text-apple-text leading-tight">UNAPEC</p>
              <p className="text-xs text-apple-secondary">Contabilidad</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav className="flex flex-col gap-0.5 px-2 pt-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                active
                  ? "bg-blue-50 text-blue-600"
                  : "text-apple-secondary hover:bg-black/[0.04] hover:text-apple-text"
              }`}
            >
              <Icon size={18} className={`flex-shrink-0 ${active ? "text-blue-600" : ""}`} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15 }}
                    className={`text-sm font-medium whitespace-nowrap ${active ? "text-blue-600" : ""}`}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* ── Tenant Switcher ─────────────────────────────────────────────── */}
      <div className="absolute bottom-16 left-0 right-0 px-2">
        <TenantSwitcher collapsed={collapsed} />
      </div>

      {/* ── Collapse Toggle ─────────────────────────────────────────────── */}
      <button
        onClick={() => setCollapsed((p) => !p)}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border border-black/08 shadow-apple flex items-center justify-center text-apple-secondary hover:text-apple-text transition-all hover:shadow-apple-hover"
        aria-label="Toggle sidebar"
      >
        <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronLeft size={14} />
        </motion.div>
      </button>
    </motion.aside>
  );
}
