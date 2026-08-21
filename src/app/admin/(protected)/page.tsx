import { SectionHeading } from "@/components/sections/SectionHeading";

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
        {/*
          Entity management lands here as link cards to /admin/experiences,
          /admin/projects and /admin/education. Each of those gets its own
          page under (protected)/ and owns its list fetch and CRUD dialogs;
          this page stays an index.
        */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-semibold text-foreground">Nothing to manage yet</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Experience, project and education management will appear here.
          </p>
        </div>
      </section>
    </div>
  );
}
