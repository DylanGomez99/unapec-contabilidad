"use client";

import { useTenant } from "@/lib/tenantService";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { activeTenant } = useTenant();

  return (
    <header className="flex items-center justify-between px-8 py-4 border-b border-black/[0.06] bg-white/50 backdrop-blur-sm">
      <div>
        <h1 className="text-xl font-semibold text-apple-text tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-apple-secondary mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Active Tenant Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.04] border border-black/[0.06]">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: activeTenant.color }}
          />
          <span className="text-xs font-medium text-apple-secondary">{activeTenant.name}</span>
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
          A
        </div>
      </div>
    </header>
  );
}
