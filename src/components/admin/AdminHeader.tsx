"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAdminUser } from "@/components/admin/AdminAuthGate";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: ROUTES.admin.experiences, label: "Experience" },
  { href: ROUTES.admin.projects, label: "Projects" },
  { href: ROUTES.admin.education, label: "Education" },
];

export function AdminHeader() {
  const user = useAdminUser();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
      <Container className="mb-0 flex h-16 items-center justify-between gap-4">
        <Link href={ROUTES.admin.dashboard} className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight">JS</span>
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-highlight">
            Admin
          </span>
        </Link>

        <nav className="hidden gap-1 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors hover:text-foreground",
                pathname === href ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:bg-transparent hover:text-foreground dark:hover:bg-transparent"
          >
            <Link href={ROUTES.home}>View site</Link>
          </Button>
          <LogoutButton />
        </div>
      </Container>
    </header>
  );
}
