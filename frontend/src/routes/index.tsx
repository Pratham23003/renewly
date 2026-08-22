import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BellRing,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  Github,
  LineChart,
  Mail,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { getToken } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/renewly/logo";
import { FloatingLogos } from "@/components/renewly/floating-logos";
import { Reveal } from "@/components/renewly/motion";
import { Spotlight } from "@/components/renewly/spotlight";
import { Button } from "@/components/renewly/primitives";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Renewly - Never miss a subscription renewal" },
      {
        name: "description",
        content:
          "Renewly tracks every subscription, normalizes monthly spend and warns you before renewals hit your card.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Renewly - Never miss a subscription renewal" },
      {
        property: "og:description",
        content: "Track subscriptions, monthly spend and upcoming renewals in one calm dashboard.",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Wallet,
    title: "Normalized spend",
    body: "Daily, weekly, yearly plans are converted to a single monthly number so you always know the real burn.",
  },
  {
    icon: CalendarClock,
    title: "Renewal radar",
    body: "A 30-day window of what's about to charge you, colour-coded by urgency down to the last two days.",
  },
  {
    icon: BellRing,
    title: "Zero surprise billing",
    body: "Trials, paused plans and cancellations are tracked separately so nothing quietly renews in the dark.",
  },
  {
    icon: LineChart,
    title: "Category breakdown",
    body: "See where money leaks — entertainment, tooling, finance — and prune the plans you stopped using.",
  },
  {
    icon: CreditCard,
    title: "Multi-currency",
    body: "INR, USD, EUR and GBP side by side, formatted the way each currency should actually read.",
  },
  {
    icon: ShieldCheck,
    title: "Yours only",
    body: "Token-based auth, your data scoped to your account. No sharing, no ad tech, no resale.",
  },
] as const;

const overviewStats = [
  { label: "Total subscriptions", value: "14" },
  { label: "Monthly spend", value: "₹4,280.00" },
  { label: "Renewing in 7 days", value: "3" },
];

const upcomingRows = [
  { name: "Netflix", cat: "Entertainment", price: "₹649.00", when: "Renews in 2 days", tone: "text-danger" },
  { name: "Figma", cat: "Technology", price: "₹1,250.00", when: "Renews in 6 days", tone: "text-warning" },
  { name: "Spotify", cat: "Entertainment", price: "₹149.00", when: "Renews in 21 days", tone: "text-muted-foreground" },
];

const categoryBars = [
  { name: "Entertainment", value: 1849.0, pct: 43 },
  { name: "Technology", value: 1250.0, pct: 29 },
  { name: "Productivity", value: 799.0, pct: 19 },
  { name: "Utilities", value: 382.0, pct: 9 },
];

type MockTab = "overview" | "upcoming" | "categories";

const tabs: { id: MockTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "upcoming", label: "Upcoming" },
  { id: "categories", label: "Categories" },
];

function MockDashboard() {
  const [tab, setTab] = useState<MockTab>("overview");
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play tab cycling every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setTab((prev) => {
        if (prev === "overview") return "upcoming";
        if (prev === "upcoming") return "categories";
        return "overview";
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <Spotlight className="mt-16 rounded-[12px] border border-border bg-surface p-2 shadow-[0_24px_80px_rgba(0,0,0,0.5)]" size={900}>
      <div
        className="rounded-[10px] border border-border/70 bg-background p-4 text-left sm:p-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Top Header & Tab Controls */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2" role="tablist" aria-label="Dashboard preview">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "press relative rounded-[8px] px-3 py-1.5 text-xs font-medium transition-all duration-200",
                  tab === t.id
                    ? "bg-primary text-primary-foreground shadow-sm scale-105"
                    : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <span className="hidden items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-0.5 text-[10px] text-subtle sm:inline-flex">
            <span className="size-1.5 rounded-full bg-success animate-pulse" /> Live Preview
          </span>
        </div>

        {/* Tab Content Container with Animation */}
        <div className="pt-4 min-h-[220px]">
          {tab === "overview" && (
            <div className="animate-fade-in space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                {overviewStats.map((s, idx) => (
                  <div
                    key={s.label}
                    className="lit-edge rounded-[10px] border border-border bg-surface p-4 transition-all duration-300 hover:border-border-hover hover:scale-[1.02]"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="mt-2 font-mono text-2xl text-foreground">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="divide-y divide-border rounded-[10px] border border-border bg-surface/50 overflow-hidden">
                {upcomingRows.map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between px-4 py-3 text-sm transition-colors duration-200 hover:bg-surface-elevated/70"
                  >
                    <div>
                      <p className="font-medium text-foreground">{row.name}</p>
                      <p className="text-xs text-subtle">{row.cat}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-mono text-foreground">{row.price}</span>
                      <span className={`text-xs font-medium ${row.tone}`}>{row.when}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "upcoming" && (
            <div className="animate-fade-in space-y-3">
              {upcomingRows.map((row, idx) => (
                <div
                  key={row.name}
                  className="flex items-center justify-between rounded-[10px] border border-border bg-surface p-4 text-sm transition-all duration-300 hover:border-border-hover hover:translate-x-1"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-[8px] bg-primary/12">
                      <CalendarClock className="size-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{row.name}</p>
                      <p className="text-xs text-subtle">{row.cat}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-foreground">{row.price}</span>
                    <span className={cn("rounded-[20px] px-2.5 py-0.5 text-xs font-medium", row.tone.replace("text-", "bg-") + "/15 " + row.tone)}>
                      {row.when}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "categories" && (
            <div className="animate-fade-in space-y-5 py-2">
              {categoryBars.map((cat) => (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{cat.name}</span>
                    <span className="font-mono text-muted-foreground">₹{cat.value.toLocaleString("en-IN")}.00</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-surface-elevated">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
                      style={{ width: `${cat.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Spotlight>
  );
}

function BentoCard({
  feature,
  large,
  className,
}: {
  feature: (typeof features)[number];
  large?: boolean;
  className?: string;
}) {
  const Icon = feature.icon;
  return (
    <Spotlight className={cn("bento-card flex h-full flex-col", large ? "p-7" : "p-5", className)} size={large ? 700 : 500}>
      <Icon className={cn("shrink-0 text-primary", large ? "size-7" : "size-5")} />
      <h3 className={cn("mt-4 font-medium text-foreground", large ? "text-lg" : "text-sm")}>{feature.title}</h3>
      <p className={cn("leading-relaxed text-muted-foreground", large ? "mt-3 text-base" : "mt-2 text-sm")}>
        {feature.body}
      </p>
    </Spotlight>
  );
}

function AnimatedWorkflow() {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  const [typedText, setTypedText] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const [spend, setSpend] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  const [showAlert, setShowAlert] = useState(false);
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    const fullTitle = "Netflix Premium";

    const runLoop = () => {
      // Step 1 Starts (0ms)
      setActiveStep(1);
      setTypedText("");
      setIsSaved(false);
      setSpend(0);
      setBarWidth(0);
      setShowAlert(false);
      setIsSent(false);

      // Step 1: Typing simulation
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i <= fullTitle.length) {
          setTypedText(fullTitle.slice(0, i));
          i++;
        } else {
          clearInterval(typeInterval);
          setIsSaved(true);
        }
      }, 75);

      // Step 2 Starts (2200ms)
      setTimeout(() => {
        setActiveStep(2);
        setBarWidth(100);
        let curr = 0;
        const target = 4280;
        const step = Math.ceil(target / 20);
        const countInterval = setInterval(() => {
          curr += step;
          if (curr >= target) {
            setSpend(target);
            clearInterval(countInterval);
          } else {
            setSpend(curr);
          }
        }, 35);
      }, 2200);

      // Step 3 Starts (4500ms)
      setTimeout(() => {
        setActiveStep(3);
        setShowAlert(true);
        setTimeout(() => setIsSent(true), 900);
      }, 4500);
    };

    runLoop();
    const interval = setInterval(runLoop, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mt-8">
      {/* Top Laser Workflow Progress Pipeline (Placed above cards so it never cuts through card text) */}
      <div aria-hidden className="pointer-events-none relative mb-6 hidden md:block">
        {/* Rail Background */}
        <div className="h-[2px] w-full bg-border/60" />
        
        {/* Active Fill Line */}
        <div
          className="absolute top-0 h-[2px] bg-gradient-to-r from-primary/40 via-primary to-primary transition-all duration-700 ease-out"
          style={{
            width: activeStep === 1 ? "16%" : activeStep === 2 ? "50%" : "100%",
          }}
        />

        {/* Step Connector Nodes */}
        <div
          className={cn(
            "absolute top-1/2 left-[16%] size-3 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 transition-all duration-500",
            activeStep >= 1 ? "border-primary bg-primary shadow-[0_0_10px_var(--primary)]" : "border-border bg-background"
          )}
        />
        <div
          className={cn(
            "absolute top-1/2 left-[50%] size-3 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 transition-all duration-500",
            activeStep >= 2 ? "border-primary bg-primary shadow-[0_0_10px_var(--primary)]" : "border-border bg-background"
          )}
        />
        <div
          className={cn(
            "absolute top-1/2 left-[84%] size-3 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 transition-all duration-500",
            activeStep >= 3 ? "border-warning bg-warning shadow-[0_0_10px_var(--warning)]" : "border-border bg-background"
          )}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Step 1 Card: Add Subscription */}
        <Spotlight
          className={cn(
            "group relative rounded-[14px] border bg-surface/90 p-6 backdrop-blur-md transition-all duration-500",
            activeStep === 1
              ? "border-primary/60 shadow-[0_0_25px_rgba(59,130,246,0.15)] ring-1 ring-primary/40 scale-[1.01]"
              : "border-border/80 opacity-75"
          )}
        >
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <span className="font-mono text-xs font-semibold text-primary">01</span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors",
              activeStep === 1 ? "bg-primary text-primary-foreground font-semibold" : "bg-primary/10 text-primary"
            )}
          >Log
          </span>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">Add your subscription</h3>
        <p className="mt-1 text-xs text-muted-foreground">Log plans in seconds — name, price, cycle, renewal date.</p>

        {/* Micro-UI Simulation */}
        <div className="mt-6 rounded-[10px] border border-border/80 bg-background/90 p-3.5 space-y-2.5 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus className="size-3.5 text-primary" />
              <span className="text-xs font-medium text-foreground">New Subscription</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-[6px] border border-border/60 bg-surface px-2.5 py-1.5 text-xs">
            <span className="font-medium text-foreground">{typedText}</span>
            <span className="h-4 w-0.5 animate-pulse bg-primary" />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="font-mono text-xs font-medium text-primary">₹649/mo</span>
            <button
              className={cn(
                "flex items-center gap-1 rounded-[6px] px-2.5 py-1 text-[11px] font-medium transition-all duration-300",
                isSaved
                  ? "bg-success/20 text-success border border-success/40 scale-105"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="size-3" /> Saved
                </>
              ) : (
                "Save Plan"
              )}
            </button>
          </div>
        </div>
      </Spotlight>

      {/* Step 2 Card: Track Money Spent */}
      <Spotlight
        className={cn(
          "group relative z-10 rounded-[14px] border bg-surface/90 p-6 backdrop-blur-md transition-all duration-500",
          activeStep === 2
            ? "border-primary/60 shadow-[0_0_25px_rgba(59,130,246,0.15)] ring-1 ring-primary/40 scale-[1.01]"
            : "border-border/80 opacity-75"
        )}
      >
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <span className="font-mono text-xs font-semibold text-primary">02</span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors",
              activeStep === 2 ? "bg-primary text-primary-foreground font-semibold" : "bg-primary/10 text-primary"
            )}
          >
            Track
          </span>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">Track money spent</h3>
        <p className="mt-1 text-xs text-muted-foreground">Every cycle converted into one clean monthly spend figure.</p>

        {/* Micro-UI Simulation */}
        <div className="mt-6 rounded-[10px] border border-border/80 bg-background/90 p-3.5 space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs text-subtle">Total Monthly Spend</span>
            <TrendingUp className="size-3.5 text-success" />
          </div>

          <div className="font-mono text-xl font-bold text-foreground tracking-tight">
            ₹{spend.toLocaleString("en-IN")}
            <span className="text-xs font-normal text-subtle">/month</span>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Entertainment & Tech</span>
              <span className="font-mono text-xs font-medium text-primary">72%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-elevated">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>
        </div>
      </Spotlight>

      {/* Step 3 Card: Email Alert Before Renewal */}
      <Spotlight
        className={cn(
          "group relative z-10 rounded-[14px] border bg-surface/90 p-6 backdrop-blur-md transition-all duration-500",
          activeStep === 3
            ? "border-warning/60 shadow-[0_0_25px_rgba(245,158,11,0.15)] ring-1 ring-warning/40 scale-[1.01]"
            : "border-border/80 opacity-75"
        )}
      >
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <span className="font-mono text-xs font-semibold text-primary">03</span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-medium flex items-center gap-1 transition-colors",
              activeStep === 3 ? "bg-warning text-warning-foreground font-semibold" : "bg-warning/15 text-warning"
            )}
          >
            <BellRing className="size-3 animate-pulse" />Alert
          </span>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">Get mail before renewal</h3>
        <p className="mt-1 text-xs text-muted-foreground">Automated notification to your inbox before the charge hits.</p>

        {/* Micro-UI Simulation */}
        <div className="mt-6 rounded-[10px] border border-border/80 bg-background/90 p-3.5 space-y-2.5 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
              <Mail className="size-3.5 text-primary" />
              <span>Renewly Reminder</span>
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium transition-all duration-300",
                isSent
                  ? "bg-success/20 text-success border border-success/30"
                  : "bg-surface text-subtle"
              )}
            >
              {isSent ? "Dispatched" : "Queued"}
            </span>
          </div>

          <div
            className={cn(
              "rounded-[8px] border p-2.5 transition-all duration-500",
              showAlert
                ? "border-warning/40 bg-warning/10 translate-y-0 opacity-100"
                : "border-border/40 bg-surface/40 translate-y-2 opacity-60"
            )}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>🔔 Netflix renews in 2 days</span>
              <span className="font-mono text-[10px] text-warning">₹649.00</span>
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Cancel or update payment before renewal.
            </p>
          </div>
        </div>
      </Spotlight>
    </div>
  </div>
);
}

function Landing() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (getToken()) navigate({ to: "/dashboard", replace: true });
    else setChecked(true);
  }, [navigate]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Logo className="text-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo className="text-lg" />
          <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <a className="transition-colors hover:text-foreground" href="#features">
              Features
            </a>
            <a className="transition-colors hover:text-foreground" href="#how">
              How it works
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/sign-in">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link to="/sign-up">
              <Button>Get started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <Spotlight size={1200}>
          <section className="relative overflow-hidden">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[-18rem] size-[42rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]"
            />
            <FloatingLogos />
            <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
                <Sparkles className="size-3.5 text-primary" />
                Subscription clarity, without the spreadsheet
              </span>
              <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-6xl">
                Every subscription you pay for, in one calm dashboard.
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                Renewly tracks what renews, when it renews and what it actually costs you per month — so you cancel on
                your terms instead of finding out from your bank statement.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to="/sign-up">
                  <Button className="h-11 px-6">
                    Start tracking free <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link to="/sign-in">
                  <Button variant="outline" className="h-11 px-6">
                    Sign in
                  </Button>
                </Link>
              </div>
              <p className="mt-3 text-xs text-subtle">No card required · Free forever tier</p>

              <MockDashboard />
            </div>
          </section>
        </Spotlight>

        {/* Features */}
        <section id="features" className="border-t border-border/60 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.02em] text-foreground">
              Built for the person paying the bills.
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Not another budgeting app. Renewly does one thing: keeps recurring charges visible.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:auto-rows-fr">
              <BentoCard feature={features[0]} large className="md:col-span-2 lg:row-span-2" />
              <BentoCard feature={features[1]} />
              <BentoCard feature={features[2]} />
              <BentoCard feature={features[3]} />
              <BentoCard feature={features[4]} />
              <BentoCard feature={features[5]} className="md:col-span-2 lg:col-span-4" />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-t border-border/60 py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground">
                Three steps, then it's quiet.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Zero manual math. Zero surprise credit card charges.
              </p>
            </div>
            <AnimatedWorkflow />
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border/60 py-24">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground">
              Find out what you're actually paying.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Most people underestimate their subscription spend by 40%. Takes five minutes to know for sure.
            </p>
            <Link to="/sign-up">
              <Button className="mt-8 h-11 px-6">
                Create your account <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-xs text-subtle sm:flex-row">
          <Logo className="text-sm" />
          <p>© {new Date().getFullYear()} Renewly. Track what renews.</p>
          <a
            href="https://github.com/Pratham23003/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="size-4" />
            Built by Pratham
          </a>
        </div>
      </footer>
    </div>
  );
}
