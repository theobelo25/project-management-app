"use client";
import Link from "next/link";

import { Button } from "../ui/button";
import { logout } from "@web/lib/api/client";
import { ME_QUERY_KEY, useMeQuery } from "@web/lib/api/queries";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const authItems = [
  { href: "/signin", label: "Sign in", primary: false },
  { href: "/signup", label: "Sign up", primary: true },
] as const;

type SecondaryNavVariant = "bar" | "drawer";

interface SecondaryNavProps {
  variant?: SecondaryNavVariant;
}

export function SecondaryNav({ variant = "bar" }: SecondaryNavProps) {
  const { data: user, isPending } = useMeQuery();
  const queryClient = useQueryClient();
  const router = useRouter();

  const isAuthenticated = !!user;

  const handleLogoutClick = () => {
    logout();
    queryClient.setQueryData(ME_QUERY_KEY, null);
    router.push("/");
  };

  if (variant === "drawer") {
    return (
      <>
        {isPending ? (
          <div className="h-10 animate-pulse rounded-lg bg-muted" />
        ) : isAuthenticated ? (
          <Button type="button" onClick={() => handleLogoutClick()}>
            Logout
          </Button>
        ) : (
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            {authItems.map(({ href, label, primary }) => (
              <Link
                key={href}
                href={href}
                className={
                  primary
                    ? "block rounded-lg bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    : "block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                }
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </>
    );
  }

  return (
    <nav className="flex items-center gap-6" aria-label="Account">
      {isPending ? (
        <div className="h-8 w-24 animate-pulse rounded bg-muted" />
      ) : isAuthenticated ? (
        <Button type="button" onClick={() => handleLogoutClick()}>
          Logout
        </Button>
      ) : (
        authItems.map(({ href, label, primary }) =>
          primary ? (
            <Button key={href} asChild size="sm">
              <Link href={href}>{label}</Link>
            </Button>
          ) : (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ),
        )
      )}
    </nav>
  );
}
