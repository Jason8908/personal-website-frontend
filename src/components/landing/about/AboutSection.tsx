import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { UserRound } from "lucide-react";

type AboutSectionProps = {
  className?: string;
};

export async function AboutSection({ className }: AboutSectionProps) {
  const t = await getTranslations("About");

  return (
    <section id="about" className={cn("w-full px-6 py-20", className)}>
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2">
        <div className="order-2 md:order-1 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <UserRound className="h-11 w-11 text-secondary" aria-hidden="true" />
            <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {t("title")}
            </h2>
          </div>
          {t("description")
            .split(/\n+/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)
            .map((paragraph, idx) => (
              <p
                key={idx}
                className="text-base leading-relaxed text-foreground/85 sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
        </div>

        <div className="order-1 md:order-2">
          <div className="relative mx-auto aspect-[4/5] w-48 overflow-hidden rounded-xl border border-border/40 bg-muted/30 sm:w-60 md:w-72 lg:w-80">
            <Image
              src="/avatar.jpeg"
              alt="Jason Su"
              fill
              priority
              sizes="(min-width: 1024px) 20rem, (min-width: 768px) 18rem, (min-width: 640px) 15rem, 12rem"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;