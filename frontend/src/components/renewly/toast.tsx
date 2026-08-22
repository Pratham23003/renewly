import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; type: ToastType; message: string };

const ToastContext = createContext<{ toast: (type: ToastType, message: string) => void } | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx.toast;
}

const accent: Record<ToastType, string> = {
  success: "border-l-success",
  error: "border-l-danger",
  info: "border-l-primary",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (type: ToastType, message: string) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[100] flex w-[340px] flex-col-reverse gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{ animation: "toastIn 200ms ease-out both" }}
            className={`pointer-events-auto flex items-start gap-3 rounded-[10px] border border-l-4 border-border bg-surface-elevated px-4 py-3 text-sm shadow-card ${accent[t.type]}`}
          >
            {t.type === "success" && <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />}
            {t.type === "error" && <XCircle className="mt-0.5 size-4 shrink-0 text-danger" />}
            {t.type === "info" && <Info className="mt-0.5 size-4 shrink-0 text-primary" />}
            <p className="flex-1 leading-snug text-foreground">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
              className="press rounded-md text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
