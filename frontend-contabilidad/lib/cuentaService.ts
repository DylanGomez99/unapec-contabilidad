import apiClient from "@/lib/apiClient";
import {
  CuentaContable,
  CreateCuentaPayload,
  UpdateCuentaPayload,
} from "@/types";

const BASE = "/api/cuentas-contables";

export async function getCuentas(): Promise<CuentaContable[]> {
  const { data } = await apiClient.get<CuentaContable[]>(BASE);
  return data;
}

export async function getCuentaById(id: number): Promise<CuentaContable> {
  const { data } = await apiClient.get<CuentaContable>(`${BASE}/${id}`);
  return data;
}

const TIPO_MAP: Record<string, number> = {
  ACTIVO: 1,
  PASIVO: 2,
  PATRIMONIO: 3,
  INGRESO: 4,
  GASTO: 5
};

export async function createCuenta(payload: CreateCuentaPayload): Promise<CuentaContable> {
  const mapped = { ...payload, tipo: { id: TIPO_MAP[payload.tipo] } };
  const { data } = await apiClient.post<CuentaContable>(BASE, mapped);
  return data;
}

export async function updateCuenta(id: number, payload: UpdateCuentaPayload): Promise<CuentaContable> {
  const mapped = { ...payload, tipo: payload.tipo ? { id: TIPO_MAP[payload.tipo] } : undefined };
  const { data } = await apiClient.put<CuentaContable>(`${BASE}/${id}`, mapped);
  return data;
}

export async function deleteCuenta(id: number): Promise<void> {
  await apiClient.delete(`${BASE}/${id}`);
}

