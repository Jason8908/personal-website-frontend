import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { Container } from "@/components/layout/Container";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/experience/Experience";

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <Header />
      <Container>
        <About />
        <Experience />
      </Container>
      <Footer />
    </main>
  );
}
