import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/renewly/auth-page";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign in — Renewly" },
      { name: "description", content: "Sign in to Renewly to track subscriptions and never miss a renewal." },
      { property: "og:title", content: "Sign in — Renewly" },
      { property: "og:description", content: "Sign in to Renewly to track subscriptions and renewals." },
    ],
  }),
  component: () => <AuthPage mode="sign-in" />,
});
