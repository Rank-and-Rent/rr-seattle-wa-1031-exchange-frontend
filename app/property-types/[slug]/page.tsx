import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import site from "@/content/site.json";
import {
  propertyTypesData,
  propertyTypeDetails,
  type PropertyTypeDetail,
  type PropertyTypeItem,
} from "@/data";
import { getPrimaryMarket } from "@/lib/market";
import { Breadcrumbs, buildBreadcrumbJsonLd } from "@/components/ui/breadcrumbs";
import { ContactForm } from "@/components/forms/contact-form";
import { DeadlineCalculator } from "@/components/widgets/deadline-calculator";
import { IdentificationRules } from "@/components/widgets/identification-rules";
import { TimelineTracker } from "@/components/widgets/timeline-tracker";

const { city: PRIMARY_CITY, state: PRIMARY_STATE_ABBR } = getPrimaryMarket();

type Params = Promise<{
  slug: string;
}>;

export async function generateStaticParams() {
  return propertyTypesData.map((type) => ({ slug: type.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const detail = propertyTypeDetails[slug];
  if (!detail) {
    return {};
  }
  return {
    title: detail.seo.title,
    description: detail.seo.description,
    alternates: {
      canonical: `https://www.1031exchangeseattle.com/property-types/${slug}`,
    },
  };
}

const getPropertyType = (slug: string): { type: PropertyTypeItem; detail: PropertyTypeDetail } => {
  const type = propertyTypesData.find((item) => item.slug === slug);
  const detail = propertyTypeDetails[slug];
  if (!type || !detail) {
    notFound();
  }
  return { type, detail };
};

const jsonSafe = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

export default async function PropertyTypePage({ params }: { params: Params }) {
  const { slug } = await params;
  const { type, detail } = getPropertyType(slug);

  const relatedPool = propertyTypesData.filter((item) => item.slug !== type.slug);
  const related = relatedPool.slice(0, 6);

  const breadcrumbItems = [
    { label: "Home", href: "https://www.1031exchangeseattle.com/" },
    { label: "Property Types", href: "https://www.1031exchangeseattle.com/property-types" },
    {
      label: type.name,
      href: `https://www.1031exchangeseattle.com/property-types/${slug}`,
    },
  ];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  const propertyTypeJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: type.name,
    description: detail.overview,
    category: "Real Estate Investment Property",
    areaServed: {
      "@type": "State",
      name: `${PRIMARY_CITY}, ${PRIMARY_STATE_ABBR}`,
    },
    url: `https://www.1031exchangeseattle.com/property-types/${slug}`,
  };

  return (
    <div className="bg-[#F5F7FA]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonSafe(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonSafe(propertyTypeJsonLd) }}
      />
      <div className="mx-auto max-w-wrapper px-6 pt-12 md:px-10">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      {type.heroImage && (
        <div className="relative mx-auto mt-6 h-64 w-full max-w-wrapper overflow-hidden rounded-3xl px-6 md:px-10 md:h-96">
          <Image
            src={type.heroImage}
            alt={`${type.name} property type`}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}
      <article className="mx-auto max-w-wrapper px-6 pb-24 pt-12 md:px-10 md:pb-32">
        <header className="grid gap-10 rounded-3xl border border-[#1F3C58]/10 bg-white p-8 shadow-[0_28px_52px_-32px_rgba(17,40,60,0.3)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-6">
            <h1 className="font-heading text-3xl font-semibold text-[#1F3C58] sm:text-4xl">
              {type.name}
            </h1>
            <p className="text-base leading-7 text-[#1B1B1B]/80">{detail.overview}</p>
            <div className="grid gap-3">
              {detail.highlights.map((highlight) => (
                <div key={highlight} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#4DA49B]" />
                  <p className="text-sm text-[#1B1B1B]/75">{highlight}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="#property-type-intake"
                className="rounded-full bg-[#1F3C58] px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-[#F5F7FA] hover:bg-[#274f74]"
              >
                Request Briefing
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
            <h2 className="font-heading text-lg font-semibold text-[#1F3C58]">Focus Areas</h2>
            <ul className="space-y-3 text-sm text-[#1B1B1B]/75">
              {type.focusAreas.map((area) => (
                <li key={area} className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#4DA49B]" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        </header>

        <section className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-8">
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
            {related.length > 0 && (
              <div className="rounded-3xl border border-[#1F3C58]/10 bg-white p-6 shadow-[0_22px_44px_-28px_rgba(17,40,60,0.28)]">
                <h2 className="font-heading text-lg font-semibold text-[#1F3C58]">
                  Related Property Types
                </h2>
                <ul className="mt-4 space-y-2">
                  {related.map((relatedType) => (
                    <li key={relatedType.slug}>
                      <a
                        href={relatedType.route}
                        className="text-sm text-[#1F3C58] hover:text-[#4DA49B] hover:underline"
                      >
                        {relatedType.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
            Discuss {type.name}
          </h2>
          <p className="mt-2 text-sm text-[#1B1B1B]/75">
            Share your timeline, equity targets, and lender objectives. We respond within one business day.
          </p>
          <div className="mt-6">
            <ContactForm
              source={`Property Type page: ${type.name}`}
              defaultProjectType={type.name}
              id="property-type-intake"
            />
          </div>
        </section>
      </article>
    </div>
  );
}
