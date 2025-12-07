"use client";

import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";
import { Button } from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: "info" | "warning" | "success" | "danger";
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "warning",
  confirmText = "Onayla",
  cancelText = "İptal",
  isLoading = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const icons = {
    info: <Info className="text-blue-500" size={48} />,
    warning: <AlertTriangle className="text-yellow-500" size={48} />,
    success: <CheckCircle className="text-green-500" size={48} />,
    danger: <XCircle className="text-red-500" size={48} />,
  };

  const colors = {
    info: "border-blue-500/20 bg-blue-500/10",
    warning: "border-yellow-500/20 bg-yellow-500/10",
    success: "border-green-500/20 bg-green-500/10",
    danger: "border-red-500/20 bg-red-500/10",
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] rounded-lg border border-[#252525] w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Icon */}
          <div className={`flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4 border-2 ${colors[type]}`}>
            {icons[type]}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white text-center mb-2">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-400 text-center mb-6">{message}</p>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              variant={type === "danger" ? "danger" : "primary"}
              className="flex-1"
              onClick={onConfirm}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
