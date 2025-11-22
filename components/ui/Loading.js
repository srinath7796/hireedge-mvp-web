export function LoadingDots({ label }) {
  return (
    <span aria-live="polite" className="inline-actions" style={{ alignItems: "center" }}>
      <span className="badge" aria-hidden>
        ● ● ●
      </span>
      {label && <span className="section-subtitle">{label}</span>}
    </span>
  );
}
