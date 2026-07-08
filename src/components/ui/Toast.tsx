"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, XCircle } from "lucide-react";
import { create } from "zustand";

type ToastItem = {
  id: number;
  message: string;
  type: "success" | "error" | "info";
};

type ToastState = {
  toasts: ToastItem[];
  push: (message: string, type?: ToastItem["type"]) => void;
  dismiss: (id: number) => void;
};

let nextId = 1;

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  push: (message, type = "success") => {
    const id = nextId++;
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, message, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3500);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = (message: string, type?: ToastItem["type"]) =>
  useToast.getState().push(message, type);

const icons = {
  success: <CheckCircle2 size={17} className="text-emerald-500" />,
  error: <XCircle size={17} className="text-red-500" />,
  info: <Info size={17} className="text-brand-500" />,
};

export function Toaster() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-120 flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            onClick={() => dismiss(t.id)}
            className="pointer-events-auto flex w-auto items-center gap-2.5 rounded-full border border-line bg-surface py-2.5 pr-5 pl-4 text-sm font-medium text-ink card-shadow-lg"
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            {icons[t.type]}
            {t.message}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
