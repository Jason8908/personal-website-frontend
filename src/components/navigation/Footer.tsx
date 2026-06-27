import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="w-full border-t border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-8">
        <p className="text-md text-muted-foreground">{t("copyright")}</p>
      </div>
    </footer>
  );
}
