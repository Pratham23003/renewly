import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground font-semibold hover:bg-primary-hover hover:shadow-[0_6px_24px_rgba(79,142,247,0.28)]",
  outline: "border border-border bg-transparent text-foreground hover:border-border-hover hover:bg-surface-elevated",
  ghost: "bg-transparent text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
  danger: "border border-danger/40 bg-transparent text-danger hover:bg-danger/10",
};

export function Button({
  variant = "primary",
  loading,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant | undefined; loading?: boolean | undefined }) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={cn(
        "press inline-flex h-10 items-center justify-center gap-2 rounded-[8px] px-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      )}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-subtle">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

const controlClass =
  "h-10 w-full rounded-[8px] border border-border bg-background px-3 text-sm text-foreground placeholder:text-subtle transition-colors hover:border-border-hover";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(controlClass, className)} />;
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={cn(controlClass, "appearance-none pr-8", className)}>
      {children}
    </select>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} />;
}

const statusStyles: Record<string, string> = {
  active: "bg-success/12 text-success",
  trial: "bg-trial/12 text-trial",
  paused: "bg-warning/12 text-warning",
  cancelled: "bg-cancelled/12 text-cancelled",
  expired: "bg-danger/12 text-danger",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[20px] px-2.5 py-0.5 text-xs font-medium capitalize",
        statusStyles[status] ?? "bg-cancelled/12 text-cancelled",
      )}
    >
      {status}
    </span>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-[20px] bg-surface-elevated px-2.5 py-0.5 text-xs capitalize text-muted-foreground">
      {children}
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: ReactNode | undefined;
  actions?: ReactNode | undefined;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}
