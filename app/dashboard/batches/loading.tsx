export default function Loading() {
  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden">
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
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[120px] opacity-25"
        style={{ background: "var(--primary)" }}
      />

      {/* Spinner + label */}
      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Ring */}
        <div className="relative w-14 h-14">
          {/* Track */}
          <span
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: "var(--border)" }}
          />
          {/* Spinning arc */}
          <span
            className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderTopColor: "var(--primary)",
              borderRightColor: "color-mix(in oklch, var(--primary) 40%, transparent)",
              animationDuration: "800ms",
            }}
          />
          {/* Center dot */}
          <span className="absolute inset-0 flex items-center justify-center">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "var(--primary)" }}
            />
          </span>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-foreground text-sm font-medium tracking-wide">
            Loading
          </p>
          {/* Dots */}
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-1 h-1 rounded-full animate-pulse"
                style={{
                  background: "var(--muted-foreground)",
                  animationDelay: `${i * 200}ms`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}