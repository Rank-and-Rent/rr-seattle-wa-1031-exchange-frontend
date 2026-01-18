import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import site from "@/content/site.json";
import {
  servicesData,
  serviceDetails,
  type ServiceDetail,
  type ServiceItem,
} from "@/data";
import { getPrimaryMarket } from "@/lib/market";
import { buildBreadcrumbJsonLd } from "@/components/ui/breadcrumbs";
import { ContactForm } from "@/components/forms/contact-form";

const { city: PRIMARY_CITY, state: PRIMARY_STATE_ABBR } = getPrimaryMarket();

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return servicesData.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const detail = serviceDetails[slug];
  if (!detail) return {};
  return {
    title: detail.seo.title,
    description: detail.seo.description,
    alternates: { canonical: `https://www.1031exchangeseattle.com/services/${slug}` },
  };
}

const getService = (slug: string): { service: ServiceItem; detail: ServiceDetail } => {
  const service = servicesData.find((item) => item.slug === slug);
  const detail = serviceDetails[slug];
  if (!service || !detail) notFound();
  return { service, detail };
};

const jsonSafe = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

export default async function ServicePage({ params }: { params: Params }) {
  const { slug } = await params;
  const { service, detail } = getService(slug);

  const relatedPool = servicesData.filter((item) => item.slug !== service.slug);
  const relatedByCategory = relatedPool.filter((item) => item.category === service.category);
  const fallbackRelated = relatedPool.filter((item) => item.category !== service.category);
  const related = [...relatedByCategory, ...fallbackRelated].slice(0, 3);

  const breadcrumbItems = [
    { label: "Home", href: "https://www.1031exchangeseattle.com/" },
    { label: "Services", href: "https://www.1031exchangeseattle.com/services" },
    { label: service.name, href: `https://www.1031exchangeseattle.com/services/${slug}` },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: detail.summary,
    provider: {
      "@type": "ProfessionalService",
      name: site.company,
      areaServed: `${PRIMARY_CITY}, ${PRIMARY_STATE_ABBR}`,
      url: "https://www.1031exchangeseattle.com/",
    },
    areaServed: `${PRIMARY_CITY}, ${PRIMARY_STATE_ABBR}`,
    serviceType: service.category,
    url: `https://www.1031exchangeseattle.com/services/${slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonSafe(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonSafe(serviceJsonLd) }} />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-end bg-[#1a3a52]">
        <div className="absolute inset-0">
          <Image
            src="/homepage-hero/seattle-washington-1031-exchange-3.jpg"
            alt={service.name}
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 md:px-10">
          <nav className="mb-8 text-sm">
            <ol className="flex items-center gap-2 text-white/60">
              <li><Link href="/" className="hover:text-[#b8a074]">Home</Link></li>
              <li>/</li>
              <li><Link href="/services" className="hover:text-[#b8a074]">Services</Link></li>
              <li>/</li>
              <li className="text-white/90">{service.name}</li>
            </ol>
          </nav>
          <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-4">
            {service.category}
          </p>
          <h1 className="font-heading text-4xl md:text-6xl tracking-[0.1em] text-white mb-6 max-w-4xl">
            {service.name}
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mb-10 leading-relaxed">
            {detail.summary}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#contact"
              className="px-10 py-4 bg-[#b8a074] text-xs tracking-[0.2em] uppercase text-white hover:bg-[#a08960] transition-colors"
            >
              Start Discovery Call
            </a>
            <a
              href={`tel:${site.phoneDigits}`}
              className="px-10 py-4 border border-white/40 text-xs tracking-[0.2em] uppercase text-white hover:bg-white hover:text-[#1a3a52] transition-all"
            >
              Call {site.phone}
            </a>
          </div>
        </div>
      </section>

      {/* Key Outcomes */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-4">
                What You Get
              </p>
              <h2 className="font-heading text-3xl md:text-4xl tracking-[0.1em] text-[#2c3e50] mb-8">
                Key Outcomes
              </h2>
              <div className="space-y-6">
                {detail.outcomes.map((outcome, index) => (
                  <div key={outcome} className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 bg-[#1a3a52] text-white text-sm flex items-center justify-center font-heading">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-[#6b7c8a] leading-relaxed pt-2">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#f7f6f4] p-10">
              <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-4">
                Deliverables
              </p>
              <h3 className="font-heading text-2xl tracking-[0.08em] text-[#2c3e50] mb-6">
                What We Deliver
              </h3>
              <ul className="space-y-4">
                {detail.deliverables.map((deliverable) => (
                  <li key={deliverable} className="flex items-start gap-3">
                    <span className="mt-2 w-1.5 h-1.5 bg-[#b8a074] flex-shrink-0" />
                    <span className="text-[#6b7c8a]">{deliverable}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-[#1a3a52] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-2">
              Process
            </p>
            <h2 className="font-heading text-3xl md:text-4xl tracking-[0.1em] text-white">
              Execution Timeline
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detail.timeline.map((item, index) => (
              <div key={item} className="bg-white/10 border border-white/20 p-8">
                <span className="font-heading text-4xl text-[#b8a074] mb-4 block">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-white/80 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-2">
              Common Questions
            </p>
            <h2 className="font-heading text-3xl md:text-4xl tracking-[0.1em] text-[#2c3e50]">
              Frequently Asked
            </h2>
          </div>
          <div className="space-y-0">
            {detail.faqs.map((faq) => (
              <details key={faq.question} className="group border-b border-gray-100">
                <summary className="cursor-pointer py-6 flex items-center justify-between">
                  <h3 className="font-heading text-lg text-[#2c3e50] pr-8">
                    {faq.question}
                  </h3>
                  <span className="text-[#b8a074] text-2xl transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="pb-6 text-[#6b7c8a] leading-relaxed -mt-2">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="bg-[#f7f6f4] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-2">
                Explore More
              </p>
              <h2 className="font-heading text-3xl tracking-[0.1em] text-[#2c3e50]">
                Related Services
              </h2>
            </div>
            <Link
              href="/services"
              className="hidden md:inline-block text-xs tracking-[0.2em] uppercase text-[#2c3e50] border-b border-[#2c3e50] pb-1 hover:text-[#b8a074] hover:border-[#b8a074] transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {related.map((relService) => (
              <Link
                key={relService.slug}
                href={relService.route}
                className="group bg-white p-8 hover:shadow-[0_20px_40px_-20px_rgba(26,58,82,0.15)] transition-all"
              >
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#b8a074] mb-3">
                  {relService.category}
                </p>
                <h3 className="font-heading text-lg tracking-[0.05em] text-[#2c3e50] mb-3 group-hover:text-[#b8a074] transition-colors">
                  {relService.name}
                </h3>
                <p className="text-sm text-[#6b7c8a] leading-relaxed">{relService.short}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-24">
        <div className="absolute inset-0">
          <Image
            src="/homepage-hero/seattle-washington-1031-exchange-4.jpg"
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
              Discuss {service.name}
            </h2>
            <p className="text-white/70">
              Share your timeline, equity targets, and lender objectives. We respond within one business day.
            </p>
          </div>
          <div className="bg-white/10 border border-white/20 p-8 md:p-10">
            <ContactForm
              source={`Service page: ${service.name}`}
              defaultProjectType={service.name}
              id="service-intake-form"
              variant="dark"
            />
          </div>
        </div>
      </section>
    </>
  );
}
