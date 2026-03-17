"use client";

import { useState, useCallback, useEffect } from "react";
import { Plus, RefreshCw, Edit2, Trash2, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import { DataTable } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TableColumn } from "@/types";
import { Auxiliar, getAuxiliares, deleteAuxiliar } from "@/lib/auxiliarService";
import { useTenant } from "@/lib/tenantService";
import AuxiliarFormModal from "./components/AuxiliarFormModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export default function AuxiliaresPage() {
  const { activeTenant } = useTenant();
  const [auxiliares, setAuxiliares] = useState<Auxiliar[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAuxiliar, setEditingAuxiliar] = useState<Auxiliar | null>(null);
  
  const [dialog, setDialog] = useState<{ open: boolean; type: "alert"|"confirm"; message: string; onConfirm?: () => void }>({ open: false, type: "alert", message: "" });

  const fetchAuxiliares = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAuxiliares();
      setAuxiliares(data);
    } catch (e: any) {
      console.error(e);
      setAuxiliares([]);
    } finally {
      setLoading(false);
    }
  }, [activeTenant.id]);

  useEffect(() => {
    fetchAuxiliares();
  }, [fetchAuxiliares]);

  const handleDelete = (id: number) => {
    setDialog({
      open: true,
      type: "confirm",
      message: "¿Estás seguro de que deseas eliminar este auxiliar?",
      onConfirm: async () => {
        setDialog(prev => ({ ...prev, open: false }));
        try {
          await deleteAuxiliar(id);
          setAuxiliares(prev => prev.filter(c => c.id !== id));
        } catch (e: any) {
          setTimeout(() => {
            setDialog({
              open: true,
              type: "alert",
              message: "No se pudo eliminar el auxiliar. Es posible que esté en uso por un Asiento Contable."
            });
          }, 300);
        }
      }
    });
  };

  const handeEdit = (aux: Auxiliar) => {
    setEditingAuxiliar(aux);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingAuxiliar(null);
  };

  const handleModalSuccess = (savedAux: Auxiliar) => {
    setAuxiliares(prev => {
      const exists = prev.find(a => a.id === savedAux.id);
      if (exists) return prev.map(a => a.id === savedAux.id ? savedAux : a);
      return [savedAux, ...prev];
    });
  };

  const columns: TableColumn<Auxiliar>[] = [
    { header: "ID", accessor: (a) => <code className="text-xs font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg">AUX-{a.id}</code>, exportValue: (a) => `AUX-${a.id}`, width: "100px" },
    { header: "Nombre", accessor: "nombre" },
    { header: "Descripción / RNC", accessor: (a) => <span className="text-apple-secondary">{a.descripcion || "—"}</span>, exportValue: (a) => a.descripcion || "" },
    { header: "Estado", accessor: (a) => <StatusBadge active={a.estado} />, exportValue: (a) => a.estado ? "Activo" : "Inactivo", align: "center", width: "110px" },
    {
      header: "",
      accessor: (a) => (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => handeEdit(a)} className="p-1.5 text-apple-secondary hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Edit2 size={15} />
          </button>
          <button onClick={() => handleDelete(a.id)} className="p-1.5 text-apple-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={15} />
          </button>
        </div>
      ),
      align: "right",
      width: "100px",
      excludeFromExport: true,
    },
  ];

  const activos = auxiliares.filter(a => a.estado).length;
  const inactivos = auxiliares.filter(a => !a.estado).length;

  return (
    <div className="flex flex-col h-full">
      <Header title="Catálogo de Auxiliares" subtitle="Gestión de clientes, proveedores y terceros" />

      <div className="flex-1 p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-700">
               <Users size={16} />
               <span className="text-sm font-semibold">{auxiliares.length} Auxiliares Total</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50 border border-green-100 text-green-700">
               <span className="text-sm font-semibold">{activos} Activos</span>
            </div>
            {inactivos > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-600">
                 <span className="text-sm font-semibold">{inactivos} Inactivos</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAuxiliares}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/[0.08] text-sm text-apple-secondary hover:bg-white transition-all disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Actualizar
            </button>
            <button
              id="btn-nuevo-auxiliar"
              onClick={() => { setEditingAuxiliar(null); setModalOpen(true); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors"
            >
              <Plus size={15} /> Nuevo Auxiliar
            </button>
          </div>
        </div>

        <DataTable<Auxiliar>
          columns={columns}
          data={auxiliares}
          isLoading={loading}
          emptyMessage="No hay auxiliares registrados."
          keyExtractor={(item) => item.id}
          exportable
          tableName="Catálogo de Auxiliares"
        />
      </div>

      <AuxiliarFormModal
        open={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        initialData={editingAuxiliar}
      />

      <ConfirmDialog
        open={dialog.open}
        type={dialog.type}
        message={dialog.message}
        onClose={() => setDialog(prev => ({ ...prev, open: false }))}
        onConfirm={dialog.onConfirm}
      />
    </div>
  );
}
