import { Header } from "@/components/navigation/Header";
import { Container } from "@/components/layout/Container";
import { About } from "@/components/sections/About";

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <Header />
      <Container>
        <About />
      </Container>
    </main>
  );
}
