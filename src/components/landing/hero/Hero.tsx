"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type HeroProps = {
  name: string;
  title: string;
  subtitle?: string;
  avatarUrl: string;
  ctaPrimary?: {
    label: string;
    href: string;
  };
  ctaSecondary?: {
    label: string;
    href: string;
  };
  className?: string;
};

export function Hero({
  name,
  title,
  subtitle,
  avatarUrl,
  ctaPrimary,
  ctaSecondary,
  className,
}: HeroProps) {
  return (
    <section
      className={cn(
        "relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-20 sm:grid-cols-2 md:py-28",
        className
      )}
    >
      <div className="order-2 sm:order-1 flex flex-col gap-5">
        <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-primary" />
          <span>Software Engineer</span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          {name}
        </h1>
        <p className="text-xl text-muted-foreground md:text-2xl">{title}</p>
        {subtitle ? (
          <p className="max-w-prose text-balance text-base text-muted-foreground/90">
            {subtitle}
          </p>
        ) : null}

        {(ctaPrimary || ctaSecondary) && (
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {ctaPrimary ? (
              <a
                href={ctaPrimary.href}
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                {ctaPrimary.label}
              </a>
            ) : null}
            {ctaSecondary ? (
              <a
                href={ctaSecondary.href}
                className="rounded-md border px-5 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                {ctaSecondary.label}
              </a>
            ) : null}
          </div>
        )}
      </div>

      <div className="order-1 sm:order-2 relative mx-auto aspect-square w-48 sm:w-60 md:w-72 lg:w-80">
        <div className="absolute -inset-4 -z-10 rounded-full bg-gradient-to-br from-primary/20 via-transparent to-transparent blur-2xl" />
        <Image
          src={avatarUrl}
          alt={`${name} avatar`}
          fill
          priority
          sizes="(max-width: 640px) 12rem, (max-width: 768px) 15rem, (max-width: 1024px) 18rem, 20rem"
          className="rounded-full object-cover ring-1 ring-border"
        />
      </div>
    </section>
  );
}

export default Hero;