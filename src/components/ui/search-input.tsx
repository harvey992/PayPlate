import { Search } from "lucide-react";

export function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Search food, restaurants...",
}: {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.FormEvent) => void;
  placeholder?: string;
}) {
  return (
    <form onSubmit={onSubmit}>
      <label className="flex items-center gap-2.5 rounded-2xl bg-card px-4 py-2.5 ring-1 ring-border transition-all focus-within:ring-primary/40">
        <Search size={17} className="shrink-0 text-muted-foreground" />
        <input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm font-medium text-text placeholder:text-muted-foreground outline-none"
        />
      </label>
    </form>
  );
}
