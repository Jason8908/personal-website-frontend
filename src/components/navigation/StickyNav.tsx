import { useTranslations } from "next-intl";

const links = [
  { href: "#home", key: "home" },
  { href: "#about", key: "about" },
  { href: "#experience", key: "experience" },
  { href: "#projects", key: "projects" },
] as const;

export function StickyNav() {
  const t = useTranslations("Nav");

  return (
    <nav
      aria-label="Page sections"
      className="fixed top-9 left-1/2 z-50 -translate-x-1/2"
    >
      <ul className="flex items-center gap-1 rounded-full border border-border bg-card/80 px-2 py-1.5 shadow-sm backdrop-blur">
        {links.map(({ href, key }) => (
          <li key={key}>
            <a
              href={href}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(key)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
