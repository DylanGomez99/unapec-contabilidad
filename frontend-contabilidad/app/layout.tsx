import type { Metadata } from "next";
import "./globals.css";
import { TenantProvider } from "@/lib/tenantService";

export const metadata: Metadata = {
  title: "UNAPEC Contabilidad",
  description: "Sistema de Contabilidad Central — Universidad APEC",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <TenantProvider>
          {children}
        </TenantProvider>
      </body>
    </html>
  );
}
