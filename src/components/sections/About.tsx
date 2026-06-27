import { useTranslations } from "next-intl";
import { richTextTags } from "@/components/typography/richText";

export function About() {
  const t = useTranslations("About");
  const paragraphs = t.raw("paragraphs") as string[];

  return (
    <section id="about" className="scroll-mt-20 py-16 md:py-24">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
        <div className="space-y-4">
          <h2 className="text-5xl font-bold tracking-tight md:text-4xl">
            {t("title")}
          </h2>
          <div className="space-y-6">
            {paragraphs.map((_, i) => (
              <p key={i} className="leading-relaxed text-muted-foreground">
                {t.rich(`paragraphs.${i}`, richTextTags)}
              </p>
            ))}
          </div>
        </div>
        <div aria-hidden />
      </div>
    </section>
  );
}
