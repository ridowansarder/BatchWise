"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden px-6">
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Green glow blob */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-[140px] opacity-25"
        style={{ background: "var(--primary)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        {/* 404 */}
        <div className="relative mb-4 select-none leading-none">
          {/* Ghost layer */}
          <span
            className="absolute inset-0 flex items-end justify-center text-[clamp(7rem,22vw,11rem)] font-black tracking-tighter"
            style={{
              WebkitTextStroke: "1px var(--border)",
              color: "transparent",
              transform: "translateY(6px)",
              opacity: 0.5,
            }}
          >
            404
          </span>
          {/* Main gradient text */}
          <span
            className="relative text-[clamp(7rem,22vw,11rem)] font-black tracking-tighter bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, var(--foreground) 0%, var(--primary) 55%, var(--accent) 100%)",
            }}
          >
            404
          </span>
        </div>

        {/* Divider */}
        <div
          className="w-10 h-0.5 rounded-full mb-5"
          style={{ background: "var(--primary)" }}
        />

        <h1 className="text-foreground text-xl font-semibold tracking-tight mb-2">
          Page not found
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved somewhere else.
        </p>

        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>

        <p className="mt-10 text-xs tracking-widest uppercase font-mono text-muted-foreground/40">
          Error · 404 · Not Found
        </p>
      </div>
    </div>
  );
}
