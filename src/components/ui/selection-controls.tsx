import { cn } from "@/lib/utils";

export function Checkbox({ checked, onChange, label }: { checked?: boolean; onChange?: (v: boolean) => void; label?: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="size-5 rounded-md border-border accent-primary"
      />
      {label ? <span className="text-sm font-medium">{label}</span> : null}
    </label>
  );
}

export function Radio({ checked, onChange, name, value, label }: { checked?: boolean; onChange?: () => void; name?: string; value?: string; label?: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2.5">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className={cn("size-5 border-border accent-primary")}
      />
      {label ? <span className="text-sm font-medium">{label}</span> : null}
    </label>
  );
}
