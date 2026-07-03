// Deterministic starfield (no hydration mismatch) used on night-sky panels.
export function Stars({ count = 70 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => {
    const x = (i * 137.5) % 100;
    const y = ((i * 61.8) % 82) + 2;
    const s = (i % 3) + 1;
    const d = (i % 5) * 0.7;
    return { x, y, s, d };
  });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {stars.map((st, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: st.s,
            height: st.s,
            animationDelay: `${st.d}s`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}
