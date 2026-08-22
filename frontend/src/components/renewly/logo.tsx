export function Logo({ className }: { className?: string }) {
  return (
    <span className={`font-medium tracking-[-0.02em] text-foreground ${className ?? "text-lg"}`}>
      Renew<span className="text-primary">ly</span>
    </span>
  );
}
