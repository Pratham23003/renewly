import { AppShell, useAuthUser } from "@/components/renewly/app-shell";
import { SubscriptionsList } from "@/components/renewly/subscriptions-list";

export default function SubscriptionsPage() {
  useAuthUser();
  return (
    <AppShell>
      <SubscriptionsList />
    </AppShell>
  );
}
