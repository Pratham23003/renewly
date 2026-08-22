import { useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Spotlight({
  children,
  className,
  size = 600,
}: {
  children: ReactNode;
  className?: string;
  size?: number;
}) {
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setActive(true);
  }

  return (
    <div
      className={cn("group relative overflow-hidden", className)}
      onMouseMove={handleMove}
      onMouseLeave={() => setActive(false)}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300",
          active && "opacity-100",
        )}
        style={{
          background: `radial-gradient(${size}px circle at ${pos.x}px ${pos.y}px, var(--spotlight), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}
