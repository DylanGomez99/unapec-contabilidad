"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { useTenant } from "@/lib/tenantService";

interface TenantSwitcherProps {
  collapsed?: boolean;
}

export default function TenantSwitcher({ collapsed = false }: TenantSwitcherProps) {
  const { tenants, activeTenant, setActiveTenant } = useTenant();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-black/[0.04] transition-colors group"
        title={collapsed ? activeTenant.name : undefined}
      >
        {/* Tenant color dot */}
        <div
          className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-bold shadow-sm"
          style={{ backgroundColor: activeTenant.color }}
        >
          {activeTenant.name.charAt(0)}
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 text-left overflow-hidden"
            >
              <p className="text-xs font-semibold text-apple-text truncate">{activeTenant.name}</p>
              <p className="text-[10px] text-apple-secondary">Tenant activo</p>
            </motion.div>
          )}
        </AnimatePresence>

        {!collapsed && (
          <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={13} className="text-apple-secondary" />
          </motion.div>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-2 w-52 rounded-2xl shadow-apple-modal overflow-hidden z-50"
            style={{
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <div className="p-1.5">
              <p className="px-3 py-1.5 text-[10px] font-semibold text-apple-secondary uppercase tracking-wider">
                Cambiar empresa
              </p>
              {tenants.map((tenant) => (
                <button
                  key={tenant.id}
                  onClick={() => { setActiveTenant(tenant); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors text-left"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: tenant.color }}
                  >
                    {tenant.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-apple-text flex-1">{tenant.name}</span>
                  {activeTenant.id === tenant.id && (
                    <Check size={14} className="text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
