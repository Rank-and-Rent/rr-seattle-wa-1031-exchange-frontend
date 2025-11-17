import type { Metadata } from "next";
import Link from "next/link";
import BootCalculator from "@/components/tools/BootCalculator";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import site from "@/content/site.json";

const baseUrl = `https://www.${site.website}`;
const toolSlug = "boot-calculator";
const canonicalUrl = `${baseUrl}/tools/${toolSlug}`;

export const metadata: Metadata = {
  title: "Boot Calculator | 1031 Exchange Seattle",
  description:
    "Use our Boot Calculator to analyze cash, mortgage, and value boot exposure on Seattle 1031 exchanges so you can plan reinvestment strategies that defer capital gains taxes.",
  keywords:
    "boot calculator, 1031 exchange boot, mortgage boot, cash boot, Seattle 1031 calculator, Washington boot calculator",
  openGraph: {
    title: "Boot Calculator | 1031 Exchange Seattle",
    description:
      "Model potential cash and mortgage boot exposure for Seattle 1031 exchanges and explore strategies to fully defer capital gains taxes.",
    type: "website",
    url: canonicalUrl,
  },
  alternates: {
    canonical: canonicalUrl,
  },
};

const jsonSafe = (value: unknown) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

export default function BootCalculatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools" },
    { label: "Boot Calculator", href: `/tools/${toolSlug}` },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: `${baseUrl}/tools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Boot Calculator",
        item: canonicalUrl,
      },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Boot Calculator",
    url: canonicalUrl,
    description:
      "Interactive boot calculator for Seattle 1031 exchanges. Review cash, mortgage, and property boot exposure with real-time modeling.",
    isPartOf: {
      "@type": "WebSite",
      name: site.company,
      url: baseUrl,
    },
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Boot Calculator",
    operatingSystem: "Web",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: canonicalUrl,
    description:
      "Calculate cash boot, mortgage boot, and estimated tax exposure for Seattle 1031 exchanges.",
    creator: {
      "@type": "Organization",
      name: site.company,
      url: baseUrl,
    },
  };

  return (
    <>
      <div className="mx-auto max-w-wrapper px-6 py-12 md:px-10 md:py-20">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="mt-6 font-heading text-3xl font-semibold text-[#1F3C58] md:text-4xl">
          Boot Calculator
        </h1>
        <p className="mt-4 text-base leading-7 text-[#1B1B1B]/80">
          Model cash boot, mortgage boot, and property value shortfalls before
          you close. Use the tool to refine replacement property pricing,
          match debt proceeds, and reduce the risk of triggering taxable boot
          in your Seattle 1031 exchange.
        </p>

        <div className="mt-10">
          <BootCalculator />
        </div>

        <div className="mt-8 rounded-3xl border border-[#1F3C58]/10 bg-white p-6 text-sm text-[#1B1B1B]/80 shadow-[0_20px_40px_-30px_rgba(17,40,60,0.25)]">
          <p>
            <strong>Educational content only.</strong> Not tax, legal, or
            investment advice. Results are estimates only. Consult a qualified
            intermediary and tax advisor before making decisions. Texas does
            not impose a state real estate transfer tax. Recording fees and
            title insurance premiums still apply.
          </p>
        </div>

        <div className="mt-12 border-t border-[#1F3C58]/10 pt-8">
          <h2 className="font-heading text-2xl font-semibold text-[#1F3C58]">
            Related Resources
          </h2>
          <ul className="mt-4 space-y-3">
            <li>
              <Link
                href="/services/boot-calculation"
                className="text-[#1F3C58] underline transition hover:text-[#4DA49B]"
              >
                Boot Calculation Services
              </Link>
            </li>
            <li>
              <Link
                href="/services/seattle-45-day-identification-strategy"
                className="text-[#1F3C58] underline transition hover:text-[#4DA49B]"
              >
                45-Day Strategy Planning
              </Link>
            </li>
            <li>
              <Link
                href="/services/seattle-dst-placement-advisory"
                className="text-[#1F3C58] underline transition hover:text-[#4DA49B]"
              >
                DST Placement Advisory
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonSafe([breadcrumbJsonLd, webPageJsonLd, softwareJsonLd]),
        }}
      />
    </>
  );
}

