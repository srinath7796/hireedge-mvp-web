export function ErrorBanner({ message }) {
  if (!message) return null;
  return <div className="error-banner" role="alert">{message}</div>;
}

export function SuccessBanner({ message }) {
  if (!message) return null;
  return <div className="success-banner" role="status">{message}</div>;
}
