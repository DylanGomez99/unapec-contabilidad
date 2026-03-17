import apiClient from "@/lib/apiClient";
import { Asiento, CreateAsientoPayload, UpdateAsientoPayload } from "@/types";

const BASE = "/api/asientos";

export async function getAsientos(): Promise<Asiento[]> {
  const { data } = await apiClient.get<Asiento[]>(BASE);
  return data;
}

export async function getAsientoById(id: number): Promise<Asiento> {
  const { data } = await apiClient.get<Asiento>(`${BASE}/${id}`);
  return data;
}

export async function createAsiento(payload: CreateAsientoPayload): Promise<Asiento> {
  const backendPayload = {
    asiento: {
      fechaAsiento: payload.fecha.split("T")[0],
      descripcion: payload.descripcion,
      referencia: payload.referencia
    },
    detalles: payload.detalles.map(d => ({
      cuenta: { id: d.cuentaId },
      tipoMovimiento: d.debe > 0 ? "Debito" : "Credito",
      monto: d.debe > 0 ? d.debe : d.haber
    }))
  };

  const { data } = await apiClient.post<Asiento>(BASE, backendPayload);
  return data;
}

export async function updateAsiento(id: number, payload: UpdateAsientoPayload): Promise<Asiento> {
  const { data } = await apiClient.put<Asiento>(`${BASE}/${id}`, payload);
  return data;
}

export async function confirmarAsiento(id: number): Promise<Asiento> {
  const { data } = await apiClient.patch<Asiento>(`${BASE}/${id}/confirmar`);
  return data;
}

export async function anularAsiento(id: number): Promise<Asiento> {
  const { data } = await apiClient.patch<Asiento>(`${BASE}/${id}/anular`);
  return data;
}


