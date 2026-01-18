import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import site from "@/content/site.json";
import { ContactForm } from "@/components/forms/contact-form";
import { buildBreadcrumbJsonLd } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "About 1031 Exchange Seattle | 1031 Exchange Specialists",
  description:
    "Learn how 1031 Exchange Seattle helps investors identify replacement properties, maintain compliance, and coordinate with Qualified Intermediaries and lenders.",
  alternates: {
    canonical: "https://www.1031exchangeseattle.com/about",
  },
};

const breadcrumbItems = [
  { label: "Home", href: "https://www.1031exchangeseattle.com/" },
  { label: "About", href: "https://www.1031exchangeseattle.com/about" },
];

const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

const capabilities = [
  "Replacement property intelligence covering single tenant NNN, multifamily, logistics, healthcare, hospitality, and mixed-use assets.",
  "Secure intake and encrypted data rooms that keep your financial information protected.",
  "Project management that aligns lenders, inspectors, attorneys, and intermediaries with forty-five and one hundred eighty day deadlines.",
  "Audit-ready reporting that records every milestone, document, and valuation adjustment.",
];

const processSteps = [
  { title: "Intake", description: "Secure intake captures goals, timelines, debt preferences, and target asset classes." },
  { title: "Sourcing", description: "We deliver curated replacement property lists with underwriting packages and risk registers." },
  { title: "Identification", description: "Identification support includes valuation evidence, draft letters, and intermediary coordination." },
  { title: "Diligence", description: "Diligence management collects inspections, rent roll updates, financing approvals, and closing statements." },
  { title: "Closing", description: "Closing support documents every transfer, escrow instruction, and compliance step for audit readiness." },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/homepage-hero/seattle-washington-1031-exchange-2.jpg"
            alt="About 1031 Exchange Seattle"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 md:px-10">
          <nav className="mb-8 text-sm">
            <ol className="flex items-center gap-2 text-white/60">
              <li><Link href="/" className="hover:text-[#b8a074]">Home</Link></li>
              <li>/</li>
              <li className="text-white/90">About</li>
            </ol>
          </nav>
          <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-4">
            Who We Are
          </p>
          <h1 className="font-heading text-5xl md:text-7xl tracking-[0.1em] text-white">
            About Us
          </h1>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-4">
                Our Mission
              </p>
              <h2 className="font-heading text-3xl md:text-4xl tracking-[0.1em] text-[#2c3e50] mb-6">
                Expert Exchange Coordination
              </h2>
              <p className="text-xl text-[#6b7c8a] leading-relaxed mb-8">
                {site.company} helps investors identify, underwrite, and secure 1031 exchange replacement properties nationwide. Our Seattle team manages sourcing, diligence, lender coordination, and documentation while partnering with your Qualified Intermediary, CPA, and counsel.
              </p>
              <Link
                href="/contact"
                className="inline-block px-8 py-4 bg-[#2c3e50] text-xs tracking-[0.2em] uppercase text-white hover:bg-[#1a3a52] transition-colors"
              >
                Work With Us
              </Link>
            </div>
            <div className="relative aspect-[4/3]">
              <Image
                src="/homepage-hero/seattle-washington-1031-exchange-4.jpg"
                alt="Seattle Skyline"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="bg-[#1a3a52] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-4">
              What We Offer
            </p>
            <h2 className="font-heading text-3xl md:text-4xl tracking-[0.1em] text-white">
              Our Capabilities
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {capabilities.map((capability, index) => (
              <div 
                key={capability}
                className="bg-white/10 border border-white/20 p-8"
              >
                <span className="font-heading text-4xl text-[#b8a074] mb-4 block">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-white/80 leading-relaxed">{capability}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-[#f7f6f4] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-2">
              Our Approach
            </p>
            <h2 className="font-heading text-3xl md:text-4xl tracking-[0.1em] text-[#2c3e50]">
              How We Work
            </h2>
          </div>
          <div className="grid md:grid-cols-5 gap-6">
            {processSteps.map((step, index) => (
              <div key={step.title} className="bg-white p-6">
                <span className="font-heading text-3xl text-[#b8a074] mb-4 block">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-heading text-lg tracking-[0.05em] text-[#2c3e50] mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-[#6b7c8a] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-4">
            Important Notice
          </p>
          <h2 className="font-heading text-3xl md:text-4xl tracking-[0.1em] text-[#2c3e50] mb-6">
            Compliance & Advisor Alignment
          </h2>
          <p className="text-[#6b7c8a] leading-relaxed mb-8 max-w-3xl mx-auto">
            We are not a Qualified Intermediary, law firm, broker, or CPA. We coordinate with the licensed professionals you trust. Every engagement includes secure communication channels, weekly schedule reviews, data rooms for documentation, and compliance checklists.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/services"
              className="px-8 py-4 border border-[#2c3e50] text-xs tracking-[0.2em] uppercase text-[#2c3e50] hover:bg-[#2c3e50] hover:text-white transition-all"
            >
              View Our Services
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-[#2c3e50] text-xs tracking-[0.2em] uppercase text-white hover:bg-[#1a3a52] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-24">
        <div className="absolute inset-0">
          <Image
            src="/homepage-hero/seattle-washington-1031-exchange-5.jpg"
            alt="Contact"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#1a3a52]/90" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-4">
              Get Started
            </p>
            <h2 className="font-heading text-3xl md:text-4xl tracking-[0.1em] text-white mb-4">
              Contact Our Seattle Team
            </h2>
            <p className="text-white/70">
              Share your exchange goals, timeline, and preferred asset classes. We respond within one business day.
            </p>
          </div>
          <div className="bg-white/10 border border-white/20 p-8 md:p-10">
            <ContactForm 
              source="About page" 
              defaultProjectType="Seattle replacement property" 
              id="about-intake" 
              variant="dark"
            />
          </div>
        </div>
      </section>
    </>
  );
}
