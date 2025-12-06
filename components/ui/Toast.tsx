"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    info: <Info size={20} />,
  };

  const colors = {
    success: "bg-green-500/20 border-green-500 text-green-400",
    error: "bg-red-500/20 border-red-500 text-red-400",
    info: "bg-blue-500/20 border-blue-500 text-blue-400",
  };

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border ${colors[type]} backdrop-blur-sm animate-slide-in`}>
      {icons[type]}
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X size={18} />
      </button>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = (message: string, type: ToastType = "info") => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  return {
    toast,
    showToast,
    hideToast,
    ToastComponent: toast ? (
      <Toast message={toast.message} type={toast.type} onClose={hideToast} />
    ) : null,
  };
}
