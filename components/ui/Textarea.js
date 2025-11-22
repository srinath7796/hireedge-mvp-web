export default function Textarea({ label, id, helper, ...props }) {
  return (
    <label className="stack" htmlFor={id}>
      {label && <span className="label">{label}</span>}
      <textarea className="textarea" id={id} {...props} />
      {helper && <span className="section-subtitle">{helper}</span>}
    </label>
  );
}
