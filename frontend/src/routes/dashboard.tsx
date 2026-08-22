import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, CreditCard, TrendingUp } from "lucide-react";
import { AppShell, useAuthUser } from "@/components/renewly/app-shell";
import { PageHeader, Pill, Skeleton, StatusBadge } from "@/components/renewly/primitives";
import { useSubscriptions, useUpcomingRenewals } from "@/lib/queries";
import { formatAmount, formatDate, formatPrice, greeting, monthlyValue, capitalize } from "@/lib/format";
import type { Subscription } from "@/lib/api";
import { CountUp, Reveal } from "@/components/renewly/motion";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Renewly" },
      { name: "description", content: "See total subscriptions, monthly spend and upcoming renewals at a glance." },
      { property: "og:title", content: "Dashboard — Renewly" },
      { property: "og:description", content: "Your subscription spend and renewals at a glance." },
    ],
  }),
  component: DashboardPage,
});

function StatCard({
  icon: Icon,
  value,
  label,
  loading,
  delay = 0,
  format,
}: {
  icon: typeof Bell;
  value: number;
  label: string;
  loading: boolean;
  delay?: number;
  format?: (n: number) => string;
}) {
  return (
    <Reveal delay={delay} className="card-surface card-interactive lit-edge p-5">
      <div className="flex size-10 items-center justify-center rounded-[8px] bg-primary/12">
        <Icon className="size-5 text-primary" />
      </div>
      {loading ? (
        <Skeleton className="mt-4 h-8 w-24" />
      ) : (
        <p className="mt-4 text-[28px] font-bold leading-none tracking-[-0.02em]">
          <CountUp value={value} format={format} />
        </p>
      )}

      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </Reveal>
  );
}

function DashboardPage() {
  const { user } = useAuthUser();
  const subs = useSubscriptions();
  const upcoming = useUpcomingRenewals();

  const [hello, setHello] = useState("Welcome back");
  useEffect(() => setHello(greeting()), []);

  const all: Subscription[] = subs.data ?? [];
  const monthlySpend = all
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + monthlyValue(s), 0);
  const recent = [...all]
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 5);
  const renewals = (upcoming.data ?? []).slice(0, 3);

  return (
    <AppShell>
      <PageHeader
        title="Dashboard"
        subtitle={`${hello}, ${user?.name ?? "there"} 👋`}
      />


      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={CreditCard} value={all.length} label="Total Subscriptions" loading={subs.isLoading} />
        <StatCard
          icon={TrendingUp}
          value={monthlySpend}
          format={(n) => formatAmount(n, "INR")}
          label="Monthly Spend"
          loading={subs.isLoading}
          delay={70}
        />
        <StatCard
          icon={Bell}
          value={(upcoming.data ?? []).length}
          label="Upcoming Renewals"
          loading={upcoming.isLoading}
          delay={140}
        />
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent Subscriptions</h2>
          <Link to="/subscriptions" className="press text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="card-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-subtle">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Renewal Date</th>
              </tr>
            </thead>
            <tbody>
              {subs.isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                    ))}
                  </tr>
                ))}
              {!subs.isLoading && recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                    No subscriptions yet.
                  </td>
                </tr>
              )}
              {recent.map((s, i) => (
                <Reveal
                  as="tr"
                  key={s._id}
                  delay={i * 45}
                  className="border-b border-border last:border-0 hover:bg-surface-elevated/60"
                >
                  <td className="px-5 py-3.5 font-medium text-foreground">{s.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{capitalize(s.category)}</td>
                  <td className="px-5 py-3.5">{formatPrice(s)}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{formatDate(s.renewalDate)}</td>
                </Reveal>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-base font-semibold">Renewing Soon</h2>
        {upcoming.isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : renewals.length === 0 ? (
          <div className="card-surface flex flex-col items-center gap-2 px-6 py-12 text-center">
            <span className="text-3xl">🎉</span>
            <p className="text-sm text-muted-foreground">No renewals in the next 30 days</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {renewals.map((s, i) => (
              <Reveal
                key={s._id}
                delay={i * 70}
                className="card-surface card-interactive lit-edge border-l-4 border-l-warning p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{s.name}</p>
                  <Pill>{s.category}</Pill>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">Renews {formatDate(s.renewalDate)}</p>
                <p className="mt-1 text-sm font-medium">{formatPrice(s)}</p>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
