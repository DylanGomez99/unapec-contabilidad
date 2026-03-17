"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { CuentaContable, TipoCuenta, NaturalezaCuenta, CreateCuentaPayload } from "@/types";
import { createCuenta, updateCuenta, MOCK_CUENTAS } from "@/lib/cuentaService";

const TIPOS: TipoCuenta[] = ["ACTIVO", "PASIVO", "PATRIMONIO", "INGRESO", "GASTO"];
const NATURALEZAS: NaturalezaCuenta[] = ["DEUDORA", "ACREEDORA"];

const schema = z.object({
  codigo: z.string().min(1, "El código es obligatorio").max(20),
  nombre: z.string().min(1, "El nombre es obligatorio").max(150),
  descripcion: z.string().optional(),
  tipo: z.enum(["ACTIVO", "PASIVO", "PATRIMONIO", "INGRESO", "GASTO"]),
  naturaleza: z.enum(["DEUDORA", "ACREEDORA"]),
  cuentaPadreId: z.number().optional(),
  nivel: z.number().min(1).max(4),
  aceptaMovimientos: z.boolean(),
  estado: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (c: CuentaContable) => void;
  cuentas: CuentaContable[];
  initialData?: CuentaContable | null;
}

const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-black/[0.10] bg-white text-sm text-apple-text placeholder:text-apple-secondary/60 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400";
const labelClass = "block text-xs font-semibold text-apple-secondary uppercase tracking-wider mb-1.5";
const errClass  = "mt-1 text-xs text-red-500";

export default function CuentaFormModal({ open, onClose, onSuccess, cuentas, initialData }: Props) {
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tipo: "ACTIVO", naturaleza: "DEUDORA", nivel: 3, aceptaMovimientos: true, estado: true },
  });

  // Auto-set naturaleza based on tipo
  const tipo = watch("tipo");
  useEffect(() => {
    setValue("naturaleza", tipo === "ACTIVO" || tipo === "GASTO" ? "DEUDORA" : "ACREEDORA");
  }, [tipo, setValue]);

  useEffect(() => { 
    if (open) {
      setApiError(null);
      if (initialData) {
        reset({
          codigo: initialData.codigo,
          nombre: initialData.nombre,
          descripcion: initialData.descripcion || "",
          tipo: initialData.tipo,
          naturaleza: initialData.naturaleza,
          cuentaPadreId: initialData.cuentaPadreId,
          nivel: initialData.nivel,
          aceptaMovimientos: initialData.aceptaMovimientos,
          estado: initialData.estado,
        });
      } else {
        reset({ tipo: "ACTIVO", naturaleza: "DEUDORA", nivel: 3, aceptaMovimientos: true, estado: true });
      }
    }
  }, [open, initialData, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      setApiError(null);
      let saved: CuentaContable;
      if (initialData) {
        saved = await updateCuenta(initialData.id, data as CreateCuentaPayload);
      } else {
        saved = await createCuenta(data as CreateCuentaPayload);
      }
      onSuccess(saved);
      onClose();
    } catch (e: any) {
      setApiError(e.message || "Error al guardar la cuenta.");
    }
  };

  const padresDisponibles = cuentas.filter((c) => !c.aceptaMovimientos && c.id !== initialData?.id);

  return (
    <Modal open={open} onClose={onClose} title={initialData ? "Editar Cuenta" : "Nueva Cuenta Contable"} subtitle={initialData ? "Modifica los datos de la cuenta" : "Agrega una cuenta al plan contable"}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {apiError && (
          <div className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
            {apiError}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Código</label>
            <input {...register("codigo")} placeholder="1.1.01" className={inputClass} />
            {errors.codigo && <p className={errClass}>{errors.codigo.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Nivel</label>
            <select {...register("nivel", { valueAsNumber: true })} className={inputClass}>
              <option value={1}>1 — Grupo</option>
              <option value={2}>2 — Subgrupo</option>
              <option value={3}>3 — Cuenta</option>
              <option value={4}>4 — Subcuenta</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Nombre</label>
          <input {...register("nombre")} placeholder="Caja General" className={inputClass} />
          {errors.nombre && <p className={errClass}>{errors.nombre.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Descripción (opcional)</label>
          <input {...register("descripcion")} placeholder="Descripción de la cuenta" className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Tipo</label>
            <select {...register("tipo")} className={inputClass}>
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Naturaleza</label>
            <select {...register("naturaleza")} className={inputClass}>
              {NATURALEZAS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>

        {padresDisponibles.length > 0 && (
          <div>
            <label className={labelClass}>Cuenta padre (opcional)</label>
            <select {...register("cuentaPadreId", { valueAsNumber: true })} className={inputClass}>
              <option value="">— Sin padre —</option>
              {padresDisponibles.map((c) => (
                <option key={c.id} value={c.id}>{c.codigo} — {c.nombre}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("aceptaMovimientos")} className="w-4 h-4 rounded accent-blue-600" />
            <span className="text-sm text-apple-text">Acepta movimientos</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("estado")} className="w-4 h-4 rounded accent-blue-600" />
            <span className="text-sm text-apple-text">Activa</span>
          </label>
        </div>

        <div className="flex gap-2.5 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-black/[0.10] text-sm font-medium text-apple-secondary hover:bg-black/[0.04] transition-colors">Cancelar</button>
          <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">
            {isSubmitting ? "Guardando…" : "Guardar Cuenta"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
