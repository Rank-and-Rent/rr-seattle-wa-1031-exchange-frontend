import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import site from "@/content/site.json";
import {
  locationsData,
  locationDetails,
  servicesData,
  type LocationDetail,
  type LocationItem,
} from "@/data";
import { buildBreadcrumbJsonLd } from "@/components/ui/breadcrumbs";
import { ContactForm } from "@/components/forms/contact-form";

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
  const recommendedServices = servicesData.slice(0, 4);

  const breadcrumbItems = [
    { label: "Home", href: "https://www.1031exchangeseattle.com/" },
    { label: "Locations", href: "https://www.1031exchangeseattle.com/locations" },
    { label: location.name, href: `https://www.1031exchangeseattle.com/locations/${slug}` },
  ];
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonSafe(breadcrumbJsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-end">
        <div className="absolute inset-0">
          <Image
            src={location.image || "/homepage-hero/seattle-washington-1031-exchange-1.jpg"}
            alt={location.name}
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
              <li><Link href="/locations" className="hover:text-[#b8a074]">Locations</Link></li>
              <li>/</li>
              <li className="text-white/90">{location.name}</li>
            </ol>
          </nav>
          <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-4">
            {location.type}
          </p>
          <h1 className="font-heading text-5xl md:text-7xl tracking-[0.1em] text-white mb-4">
            {location.name}
          </h1>
          <p className="text-xl text-white/80">1031 Exchange Support</p>
        </div>
      </section>

      {/* Overview Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-4">
                Market Overview
              </p>
              <p className="text-xl text-[#2c3e50] leading-relaxed mb-8">
                {detail.overview}
              </p>
              <Link
                href="#contact"
                className="inline-block px-8 py-4 bg-[#2c3e50] text-xs tracking-[0.2em] uppercase text-white hover:bg-[#1a3a52] transition-colors"
              >
                Start Your Exchange
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {detail.highlights.map((highlight, index) => (
                <div 
                  key={highlight}
                  className={`p-6 ${index % 2 === 0 ? 'bg-[#f7f6f4]' : 'bg-[#1a3a52] text-white'}`}
                >
                  <p className={`text-sm leading-relaxed ${index % 2 === 0 ? 'text-[#6b7c8a]' : 'text-white/80'}`}>
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-[#f7f6f4] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-2">
                Our Expertise
              </p>
              <h2 className="font-heading text-3xl md:text-4xl tracking-[0.1em] text-[#2c3e50]">
                Recommended Services
              </h2>
            </div>
            <Link
              href="/services"
              className="hidden md:inline-block text-xs tracking-[0.2em] uppercase text-[#2c3e50] border-b border-[#2c3e50] pb-1 hover:text-[#b8a074] hover:border-[#b8a074] transition-colors"
            >
              View All Services
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedServices.map((service) => (
              <Link
                key={service.slug}
                href={service.route}
                className="group bg-white p-8 hover:shadow-[0_20px_40px_-20px_rgba(26,58,82,0.15)] transition-shadow"
              >
                <p className="text-[10px] tracking-[0.3em] uppercase text-[#b8a074] mb-3">
                  {service.category}
                </p>
                <h3 className="font-heading text-lg tracking-[0.05em] text-[#2c3e50] mb-3 group-hover:text-[#b8a074] transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm text-[#6b7c8a] leading-relaxed">
                  {service.short}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-2">
              Common Questions
            </p>
            <h2 className="font-heading text-3xl md:text-4xl tracking-[0.1em] text-[#2c3e50]">
              {location.name} FAQs
            </h2>
          </div>
          
          <div className="space-y-0">
            {detail.faqs.map((faq, index) => (
              <details 
                key={faq.question} 
                className="group border-b border-gray-100"
              >
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

      {/* Contact Section */}
      <section id="contact" className="relative py-24">
        <div className="absolute inset-0">
          <Image
            src={location.image || "/homepage-hero/seattle-washington-1031-exchange-2.jpg"}
            alt={location.name}
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
              Connect With Our Seattle Team
            </h2>
            <p className="text-white/70">
              Share your goals for {location.name}. We respond within one business day.
            </p>
          </div>
          <div className="bg-white/10 border border-white/20 p-8 md:p-10">
            <ContactForm
              source={`Location page: ${location.name}`}
              defaultProjectType={`${location.name} replacement property`}
              id="location-intake"
              variant="dark"
            />
          </div>
          <div className="mt-8 text-center">
            <a 
              href={`tel:${site.phoneDigits}`}
              className="text-white/70 hover:text-[#b8a074] transition-colors"
            >
              Or call us at {site.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
