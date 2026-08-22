import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useAuthUser } from "@/components/renewly/app-shell";
import { PageHeader, Pill, Skeleton } from "@/components/renewly/primitives";
import { useUpcomingRenewals } from "@/lib/queries";
import { daysUntil, formatAmount, formatDate, formatPrice } from "@/lib/format";

export const Route = createFileRoute("/upcoming")({
  head: () => ({
    meta: [
      { title: "Upcoming Renewals — Renewly" },
      { name: "description", content: "Subscriptions renewing soon, with days remaining and billing amounts." },
      { property: "og:title", content: "Upcoming Renewals — Renewly" },
      { property: "og:description", content: "Stay ahead of every subscription renewal and billing date." },
    ],
  }),
  component: UpcomingPage,
});

function tone(days: number) {
  if (days <= 2) return { chip: "bg-danger/12 text-danger", border: "border-l-danger" };
  if (days <= 7) return { chip: "bg-warning/12 text-warning", border: "border-l-warning" };
  return { chip: "bg-success/12 text-success", border: "border-l-success" };
}

function UpcomingPage() {
  useAuthUser();
  const upcoming = useUpcomingRenewals();
  const items = upcoming.data ?? [];

  return (
    <AppShell>
      <PageHeader
        title="Upcoming Renewals"
        subtitle="Subscriptions renewing soon — stay ahead of your billing."
      />

      {upcoming.isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card-surface flex flex-col items-center gap-2 px-6 py-16 text-center">
          <p className="text-lg font-semibold">You&apos;re all caught up! 🎉</p>
          <p className="text-sm text-muted-foreground">No subscriptions are renewing in the next 30 days.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((s) => {
            const days = daysUntil(s.renewalDate);
            const t = tone(days);
            return (
              <article key={s._id} className={`card-surface card-interactive border-l-4 ${t.border} p-5`}>
                <div className="flex items-start justify-between gap-2">
                  <h2 className="text-lg font-semibold">{s.name}</h2>
                  <Pill>{s.category}</Pill>
                </div>
                <p className="mt-4 text-sm font-medium text-foreground">Renews {formatDate(s.renewalDate)}</p>
                <span className={`mt-2 inline-flex rounded-[20px] px-2.5 py-0.5 text-xs font-medium ${t.chip}`}>
                  {days <= 0 ? "due today" : `in ${days} day${days === 1 ? "" : "s"}`}
                </span>
                <p className="mt-4 text-sm font-semibold text-foreground">
                  {formatPrice(s)}
                </p>
                <p className="mt-3 text-xs text-subtle">{s.paymentMethod}</p>
              </article>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
