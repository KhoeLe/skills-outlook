import {
  Navigation,
  Hero,
  Packages,
  Features,
  QuickStart,
  MCPSection,
  TypesReference,
  Footer,
} from "@/components";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <Packages />
        <Features />
        <QuickStart />
        <MCPSection />
        <TypesReference />
      </main>
      <Footer />
    </>
  );
}
