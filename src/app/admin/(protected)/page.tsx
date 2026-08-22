import Link from "next/link";
import { Briefcase, FolderGit2, GraduationCap } from "lucide-react";

import { SectionHeading } from "@/components/sections/SectionHeading";
import { ROUTES } from "@/lib/routes";

const SECTIONS = [
  {
    href: ROUTES.admin.experiences,
    icon: Briefcase,
    title: "Experience",
    description: "Roles on the public timeline.",
  },
  {
    href: ROUTES.admin.projects,
    icon: FolderGit2,
    title: "Projects",
    description: "Work shown in the projects section.",
  },
  {
    href: ROUTES.admin.education,
    icon: GraduationCap,
    title: "Education",
    description: "Schools and degrees.",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="leading-relaxed text-muted-foreground">
          Manage the content that appears on the public site.
        </p>
      </div>

      <section>
        <SectionHeading title="Content" />
        <div className="grid gap-4 sm:grid-cols-3">
          {SECTIONS.map(({ href, icon: Icon, title, description }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-highlight/40"
            >
              <Icon className="size-5 text-highlight" />
              <h3 className="mt-3 font-semibold text-foreground">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
