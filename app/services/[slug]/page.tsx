import type { Metadata } from "next";
import { notFound } from "next/navigation";
import site from "@/content/site.json";
import {
  servicesData,
  serviceDetails,
  type ServiceDetail,
  type ServiceItem,
} from "@/data";
import { getPrimaryMarket } from "@/lib/market";
import { Breadcrumbs, buildBreadcrumbJsonLd } from "@/components/ui/breadcrumbs";
import { RelatedServices } from "@/components/services/related-services";
import { ContactForm } from "@/components/forms/contact-form";
import { DeadlineCalculator } from "@/components/widgets/deadline-calculator";
import { IdentificationRules } from "@/components/widgets/identification-rules";
import { TimelineTracker } from "@/components/widgets/timeline-tracker";

const { city: PRIMARY_CITY, state: PRIMARY_STATE_ABBR } = getPrimaryMarket();

type Params = Promise<{
  slug: string;
}>;

export async function generateStaticParams() {
  return servicesData.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const detail = serviceDetails[slug];
  if (!detail) {
    return {};
  }
  return {
    title: detail.seo.title,
    description: detail.seo.description,
    alternates: {
      canonical: `https://www.1031exchangeseattle.com/services/${slug}`,
    },
  };
}

const getService = (slug: string): { service: ServiceItem; detail: ServiceDetail } => {
  const service = servicesData.find((item) => item.slug === slug);
  const detail = serviceDetails[slug];
  if (!service || !detail) {
    notFound();
  }
  return { service, detail };
};

const jsonSafe = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

export default async function ServicePage({ params }: { params: Params }) {
  const { slug } = await params;
  const { service, detail } = getService(slug);

  const relatedPool = servicesData.filter((item) => item.slug !== service.slug);
  const relatedByCategory = relatedPool.filter(
    (item) => item.category === service.category
  );
  const fallbackRelated = relatedPool.filter(
    (item) => item.category !== service.category
  );
  const related = [...relatedByCategory, ...fallbackRelated].slice(0, 6);

  const breadcrumbItems = [
    { label: "Home", href: "https://www.1031exchangeseattle.com/" },
    { label: "Services", href: "https://www.1031exchangeseattle.com/services" },
    {
      label: service.name,
      href: `https://www.1031exchangeseattle.com/services/${slug}`,
    },
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
    <div className="bg-[#F5F7FA]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonSafe(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonSafe(serviceJsonLd) }}
      />
      <div className="mx-auto max-w-wrapper px-6 pt-12 md:px-10">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <article className="mx-auto max-w-wrapper px-6 pb-24 pt-12 md:px-10 md:pb-32">
        <header className="grid gap-10 rounded-3xl border border-[#1F3C58]/10 bg-white p-8 shadow-[0_28px_52px_-32px_rgba(17,40,60,0.3)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-6">
            <span className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-[#4DA49B]">
              {service.category}
            </span>
            <h1 className="font-heading text-3xl font-semibold text-[#1F3C58] sm:text-4xl">
              {service.name}
            </h1>
            <p className="text-base leading-7 text-[#1B1B1B]/80">{detail.summary}</p>
            <div className="grid gap-3">
              {detail.outcomes.map((outcome) => (
                <div key={outcome} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#4DA49B]" />
                  <p className="text-sm text-[#1B1B1B]/75">{outcome}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="#service-intake"
                className="rounded-full bg-[#1F3C58] px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#F5F7FA] hover:bg-[#274f74]"
              >
                Start Discovery Call
              </a>
              <a
                href={`tel:${site.phoneDigits}`}
                className="rounded-full border border-[#1F3C58] px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#1F3C58] hover:bg-[#1F3C58] hover:text-[#F5F7FA]"
              >
                Call {site.phone}
              </a>
            </div>
          </div>
          <div className="space-y-4 rounded-3xl border border-[#1F3C58]/15 bg-[#F5F7FA] p-6">
            <h2 className="font-heading text-lg font-semibold text-[#1F3C58]">
              Key Deliverables
            </h2>
            <ul className="space-y-3 text-sm text-[#1B1B1B]/75">
              {detail.deliverables.map((deliverable) => (
                <li key={deliverable} className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#4DA49B]" />
                  <span>{deliverable}</span>
                </li>
              ))}
            </ul>
          </div>
        </header>

        <section className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-8">
            <div className="rounded-3xl border border-[#1F3C58]/10 bg-white p-6 shadow-[0_24px_46px_-28px_rgba(17,40,60,0.28)]">
              <h2 className="font-heading text-lg font-semibold text-[#1F3C58]">
                Execution Timeline
              </h2>
              <ol className="mt-4 list-decimal space-y-3 pl-6 text-sm text-[#1B1B1B]/80">
                {detail.timeline.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </div>
            <div className="rounded-3xl border border-[#1F3C58]/10 bg-white p-6 shadow-[0_24px_46px_-28px_rgba(17,40,60,0.28)]">
              <h2 className="font-heading text-lg font-semibold text-[#1F3C58]">
                Frequently Asked Questions
              </h2>
              <div className="mt-4 space-y-4">
                {detail.faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="font-heading text-sm font-semibold text-[#1F3C58]">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-sm text-[#1B1B1B]/80">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <RelatedServices services={related} />
            <div className="rounded-3xl border border-[#1F3C58]/10 bg-white p-5 shadow-[0_22px_44px_-28px_rgba(17,40,60,0.28)]">
              <DeadlineCalculator />
            </div>
            <div className="rounded-3xl border border-[#1F3C58]/10 bg-white p-5 shadow-[0_22px_44px_-28px_rgba(17,40,60,0.28)]">
              <IdentificationRules />
            </div>
            <div className="rounded-3xl border border-[#1F3C58]/10 bg-white p-5 shadow-[0_22px_44px_-28px_rgba(17,40,60,0.28)]">
              <TimelineTracker />
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-3xl border border-[#1F3C58]/10 bg-white p-8 shadow-[0_26px_50px_-30px_rgba(17,40,60,0.3)]">
          <h2 className="font-heading text-lg font-semibold text-[#1F3C58]">
            Discuss {service.name}
          </h2>
          <p className="mt-2 text-sm text-[#1B1B1B]/75">
            Share your timeline, equity targets, and lender objectives. We respond within one business day.
          </p>
          <div className="mt-6">
            <ContactForm
              source={`Service page: ${service.name}`}
              defaultProjectType={service.name}
              id="service-intake"
            />
          </div>
        </section>
      </article>
    </div>
  );
}
