import apiClient from "@/lib/apiClient";
import { Moneda, CreateMonedaPayload, UpdateMonedaPayload } from "@/types";

const BASE = "/api/monedas";

/** Fetch all currencies */
export async function getMonedas(): Promise<Moneda[]> {
  const { data } = await apiClient.get<Moneda[]>(BASE);
  return data;
}

/** Fetch a single currency by ID */
export async function getMonedaById(id: number): Promise<Moneda> {
  const { data } = await apiClient.get<Moneda>(`${BASE}/${id}`);
  return data;
}

/** Create a new currency */
export async function createMoneda(payload: CreateMonedaPayload): Promise<Moneda> {
  const { data } = await apiClient.post<Moneda>(BASE, payload);
  return data;
}

/** Update an existing currency */
export async function updateMoneda(id: number, payload: UpdateMonedaPayload): Promise<Moneda> {
  const { data } = await apiClient.put<Moneda>(`${BASE}/${id}`, payload);
  return data;
}

/** Delete a currency */
export async function deleteMoneda(id: number): Promise<void> {
  await apiClient.delete(`${BASE}/${id}`);
}
