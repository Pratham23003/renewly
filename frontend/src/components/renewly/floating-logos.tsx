import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Sparkles } from "lucide-react";

/**
 * Interactive floating brand pillars with rich hover tooltips & click actions.
 * Framed gracefully on outer margins so hero text remains clear.
 */

type LogoConfig = {
  name: string;
  plan: string;
  price: string;
  cycle: string;
  renewsIn: string;
  urgent?: boolean;
  color: string;
  glow: string;
  side: "left" | "right";
  top: string;
  offset: string;
  size: string;
  anim: "bob" | "drift" | "spin";
  delay: string;
  dur: string;
  svg: JSX.Element;
};

const LOGO_ITEMS: LogoConfig[] = [
  // ── LEFT SIDE ──
  {
    name: "Netflix",
    plan: "Premium 4K",
    price: "₹649",
    cycle: "mo",
    renewsIn: "Renews in 2 days",
    urgent: true,
    color: "#E50914",
    glow: "rgba(229, 9, 20, 0.35)",
    side: "left",
    top: "14%",
    offset: "4%",
    size: "3.5rem",
    anim: "bob",
    delay: "0s",
    dur: "12s",
    svg: (
      <svg viewBox="0 0 24 24" fill="#E50914" className="size-6">
        <path d="M5.398 0v24h4.195l4.636-15.003L14.403 24h4.199V0h-4.199l-4.636 15.003L9.593 0H5.398z" />
      </svg>
    ),
  },
  {
    name: "Spotify",
    plan: "Duo Plan",
    price: "₹149",
    cycle: "mo",
    renewsIn: "Renews in 18 days",
    color: "#1DB954",
    glow: "rgba(29, 185, 84, 0.35)",
    side: "left",
    top: "40%",
    offset: "11%",
    size: "3.5rem",
    anim: "drift",
    delay: "-3s",
    dur: "14s",
    svg: (
      <svg viewBox="0 0 24 24" fill="#1DB954" className="size-7">
        <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.341c-.217.356-.676.469-1.032.252-2.827-1.728-6.387-2.119-10.58-1.161-.403.093-.804-.158-.897-.561-.093-.403.158-.804.561-.897 4.593-1.049 8.522-.6 11.696 1.336.356.217.469.676.252 1.031zm1.472-3.278c-.273.444-.857.587-1.301.314-3.235-1.988-8.169-2.563-12.001-1.399-.497.151-1.023-.13-1.173-.627-.151-.497.13-1.023.627-1.173 4.382-1.33 9.81-.687 13.534 1.604.444.273.587.857.314 1.301zm.126-3.414c-3.879-2.303-10.274-2.516-13.98-1.39-.607.184-1.251-.168-1.435-.775-.184-.607.168-1.251.775-1.435 4.261-1.294 11.312-1.042 15.772 1.605.547.324.727 1.037.403 1.584-.324.547-1.037.727-1.584.403z" />
      </svg>
    ),
  },
  {
    name: "Figma",
    plan: "Professional",
    price: "₹1,250",
    cycle: "mo",
    renewsIn: "Renews in 5 days",
    urgent: true,
    color: "#F24E1E",
    glow: "rgba(242, 78, 30, 0.35)",
    side: "left",
    top: "66%",
    offset: "5%",
    size: "3.5rem",
    anim: "bob",
    delay: "-6s",
    dur: "13s",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" className="size-6">
        <path d="M12 12c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3z" fill="#1ABCFE" />
        <path d="M6 21c0-1.657 1.343-3 3-3h3v3c0 1.657-1.343 3-3 3s-3-1.343-3-3z" fill="#0ACF83" />
        <path d="M12 3v6h3c1.657 0 3-1.343 3-3s-1.343-3-3-3h-3z" fill="#FF7262" />
        <path d="M18 12c0-1.657-1.343-3-3-3h-3v6h3c1.657 0 3-1.343 3-3z" fill="#F24E1E" />
        <path d="M6 3c0-1.657 1.343-3 3-3h3v6H9C7.343 6 6 4.657 6 3z" fill="#A259FF" />
      </svg>
    ),
  },

  // ── RIGHT SIDE ──
  {
    name: "OpenAI",
    plan: "ChatGPT Plus",
    price: "₹1,999",
    cycle: "mo",
    renewsIn: "Renews tomorrow",
    urgent: true,
    color: "#10A37F",
    glow: "rgba(16, 163, 127, 0.35)",
    side: "right",
    top: "16%",
    offset: "5%",
    size: "3.5rem",
    anim: "bob",
    delay: "-2s",
    dur: "15s",
    svg: (
      <svg viewBox="0 0 24 24" fill="#FFFFFF" className="size-6">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.067l-4.831 2.791A4.5 4.5 0 0 1 3.6 18.304zm-1.47-9.84a4.478 4.478 0 0 1 2.34-1.977V12.1a.784.784 0 0 0 .388.676l5.843 3.372-2.02 1.166a.077.077 0 0 1-.074.005l-4.837-2.793A4.502 4.502 0 0 1 2.13 8.464zm14.887-3.924a4.474 4.474 0 0 1 2.877 1.037l-.14.084-4.781 2.758a.79.79 0 0 0-.392.681v6.738l-2.02-1.168a.074.074 0 0 1-.037-.054V9.034a4.503 4.503 0 0 1 4.493-4.494zM7.5 13.916l-2.02-1.166a.077.077 0 0 1-.036-.057V7.11a4.505 4.505 0 0 1 7.375-3.454l-.142.08-4.78 2.76a.79.79 0 0 0-.392.681v6.739zm2.4-3.136l2.846-1.643 2.847 1.643v3.286l-2.847 1.643-2.846-1.643v-3.286z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    plan: "Pro Tier",
    price: "₹329",
    cycle: "mo",
    renewsIn: "Renews in 12 days",
    color: "#FFFFFF",
    glow: "rgba(255, 255, 255, 0.3)",
    side: "right",
    top: "42%",
    offset: "12%",
    size: "3.5rem",
    anim: "drift",
    delay: "-5s",
    dur: "13s",
    svg: (
      <svg viewBox="0 0 24 24" fill="#FFFFFF" className="size-6">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    plan: "Premium Family",
    price: "₹149",
    cycle: "mo",
    renewsIn: "Renews in 8 days",
    color: "#FF0000",
    glow: "rgba(255, 0, 0, 0.35)",
    side: "right",
    top: "68%",
    offset: "4%",
    size: "3.5rem",
    anim: "bob",
    delay: "-7s",
    dur: "14s",
    svg: (
      <svg viewBox="0 0 24 24" fill="#FF0000" className="size-6">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export function FloatingLogos() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {LOGO_ITEMS.map((item) => {
        const isHovered = hovered === item.name;

        const animClass =
          item.anim === "bob"
            ? "float-mark"
            : item.anim === "drift"
            ? "float-drift"
            : "float-spin";

        return (
          <div
            key={item.name}
            style={{
              top: item.top,
              ...(item.side === "left" ? { left: item.offset } : { right: item.offset }),
              animationDelay: item.delay,
              animationDuration: item.dur,
              animationPlayState: isHovered ? "paused" : "running",
            }}
            className={`${animClass} absolute pointer-events-auto transition-transform duration-300`}
            onMouseEnter={() => setHovered(item.name)}
            onMouseLeave={() => setHovered(null)}
          >
            <Link to="/sign-up" className="group relative block focus:outline-none">
              {/* Floating Glass Icon Card */}
              <div
                style={{
                  width: item.size,
                  height: item.size,
                  boxShadow: isHovered
                    ? `0 16px 48px ${item.glow}, 0 0 0 1px ${item.color}50`
                    : `0 8px 32px ${item.glow}`,
                }}
                className={`grid place-items-center rounded-[18px] border transition-all duration-300 ${
                  isHovered
                    ? "scale-110 border-white/30 bg-surface/90"
                    : "border-white/10 bg-surface/70 backdrop-blur-md hover:border-white/20"
                }`}
              >
                {item.svg}

                {/* Subtle active status indicator dot */}
                <span
                  className={`absolute -right-1 -top-1 size-3 rounded-full border-2 border-background ${
                    item.urgent ? "bg-warning animate-pulse" : "bg-success"
                  }`}
                />
              </div>

              {/* Rich Interactive Hover Popover */}
              <div
                className={`absolute z-30 w-52 rounded-[14px] border border-border/80 bg-surface/95 p-3.5 shadow-2xl backdrop-blur-xl transition-all duration-200 ${
                  item.side === "left" ? "left-full ml-3" : "right-full mr-3"
                } ${
                  isHovered
                    ? "pointer-events-auto opacity-100 scale-100 translate-y-0"
                    : "pointer-events-none opacity-0 scale-95 translate-y-1"
                }`}
                style={{ top: "-10px" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold text-foreground text-sm">
                    {item.name}
                    <span className="text-[10px] text-muted-foreground font-normal">({item.plan})</span>
                  </div>
                  <ArrowUpRight className="size-3.5 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                </div>

                <div className="mt-2 flex items-baseline justify-between border-t border-border/60 pt-2">
                  <span className="font-mono text-base font-medium text-foreground">
                    {item.price}<span className="text-xs text-subtle">/{item.cycle}</span>
                  </span>
                  <span
                    className={`text-[11px] font-medium ${
                      item.urgent ? "text-warning" : "text-subtle"
                    }`}
                  >
                    {item.renewsIn}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center justify-between rounded-[8px] bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                  <span className="flex items-center gap-1">
                    <Sparkles className="size-3" /> Track with Renewly
                  </span>
                  <span className="font-mono text-[10px]">Free</span>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
