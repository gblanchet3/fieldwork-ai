import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";

export const metadata = {
  title: "Talk to me | Fieldwork AI",
  description: "Two ways in. Run the calculator and send me your levels, or book a 30-minute call. No pitch deck.",
};

export default function ContactPage() {
  return (
    <main>
      <Nav />
      <Contact standalone />
      <Footer />
    </main>
  );
}
