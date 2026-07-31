import { Link } from "react-router-dom";
import { SearchInput } from "@/components/ui/search-input";

export function TopNavigation() {
  return (
    <header className="w-full border-b border-border bg-background/85 p-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link to="/" className="font-heading text-xl font-black">
          PayPlate
        </Link>
        <div className="flex-1">
          <SearchInput />
        </div>
      </div>
    </header>
  );
}
