import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/navigation/Footer";
import { Container } from "@/components/layout/Container";
import { About } from "@/components/sections/About";

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <Header />
      <Container>
        <About />
      </Container>
      <Footer />
    </main>
  );
}
