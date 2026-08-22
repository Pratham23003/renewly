import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell, useAuthUser } from "@/components/renewly/app-shell";
import { SubscriptionsList } from "@/components/renewly/subscriptions-list";

export const Route = createFileRoute("/subscriptions")({
  head: () => ({
    meta: [
      { title: "Subscriptions — Renewly" },
      { name: "description", content: "Browse, filter, edit and cancel every subscription you track in Renewly." },
      { property: "og:title", content: "Subscriptions — Renewly" },
      { property: "og:description", content: "Every subscription you track, with price, status and renewal date." },
    ],
  }),
  component: SubscriptionsLayout,
});

function SubscriptionsLayout() {
  useAuthUser();
  return (
    <AppShell>
      <SubscriptionsList />
      <Outlet />
    </AppShell>
  );
}
