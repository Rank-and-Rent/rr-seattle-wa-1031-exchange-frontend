import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs, buildBreadcrumbJsonLd } from "@/components/ui/breadcrumbs";
import ContactForm from "@/components/ContactForm";
import site from "@/content/site.json";
import { getPrimaryMarket } from "@/lib/market";

const { city: PRIMARY_CITY, state: PRIMARY_STATE_ABBR } = getPrimaryMarket();

export const metadata: Metadata = {
  title: `Contact ${site.company} | ${PRIMARY_CITY}, ${PRIMARY_STATE_ABBR} 1031 Exchange Support`,
  description: `Connect with ${site.company} in ${PRIMARY_CITY}, ${PRIMARY_STATE_ABBR} to coordinate 1031 exchange property identification, diligence, and compliance.`,
  alternates: {
    canonical: "https://www.1031exchangeseattle.com/contact",
  },
};

const breadcrumbItems = [
  { label: "Home", href: "https://www.1031exchangeseattle.com/" },
  { label: "Contact", href: "https://www.1031exchangeseattle.com/contact" },
];

const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="bg-[#F5F7FA]">
        <div className="mx-auto max-w-wrapper px-6 pt-12 md:px-10">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <Suspense fallback={<div className="min-h-screen bg-[#F5F7FA]" />}>
          <ContactForm />
        </Suspense>
      </div>
    </>
  );
}
