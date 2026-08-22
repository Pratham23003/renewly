import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, BellRing, Eye, EyeOff, Github, Lock, ShieldCheck, TrendingUp } from "lucide-react";
import { api, setSession, type User } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button, Field, Input } from "./primitives";
import { Logo } from "./logo";
import { Spotlight } from "./spotlight";

export function AuthPage({ mode }: { mode: "sign-in" | "sign-up" }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === "sign-up";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body = isSignUp ? { name, email, password } : { email, password };
      const data = await api<{ token: string; user: User }>(`/auth/${mode}`, {
        method: "POST",
        body,
        auth: false,
      });
      setSession(data.token, data.user);
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-background text-foreground">
      {/* Background Radial Spotlights */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-10rem] size-[38rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-10rem] right-[-10rem] size-[32rem] rounded-full bg-primary/10 blur-[130px]"
      />

      {/* Header Bar with Back Link */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between p-6">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-full border border-border/60 bg-surface/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-md transition-all hover:border-primary/40 hover:text-foreground"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </Link>
        <Logo className="text-lg" />
      </header>

      {/* Main Auth Split Container */}
      <main className="relative z-10 mx-auto my-auto flex w-full max-w-6xl items-center justify-center p-6 lg:justify-between lg:gap-12">
        {/* Left Side: Value proposition & Live Showcase (Hidden on Mobile) */}
        <div className="hidden max-w-lg lg:block">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground leading-[1.15]">
            {isSignUp
              ? "Start tracking every subscription in 60 seconds."
              : "Welcome back to your subscription dashboard."}
          </h1>

          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Renewly tracks all your monthly subscriptions in one place and emails you before any payment is due.
          </p>

          {/* Animated Feature Pills */}
          <div className="mt-8 space-y-3.5">
            <div className="flex items-center gap-3 rounded-[12px] border border-border/60 bg-surface/40 p-3.5 backdrop-blur-md">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <BellRing className="size-4 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">Email Reminders</div>
                <div className="text-[11px] text-muted-foreground">Get notified 2 days before any charge.</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-[12px] border border-border/60 bg-surface/40 p-3.5 backdrop-blur-md">
              <div className="flex size-8 items-center justify-center rounded-lg bg-success/15 text-success">
                <TrendingUp className="size-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">Clear Monthly Totals</div>
                <div className="text-[11px] text-muted-foreground">Know exactly what you spend in ₹ each month.</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-[12px] border border-border/60 bg-surface/40 p-3.5 backdrop-blur-md">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">100% Free & Private</div>
                <div className="text-[11px] text-muted-foreground">No credit card or bank details needed.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: High-End Auth Card */}
        <Spotlight className="w-full max-w-[420px] rounded-[20px] border border-border/80 bg-surface/80 p-8 backdrop-blur-xl lit-edge shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className="flex size-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary shadow-inner">
              <Lock className="size-5" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-foreground">
              {isSignUp ? "Create your account" : "Sign in to Renewly"}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {isSignUp ? "No credit card required. Free forever tier." : "Welcome back! Enter your details to continue."}
            </p>
          </div>

          {/* Mode Tabs Switcher */}
          <div className="mt-6 grid grid-cols-2 gap-1 rounded-[12px] border border-border/80 bg-background/80 p-1">
            {(["sign-in", "sign-up"] as const).map((tab) => (
              <Link
                key={tab}
                to={tab === "sign-in" ? "/sign-in" : "/sign-up"}
                className={cn(
                  "rounded-[9px] py-2 text-center text-xs font-semibold transition-all duration-200",
                  mode === tab
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab === "sign-in" ? "Sign In" : "Sign Up"}
              </Link>
            ))}
          </div>

          <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
            {isSignUp && (
              <Field label="Full Name">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                  autoComplete="name"
                  className="h-10 bg-background/90"
                />
              </Field>
            )}
            <Field label="Email address">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="h-10 bg-background/90"
              />
            </Field>
            <Field label="Password">
              <div className="relative">
                <Input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-10 bg-background/90 pr-10"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </Field>

            {error && (
              <div className="rounded-lg border border-danger/40 bg-danger/10 p-2.5 text-xs text-danger">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="mt-2 h-10 w-full text-sm font-semibold">
              {isSignUp ? "Get Started Free" : "Sign In to Dashboard"}
            </Button>
          </form>
        </Spotlight>
      </main>

      {/* Footer credit with GitHub */}
      <footer className="relative z-10 py-6 text-center text-xs text-subtle flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
        <span>© {new Date().getFullYear()} Renewly. All rights reserved.</span>
        <span className="hidden sm:inline">•</span>
        <a
          href="https://github.com/Pratham23003/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Github className="size-3.5" />
          Built by Pratham
        </a>
      </footer>
    </div>
  );
}
