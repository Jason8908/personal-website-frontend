import { HeroCentered } from "@/components/landing/hero";
import { AboutSection } from "@/components/landing/about";

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <HeroCentered name="Jason Su" role="Software Engineer, Computer Science Student @ UofT" />
      {/* About */}
      <AboutSection />
    </main>
  );
}