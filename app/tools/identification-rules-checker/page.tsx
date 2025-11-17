import type { Metadata } from "next";
import Link from "next/link";
import IdentificationRulesChecker from "@/components/tools/IdentificationRulesChecker";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import site from "@/content/site.json";

const baseUrl = `https://www.${site.website}`;
const toolSlug = "identification-rules-checker";
const canonicalUrl = `${baseUrl}/tools/${toolSlug}`;

export const metadata: Metadata = {
  title: "Identification Rules Checker | 1031 Exchange Seattle",
  description:
    "Check your 1031 exchange against the 3-property, 200%, and 95% identification rules so Seattle investors can document compliant replacement strategies before day 45.",
  keywords:
    "identification rules checker, 1031 3 property rule, 200 percent rule, 95 percent rule, Seattle 1031 identification",
  openGraph: {
    title: "Identification Rules Checker | 1031 Exchange Seattle",
    description:
      "Validate your property count and fair market values against the 3-property, 200%, and 95% identification rules for Seattle 1031 exchanges.",
    type: "website",
    url: canonicalUrl,
  },
  alternates: {
    canonical: canonicalUrl,
  },
};

const jsonSafe = (value: unknown) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

export default function IdentificationRulesCheckerPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools" },
    { label: "Identification Rules Checker", href: `/tools/${toolSlug}` },
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
        name: "Identification Rules Checker",
        item: canonicalUrl,
      },
    ],
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Identification Rules Checker",
    url: canonicalUrl,
    description:
      "Interactive 1031 identification rules checker that analyzes the 3-property, 200 percent, and 95 percent tests for Seattle exchanges.",
    isPartOf: {
      "@type": "WebSite",
      name: site.company,
      url: baseUrl,
    },
  };

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Identification Rules Checker",
    operatingSystem: "Web",
    applicationCategory: "BusinessApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: canonicalUrl,
    description:
      "Validate whether your identified replacement properties satisfy the IRS 3-property, 200%, or 95% identification rules.",
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
          Identification Rules Checker
        </h1>
        <p className="mt-4 text-base leading-7 text-[#1B1B1B]/80">
          Enter your property counts and fair market values to confirm which
          identification rule keeps your Seattle 1031 exchange compliant. Use
          the output to document your identification notice and collaborate
          with your intermediary before deadlines.
        </p>

        <div className="mt-10">
          <IdentificationRulesChecker />
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
                href="/services/seattle-45-day-identification-strategy"
                className="text-[#1F3C58] underline transition hover:text-[#4DA49B]"
              >
                Identification Strategy Design
              </Link>
            </li>
            <li>
              <Link
                href="/services/seattle-improvement-exchange-oversight"
                className="text-[#1F3C58] underline transition hover:text-[#4DA49B]"
              >
                Improvement Exchange Oversight
              </Link>
            </li>
            <li>
              <Link
                href="/services/seattle-rent-roll-and-t12-verification"
                className="text-[#1F3C58] underline transition hover:text-[#4DA49B]"
              >
                Rent Roll & T12 Verification
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

