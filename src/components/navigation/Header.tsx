import Link from "next/link";
import { useTranslations } from "next-intl";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { Button } from "@/components/ui/button";

export function Header() {
  const t = useTranslations("Header");

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 pt-15">
        <Link
          href={t("homeHref")}
          className="text-5xl font-bold tracking-tight"
        >
          {t("initials")}
        </Link>
        <nav className="flex items-center gap-4">
          <Button
            asChild
            variant="ghost"
            className="size-14 transition-colors hover:bg-transparent hover:text-foreground/70 dark:hover:bg-transparent"
            aria-label={t("github.label")}
          >
            <Link href={t("github.url")} target="_blank" rel="noopener noreferrer">
              <FaGithub className="size-8" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="size-14 transition-colors hover:bg-transparent hover:text-foreground/70 dark:hover:bg-transparent"
            aria-label={t("linkedin.label")}
          >
            <Link href={t("linkedin.url")} target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn className="size-8" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
