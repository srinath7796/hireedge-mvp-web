export function TextInput({ label, id, helper, ...props }) {
  return (
    <label className="stack" htmlFor={id}>
      {label && <span className="label">{label}</span>}
      <input className="input" id={id} {...props} />
      {helper && <span className="section-subtitle">{helper}</span>}
    </label>
  );
}

export function Select({ label, id, children, ...props }) {
  return (
    <label className="stack" htmlFor={id}>
      {label && <span className="label">{label}</span>}
      <select className="select" id={id} {...props}>
        {children}
      </select>
    </label>
  );
}
