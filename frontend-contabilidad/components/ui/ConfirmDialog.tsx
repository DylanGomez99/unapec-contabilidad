"use client";

import { Modal } from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  type?: "alert" | "confirm";
  onClose: () => void;
  onConfirm?: () => void;
}

export function ConfirmDialog({
  open,
  title = "Contabilidad dice:",
  message,
  type = "confirm",
  onClose,
  onConfirm
}: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="400px">
      <div className="py-2">
        <p className="text-sm text-apple-text mb-6 whitespace-pre-wrap">{message}</p>
        <div className="flex justify-end gap-2">
          {type === "confirm" && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-apple-secondary bg-apple-gray hover:bg-black/5 transition-colors"
            >
              Cancelar
            </button>
          )}
          <button
            onClick={() => {
              if (onConfirm) onConfirm();
              if (type === "alert") onClose();
            }}
            className={`px-5 py-2 rounded-xl text-sm font-medium text-white transition-colors shadow-sm ${
              type === "alert" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {type === "alert" ? "Aceptar" : "Confirmar"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
