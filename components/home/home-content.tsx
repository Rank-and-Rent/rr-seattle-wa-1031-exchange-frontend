"use client";

import type { JSX } from "react";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import site from "@/content/site.json";
import { ContactForm } from "@/components/forms/contact-form";
import { SearchInput } from "@/components/ui/search-input";
import { DeadlineCalculator } from "@/components/widgets/deadline-calculator";
import { IdentificationRules } from "@/components/widgets/identification-rules";
import { IdentificationLetterHelper } from "@/components/widgets/identification-letter-helper";
import { TimelineTracker } from "@/components/widgets/timeline-tracker";
import { getPrimaryMarket } from "@/lib/market";

import type { FAQItem, PropertyTypeItem, ServiceItem } from "@/data";
import type { ToolInfo } from "@/data/tools";

interface HomeContentProps {
  services: ServiceItem[];
  propertyTypes: PropertyTypeItem[];
  serviceAreaCards: { name: string; route: string }[];
  faqItems: FAQItem[];
  timelineLinks: { label: string; href: string }[];
  waTaxHref: string;
  tools: ToolInfo[];
}

const { city: PRIMARY_CITY, state: PRIMARY_STATE_ABBR } = getPrimaryMarket();

const heroImages = [
  "/homepage-hero/seattle-washington-1031-exchange-1.jpg",
  "/homepage-hero/seattle-washington-1031-exchange-2.jpg",
  "/homepage-hero/seattle-washington-1031-exchange-3.jpg",
  "/homepage-hero/seattle-washington-1031-exchange-4.jpg",
  "/homepage-hero/seattle-washington-1031-exchange-5.jpg",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

const fadeScale = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1 },
};

const iconClasses = "h-10 w-10 text-[#C9A227]";

const CalculatorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={iconClasses}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 6h9m-9 3h9m-9 3h9m-9 3h3M6 4.5h12A1.5 1.5 0 0 1 19.5 6v12A1.5 1.5 0 0 1 18 19.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5Z"
    />
  </svg>
);

const ScaleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={iconClasses}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v18m0-18 3 3m-3-3-3 3m-6 7.5c0 .828.895 1.5 2 1.5s2-.672 2-1.5S7.105 12 6 12s-2 .672-2 1.5Zm12 0c0 .828.895 1.5 2 1.5s2-.672 2-1.5-.895-1.5-2-1.5-2 .672-2 1.5Z"
    />
  </svg>
);

const FlagIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={iconClasses}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 21V4.5A1.5 1.5 0 0 1 5.25 3h13.5a1.5 1.5 0 0 1 1.5 1.5v7.002a1.5 1.5 0 0 1-1.5 1.5H9m0 0L12 15m-3-2.998L12 9"
    />
  </svg>
);

const toolIconMap: Record<ToolInfo["icon"], JSX.Element> = {
  calculator: <CalculatorIcon />,
  scale: <ScaleIcon />,
  identification: <FlagIcon />,
};

const Reveal: React.FC<{ delay?: number; variant?: "fade" | "scale"; className?: string; children: React.ReactNode }> = ({
  delay = 0,
  variant = "fade",
  className,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });
  const variants = variant === "scale" ? fadeScale : fadeUp;

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const HomeContent = ({
  services,
  propertyTypes,
  serviceAreaCards,
  faqItems,
  timelineLinks,
  waTaxHref,
  tools,
}: HomeContentProps) => {
  const [serviceQuery, setServiceQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [heroFormSubmitted, setHeroFormSubmitted] = useState(false);

  const filteredServices = useMemo(() => {
    if (!serviceQuery.trim()) {
      return services.slice(0, 9);
    }

    const query = serviceQuery.trim().toLowerCase();
    const exactMatch = services.find(
      (service) => service.name.toLowerCase() === query
    );

    if (exactMatch) {
      return [exactMatch];
    }

    const matches = services.filter((service) => {
      const haystack = [service.name, service.short, ...service.keywords].join(" ").toLowerCase();
      return haystack.includes(query);
    });

    if (matches.length === 0) {
      return [];
    }

    return matches.slice(0, 9);
  }, [serviceQuery, services]);

  const filteredLocations = useMemo(() => {
    if (!locationQuery.trim()) {
      return serviceAreaCards.slice(0, 8);
    }
    const query = locationQuery.trim().toLowerCase();
    const results = serviceAreaCards.filter((location) =>
      location.name.toLowerCase().includes(query)
    );
    return results;
  }, [locationQuery, serviceAreaCards]);

  const noServiceResults = serviceQuery && filteredServices.length === 0;
  const noLocationResults = locationQuery && filteredLocations.length === 0;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#F5F7FA]">
      <section className="relative overflow-hidden text-[#F5F7FA]">
        {/* Rotating background images */}
        <div className="absolute inset-0">
          {heroImages.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={src}
                alt={`Seattle, Washington skyline ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
                quality={90}
                sizes="100vw"
              />
            </div>
          ))}
        </div>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1F3C58]/85 via-[#234a6d]/80 to-[#4DA49B]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_60%)]" />
        <div className="relative mx-auto grid max-w-wrapper items-start gap-12 px-6 py-24 md:px-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,420px)] lg:py-32">
          <Reveal className="space-y-8">
            <h1 className="font-heading text-4xl font-semibold leading-tight text-[#F5F7FA] sm:text-5xl lg:text-6xl">
              Seattle, WA 1031 Exchange Experts.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-[#E8EDEF]/90">
              Modern 1031 coordination for Washington investors. We identify compliant replacement property, produce underwriting that withstands scrutiny, and manage every deadline with transparent reporting.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur">
                <p className="font-heading text-sm font-semibold uppercase tracking-[0.28em] text-[#E8EDEF]">
                  Replacement Property Intelligence
                </p>
                <p className="mt-3 text-sm text-[#E8EDEF]/75">
                  Curated single tenant NNN, multifamily, logistics, healthcare, and DST opportunities in all fifty states with lender-ready data.
                </p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur">
                <p className="font-heading text-sm font-semibold uppercase tracking-[0.28em] text-[#E8EDEF]">
                  Timeline and Compliance Control
                </p>
                <p className="mt-3 text-sm text-[#E8EDEF]/75">
                  Project plans, automated reminders, and intermediary coordination so 45-day and 180-day milestones stay on schedule.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#contact-intake"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#4DA49B] to-[#7BC5BD] px-6 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-[#0E2536] shadow-[0_20px_46px_-24px_rgba(77,164,155,0.8)] transition hover:shadow-[0_24px_56px_-22px_rgba(77,164,155,0.85)]"
              >
                Start My Exchange
              </a>
              <a
                href={`tel:${site.phoneDigits}`}
                className="inline-flex items-center justify-center rounded-full border border-white/50 px-6 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-[#F5F7FA] hover:bg-white/10"
              >
                Call {site.phone}
              </a>
            </div>
          </Reveal>

          <Reveal variant="scale" delay={0.1}>
            <div
              id="contact-intake"
              className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-xl shadow-[0_30px_60px_-28px_rgba(10,19,28,0.6)]"
            >
              <h2 className="font-heading text-xl font-semibold text-[#F5F7FA]">
                Share Your 1031 Requirements
              </h2>
              <p className="mt-2 text-sm text-[#E8EDEF]/75">
                Secure intake protects your information. A senior advisor responds within one business day.
              </p>
              <div className="mt-6">
                {heroFormSubmitted ? (
                  <div className="space-y-5 rounded-2xl border border-white/20 bg-white/15 p-6 text-center text-sm text-[#F5F7FA]">
                    <p className="text-lg font-semibold text-white">
                      Thank you. We received your request.
                    </p>
                    <p className="text-white/80">
                      Expect a call or email within one business day with replacement property options and timeline guidance.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                      <a
                        href={`tel:${site.phoneDigits}`}
                        className="inline-flex items-center justify-center rounded-full border border-white/60 px-6 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-white hover:text-[#1F3C58]"
                      >
                        Call {site.phone}
                      </a>
                      <Link
                        href="/contact"
                        className="inline-flex items-center justify-center rounded-full border border-white/40 px-6 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-white/90 transition hover:bg-white/10"
                      >
                        View Contact Details
                      </Link>
                    </div>
                  </div>
                ) : (
                  <ContactForm
                    source="Homepage hero form"
                    onSuccess={() => setHeroFormSubmitted(true)}
                  />
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#F5F7FA] py-12">
        <div className="mx-auto max-w-wrapper px-6 md:px-10">
          <div className="grid gap-6 md:grid-cols-4">
            {["Qualified Intermediary Network", "CPA and Legal Alignment", "Timeline Precision", "Transparent Documentation"].map((title) => (
              <div
                key={title}
                className="rounded-2xl border border-[#1F3C58]/10 bg-white px-5 py-6 shadow-[0_18px_32px_-26px_rgba(17,40,60,0.25)]"
              >
                <p className="font-heading text-sm font-semibold uppercase tracking-[0.26em] text-[#4DA49B]">
                  {title}
                </p>
                <p className="mt-3 text-sm text-[#1B1B1B]/75">
                  We coordinate transparent workflows with your advisors, deliver secure documentation, and monitor every milestone across the exchange lifecycle.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="mx-auto grid max-w-wrapper gap-16 px-6 md:px-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:items-center">
          <Reveal>
            <div className="space-y-6">
              <span className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-[#4DA49B]">
                Built for Washington Investors
              </span>
              <h2 className="font-heading text-3xl font-semibold text-[#1F3C58] sm:text-4xl">
                Clarity, compliance, and nationwide reach.
              </h2>
              <p className="text-base leading-7 text-[#1B1B1B]/80">
                Our Seattle team manages every stage of your 1031 exchange. We prepare lender-ready underwriting, coordinate diligence, and keep your intermediary, CPA, and legal advisors informed at every checkpoint.
              </p>
              <div className="grid gap-4">
                {["Dedicated sourcing teams covering all fifty states with local intelligence across the Puget Sound", "Secure data rooms, weekly dashboards, and compliance records ready for audits", "Scenario modeling for cap rates, rent coverage, and lender sensitivity before you sign"].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#4DA49B]" />
                    <p className="text-sm leading-6 text-[#1B1B1B]/80">{point}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href={`tel:${site.phoneDigits}`}
                  className="rounded-full bg-[#1F3C58] px-6 py-3 text-sm font-semibold uppercase tracking-[0.26em] text-[#F5F7FA] hover:bg-[#274f74]"
                >
                  Call {site.phone}
                </a>
                <Link
                  href="/services/seattle-replacement-property-identification"
                  className="rounded-full border border-[#1F3C58] px-6 py-3 text-sm font-semibold uppercase tracking-[0.26em] text-[#1F3C58] hover:bg-[#1F3C58] hover:text-[#F5F7FA]"
                >
                  Explore Services
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal variant="scale" delay={0.1}>
            <div className="space-y-6 rounded-3xl border border-[#1F3C58]/10 bg-white p-6 shadow-[0_24px_48px_-28px_rgba(17,40,60,0.35)]">
              <DeadlineCalculator />
              <IdentificationRules />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#0B3C5D] py-24 md:py-32 text-[#F5F7FA]">
        <div className="mx-auto max-w-wrapper px-6 md:px-10">
          <Reveal className="text-center">
            <span className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-[#C9A227]">
              Tools & Calculators
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">
              Interactive 1031 exchange planning tools.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#F5F7FA]/80">
              Model boot exposure, estimate closing costs, and verify
              identification strategies in minutes. Share the outputs with your
              intermediary, CPA, and lender to streamline decision making.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, index) => (
              <Reveal key={tool.slug} delay={index * 0.05}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="group block h-full rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-[0_28px_52px_-30px_rgba(0,0,0,0.55)] transition hover:-translate-y-1 hover:border-[#C9A227]/60"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                    {toolIconMap[tool.icon]}
                  </div>
                  <h3 className="mt-6 font-heading text-2xl font-semibold text-white">
                    {tool.name}
                  </h3>
                  <p className="mt-3 text-sm text-[#F5F7FA]/80">{tool.summary}</p>
                  <span className="mt-6 inline-flex items-center text-xs font-semibold uppercase tracking-[0.28em] text-[#C9A227]">
                    Launch tool
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.25 6.75H9m8.25 0V15m0-8.25L7.5 16.5"
                      />
                    </svg>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#E8EDEF] py-24 md:py-32">
        <div className="mx-auto max-w-wrapper px-6 md:px-10">
          <Reveal className="text-center">
            <span className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-[#1F3C58]">
              How a 1031 Works
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold text-[#1F3C58] sm:text-4xl">
              Linear timeline with disciplined execution.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#1B1B1B]/80">
              Every exchange progresses through discovery, identification, diligence, and closing. We align your advisors and lenders to ensure statutory deadlines are met and documented.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <Reveal variant="scale">
              <TimelineTracker />
            </Reveal>
            <Reveal delay={0.1} variant="scale">
              <div className="rounded-3xl border border-[#1F3C58]/10 bg-white p-6 shadow-[0_24px_44px_-26px_rgba(17,40,60,0.32)]">
                <p className="text-sm text-[#1B1B1B]/80">
                  Reference IRS guidance during identification and closing planning.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {timelineLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-[#1F3C58] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#1F3C58] transition hover:bg-[#1F3C58] hover:text-[#F5F7FA]"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-[#4DA49B] py-24 md:py-32 text-[#F5F7FA]">
        <div className="mx-auto max-w-wrapper px-6 md:px-10">
          <Reveal className="text-center">
            <span className="font-heading text-xs font-semibold uppercase tracking-[0.3em]">
              Strategic Services
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold sm:text-4xl">
              Replacement property identification at institutional depth.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#F5F7FA]/90">
              Filter services by the strategy that supports your exchange. Share precise requirements and we will prepare identification options with lender-ready diligence.
            </p>
          </Reveal>
          <div className="mt-10">
            <SearchInput
              label="Search services"
              placeholder="Search services by keyword"
              onSearch={setServiceQuery}
              onClear={() => setServiceQuery("")}
            />
            {noServiceResults && (
              <div className="mt-4 space-y-3 rounded-2xl border border-white/60 bg-white/15 p-4 text-sm">
                <p>
                  No services matched "{serviceQuery}". We can still help with "{serviceQuery}".
                </p>
                <Link
                  href={`/contact?projectType=${encodeURIComponent(serviceQuery)}#contact-intake`}
                  className="inline-flex rounded-full border border-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white hover:bg-white/20"
                >
                  Contact the Seattle team about {serviceQuery}
                </Link>
              </div>
            )}
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {filteredServices.slice(0, 9).map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.05} variant="scale">
                <Link
                  href={service.route}
                  className="block h-full rounded-3xl border border-white/25 bg-white/10 p-6 text-left shadow-[0_24px_44px_-28px_rgba(12,28,40,0.45)] transition hover:border-white/60 hover:bg-white/15"
                >
                  <p className="font-heading text-xs font-semibold uppercase tracking-[0.28em] text-[#F5F7FA]/80">
                    {service.category}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-white">
                    {service.name}
                  </h3>
                  <p className="mt-3 text-sm text-[#F5F7FA]/75">{service.short}</p>
                  <span className="mt-6 inline-flex items-center text-xs font-semibold uppercase tracking-[0.28em] text-[#F5F7FA]">
                    View Details
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link
              href="/services"
              className="rounded-full border border-white/70 px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-white hover:bg-white/15"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-wrapper px-6 md:px-10">
          <Reveal className="text-center">
            <span className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-[#1F3C58]">
              Property Profiles
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold text-[#1F3C58] sm:text-4xl">
              Asset classes matched to investor objectives.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#1B1B1B]/80">
              Preview the asset classes we model most often for ${PRIMARY_CITY}, ${PRIMARY_STATE_ABBR} investors. Each profile includes underwriting frameworks, rent rolls, and market comp support.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {propertyTypes.slice(0, 9).map((type, index) => (
              <Reveal key={type.slug} delay={index * 0.05}>
                <div className="flex h-full flex-col rounded-3xl border border-[#1F3C58]/15 bg-white p-6 shadow-[0_24px_44px_-30px_rgba(17,40,60,0.32)]">
                  <h3 className="font-heading text-lg font-semibold text-[#1F3C58]">
                    {type.name}
                  </h3>
                  <p className="mt-3 text-sm text-[#1B1B1B]/75">{type.summary}</p>
                  <ul className="mt-4 space-y-2 text-sm text-[#1B1B1B]/70">
                    {type.focusAreas.map((focus) => (
                      <li key={focus} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#4DA49B]" />
                        <span>{focus}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-4">
                    <Link
                      href={type.route}
                      className="inline-flex rounded-full border border-[#1F3C58] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#1F3C58] hover:bg-[#1F3C58] hover:text-[#F5F7FA]"
                    >
                      View Playbook
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <Reveal variant="scale">
              <IdentificationLetterHelper />
            </Reveal>
            <Reveal variant="scale" delay={0.1}>
              <div className="rounded-3xl border border-[#1F3C58]/15 bg-[#F5F7FA] p-6 shadow-[0_22px_44px_-28px_rgba(17,40,60,0.28)]">
                <h3 className="font-heading text-lg font-semibold text-[#1F3C58]">
                  Washington State Excise Guidance
                </h3>
                <p className="mt-2 text-sm text-[#1B1B1B]/75">
                  Review Washington State Real Estate Excise Tax requirements alongside federal exchange planning. Excise tax applies even when capital gains are deferred.
                </p>
                <a
                  href={waTaxHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex rounded-full border border-[#1F3C58] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#1F3C58] hover:bg-[#1F3C58] hover:text-[#F5F7FA]"
                >
                  Washington State REET Guidance
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F7FA] py-24 md:py-32">
        <div className="mx-auto max-w-wrapper px-6 md:px-10">
          <Reveal className="text-center">
            <span className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-[#1F3C58]">
              Seattle Coverage
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold text-[#1F3C58] sm:text-4xl">
              Puget Sound markets with national reach.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#1B1B1B]/80">
              We support investors across Seattle, Bellevue, Redmond, Kirkland, Mercer Island, and beyond while sourcing replacement options in every major U.S. market.
            </p>
          </Reveal>
          <div className="mt-8">
            <SearchInput
              label="Search locations"
              placeholder="Filter locations by city or neighborhood"
              onSearch={setLocationQuery}
              onClear={() => setLocationQuery("")}
            />
            {noLocationResults && (
              <div className="mt-4 space-y-3 rounded-2xl border border-[#1F3C58]/20 bg-white p-4 text-sm">
                <p>
                  We do not yet list "{locationQuery}". We can still prepare replacement options in that market.
                </p>
                <Link
                  href={`/contact?projectType=${encodeURIComponent(locationQuery)}#contact-intake`}
                  className="inline-flex rounded-full border border-[#1F3C58] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#1F3C58] hover:bg-[#1F3C58] hover:text-[#F5F7FA]"
                >
                  Contact us about {locationQuery}
                </Link>
              </div>
            )}
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredLocations.slice(0, 8).map((location, index) => (
              <Reveal key={location.route} delay={index * 0.04}>
                <Link
                  href={location.route}
                  className="flex h-full flex-col justify-between rounded-3xl border border-[#1F3C58]/15 bg-white px-5 py-6 shadow-[0_20px_40px_-28px_rgba(17,40,60,0.28)] transition hover:border-[#1F3C58]"
                >
                  <div>
                    <p className="font-heading text-sm font-semibold uppercase tracking-[0.26em] text-[#4DA49B]">
                      {location.name}
                    </p>
                    <p className="mt-3 text-sm text-[#1B1B1B]/75">
                      Replacement strategies, FAQs, and lender alignment tailored to {location.name}.
                    </p>
                  </div>
                  <span className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#1F3C58]">
                    View Market
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center text-sm text-[#1B1B1B]/75">
            <p>
              A 1031 exchange defers federal and Washington State capital gains tax on qualifying real property. It does not remove excise tax obligations.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6 md:px-10">
          <Reveal className="text-center">
            <span className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-[#1F3C58]">
              FAQs
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold text-[#1F3C58] sm:text-4xl">
              Frequently asked questions.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#1B1B1B]/80">
              Clear answers for investors, developers, attorneys, and advisors advancing 1031 exchange strategies in Washington and across the country.
            </p>
          </Reveal>
          <div className="mt-12 space-y-4">
            {faqItems.map((faq, index) => (
              <Reveal key={faq.question} delay={index * 0.04}>
                <details className="group rounded-3xl border border-[#1F3C58]/10 bg-[#F5F7FA] px-6 py-5 shadow-[0_20px_40px_-30px_rgba(17,40,60,0.25)]">
                  <summary className="cursor-pointer font-heading text-base font-semibold text-[#1F3C58]">
                    {faq.question}
                  </summary>
                  <div className="mt-3 border-t border-[#1F3C58]/10 pt-4 text-sm text-[#1B1B1B]/80">
                    {faq.answer}
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-[#1F3C58] via-[#234a6d] to-[#4DA49B] py-24 md:py-32 text-[#F5F7FA]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,247,250,0.18),_transparent_60%)]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center md:px-10">
          <Reveal className="space-y-6">
            <h2 className="font-heading text-3xl font-semibold sm:text-4xl">
              Start your 1031 exchange with confidence.
            </h2>
            <p className="text-base leading-7 text-[#F5F7FA]/85">
              Our Seattle advisors help you identify replacement properties, manage diligence, and close on time. Share your objectives and we will deploy a project plan tailored to your timeline.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#contact-intake"
                className="rounded-full bg-[#F5F7FA] px-6 py-3 text-sm font-semibold uppercase tracking-[0.26em] text-[#1F3C58] hover:bg-[#E8EDEF]"
              >
                Start My Exchange
              </a>
              <Link
                href="/contact"
                className="rounded-full border border-[#F5F7FA]/70 px-6 py-3 text-sm font-semibold uppercase tracking-[0.26em] text-[#F5F7FA] hover:bg-[#F5F7FA] hover:text-[#1F3C58]"
              >
                Schedule a Strategy Call
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
