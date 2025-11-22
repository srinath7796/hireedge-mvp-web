export function Card({ title, subtitle, actions, children }) {
  return (
    <div className="card">
      {(title || subtitle || actions) && (
        <div className="section-heading" style={{ marginBottom: subtitle ? 6 : 10 }}>
          <div>
            {title && <div className="card-title">{title}</div>}
            {subtitle && <div className="card-subtitle">{subtitle}</div>}
          </div>
          {actions && <div className="inline-actions">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function Section({ title, subtitle, actions, children }) {
  return (
    <section className="section">
      {(title || subtitle || actions) && (
        <div className="section-heading">
          <div>
            {title && <div className="section-title">{title}</div>}
            {subtitle && <div className="section-subtitle">{subtitle}</div>}
          </div>
          {actions && <div className="inline-actions">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
