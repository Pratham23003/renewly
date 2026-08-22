import { useQuery } from "@tanstack/react-query";
import { api, getToken, type Subscription } from "./api";

function normalize(value: unknown): Subscription[] {
  if (Array.isArray(value)) return value as Subscription[];
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    for (const key of ["subscriptions", "data", "renewals"]) {
      if (Array.isArray(record[key])) return record[key] as Subscription[];
    }
  }
  return [];
}

export function useSubscriptions() {
  return useQuery({
    queryKey: ["subscriptions"],
    enabled: typeof window !== "undefined" && !!getToken(),
    queryFn: async () => normalize(await api<unknown>("/subscriptions")),
  });
}

export function useUpcomingRenewals() {
  return useQuery({
    queryKey: ["upcoming-renewals"],
    enabled: typeof window !== "undefined" && !!getToken(),
    queryFn: async () => normalize(await api<unknown>("/subscriptions/upcoming-renewals")),
  });
}
