export function IconButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={`inline-grid place-items-center rounded-xl p-2 ${props.className ?? ""}`}>
      {children}
    </button>
  );
}
