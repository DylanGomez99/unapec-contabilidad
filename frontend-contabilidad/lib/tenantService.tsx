"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Tenant } from "@/types";

// ─── Default tenants (replace/extend with your real entities) ─────────────────
const TENANTS: Tenant[] = [
  { id: "UNAPEC", name: "UNAPEC", color: "#0071e3" },
  { id: "CORP",   name: "Corporativo",    color: "#34c759" },
  { id: "DEMO",   name: "Demo Empresa",   color: "#ff9f0a" },
];

interface TenantContextType {
  tenants: Tenant[];
  activeTenant: Tenant;
  setActiveTenant: (tenant: Tenant) => void;
}

const TenantContext = createContext<TenantContextType | null>(null);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [activeTenant, setActiveTenantState] = useState<Tenant>(TENANTS[0]);

  // Persist selection across page reloads
  useEffect(() => {
    const stored = localStorage.getItem("activeTenantId");
    if (stored) {
      const found = TENANTS.find((t) => t.id === stored);
      if (found) setActiveTenantState(found);
    }
  }, []);

  const setActiveTenant = (tenant: Tenant) => {
    setActiveTenantState(tenant);
    localStorage.setItem("activeTenantId", tenant.id);
  };

  return (
    <TenantContext.Provider value={{ tenants: TENANTS, activeTenant, setActiveTenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant(): TenantContextType {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used inside <TenantProvider>");
  return ctx;
}
