import { Link } from "react-router-dom";

export function Breadcrumb({ items }: { items: { title: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex items-center gap-2">
        {items.map((it, idx) => (
          <li key={idx} className="inline-flex items-center">
            {it.to ? (
              <Link to={it.to} className="text-muted-foreground hover:text-text">
                {it.title}
              </Link>
            ) : (
              <span className="text-text font-bold">{it.title}</span>
            )}
            {idx < items.length - 1 ? <span className="mx-2">/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
