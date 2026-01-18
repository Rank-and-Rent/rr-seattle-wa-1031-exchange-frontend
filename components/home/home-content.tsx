"use client";

import type { JSX } from "react";
import React, { useMemo, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import site from "@/content/site.json";
import { ContactForm } from "@/components/forms/contact-form";

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

const Reveal: React.FC<{
  delay?: number;
  className?: string;
  children: React.ReactNode;
}> = ({ delay = 0, className, children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Tool icons
const CalculatorIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="h-10 w-10">
    <rect x="4" y="2" width="16" height="20" rx="1" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="10" y2="10" />
    <line x1="14" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="10" y2="14" />
    <line x1="14" y1="14" x2="16" y2="14" />
    <line x1="8" y1="18" x2="10" y2="18" />
    <line x1="14" y1="18" x2="16" y2="18" />
  </svg>
);

const ScaleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="h-10 w-10">
    <path d="M12 3v18M3 12h18M7 7l10 10M17 7L7 17" />
  </svg>
);

const ChecklistIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} className="h-10 w-10">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const toolIconMap: Record<ToolInfo["icon"], JSX.Element> = {
  calculator: <CalculatorIcon />,
  scale: <ScaleIcon />,
  identification: <ChecklistIcon />,
};

// Exchange types data
const exchangeTypes = [
  {
    name: "Delayed Exchange",
    description: "The most common 1031 structure. Sell first, then identify and acquire replacement property within IRS deadlines.",
    route: "/services/seattle-45-day-identification-strategy",
    image: "/homepage-hero/seattle-washington-1031-exchange-1.jpg",
  },
  {
    name: "Reverse Exchange",
    description: "Acquire replacement property before selling. Requires an exchange accommodation titleholder.",
    route: "/services/seattle-reverse-exchange-execution",
    image: "/homepage-hero/seattle-washington-1031-exchange-2.jpg",
  },
  {
    name: "Improvement Exchange",
    description: "Build equity through construction or improvements on replacement property during the exchange period.",
    route: "/services/seattle-improvement-exchange-oversight",
    image: "/homepage-hero/seattle-washington-1031-exchange-3.jpg",
  },
  {
    name: "DST Exchange",
    description: "Fractional ownership in institutional-quality real estate through Delaware Statutory Trusts.",
    route: "/services/seattle-dst-placement-advisory",
    image: "/homepage-hero/seattle-washington-1031-exchange-4.jpg",
  },
];

export const HomeContent = ({
  services,
  propertyTypes,
  serviceAreaCards,
  faqItems,
  tools,
}: HomeContentProps) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const neighborhoods = useMemo(() => serviceAreaCards.slice(0, 15), [serviceAreaCards]);

  return (
    <div className="bg-white">
      {/* Hero Section - Full viewport with video background */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center">
        {/* Video Background */}
        <div className="absolute inset-0 overflow-hidden bg-black">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/homepage-hero/seattle-washington-1031-exchange-1.jpg"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/seattle-hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-xs tracking-[0.4em] uppercase mb-8 text-white/80">
              Trusted 1031 Exchange Guidance
            </p>
            <h1 className="font-heading text-5xl md:text-7xl tracking-[0.2em] mb-4">
              1031 EXCHANGE
            </h1>
            <div className="flex items-center justify-center gap-8 my-6">
              <span className="h-px w-16 bg-[#b8a074]" />
              <span className="font-heading text-3xl md:text-4xl tracking-[0.25em]">SEATTLE</span>
              <span className="h-px w-16 bg-[#b8a074]" />
            </div>
            <p className="text-lg md:text-xl font-light tracking-wide mt-8 text-white/90 max-w-2xl mx-auto">
              Expert coordination for tax-deferred exchanges across Washington State
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#contact"
                className="px-10 py-4 bg-white text-[#2c3e50] text-xs tracking-[0.25em] uppercase hover:bg-[#b8a074] hover:text-white transition-all"
              >
                Start Your Exchange
              </a>
              <a
                href={`tel:${site.phoneDigits}`}
                className="px-10 py-4 border border-white/60 text-white text-xs tracking-[0.25em] uppercase hover:bg-white hover:text-[#2c3e50] transition-all"
              >
                {site.phone}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Accolades Section */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center">
            <h2 className="font-heading text-4xl md:text-5xl tracking-[0.12em] text-[#2c3e50]">
              Key Deadlines
            </h2>
          </Reveal>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <Reveal delay={0.1}>
              <p className="font-heading text-6xl md:text-7xl text-[#2c3e50] tracking-wide">45</p>
              <p className="mt-4 text-sm tracking-[0.2em] uppercase text-[#6b7c8a]">Day Identification</p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-heading text-6xl md:text-7xl text-[#2c3e50] tracking-wide">180</p>
              <p className="mt-4 text-sm tracking-[0.2em] uppercase text-[#6b7c8a]">Day Closing</p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="font-heading text-6xl md:text-7xl text-[#2c3e50] tracking-wide">100%</p>
              <p className="mt-4 text-sm tracking-[0.2em] uppercase text-[#6b7c8a]">Tax Deferral</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Tools Section (Replacing Testimonials) */}
      <section className="py-24 bg-[#f7f6f4]">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-4">
              Interactive Resources
            </p>
            <h2 className="font-heading text-4xl md:text-5xl tracking-[0.12em] text-[#2c3e50]">
              Planning Tools
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <Reveal key={tool.slug} delay={index * 0.1}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="group block bg-white p-10 hover:shadow-lg transition-shadow"
                >
                  <div className="text-[#b8a074] mb-6">{toolIconMap[tool.icon]}</div>
                  <h3 className="font-heading text-2xl tracking-[0.08em] text-[#2c3e50] mb-4">
                    {tool.name}
                  </h3>
                  <p className="text-[#6b7c8a] text-sm leading-relaxed mb-6">
                    {tool.summary}
                  </p>
                  <span className="text-xs tracking-[0.2em] uppercase text-[#b8a074] group-hover:text-[#2c3e50] transition-colors">
                    Launch Tool →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <div className="relative aspect-[4/5]">
                <Image
                  src="/homepage-hero/seattle-washington-1031-exchange-2.jpg"
                  alt="Seattle 1031 Exchange"
                  fill
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div>
                <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-4">
                  About
                </p>
                <h2 className="font-heading text-4xl md:text-5xl tracking-[0.1em] text-[#2c3e50] mb-6">
                  1031 Exchange Seattle
                </h2>
                <p className="text-sm tracking-[0.15em] uppercase text-[#2c3e50] mb-8">
                  Expert Exchange Coordination for Washington Investors
                </p>
                <div className="space-y-6 text-[#6b7c8a] leading-relaxed">
                  <p>
                    We help Washington investors navigate IRC Section 1031 exchanges with 
                    precision and transparency. From initial strategy through closing, our 
                    team coordinates replacement property identification, timeline management, 
                    and stakeholder communication.
                  </p>
                  <p>
                    Our expertise spans single tenant NNN, multifamily, industrial, medical 
                    office, and DST opportunities across the Pacific Northwest and nationwide. 
                    We work alongside your qualified intermediary, CPA, and legal counsel to 
                    ensure compliant execution.
                  </p>
                </div>
                <div className="mt-10">
                  <Link
                    href="/about"
                    className="text-xs tracking-[0.2em] uppercase text-[#2c3e50] border-b border-[#2c3e50] pb-1 hover:text-[#b8a074] hover:border-[#b8a074] transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Exchange Types Section (Replacing Significant Sales) */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-4">
              Exchange Structures
            </p>
            <h2 className="font-heading text-4xl md:text-5xl tracking-[0.12em] text-[#2c3e50]">
              Types of Exchanges
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {exchangeTypes.map((type, index) => (
              <Reveal key={type.name} delay={index * 0.1}>
                <Link
                  href={type.route}
                  className="group block relative overflow-hidden"
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={type.image}
                      alt={type.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <h3 className="font-heading text-2xl md:text-3xl tracking-[0.1em] text-white mb-3">
                        {type.name}
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-block px-10 py-4 border border-[#2c3e50] text-xs tracking-[0.25em] uppercase text-[#2c3e50] hover:bg-[#2c3e50] hover:text-white transition-all"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Neighborhoods Section - Full width grid */}
      <section className="py-24 bg-[#f7f6f4]">
        <div className="max-w-6xl mx-auto px-6 mb-12">
          <Reveal className="text-center">
            <h2 className="font-heading text-4xl md:text-5xl tracking-[0.12em] text-[#2c3e50]">
              Seattle Markets
            </h2>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {neighborhoods.map((location, index) => (
            <Reveal key={location.route} delay={index * 0.03}>
              <Link
                href={location.route}
                className="group relative aspect-square overflow-hidden"
              >
                <div className="absolute inset-0 bg-[#1a3a52]" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a52] to-[#2c3e50] group-hover:from-[#b8a074] group-hover:to-[#9a8660] transition-all duration-300" />
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <span className="font-heading text-lg md:text-xl tracking-[0.15em] text-white text-center">
                    {location.name}
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#b8a074]">
                  <span className="text-xs tracking-[0.2em] uppercase text-white">
                    Learn More
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-12 text-center">
          <Link
            href="/locations"
            className="inline-block px-10 py-4 border border-[#2c3e50] text-xs tracking-[0.25em] uppercase text-[#2c3e50] hover:bg-[#2c3e50] hover:text-white transition-all"
          >
            View All Locations
          </Link>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-4">
              Our Expertise
            </p>
            <h2 className="font-heading text-4xl md:text-5xl tracking-[0.12em] text-[#2c3e50]">
              Exchange Services
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
            {services.slice(0, 6).map((service, index) => (
              <Reveal key={service.slug} delay={index * 0.08}>
                <Link
                  href={service.route}
                  className="group block border-l-2 border-gray-200 pl-6 hover:border-[#b8a074] transition-colors"
                >
                  <p className="text-xs tracking-[0.2em] uppercase text-[#b8a074] mb-2">
                    {service.category}
                  </p>
                  <h3 className="font-heading text-xl tracking-[0.05em] text-[#2c3e50] mb-3 group-hover:text-[#b8a074] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-[#6b7c8a] text-sm leading-relaxed">
                    {service.short}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-block px-10 py-4 border border-[#2c3e50] text-xs tracking-[0.25em] uppercase text-[#2c3e50] hover:bg-[#2c3e50] hover:text-white transition-all"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#f7f6f4]">
        <div className="max-w-3xl mx-auto px-6">
          <Reveal className="text-center mb-16">
            <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-4">
              Common Questions
            </p>
            <h2 className="font-heading text-4xl md:text-5xl tracking-[0.12em] text-[#2c3e50]">
              FAQ
            </h2>
          </Reveal>
          <div className="space-y-4">
            {faqItems.slice(0, 5).map((faq, index) => (
              <Reveal key={faq.question} delay={index * 0.05}>
                <details className="group bg-white border border-gray-200">
                  <summary className="cursor-pointer px-8 py-6 text-[#2c3e50] font-medium flex items-center justify-between">
                    <span className="pr-8">{faq.question}</span>
                    <span className="text-[#b8a074] text-xl transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="px-8 pb-6 text-[#6b7c8a] text-sm leading-relaxed border-t border-gray-100 pt-6">
                    {faq.answer}
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section id="contact" className="relative min-h-[80vh] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/homepage-hero/seattle-washington-1031-exchange-3.jpg"
            alt="Seattle"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-24 text-center">
          <Reveal>
            <h2 className="font-heading text-4xl md:text-5xl tracking-[0.15em] text-white mb-6">
              Connect With Us
            </h2>
            <p className="text-white/80 mb-12 leading-relaxed">
              Share your exchange requirements and a senior advisor will respond 
              within one business day with replacement property options and timeline guidance.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            {formSubmitted ? (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-10 text-white">
                <p className="text-xl tracking-wide mb-4">Thank you.</p>
                <p className="text-white/80 text-sm">
                  Expect a response within one business day.
                </p>
                <a
                  href={`tel:${site.phoneDigits}`}
                  className="inline-block mt-8 px-8 py-3 border border-white/60 text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-[#2c3e50] transition-all"
                >
                  Call {site.phone}
                </a>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-10">
                <ContactForm
                  source="Homepage CTA"
                  onSuccess={() => setFormSubmitted(true)}
                />
              </div>
            )}
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-white/80">
              <a href={`tel:${site.phoneDigits}`} className="hover:text-white transition-colors">
                {site.phone}
              </a>
              <span className="hidden sm:block">|</span>
              <a href={`mailto:${site.email}`} className="hover:text-white transition-colors">
                {site.email}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
