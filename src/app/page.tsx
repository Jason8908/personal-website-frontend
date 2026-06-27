import { Header } from "@/components/navigation/Header";
import { StickyNav } from "@/components/navigation/StickyNav";
import { Footer } from "@/components/navigation/Footer";
import { Container } from "@/components/layout/Container";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/experience/Experience";
import { Projects } from "@/components/sections/projects/Projects";

export default function Home() {
  return (
    <main id="home" className="min-h-screen w-full">
      <Header />
      <StickyNav />
      <Container>
        <About />
        <Experience />
        <Projects />
      </Container>
      <Footer />
    </main>
  );
}
