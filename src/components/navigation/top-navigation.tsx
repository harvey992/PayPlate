import { Link } from "react-router-dom";
import { SearchInput } from "@/components/ui/search-input";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";

export function TopNavigation() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="w-full border-b border-border bg-background/85 p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link to="/" className="font-heading text-xl font-black">
          PayPlate
        </Link>

        <div className="flex-1">
          <SearchInput />
        </div>

        <div className="ml-4 flex items-center gap-3">
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="grid size-11 place-items-center rounded-2xl border border-border bg-card shadow-sm"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link to="/profile" className="rounded-full bg-muted p-2 text-sm font-bold">
            Me
          </Link>
        </div>
      </div>
    </header>
  );
}
