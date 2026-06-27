"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { experienceService } from "@/services/experience/experience.service";
import type { Experience as ExperienceData } from "@/services/experience/types";
import { ExperienceItem } from "@/components/sections/experience/ExperienceItem";
import { Spinner } from "@/components/ui/spinner";

type Status = "loading" | "error" | "ready";

export function Experience() {
  const t = useTranslations("Experience");
  const [status, setStatus] = useState<Status>("loading");
  const [items, setItems] = useState<ExperienceData[]>([]);

  useEffect(() => {
    let active = true;
    experienceService
      .getAllExperiences()
      .then((res) => {
        if (!active) return;
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        setItems(sorted);
        setStatus("ready");
      })
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
  }, []);

  const isEmpty = status === "ready" && items.length === 0;

  return (
    <section id="experience">
      <div className="mb-4">
        <h2 className="text-lg mb-2">
          {t("title")}
        </h2>
        <hr/>
      </div>
      {status === "loading" && (
        <div className="flex justify-center py-10">
          <Spinner className="size-8 text-muted-foreground" />
        </div>
      )}

      {(status === "error" || isEmpty) && (
        <p className="py-10 text-center text-muted-foreground">{t("empty")}</p>
      )}

      {status === "ready" && items.length > 0 && (
        <ol className="relative ml-1.5 space-y-10 border-l border-border">
          {items.map((experience, index) => (
            <ExperienceItem
              key={experience.id}
              experience={experience}
              presentLabel={t("present")}
              isMostRecent={index === 0}
            />
          ))}
        </ol>
      )}
    </section>
  );
}
