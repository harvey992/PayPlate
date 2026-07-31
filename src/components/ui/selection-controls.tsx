export function Checkbox({ checked, onChange, label }: { checked?: boolean; onChange?: (v: boolean) => void; label?: string }) {
  return (
    <label className="inline-flex items-center gap-2">
      <input type="checkbox" checked={checked} onChange={(e) => onChange?.(e.target.checked)} />
      {label ? <span>{label}</span> : null}
    </label>
  );
}

export function Radio({ checked, onChange, name, value, label }: { checked?: boolean; onChange?: () => void; name?: string; value?: string; label?: string }) {
  return (
    <label className="inline-flex items-center gap-2">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} />
      {label ? <span>{label}</span> : null}
    </label>
  );
}
