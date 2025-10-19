"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

type NavbarProps = {
  className?: string;
};

type NavKey = "about" | "education" | "experience" | "projects";

const NAV_ITEMS: { key: NavKey; href: string }[] = [
  { key: "about", href: "#about" },
  { key: "education", href: "#education" },
  { key: "experience", href: "#experience" },
  { key: "projects", href: "#projects" },
];

export function Navbar({ className }: NavbarProps) {
  const t = useTranslations("Navbar");
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
    >
      <div className="relative mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link href="#" className="text-xl font-semibold text-foreground sm:text-xl">
          {t("brand")}
        </Link>

        <nav className="hidden items-center gap-6 sm:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-lg text-foreground/80 transition-colors hover:text-foreground"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="sm:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground/80 hover:text-foreground hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={t("menuOpen")}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            className={cn("h-6 w-6", open && "hidden")}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <svg
            className={cn("h-6 w-6", !open && "hidden")}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div
          id="mobile-menu"
          className={cn(
            "absolute left-0 right-0 top-full z-50 mt-2 origin-top rounded-md border border-border/30 bg-background/95 p-2 shadow-lg backdrop-blur sm:hidden transform-gpu transition-all duration-200 ease-out",
            open
              ? "opacity-100 scale-y-100 translate-y-0"
              : "pointer-events-none opacity-0 scale-y-95 -translate-y-1"
          )}
          role="menu"
          aria-label="Mobile navigation"
          aria-hidden={!open}
        >
          <div className="flex flex-col divide-y divide-border/20">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-3 text-base text-foreground/90 hover:text-foreground hover:bg-foreground/5"
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;