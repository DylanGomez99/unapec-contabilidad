import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface BentoCardProps {
  title: string;
  value?: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  children?: ReactNode;
  className?: string;
  accent?: boolean;
}

export function BentoCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "#0071e3",
  children,
  className = "",
  accent = false,
}: BentoCardProps) {
  return (
    <div
      className={`relative p-6 rounded-2xl shadow-apple card-hover overflow-hidden ${
        accent
          ? "bg-gradient-to-br from-blue-500 to-blue-700 text-white"
          : "bg-white border border-black/[0.06]"
      } ${className}`}
    >
      {/* Decorative ring */}
      {accent && (
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
      )}

      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${accent ? "text-white/70" : "text-apple-secondary"}`}>
            {title}
          </p>
          {value !== undefined && (
            <p className={`text-2xl font-bold tracking-tight ${accent ? "text-white" : "text-apple-text"}`}>
              {value}
            </p>
          )}
          {subtitle && (
            <p className={`text-sm mt-1 ${accent ? "text-white/70" : "text-apple-secondary"}`}>
              {subtitle}
            </p>
          )}
          {children}
        </div>

        {Icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ml-3"
            style={{
              backgroundColor: accent ? "rgba(255,255,255,0.2)" : `${iconColor}15`,
            }}
          >
            <Icon size={20} color={accent ? "white" : iconColor} />
          </div>
        )}
      </div>
    </div>
  );
}
