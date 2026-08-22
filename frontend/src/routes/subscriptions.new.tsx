import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SubscriptionDrawer } from "@/components/renewly/subscription-drawer";

export const Route = createFileRoute("/subscriptions/new")({
  head: () => ({
    meta: [
      { title: "Add Subscription — Renewly" },
      { name: "description", content: "Add a new subscription with price, billing frequency and renewal tracking." },
      { property: "og:title", content: "Add Subscription — Renewly" },
      { property: "og:description", content: "Track a new subscription in Renewly." },
    ],
  }),
  component: NewSubscriptionRoute,
});

function NewSubscriptionRoute() {
  const navigate = useNavigate();
  return <SubscriptionDrawer open onClose={() => navigate({ to: "/subscriptions" })} />;
}
