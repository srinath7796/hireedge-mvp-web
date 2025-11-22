export function PrimaryButton({ children, icon, ...props }) {
  return (
    <button className="btn btn-primary" {...props}>
      {icon}
      {children}
    </button>
  );
}

export function SecondaryButton({ children, icon, ...props }) {
  return (
    <button className="btn btn-secondary" {...props}>
      {icon}
      {children}
    </button>
  );
}

export function GhostButton({ children, icon, ...props }) {
  return (
    <button className="btn btn-ghost" {...props}>
      {icon}
      {children}
    </button>
  );
}
