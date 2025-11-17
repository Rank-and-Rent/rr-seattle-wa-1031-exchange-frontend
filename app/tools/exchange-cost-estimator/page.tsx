import type { Metadata } from "next";
import Link from "next/link";
import ExchangeCostEstimator from "@/components/tools/ExchangeCostEstimator";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import site from "@/content/site.json";

const baseUrl = `https://www.${site.website}`;
const toolSlug = "exchange-cost-estimator";
const canonicalUrl = `${baseUrl}/tools/${toolSlug}`;

export const metadata: Metadata = {
  title: "Exchange Cost Estimator | 1031 Exchange Seattle",
  description:
    "Estimate qualified intermediary, escrow, title insurance, and recording expenses for Seattle 1031 exchanges so you can compare replacement property scenarios with confidence.",
  keywords:
    "exchange cost estimator, 1031 closing costs, qualified intermediary fee calculator, Seattle 1031 expenses, Harris County recording fees",
  openGraph: {
    title: "Exchange Cost Estimator | 1031 Exchange Seattle",
    description:
      "Project intermediary, title, escrow, and recording costs for your Seattle 1031 exchange and align budgets before going under contract.",
    type: "website",
    url: canonicalUrl,
  },
  alternates: {
    canonical: canonicalUrl,
  },
};

const jsonSafe = (value: unknown) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

export default function ExchangeCostEstimatorPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools" },
    { label: "Exchange Cost Estimator", href: `/tools/${toolSlug}` },
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
        name: "Exchange Cost Estimator",
        item: canonicalUrl,
      },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Exchange Cost Estimator",
    url: canonicalUrl,
    description:
      "Interactive calculator that projects qualified intermediary, escrow, title, and recording fees for Seattle 1031 exchanges.",
    isPartOf: {
      "@type": "WebSite",
      name: site.company,
      url: baseUrl,
    },
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Exchange Cost Estimator",
    operatingSystem: "Web",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: canonicalUrl,
    description:
      "Calculate qualified intermediary, title, escrow, and recording expenses for Seattle and Harris County 1031 exchanges.",
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
          Exchange Cost Estimator
        </h1>
        <p className="mt-4 text-base leading-7 text-[#1B1B1B]/80">
          Forecast the full cost stack for your 1031 exchange. Adjust
          qualified intermediary percentages, escrow fees, title premiums, and
          county recording charges to understand net proceeds before you make
          offers on replacement properties.
        </p>

        <div className="mt-10">
          <ExchangeCostEstimator />
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
                href="/services/seattle-180-day-closing-control"
                className="text-[#1F3C58] underline transition hover:text-[#4DA49B]"
              >
                180-Day Closing Coordination
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
            <li>
              <Link
                href="/services/seattle-lender-preflight-coordination"
                className="text-[#1F3C58] underline transition hover:text-[#4DA49B]"
              >
                Lender Pre-Flight Coordination
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

