import { HeroCentered } from "@/components/landing/hero";
import { AboutSection } from "@/components/landing/about";
import { EducationSection } from "@/components/landing/education";
import { ExperienceSection } from "@/components/landing/experience";
import { ProjectsSection } from "@/components/landing/projects";
import { Navbar } from "@/components/navigation/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <Navbar />
      <HeroCentered name="Jason Su" role="Software Engineer, Computer Science Student @ UofT" />
      {/* About */}
      <AboutSection />
      {/* Education */}
      <EducationSection />
      {/* Experience */}
      <ExperienceSection />
      {/* Projects */}
      <ProjectsSection />
    </main>
  );
}