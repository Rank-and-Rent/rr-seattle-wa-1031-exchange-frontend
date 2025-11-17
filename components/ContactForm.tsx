'use client';

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
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
    if (direct) {
      return direct;
    }
    const serviceParam = searchParams?.get("service")?.trim();
    if (serviceParam) {
      return serviceParam;
    }
    const projectParam = searchParams?.get("project")?.trim();
    if (projectParam) {
      return projectParam;
    }
    const locationParam = searchParams?.get("location")?.trim();
    if (locationParam) {
      return `${locationParam} replacement property`;
    }
    return "";
  }, [searchParams]);

  if (isSubmitted) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-[#0E1D2B] via-[#1F3C58] to-[#4DA49B] px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/20 bg-white/10 p-12 text-center shadow-[0_45px_85px_-40px_rgba(0,0,0,0.75)] backdrop-blur">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/50 bg-white/10">
            <span className="text-3xl font-semibold">✓</span>
          </div>
          <h1 className="mt-8 text-3xl font-semibold">
            Thank you. We received your request.
          </h1>
          <p className="mt-4 text-base text-white/80">
            A Seattle 1031 exchange advisor will reach out within one business day with next steps and replacement property insights.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm font-semibold uppercase tracking-[0.28em]">
            <Link
              href="/"
              className="rounded-full border border-white/60 px-6 py-3 transition hover:bg-white hover:text-[#1F3C58]"
            >
              Return Home
            </Link>
            <a
              href={phoneHref}
              className="rounded-full border border-white/60 px-6 py-3 transition hover:bg-white hover:text-[#1F3C58]"
            >
              Call Us Now
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#F5F7FA] px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        <div className="space-y-8 rounded-3xl border border-[#E2E8F0] bg-white/80 p-10 shadow-sm backdrop-blur">
          <h1 className="text-3xl font-semibold text-[#12263A]">
            Start your exchange plan.
          </h1>
          <p className="text-base text-[#1F3C58]/80">
            We coordinate 45-day identification, 180-day closing control, and national property sourcing with full transparency.
          </p>
          <div className="space-y-6 text-sm">
            <InfoRow label="Phone">
              <a
                href={phoneHref}
                className="text-[#1F3C58] underline decoration-[#4DA49B]/70 underline-offset-4 transition hover:text-[#274f74]"
              >
                {site.phone}
              </a>
            </InfoRow>
            <InfoRow label="Email">
              <a
                href={emailHref}
                className="text-[#1F3C58] underline decoration-[#4DA49B]/70 underline-offset-4 transition hover:text-[#274f74]"
              >
                {site.email}
              </a>
            </InfoRow>
            <InfoRow label="Address">
              <span className="text-[#1F3C58]">{site.address}</span>
            </InfoRow>
            <InfoRow label="Hours">
              <span className="text-[#1F3C58]">{BUSINESS_HOURS}</span>
            </InfoRow>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-sm">
            <div className="h-56 w-full">
              <iframe
                title={`Map of ${site.address}`}
                src={mapSrc}
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <div className="rounded-2xl border border-[#E2E8F0] bg-[#1F3C58] p-6 text-white">
            <h2 className="text-lg font-semibold uppercase tracking-[0.3em] text-white/80">
              What happens next
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-white/85">
              <li>• Intake review and intermediary alignment within one business day.</li>
              <li>• Custom replacement property slate within 10 business days.</li>
              <li>• Weekly status updates covering lender, legal, and identification milestones.</li>
            </ul>
          </div>
        </div>
        <div className="rounded-3xl border border-[#1F3C58]/10 bg-white p-10 shadow-lg">
          <ContactForm
            source="Contact page form"
            defaultProjectType={defaultProjectType}
            id="contact-page-form"
            onSuccess={() => setIsSubmitted(true)}
          />
        </div>
      </div>
    </section>
  );
}

type InfoRowProps = {
  label: string;
  children: ReactNode;
};

function InfoRow({ label, children }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4DA49B]">
        {label}
      </span>
      {children}
    </div>
  );
}

