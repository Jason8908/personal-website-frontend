import { cn } from "@/lib/utils";
import { Mail } from "lucide-react";
import { SiLinkedin } from "react-icons/si";
import { getTranslations } from "next-intl/server";

type HeroCenteredProps = {
  name: string;
  role: string;
  className?: string;
};

export async function HeroCentered({ name, role, className }: HeroCenteredProps) {
  const t = await getTranslations("Hero");
  return (
    <section
      className={cn(
        "relative flex min-h-[calc(100svh-3.5rem)] sm:min-h-[calc(100svh-4rem)] w-full items-center justify-center px-6 py-12",
        "text-center",
        className
      )}
    >
      <div className="mx-auto -translate-y-8 sm:-translate-y-12 md:-translate-y-16 flex max-w-6xl flex-col items-center gap-6">
        <h1 className="text-6xl tracking-tight text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
          {name}
        </h1>
        <p className="text-lg font-semibold text-secondary sm:text-xl md:text-2xl">
          {role}
        </p>
        <div className="mt-1 flex items-center gap-4">
          <a
            href={t("links.linkedin")}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("contactLabelLinkedIn")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/50 text-foreground/80 transition-colors hover:text-foreground hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <SiLinkedin className="size-8" />
          </a>
          <a
            href={t("links.email")}
            aria-label={t("contactLabelEmail")}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/50 text-foreground/80 transition-colors hover:text-foreground hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Mail className="size-8" />
          </a>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-4 sm:bottom-6 flex justify-center">
        <a
          href="#about"
          className="group inline-flex flex-col items-center gap-2"
        >
          <svg
            className="h-6 w-6 text-foreground/70 transition-colors group-hover:text-foreground animate-bounce"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="sr-only">Scroll down</span>
        </a>
      </div>
    </section>
  );
}

export default HeroCentered;
