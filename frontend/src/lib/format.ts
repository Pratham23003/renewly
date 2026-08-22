import type { Subscription } from "./api";

export const CURRENCY_SYMBOL: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export const FREQ_ABBR: Record<string, string> = {
  daily: "day",
  weekly: "wk",
  monthly: "mo",
  yearly: "yr",
};

export function symbolFor(currency?: string) {
  return CURRENCY_SYMBOL[currency ?? "INR"] ?? "₹";
}

export function formatAmount(price: number, currency?: string) {
  return `${symbolFor(currency)}${Math.round(price).toLocaleString("en-IN")}`;
}

export function formatPrice(sub: Pick<Subscription, "price" | "currency" | "frequency">) {
  return `${formatAmount(sub.price, sub.currency)} / ${FREQ_ABBR[sub.frequency] ?? "mo"}`;
}

export function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function daysUntil(value?: string) {
  if (!value) return Infinity;
  const d = new Date(value).getTime();
  if (Number.isNaN(d)) return Infinity;
  return Math.ceil((d - Date.now()) / 86_400_000);
}

export function monthlyValue(sub: Pick<Subscription, "price" | "frequency">) {
  switch (sub.frequency) {
    case "daily":
      return sub.price * 30;
    case "weekly":
      return sub.price * 4;
    case "yearly":
      return sub.price / 12;
    default:
      return sub.price;
  }
}

export function capitalize(value?: string) {
  if (!value) return "—";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
