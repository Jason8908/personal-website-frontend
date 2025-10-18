import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardHeader } from "@/components/admin/dashboard/dashboard-header";
import { ExperiencesTab } from "@/components/admin/dashboard/sections/experiences-tab";
import { ProjectsTab } from "@/components/admin/dashboard/sections/projects-tab";
import { EducationTab } from "@/components/admin/dashboard/sections/education-tab";
import { AdminNavbar } from "@/components/admin/navigation/admin-navbar";

export function AdminDashboard() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-2">
      <AdminNavbar />
      <DashboardHeader />
      
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="experiences" className="w-full">
            <div className="flex items-center justify-between gap-4">
              <TabsList>
                <TabsTrigger value="experiences">Experiences</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>
            </div>

            <div className="mt-6">
              <TabsContent value="experiences">
                <ExperiencesTab />
              </TabsContent>
              <TabsContent value="projects">
                <ProjectsTab />
              </TabsContent>
              <TabsContent value="education">
                <EducationTab />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}


