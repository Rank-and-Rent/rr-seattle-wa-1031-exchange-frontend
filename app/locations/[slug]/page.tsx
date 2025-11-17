import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import site from "@/content/site.json";
import {
  locationsData,
  locationDetails,
  servicesData,
  type LocationDetail,
  type LocationItem,
} from "@/data";
import { Breadcrumbs, buildBreadcrumbJsonLd } from "@/components/ui/breadcrumbs";
import { ContactForm } from "@/components/forms/contact-form";
import { DeadlineCalculator } from "@/components/widgets/deadline-calculator";
import { IdentificationRules } from "@/components/widgets/identification-rules";

const getLocation = (slug: string): { location: LocationItem; detail: LocationDetail } => {
  const location = locationsData.find((item) => item.slug === slug);
  const detail = locationDetails[slug];
  if (!location || !detail) {
    notFound();
  }
  return { location, detail };
};

export async function generateStaticParams() {
  return locationsData.map((location) => ({ slug: location.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const detail = locationDetails[slug];
  if (!detail) {
    return {};
  }
  return {
    title: detail.seo.title,
    description: detail.seo.description,
    alternates: {
      canonical: `https://www.1031exchangeseattle.com/locations/${slug}`,
    },
  };
}

const jsonSafe = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { location, detail } = getLocation(slug);

  const recommendedServices = servicesData.slice(0, 6);

  const breadcrumbItems = [
    { label: "Home", href: "https://www.1031exchangeseattle.com/" },
    { label: "Locations", href: "https://www.1031exchangeseattle.com/locations" },
    {
      label: location.name,
      href: `https://www.1031exchangeseattle.com/locations/${slug}`,
    },
  ];

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  return (
    <div className="bg-[#F5F7FA]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonSafe(breadcrumbJsonLd) }}
      />
      <div className="mx-auto max-w-wrapper px-6 pt-12 md:px-10">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <article className="mx-auto max-w-wrapper px-6 pb-24 pt-12 md:px-10 md:pb-32">
        <header className="rounded-3xl border border-[#1F3C58]/10 bg-white p-8 shadow-[0_28px_52px_-32px_rgba(17,40,60,0.3)]">
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-[#4DA49B]">
            {location.type}
          </p>
          <h1 className="mt-4 font-heading text-3xl font-semibold text-[#1F3C58] sm:text-4xl">
            {location.name} 1031 Exchange Support
          </h1>
          <p className="mt-4 text-base leading-7 text-[#1B1B1B]/80">{detail.overview}</p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {detail.highlights.map((highlight) => (
              <div
                key={highlight}
                className="rounded-2xl border border-[#1F3C58]/10 bg-[#F5F7FA] px-5 py-4"
              >
                <p className="text-sm text-[#1B1B1B]/75">{highlight}</p>
              </div>
            ))}
          </div>
        </header>

        <section className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-8">
            <div className="rounded-3xl border border-[#1F3C58]/10 bg-white p-6 shadow-[0_24px_46px_-28px_rgba(17,40,60,0.28)]">
              <h2 className="font-heading text-lg font-semibold text-[#1F3C58]">
                Recommended Services
              </h2>
              <p className="mt-2 text-sm text-[#1B1B1B]/75">
                Services we deploy most often for investors targeting {location.name}, including replacement property identification, underwriting, and deadline management.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {recommendedServices.map((service) => (
                  <div key={service.slug} className="rounded-2xl border border-[#1F3C58]/15 bg-[#F5F7FA] p-4">
                    <p className="font-heading text-xs font-semibold uppercase tracking-[0.26em] text-[#4DA49B]">
                      {service.category}
                    </p>
                    <h3 className="mt-2 text-sm font-semibold text-[#1F3C58]">
                      {service.name}
                    </h3>
                    <p className="mt-2 text-xs text-[#1B1B1B]/70">{service.short}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={service.route}
                        className="rounded-full bg-[#1F3C58] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#F5F7FA] hover:bg-[#274f74]"
                      >
                        View Service
                      </Link>
                      <Link
                        href={`/contact?projectType=${encodeURIComponent(service.name)}#contact-intake`}
                        className="rounded-full border border-[#1F3C58] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1F3C58] hover:bg-[#1F3C58] hover:text-[#F5F7FA]"
                      >
                        Prefill Contact
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href="/services"
                  className="inline-flex rounded-full border border-[#1F3C58] px-5 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#1F3C58] hover:bg-[#1F3C58] hover:text-[#F5F7FA]"
                >
                  View All Services
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-[#1F3C58]/10 bg-white p-6 shadow-[0_24px_46px_-28px_rgba(17,40,60,0.28)]">
              <h2 className="font-heading text-lg font-semibold text-[#1F3C58]">
                FAQs
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

          <aside className="space-y-6">
            <div className="rounded-3xl border border-[#1F3C58]/10 bg-white p-5 shadow-[0_22px_44px_-28px_rgba(17,40,60,0.28)]">
              <DeadlineCalculator />
            </div>
            <div className="rounded-3xl border border-[#1F3C58]/10 bg-white p-5 shadow-[0_22px_44px_-28px_rgba(17,40,60,0.28)]">
              <IdentificationRules />
            </div>
            <div className="rounded-3xl border border-[#1F3C58]/10 bg-white p-6 shadow-[0_22px_44px_-28px_rgba(17,40,60,0.28)]">
              <h2 className="font-heading text-lg font-semibold text-[#1F3C58]">
                Contact our Seattle Team
              </h2>
              <p className="mt-2 text-sm text-[#1B1B1B]/75">
                Share your goals for {location.name}. We respond within one business day.
              </p>
              <div className="mt-5">
                <ContactForm
                  source={`Location page: ${location.name}`}
                  defaultProjectType={`${location.name} replacement property`}
                  id="location-intake"
                />
              </div>
            </div>
          </aside>
        </section>
      </article>
    </div>
  );
}
