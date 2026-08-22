import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api, clearSession, USER_KEY, type User } from "@/lib/api";
import { AppShell, useAuthUser } from "@/components/renewly/app-shell";
import { Button, Field, Input, PageHeader } from "@/components/renewly/primitives";
import { ConfirmDialog } from "@/components/renewly/confirm-dialog";
import { useToast } from "@/components/renewly/toast";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Renewly" },
      { name: "description", content: "Manage your Renewly account details or delete your account." },
      { property: "og:title", content: "Profile — Renewly" },
      { property: "og:description", content: "Manage your Renewly account details." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, setUser } = useAuthUser();
  const toast = useToast();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  const userId = user?._id ?? user?.id;

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);
    try {
      const updated = await api<User>(`/users/${userId}`, { method: "PATCH", body: { name } });
      const merged = { ...(user as User), ...(updated ?? {}), name };
      localStorage.setItem(USER_KEY, JSON.stringify(merged));
      setUser(merged);
      setEditing(false);
      toast("success", "Profile updated");
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  async function removeAccount() {
    if (!userId) return;
    setDeleting(true);
    try {
      await api(`/users/${userId}`, { method: "DELETE" });
      clearSession();
      navigate({ to: "/sign-in", replace: true });
    } catch (err) {
      toast("error", err instanceof Error ? err.message : "Failed to delete account");
      setDeleting(false);
    }
  }

  return (
    <AppShell>
      <PageHeader title="Profile" subtitle="Your Renewly account details." />

      <div className="mx-auto flex max-w-[520px] flex-col gap-6">
        <section className="card-surface p-6">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
              {(user?.name ?? "?").charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{user?.name ?? "—"}</h2>
              <p className="text-sm text-muted-foreground">{user?.email ?? "—"}</p>
            </div>
          </div>

          <p className="mt-5 text-xs text-subtle">Member since {formatDate(user?.createdAt)}</p>

          {!editing ? (
            <Button variant="outline" className="mt-5" onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <form onSubmit={save} className="mt-5 flex flex-col gap-4">
              <Field label="Name">
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </Field>
              <Field label="Email Address">
                <Input type="email" value={email} disabled className="opacity-60 cursor-not-allowed" />
                <span className="mt-1 text-[11px] text-subtle">Email address cannot be changed.</span>
              </Field>
              <div className="flex gap-2">
                <Button type="submit" loading={saving}>
                  Save
                </Button>
                <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </section>

        <section className="card-surface border-danger/30 p-6">
          <h2 className="text-base font-semibold text-danger">Danger Zone</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Deleting your account removes all subscriptions permanently.
          </p>
          <Button variant="danger" className="mt-4" onClick={() => setConfirming(true)}>
            Delete Account
          </Button>
        </section>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Delete account"
        description="Are you sure? This cannot be undone. You are deleting"
        highlight={user?.email}
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => setConfirming(false)}
        onConfirm={removeAccount}
      />
    </AppShell>
  );
}
