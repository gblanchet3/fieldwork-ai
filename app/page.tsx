import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Calculator from "@/components/Calculator";
import Problem from "@/components/Problem";
import Principles from "@/components/Principles";
import Methodology from "@/components/Methodology";
import Services from "@/components/Services";
import Work from "@/components/Work";
import About from "@/components/About";
import FieldNotes from "@/components/FieldNotes";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <Calculator />
      <Problem />
      <Principles />
      <Methodology />
      <Services />
      <Work />
      <About />
      <FieldNotes />
      <Contact />
      <Footer />
    </main>
  );
}
