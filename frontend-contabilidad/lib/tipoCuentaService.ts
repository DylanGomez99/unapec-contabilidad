import apiClient from "./apiClient";
import { TipoCuenta } from "@/types";

export interface TipoCuentaDto {
  id: number;
  nombre: string;
  descripcion: string;
  origen: "Debito" | "Credito";
  estado: boolean;
}

export const getTiposCuenta = async (): Promise<TipoCuentaDto[]> => {
  const { data } = await apiClient.get("/api/tipos-cuenta");
  return data;
};

export const getTipoCuentaById = async (id: number): Promise<TipoCuentaDto> => {
  const { data } = await apiClient.get(`/api/tipos-cuenta/${id}`);
  return data;
};

export const createTipoCuenta = async (payload: Partial<TipoCuentaDto>): Promise<TipoCuentaDto> => {
  const { data } = await apiClient.post("/api/tipos-cuenta", payload);
  return data;
};

export const updateTipoCuenta = async (id: number, payload: Partial<TipoCuentaDto>): Promise<TipoCuentaDto> => {
  const { data } = await apiClient.put(`/api/tipos-cuenta/${id}`, payload);
  return data;
};

export const deleteTipoCuenta = async (id: number): Promise<void> => {
  await apiClient.delete(`/api/tipos-cuenta/${id}`);
};
