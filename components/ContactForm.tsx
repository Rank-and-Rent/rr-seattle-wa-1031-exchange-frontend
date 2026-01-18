'use client';

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import site from "@/content/site.json";
import { ContactForm } from "@/components/forms/contact-form";
import { BUSINESS_HOURS } from "@/lib/config";

export default function ContactFormPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const searchParams = useSearchParams();
  const phoneHref = `tel:${site.phoneDigits}`;
  const emailHref = `mailto:${site.email}`;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    site.address
  )}&output=embed`;

  const defaultProjectType = useMemo(() => {
    const direct = searchParams?.get("projectType")?.trim();
    if (direct) return direct;
    const serviceParam = searchParams?.get("service")?.trim();
    if (serviceParam) return serviceParam;
    const projectParam = searchParams?.get("project")?.trim();
    if (projectParam) return projectParam;
    const locationParam = searchParams?.get("location")?.trim();
    if (locationParam) return `${locationParam} replacement property`;
    return "";
  }, [searchParams]);

  if (isSubmitted) {
    return (
      <section className="min-h-screen bg-[#1a3a52] flex items-center justify-center px-6 py-24">
        <div className="max-w-2xl w-full text-center">
          <div className="w-20 h-20 border border-[#b8a074] flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl text-[#b8a074]">&#10003;</span>
          </div>
          <h1 className="font-heading text-4xl tracking-[0.1em] text-white mb-4">
            Thank You
          </h1>
          <p className="text-xl text-white/70 mb-10 leading-relaxed">
            A Seattle 1031 exchange advisor will reach out within one business day with next steps and replacement property insights.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="px-10 py-4 border border-white/40 text-xs tracking-[0.2em] uppercase text-white hover:bg-white hover:text-[#1a3a52] transition-all"
            >
              Return Home
            </Link>
            <a
              href={phoneHref}
              className="px-10 py-4 bg-[#b8a074] text-xs tracking-[0.2em] uppercase text-white hover:bg-[#a08960] transition-colors"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src="/homepage-hero/seattle-washington-1031-exchange-3.jpg"
            alt="Contact Seattle 1031 Exchange"
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
              <li className="text-white/90">Contact</li>
            </ol>
          </nav>
          <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-4">
            Get In Touch
          </p>
          <h1 className="font-heading text-5xl md:text-7xl tracking-[0.1em] text-white">
            Contact Us
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left Column - Info */}
            <div>
              <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-4">
                Start Your Exchange
              </p>
              <h2 className="font-heading text-3xl md:text-4xl tracking-[0.1em] text-[#2c3e50] mb-6">
                Let&apos;s Work Together
              </h2>
              <p className="text-xl text-[#6b7c8a] leading-relaxed mb-10">
                We coordinate 45-day identification, 180-day closing control, and national property sourcing with full transparency.
              </p>

              <div className="space-y-8 mb-10">
                <InfoRow label="Phone">
                  <a href={phoneHref} className="text-[#2c3e50] text-lg hover:text-[#b8a074] transition-colors">
                    {site.phone}
                  </a>
                </InfoRow>
                <InfoRow label="Email">
                  <a href={emailHref} className="text-[#2c3e50] text-lg hover:text-[#b8a074] transition-colors">
                    {site.email}
                  </a>
                </InfoRow>
                <InfoRow label="Address">
                  <span className="text-[#2c3e50] text-lg">{site.address}</span>
                </InfoRow>
                <InfoRow label="Hours">
                  <span className="text-[#2c3e50] text-lg">{BUSINESS_HOURS}</span>
                </InfoRow>
              </div>

              <div className="bg-[#1a3a52] p-8">
                <p className="text-xs tracking-[0.25em] uppercase text-[#b8a074] mb-4">
                  What Happens Next
                </p>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 bg-[#b8a074] flex-shrink-0" />
                    <span>Intake review and intermediary alignment within one business day.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 bg-[#b8a074] flex-shrink-0" />
                    <span>Custom replacement property slate within 10 business days.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 bg-[#b8a074] flex-shrink-0" />
                    <span>Weekly status updates covering lender, legal, and identification milestones.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - Form */}
            <div className="bg-[#f7f6f4] p-8 md:p-10">
              <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-2">
                Send a Message
              </p>
              <h3 className="font-heading text-2xl tracking-[0.08em] text-[#2c3e50] mb-8">
                Share Your Requirements
              </h3>
              <ContactForm
                source="Contact page form"
                defaultProjectType={defaultProjectType}
                id="contact-page-form"
                onSuccess={() => setIsSubmitted(true)}
                variant="light"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[400px]">
        <iframe
          title={`Map of ${site.address}`}
          src={mapSrc}
          width="100%"
          height="100%"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale"
        />
      </section>
    </>
  );
}

type InfoRowProps = {
  label: string;
  children: ReactNode;
};

function InfoRow({ label, children }: InfoRowProps) {
  return (
    <div>
      <span className="text-xs tracking-[0.25em] uppercase text-[#b8a074] block mb-1">
        {label}
      </span>
      {children}
    </div>
  );
}
