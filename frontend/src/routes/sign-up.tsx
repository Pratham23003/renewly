import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/renewly/auth-page";

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    meta: [
      { title: "Create your account — Renewly" },
      { name: "description", content: "Create a Renewly account and start tracking every subscription renewal." },
      { property: "og:title", content: "Create your account — Renewly" },
      { property: "og:description", content: "Start tracking every subscription renewal with Renewly." },
    ],
  }),
  component: () => <AuthPage mode="sign-up" />,
});
