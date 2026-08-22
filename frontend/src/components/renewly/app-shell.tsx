import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, CreditCard, LayoutDashboard, LogOut, Search, User } from "lucide-react";
import { clearSession, getStoredUser, getToken, type User as UserType } from "@/lib/api";
import { Logo } from "./logo";
import { CommandPalette } from "./command-palette";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { to: "/upcoming", label: "Upcoming Renewals", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function useAuthUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      navigate({ to: "/sign-in", replace: true });
      return;
    }
    setUser(getStoredUser());
    setReady(true);
  }, [navigate]);

  return { user, ready, setUser };
}

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  function logout() {
    clearSession();
    navigate({ to: "/sign-in", replace: true });
  }

  function triggerCommandPalette() {
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 flex w-[240px] flex-col border-r border-border bg-surface">
        <div className="px-6 py-6">
          <Logo className="text-xl" />
          <p className="mt-1 text-xs text-subtle">Never miss a renewal.</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {NAV.map((item) => {
            const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`press flex items-center gap-3 rounded-[8px] border-l-[3px] px-3 py-2 text-sm ${
                  active
                    ? "border-l-primary bg-primary/8 font-medium text-foreground"
                    : "border-l-transparent text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                }`}
              >
                <Icon className={`size-4 ${active ? "text-primary" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3">
          <button
            onClick={logout}
            className="press flex w-full items-center gap-3 rounded-[8px] px-3 py-2 text-sm text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
          >
            <LogOut className="size-4" />
            Log out
          </button>
        </div>
      </aside>

      <main className="fade-in-page ml-[240px] min-h-screen p-8 pt-6">
        {/* Top Right Header Actions Bar */}
        <div className="flex items-center justify-end mb-2">
          <button
            onClick={triggerCommandPalette}
            className="group inline-flex items-center gap-2.5 rounded-full border border-border/80 bg-surface/80 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur-md transition-all hover:border-primary/40 hover:bg-surface hover:text-foreground shadow-sm"
          >
            <Search className="size-3.5 text-subtle transition-colors group-hover:text-primary" />
            <span className="font-medium">Quick actions</span>
            <kbd className="rounded-[5px] border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground group-hover:border-primary/40">
              ⌘K
            </kbd>
          </button>
        </div>

        {children}
      </main>

      <CommandPalette />
    </div>
  );
}
