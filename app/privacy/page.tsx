import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata = {
  title: "Privacy Policy | Fieldwork AI",
  description: "How Fieldwork AI collects, uses, and protects information from visitors to getfieldworkai.com.",
};

const LAST_UPDATED = "June 23, 2026";

export default function PrivacyPage() {
  return (
    <main>
      <Nav />

      <section className="bg-slate pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <p className="section-label text-amber mb-4">Legal</p>
          <h1 className="font-syne font-semibold text-4xl md:text-5xl tracking-tightest text-white leading-[1.05] mb-4">
            Privacy Policy
          </h1>
          <p className="font-inter text-sm text-bone/40">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <section className="bg-bone py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-6 md:px-10 font-inter text-base leading-body text-steel space-y-10">
          <div className="space-y-4">
            <p>
              This Privacy Policy explains how Fieldwork AI LLC (&ldquo;Fieldwork AI,&rdquo; &ldquo;we,&rdquo;
              &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, and shares information when you visit{" "}
              <span className="whitespace-nowrap">getfieldworkai.com</span> (the &ldquo;Site&rdquo;) or otherwise
              interact with us. By using the Site, you agree to the practices described here.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-syne font-semibold text-2xl text-slate">1. Information we collect</h2>
            <p>We collect information in a few straightforward ways:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Information you provide.</strong> When you contact us, book a call, submit a form, take our
                diagnostic, or subscribe to our updates, you may give us your name, email address, company, and any
                details you choose to include in your message.
              </li>
              <li>
                <strong>Automatically collected information.</strong> Like most websites, we automatically receive
                standard technical data such as your IP address, browser type, device information, referring pages,
                and how you navigate the Site.
              </li>
              <li>
                <strong>Cookies and analytics.</strong> We use cookies and similar technologies, including Google
                Analytics, to understand traffic and improve the Site. You can disable cookies in your browser
                settings, though some features may not work as intended.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="font-syne font-semibold text-2xl text-slate">2. How we use information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Respond to your inquiries and provide our services;</li>
              <li>Operate, maintain, analyze, and improve the Site and our offerings;</li>
              <li>Send updates, marketing, and other communications you have requested or that relate to our services;</li>
              <li>Measure and improve our advertising, including campaigns on platforms such as Meta (Facebook and Instagram) and Google;</li>
              <li>Protect against fraud and comply with our legal obligations.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="font-syne font-semibold text-2xl text-slate">3. Advertising and third-party platforms</h2>
            <p>
              We advertise on third-party platforms, including Meta and Google. These platforms may use cookies,
              pixels, and similar technologies to deliver and measure ads, and to show you content relevant to your
              interests. Their use of your information is governed by their own privacy policies. You can manage ad
              preferences directly with these platforms or through tools such as your device and browser settings.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-syne font-semibold text-2xl text-slate">4. How we share information</h2>
            <p>
              We do not sell your personal information. We may share information with trusted service providers who
              help us operate the Site and our business (for example, analytics, email, hosting, and advertising
              providers), and where required by law, to enforce our agreements, or to protect our rights, safety, and
              property. We may also share information in connection with a business transaction such as a merger or
              acquisition.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-syne font-semibold text-2xl text-slate">5. Your choices</h2>
            <p>
              You can opt out of marketing emails at any time using the unsubscribe link in those messages, or by
              contacting us. You can also control cookies through your browser. Depending on where you live, you may
              have additional rights regarding your personal information, including the right to access, correct, or
              delete it. To make a request, contact us using the details below.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-syne font-semibold text-2xl text-slate">6. Data retention and security</h2>
            <p>
              We keep personal information only as long as needed for the purposes described here or as required by
              law. We use reasonable measures to protect your information, but no method of transmission or storage is
              completely secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-syne font-semibold text-2xl text-slate">7. Children&rsquo;s privacy</h2>
            <p>
              The Site is intended for business audiences and is not directed to children under 13. We do not
              knowingly collect personal information from children.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-syne font-semibold text-2xl text-slate">8. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we will revise the &ldquo;Last
              updated&rdquo; date above. Your continued use of the Site after any change means you accept the updated
              policy.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="font-syne font-semibold text-2xl text-slate">9. Contact us</h2>
            <p>
              Questions about this Privacy Policy? Reach us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-amber hover:underline">
                {CONTACT_EMAIL}
              </a>
              . Fieldwork AI LLC is based in Boise, Idaho.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
