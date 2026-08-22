export const API_BASE = import.meta.env.VITE_API_URL ?? "/api/v1";

export const TOKEN_KEY = "renewly_token";
export const USER_KEY = "renewly_user";

export type User = {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  createdAt?: string;
};

export type Subscription = {
  _id: string;
  name: string;
  price: number;
  currency: "INR" | "USD" | "EUR" | "GBP";
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  category: string;
  paymentMethod: string;
  status: "active" | "paused" | "trial" | "cancelled" | "expired";
  plan?: string;
  startDate: string;
  renewalDate: string;
  createdAt?: string;
};

export const CATEGORIES = [
  "sports",
  "news",
  "entertainment",
  "lifestyle",
  "technology",
  "finance",
  "politics",
  "other",
];

export const PLANS = ["basic", "standard", "premium", "custom"];

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function api<T = unknown>(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
): Promise<T> {
  const { method = "GET", body, auth = true } = options;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    const init: RequestInit = { method, headers };
    if (body !== undefined) init.body = JSON.stringify(body);
    res = await fetch(`${API_BASE}${path}`, init);
  } catch {
    throw new ApiError("Could not reach the Renewly API. Is the server running?", 0);
  }

  if (res.status === 401) {
    clearSession();
    if (typeof window !== "undefined" && !window.location.pathname.startsWith("/sign-")) {
      window.location.href = "/sign-in";
    }
    throw new ApiError("Session expired. Please sign in again.", 401);
  }

  const text = await res.text();
  const json = text ? (JSON.parse(text) as Record<string, unknown>) : {};

  if (!res.ok) {
    throw new ApiError((json["error"] as string) || (json["message"] as string) || "Request failed", res.status);
  }

  return (json["data"] !== undefined ? json["data"] : json) as T;
}
