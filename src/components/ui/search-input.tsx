import { Search } from "lucide-react";
import { Input } from "./input";

type SearchInputProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  onSearch?: (value: string) => void;
};

export function SearchInput({
  value = "",
  onChange,
  placeholder = "Search restaurants, meals…",
  onSearch,
}: SearchInputProps) {
  return (
    <Input
      icon={<Search size={18} />}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSearch?.(value);
      }}
      aria-label="Search"
    />
  );
}
