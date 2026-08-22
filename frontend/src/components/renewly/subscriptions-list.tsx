import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { CreditCard, Pencil, Plus, Trash2, XCircle } from "lucide-react";
import { api, CATEGORIES, type Subscription } from "@/lib/api";
import { capitalize, daysUntil, formatDate, formatPrice } from "@/lib/format";
import { useSubscriptions } from "@/lib/queries";
import { Button, PageHeader, Skeleton, StatusBadge } from "./primitives";
import { SubscriptionDrawer } from "./subscription-drawer";
import { ConfirmDialog } from "./confirm-dialog";
import { useToast } from "./toast";

const STATUSES = ["all", "active", "paused", "trial", "cancelled", "expired"] as const;

type PendingAction = { type: "delete" | "cancel"; sub: Subscription } | null;

export function SubscriptionsList() {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useSubscriptions();

  const [status, setStatus] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [pending, setPending] = useState<PendingAction>(null);
  const [working, setWorking] = useState(false);

  const subs = (data ?? []).filter(
    (s) => (status === "all" || s.status === status) && (category === "all" || s.category === category),
  );

  async function runPending() {
    if (!pending) return;
    setWorking(true);
    try {
      if (pending.type === "delete") {
        await api(`/subscriptions/${pending.sub._id}`, { method: "DELETE" });
        toast("success", "Subscription deleted");
      } else {
        await api(`/subscriptions/${pending.sub._id}/cancel`, { method: "PATCH" });
        toast("success", "Subscription cancelled");
      }
      await queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      await queryClient.invalidateQueries({ queryKey: ["upcoming-renewals"] });
      setPending(null);
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Action failed");
    } finally {
      setWorking(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Subscriptions"
        actions={
          <Button onClick={() => navigate({ to: "/subscriptions/new" })}>
            <Plus className="size-4" />
            Add Subscription
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`press rounded-[20px] border px-3 py-1 text-xs font-medium capitalize ${
                status === s
                  ? "border-primary bg-primary/12 text-primary"
                  : "border-border text-muted-foreground hover:border-border-hover hover:text-foreground"
              }`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="ml-auto h-9 rounded-[8px] border border-border bg-surface px-3 text-xs text-muted-foreground hover:border-border-hover"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {capitalize(c)}
            </option>
          ))}
        </select>
      </div>

      {isError && <p className="mb-4 text-sm text-danger">{(error as Error).message}</p>}

      <div className="card-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-subtle">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Plan</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="hidden px-5 py-3 font-medium md:table-cell">Frequency</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Renewal Date</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  {Array.from({ length: 8 }).map((__, j) => (
                    <td key={j} className="px-5 py-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                  ))}
                </tr>
              ))}

            {!isLoading &&
              subs.map((s) => {
                const days = daysUntil(s.renewalDate);
                const soon = days >= 0 && days <= 7;
                return (
                  <tr key={s._id} className="group border-b border-border last:border-0 hover:bg-surface-elevated/60">
                    <td className="px-5 py-3.5 font-semibold text-foreground">{s.name}</td>
                    <td className="px-5 py-3.5 text-xs text-subtle capitalize">{s.plan ?? "—"}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{capitalize(s.category)}</td>
                    <td className="px-5 py-3.5">{formatPrice(s)}</td>
                    <td className="hidden px-5 py-3.5 capitalize text-muted-foreground md:table-cell">{s.frequency}</td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className={`px-5 py-3.5 ${soon ? "text-warning" : "text-muted-foreground"}`}>
                      <span className="inline-flex items-center gap-1.5">
                        {soon && <span className="size-1.5 rounded-full bg-warning" />}
                        {formatDate(s.renewalDate)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                        <button
                          aria-label={`Edit ${s.name}`}
                          onClick={() => setEditing(s)}
                          className="press rounded-md p-1.5 text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          aria-label={`Cancel ${s.name}`}
                          onClick={() => setPending({ type: "cancel", sub: s })}
                          className="press rounded-md p-1.5 text-muted-foreground hover:bg-surface-elevated hover:text-warning"
                        >
                          <XCircle className="size-4" />
                        </button>
                        <button
                          aria-label={`Delete ${s.name}`}
                          onClick={() => setPending({ type: "delete", sub: s })}
                          className="press rounded-md p-1.5 text-muted-foreground hover:bg-surface-elevated hover:text-danger"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

            {!isLoading && subs.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                    <CreditCard className="size-10 text-subtle" />
                    <h2 className="text-base font-semibold">No subscriptions yet</h2>
                    <p className="text-sm text-muted-foreground">Start tracking your first subscription</p>
                    <Button className="mt-2" onClick={() => navigate({ to: "/subscriptions/new" })}>
                      <Plus className="size-4" />
                      Add Subscription
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <SubscriptionDrawer open={!!editing} subscription={editing} onClose={() => setEditing(null)} />

      <ConfirmDialog
        open={!!pending}
        title={pending?.type === "delete" ? "Delete subscription" : "Cancel subscription"}
        description={
          pending?.type === "delete"
            ? "This cannot be undone. You are about to delete"
            : "This will mark the subscription as cancelled:"
        }
        highlight={pending?.sub.name}
        confirmLabel={pending?.type === "delete" ? "Delete" : "Cancel Subscription"}
        loading={working}
        onCancel={() => setPending(null)}
        onConfirm={runPending}
      />
    </>
  );
}
