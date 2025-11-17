import type { Metadata } from "next";
import Link from "next/link";
import site from "@/content/site.json";
import { toolsData } from "@/data/tools";

const baseUrl = `https://www.${site.website}`;
const canonicalUrl = `${baseUrl}/tools`;

export const metadata: Metadata = {
  title: "1031 Exchange Tools | 1031 Exchange Seattle",
  description:
    "Explore interactive 1031 exchange tools built for Seattle investors, including boot calculations, identification rule checks, and cost estimators to support compliant replacement strategies.",
  keywords:
    "1031 exchange tools, Seattle 1031 calculators, boot calculator, identification rules checker, exchange cost estimator",
  openGraph: {
    title: "1031 Exchange Tools | 1031 Exchange Seattle",
    description:
      "Access calculators and compliance checkers for Seattle 1031 exchanges, including boot analysis, identification rules, and cost projections.",
    type: "website",
    url: canonicalUrl,
  },
  alternates: {
    canonical: canonicalUrl,
  },
};

const jsonSafe = (value: unknown) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

const iconStyles = "h-10 w-10 text-[#C9A227]";

const CalculatorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={iconStyles}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 6h9m-9 3h9m-9 3h9m-9 3h3M6 4.5h12A1.5 1.5 0 0 1 19.5 6v12A1.5 1.5 0 0 1 18 19.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5Z"
    />
  </svg>
);

const ScaleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={iconStyles}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v18m0-18 3 3m-3-3-3 3m-6 7.5c0 .828.895 1.5 2 1.5s2-.672 2-1.5S7.105 12 6 12s-2 .672-2 1.5Zm12 0c0 .828.895 1.5 2 1.5s2-.672 2-1.5-.895-1.5-2-1.5-2 .672-2 1.5Z"
    />
  </svg>
);

const FlagIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={iconStyles}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 21V4.5A1.5 1.5 0 0 1 5.25 3h13.5a1.5 1.5 0 0 1 1.5 1.5v7.002a1.5 1.5 0 0 1-1.5 1.5H9m0 0L12 15m-3-2.998L12 9"
    />
  </svg>
);

const iconMap = {
  calculator: <CalculatorIcon />,
  scale: <ScaleIcon />,
  identification: <FlagIcon />,
} as const;

export default function ToolsIndexPage() {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Tools", href: "/tools" },
  ];

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "1031 Exchange Tools",
    itemListElement: toolsData.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `${baseUrl}/tools/${tool.slug}`,
      description: tool.description,
    })),
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "1031 Exchange Tools",
    url: canonicalUrl,
    description:
      "Interactive tools supporting Seattle 1031 exchange investors, including boot calculators, identification rule checkers, and exchange cost estimators.",
    isPartOf: {
      "@type": "WebSite",
      name: site.company,
      url: baseUrl,
    },
  };

  return (
    <>
      <section className="bg-[#0B3C5D] py-24 md:py-32 text-[#F5F7FA]">
        <div className="mx-auto max-w-wrapper px-6 md:px-10">
          <div className="mb-12">
            <nav aria-label="Breadcrumb" className="text-sm text-[#F5F7FA]/70">
              <ol className="flex flex-wrap items-center gap-2">
                {breadcrumbItems.map((item, index) => {
                  const isLast = index === breadcrumbItems.length - 1;
                  return (
                    <li key={item.href} className="flex items-center gap-2">
                      {isLast ? (
                        <span className="font-semibold text-[#F5F7FA]">{item.label}</span>
                      ) : (
                        <a
                          href={item.href}
                          className="text-[#F5F7FA]/80 transition hover:text-[#C9A227]"
                        >
                          {item.label}
                        </a>
                      )}
                      {!isLast && <span aria-hidden="true">/</span>}
                    </li>
                  );
                })}
              </ol>
            </nav>
            <h1 className="mt-6 font-heading text-3xl font-semibold sm:text-4xl">
              Interactive 1031 exchange planning tools.
            </h1>
            <p className="mt-4 text-base leading-7 text-[#F5F7FA]/80">
              Model boot exposure, estimate closing costs, and verify
              identification strategies in minutes. Share the outputs with your
              intermediary, CPA, and lender to streamline decision making.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {toolsData.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group block h-full rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 shadow-[0_28px_52px_-30px_rgba(0,0,0,0.55)] transition hover:-translate-y-1 hover:border-[#C9A227]/60"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  {iconMap[tool.icon]}
                </div>
                <h2 className="mt-6 font-heading text-2xl font-semibold text-white">
                  {tool.name}
                </h2>
                <p className="mt-3 text-sm text-[#F5F7FA]/80">{tool.summary}</p>
                <span className="mt-6 inline-flex items-center text-xs font-semibold uppercase tracking-[0.28em] text-[#C9A227]">
                  Launch tool
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 6.75H9m8.25 0V15m0-8.25L7.5 16.5"
                    />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonSafe([itemListJsonLd, webPageJsonLd]),
        }}
      />
    </>
  );
}

