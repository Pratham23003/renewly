import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bell, CreditCard, LayoutDashboard, LogOut, Plus, Search, User } from "lucide-react";
import { clearSession } from "@/lib/api";

type Item = { label: string; hint: string; icon: typeof Bell; run: () => void };

export function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  const items: Item[] = useMemo(
    () => [
      { label: "Dashboard", hint: "Go to", icon: LayoutDashboard, run: () => navigate({ to: "/dashboard" }) },
      { label: "Subscriptions", hint: "Go to", icon: CreditCard, run: () => navigate({ to: "/subscriptions" }) },
      { label: "Upcoming Renewals", hint: "Go to", icon: Bell, run: () => navigate({ to: "/upcoming" }) },
      { label: "Profile", hint: "Go to", icon: User, run: () => navigate({ to: "/profile" }) },
      { label: "Add subscription", hint: "Action", icon: Plus, run: () => navigate({ to: "/subscriptions/new" }) },
      {
        label: "Log out",
        hint: "Action",
        icon: LogOut,
        run: () => {
          clearSession();
          navigate({ to: "/sign-in", replace: true });
        },
      },
    ],
    [navigate],
  );

  const filtered = items.filter((i) => i.label.toLowerCase().includes(query.trim().toLowerCase()));

  if (!open) return null;

  function pick(item: Item) {
    setOpen(false);
    item.run();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-background/70 p-4 pt-[18vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-label="Command palette"
        className="card-surface lit-edge fade-in-page w-full max-w-[520px] overflow-hidden p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, filtered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter" && filtered[active]) {
                e.preventDefault();
                pick(filtered[active]);
              }
            }}
            placeholder="Search pages and actions…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-subtle"
          />
          <kbd className="rounded-[6px] border border-border px-1.5 py-0.5 font-mono text-[10px] text-subtle">esc</kbd>
        </div>
        <ul className="max-h-[320px] overflow-y-auto p-2">
          {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted-foreground">No results</li>}
          {filtered.map((item, i) => (
            <li key={item.label}>
              <button
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(item)}
                className={`flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-left text-sm ${
                  i === active ? "bg-surface-elevated text-foreground" : "text-muted-foreground"
                }`}
              >
                <item.icon className={`size-4 ${i === active ? "text-primary" : ""}`} />
                <span className="flex-1">{item.label}</span>
                <span className="text-[11px] text-subtle">{item.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
