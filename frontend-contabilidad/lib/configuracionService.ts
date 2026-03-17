import apiClient from "@/lib/apiClient";
import { ConfiguracionSistema } from "@/types";

const BASE = "/api/configuracion";

export async function getConfiguraciones(): Promise<ConfiguracionSistema[]> {
  const { data } = await apiClient.get<ConfiguracionSistema[]>(BASE);
  return data;
}

export async function updateConfiguracion(id: number, valor: string): Promise<ConfiguracionSistema> {
  const { data } = await apiClient.patch<ConfiguracionSistema>(`${BASE}/${id}`, { valor });
  return data;
}

// ─── Mock data ───────────────────────────────────────────────────────────────
export const MOCK_CONFIG: ConfiguracionSistema[] = [
  { id: 1, clave: "empresa.nombre", valor: "UNAPEC", descripcion: "Razón social de la empresa", grupo: "GENERAL", tipo: "TEXT", editable: false },
  { id: 2, clave: "empresa.rnc", valor: "401-12345-6", descripcion: "Registro Nacional del Contribuyente", grupo: "GENERAL", tipo: "TEXT", editable: false },
  { id: 3, clave: "empresa.direccion", valor: "Av. Máximo Gómez No. 72, Santo Domingo", descripcion: "Dirección fiscal", grupo: "GENERAL", tipo: "TEXT", editable: true },
  { id: 4, clave: "empresa.email", valor: "contabilidad@unapec.edu.do", descripcion: "Correo de contacto", grupo: "GENERAL", tipo: "EMAIL", editable: true },
  { id: 5, clave: "contabilidad.moneda_base", valor: "DOP", descripcion: "Moneda base del sistema", grupo: "CONTABILIDAD", tipo: "TEXT", editable: true },
  { id: 6, clave: "contabilidad.ejercicio_actual", valor: "2026", descripcion: "Año fiscal activo", grupo: "CONTABILIDAD", tipo: "NUMBER", editable: true },
  { id: 7, clave: "contabilidad.periodo_actual", valor: "2026-03", descripcion: "Período contable activo (YYYY-MM)", grupo: "CONTABILIDAD", tipo: "TEXT", editable: true },
  { id: 8, clave: "contabilidad.asientos_manual", valor: "true", descripcion: "Permitir numeración manual de asientos", grupo: "CONTABILIDAD", tipo: "BOOLEAN", editable: true },
  { id: 9, clave: "notificaciones.email_activo", valor: "false", descripcion: "Enviar notificaciones por correo", grupo: "NOTIFICACIONES", tipo: "BOOLEAN", editable: true },
  { id: 10, clave: "notificaciones.email_destino", valor: "admin@unapec.edu.do", descripcion: "Destino de notificaciones", grupo: "NOTIFICACIONES", tipo: "EMAIL", editable: true },
];
