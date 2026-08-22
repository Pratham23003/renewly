import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { api, CATEGORIES, PLANS, type Subscription } from "@/lib/api";
import { symbolFor } from "@/lib/format";
import { Button, Field, Input, Select } from "./primitives";
import { useToast } from "./toast";

type FormState = {
  name: string;
  plan: string;
  price: string;
  currency: string;
  frequency: string;
  category: string;
  paymentMethod: string;
  startDate: string;
};

const FREQUENCIES = ["daily", "weekly", "monthly", "yearly"] as const;

function initialState(sub?: Subscription | null): FormState {
  return {
    name: sub?.name ?? "",
    plan: sub?.plan ?? "basic",
    price: sub ? String(sub.price) : "",
    currency: sub?.currency ?? "INR",
    frequency: sub?.frequency ?? "monthly",
    category: sub?.category ?? "entertainment",
    paymentMethod: sub?.paymentMethod ?? "",
    startDate: sub?.startDate ? sub.startDate.slice(0, 10) : "",
  };
}

export function SubscriptionDrawer({
  open,
  subscription,
  onClose,
}: {
  open: boolean;
  subscription?: Subscription | null;
  onClose: () => void;
}) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(initialState(subscription));
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initialState(subscription));
      setErrors({});
    }
  }, [open, subscription]);

  if (!open) return null;

  const isEdit = !!subscription;
  const set = (key: keyof FormState, value: string) => setForm((f) => ({ ...f, [key]: value }));

  function validate() {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Service name is required";
    if (!form.price || Number(form.price) <= 0) next.price = "Enter a price greater than 0";
    if (!form.paymentMethod.trim()) next.paymentMethod = "Payment method is required";
    if (!form.startDate) next.startDate = "Start date is required";
    else if (new Date(form.startDate) > new Date()) next.startDate = "Start date must be today or in the past";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        plan: form.plan,
        price: Number(form.price),
        currency: form.currency,
        frequency: form.frequency,
        category: form.category,
        paymentMethod: form.paymentMethod.trim(),
        startDate: form.startDate,
      };

      if (isEdit && subscription) {
        const base = initialState(subscription);
        const changed: Record<string, unknown> = {};
        (Object.keys(form) as (keyof FormState)[]).forEach((key) => {
          if (form[key] !== base[key]) {
            changed[key] = key === "price" ? Number(form[key]) : form[key];
          }
        });
        if (Object.keys(changed).length === 0) {
          onClose();
          return;
        }
        await api(`/subscriptions/${subscription._id}`, { method: "PATCH", body: changed });
        toast("success", "Subscription updated successfully");
      } else {
        await api("/subscriptions", { method: "POST", body: payload });
        toast("success", "Subscription added successfully");
      }
      await queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      await queryClient.invalidateQueries({ queryKey: ["upcoming-renewals"] });
      onClose();
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Failed to save subscription");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]" onClick={onClose} aria-hidden />
      <aside
        role="dialog"
        aria-modal="true"
        style={{ animation: "drawerIn 250ms ease-out both" }}
        className="relative flex h-full w-full max-w-[480px] flex-col border-l border-border bg-surface"
      >
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold">{isEdit ? "Edit Subscription" : "Add Subscription"}</h2>
          <button onClick={onClose} aria-label="Close drawer" className="press text-muted-foreground hover:text-foreground">
            <X className="size-4" />
          </button>
        </header>

        <form onSubmit={submit} className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex flex-1 flex-col gap-4 px-6 py-5">
            <Field label="Service Name" error={errors.name}>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Netflix, Spotify" />
            </Field>

            <Field label="Plan">
              <Select value={form.plan} onChange={(e) => set("plan", e.target.value)}>
                {PLANS.map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </Select>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Price" error={errors.price}>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    {symbolFor(form.currency)}
                  </span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    className="pl-7"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    placeholder="649"
                  />
                </div>
              </Field>
              <Field label="Currency">
                <Select value={form.currency} onChange={(e) => set("currency", e.target.value)}>
                  {["INR", "USD", "EUR", "GBP"].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field label="Billing Frequency">
              <div className="grid grid-cols-4 gap-2">
                {FREQUENCIES.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => set("frequency", f)}
                    className={`press rounded-[20px] border px-2 py-1.5 text-xs font-medium capitalize ${form.frequency === f
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-border-hover hover:text-foreground"
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Category">
              <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Payment Method" error={errors.paymentMethod}>
              <Input
                value={form.paymentMethod}
                onChange={(e) => set("paymentMethod", e.target.value)}
                placeholder="e.g. UPI, Credit Card, Debit Card"
              />
            </Field>

            <Field
              label="Start Date"
              error={errors.startDate}
              hint="When did you start this subscription?"
            >
              <Input
                type="date"
                max={new Date().toISOString().slice(0, 10)}
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </Field>
          </div>

          <footer className="flex justify-end gap-2 border-t border-border px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {isEdit ? "Save Changes" : "Add Subscription"}
            </Button>
          </footer>
        </form>
      </aside>
    </div>
  );
}
