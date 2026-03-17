"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Modal } from "@/components/ui/Modal";
import { Auxiliar, createAuxiliar, updateAuxiliar, CreateAuxiliarPayload } from "@/lib/auxiliarService";

const schema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(50, "Máximo 50 caracteres"),
  descripcion: z.string().max(100, "Máximo 100 caracteres").optional().or(z.literal("")),
  estado: z.boolean(),
});

type FormData = z.infer<typeof schema>;

interface AuxiliarFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (aux: Auxiliar) => void;
  initialData?: Auxiliar | null;
}

const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-black/[0.10] bg-white text-sm text-apple-text " +
  "placeholder:text-apple-secondary/60 outline-none transition-all " +
  "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 hover:border-black/20";
const labelClass = "block text-xs font-semibold text-apple-secondary uppercase tracking-wider mb-1.5";
const errorClass = "mt-1 text-xs text-red-500";

export default function AuxiliarFormModal({ open, onClose, onSuccess, initialData }: AuxiliarFormModalProps) {
  const [apiError, setApiError] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { estado: true },
  });

  const estadoValue = watch("estado");

  useEffect(() => {
    if (open) {
      setApiError(null);
      if (initialData) {
        reset({
          nombre: initialData.nombre,
          descripcion: initialData.descripcion || "",
          estado: initialData.estado,
        });
      } else {
        reset({ estado: true, nombre: "", descripcion: "" });
      }
    }
  }, [open, initialData, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      setApiError(null);
      let auxiliar: Auxiliar;
      if (initialData) {
        auxiliar = await updateAuxiliar(initialData.id, data as CreateAuxiliarPayload);
      } else {
        auxiliar = await createAuxiliar(data as CreateAuxiliarPayload);
      }
      onSuccess(auxiliar);
      onClose();
    } catch (error: any) {
      setApiError(error?.response?.data?.message || error.message || "Error al guardar el auxiliar.");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialData ? "Editar Auxiliar" : "Nuevo Auxiliar"}
      subtitle={initialData ? "Modifica los datos del tercero/auxiliar" : "Ingrese los datos del nuevo auxiliar"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {apiError && (
          <div className="px-4 py-2.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
            {apiError}
          </div>
        )}
        
        {/* Row: Nombre + Estado */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className={labelClass}>Nombre</label>
            <input
              {...register("nombre")}
              placeholder="Ej. Juan Pérez / Empresa X"
              className={inputClass}
            />
            {errors.nombre && <p className={errorClass}>{errors.nombre.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Estado</label>
            <button
              type="button"
              onClick={() => setValue("estado", !estadoValue)}
              className={`relative inline-flex h-[42px] w-20 items-center justify-center rounded-xl border transition-colors font-medium text-sm ${
                estadoValue
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-gray-50 border-gray-200 text-gray-500"
              }`}
            >
              <span className={`mr-1 w-2 h-2 rounded-full ${estadoValue ? "bg-green-500" : "bg-gray-400"}`} />
              {estadoValue ? "Activo" : "Inactivo"}
            </button>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className={labelClass}>Descripción / RNC</label>
          <textarea
            {...register("descripcion")}
            placeholder="Información adicional del auxiliar..."
            rows={2}
            className={`${inputClass} resize-none`}
          />
          {errors.descripcion && <p className={errorClass}>{errors.descripcion.message}</p>}
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-black/[0.10] text-sm font-medium text-apple-secondary hover:bg-black/[0.04] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 shadow-sm"
          >
            {isSubmitting ? "Guardando…" : "Guardar Auxiliar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
