/**
 * Compatibility shim between the app's existing react-router-dom-shaped call
 * sites and TanStack Router. This lets page/component code keep working
 * unchanged (navigate("/path"), useParams(), useSearchParams(), etc.)
 * while the app runs on @tanstack/react-router underneath.
 */
import { useEffect } from "react";
import {
  Link as TsLink,
  useNavigate as useTsNavigate,
  useParams as useTsParams,
  useLocation as useTsLocation,
  useSearch as useTsSearch,
} from "@tanstack/react-router";
import type { ReactNode, AnchorHTMLAttributes } from "react";

type LooseLinkProps = {
  to: string;
  children?: ReactNode | ((state: { isActive: boolean }) => ReactNode);
  className?: string | ((state: { isActive: boolean }) => string);
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;

/** Drop-in for react-router-dom's <Link to="..."> */
export function Link({ to, ...rest }: LooseLinkProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <TsLink to={to as any} {...(rest as any)} />;
}

/** Drop-in for react-router-dom's <NavLink> — TanStack's Link already
 * supports the same render-prop `{({ isActive }) => ...}` children API. */
export const NavLink = Link;

/** Drop-in for react-router-dom's <Navigate to="..." replace /> */
export function Navigate({ to, replace }: { to: string; replace?: boolean; state?: unknown }) {
  const navigate = useTsNavigate();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate({ to: to as any, replace });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

/** Drop-in for react-router-dom's useNavigate() — still called as navigate("/path") */
export function useNavigate() {
  const navigate = useTsNavigate();
  return (to: string) => {
    const [pathname, search] = to.split("?");
    navigate({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      to: pathname as any,
      search: search
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (Object.fromEntries(new URLSearchParams(search)) as any)
        : undefined,
    });
  };
}

/** Drop-in for react-router-dom's useParams() */
export function useParams<T extends Record<string, string> = Record<string, string>>(): T {
  return useTsParams({ strict: false }) as unknown as T;
}

/** Drop-in for react-router-dom's useLocation() */
export function useLocation() {
  return useTsLocation();
}

/** Drop-in for react-router-dom's useSearchParams() -> [URLSearchParams, setter] */
export function useSearchParams(): [URLSearchParams, (next: Record<string, string>) => void] {
  const search = useTsSearch({ strict: false }) as Record<string, string>;
  const navigate = useTsNavigate();
  const usp = new URLSearchParams(search as Record<string, string>);
  const setSearchParams = (next: Record<string, string>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate({ search: next as any } as any);
  };
  return [usp, setSearchParams];
}
