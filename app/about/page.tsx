import type { Metadata } from "next";
import site from "@/content/site.json";
import { ContactForm } from "@/components/forms/contact-form";
import { DeadlineCalculator } from "@/components/widgets/deadline-calculator";
import { IdentificationRules } from "@/components/widgets/identification-rules";
import { Breadcrumbs, buildBreadcrumbJsonLd } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "About 1031 Exchange Seattle | 1031 Exchange Specialists",
  description:
    "Learn how 1031 Exchange Seattle helps investors identify replacement properties, maintain compliance, and coordinate with Qualified Intermediaries and lenders.",
  alternates: {
    canonical: "https://www.1031exchangeseattle.com/about",
  },
};

const breadcrumbItems = [
  { label: "Home", href: "https://www.1031exchangeseattle.com/" },
  { label: "About", href: "https://www.1031exchangeseattle.com/about" },
];

const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

export default function AboutPage() {
  return (
    <div className="bg-[#F5F7FA]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto max-w-wrapper px-6 pt-12 md:px-10">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <article className="mx-auto max-w-wrapper px-6 pb-24 pt-12 md:px-10 md:pb-32">
        <section className="rounded-3xl border border-[#1F3C58]/10 bg-white p-8 shadow-[0_28px_52px_-32px_rgba(17,40,60,0.3)]">
          <h1 className="font-heading text-3xl font-semibold text-[#1F3C58] sm:text-4xl">
            About {site.company}
          </h1>
          <p className="mt-4 text-base leading-7 text-[#1B1B1B]/80">
            {site.company} helps investors identify, underwrite, and secure 1031 exchange replacement properties nationwide. Our Seattle team manages sourcing, diligence, lender coordination, and documentation while partnering with your Qualified Intermediary, CPA, and counsel.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              "Replacement property intelligence covering single tenant NNN, multifamily, logistics, healthcare, hospitality, and mixed-use assets.",
              "Secure intake and encrypted data rooms that keep your financial information protected.",
              "Project management that aligns lenders, inspectors, attorneys, and intermediaries with forty-five and one hundred eighty day deadlines.",
              "Audit-ready reporting that records every milestone, document, and valuation adjustment.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-[#1F3C58]/10 bg-[#F5F7FA] px-5 py-4">
                <p className="text-sm text-[#1B1B1B]/75">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-8">
            <div className="rounded-3xl border border-[#1F3C58]/10 bg-white p-6 shadow-[0_24px_46px_-28px_rgba(17,40,60,0.28)]">
              <h2 className="font-heading text-lg font-semibold text-[#1F3C58]">
                How Our Process Works
              </h2>
              <ol className="mt-4 list-decimal space-y-3 pl-6 text-sm text-[#1B1B1B]/80">
                <li>Secure intake captures goals, timelines, debt preferences, and target asset classes.</li>
                <li>We deliver curated replacement property lists with underwriting packages, lender preflight summaries, and risk registers.</li>
                <li>Identification support includes valuation evidence, draft letters, and intermediary coordination.</li>
                <li>Diligence management collects inspections, rent roll updates, financing approvals, and closing statements.</li>
                <li>Closing support documents every transfer, escrow instruction, and compliance step for audit readiness.</li>
              </ol>
            </div>
            <div className="rounded-3xl border border-[#1F3C58]/10 bg-white p-6 shadow-[0_24px_46px_-28px_rgba(17,40,60,0.28)]">
              <h2 className="font-heading text-lg font-semibold text-[#1F3C58]">
                Compliance and Advisor Alignment
              </h2>
              <p className="mt-3 text-sm text-[#1B1B1B]/80">
                We are not a Qualified Intermediary, law firm, broker, or CPA. We coordinate with the licensed professionals you trust. Every engagement includes:
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[#1B1B1B]/70">
                <li>Secure communication channels with your intermediary, CPA, and attorney.</li>
                <li>Weekly schedule reviews that monitor forty-five day and one hundred eighty day milestones.</li>
                <li>Data rooms for rent rolls, T12s, lender correspondence, and closing documentation.</li>
                <li>Compliance checklists covering excise tax, entity formation, and reporting requirements.</li>
              </ul>
            </div>
          </div>
          <aside className="space-y-6">
            <div className="rounded-3xl border border-[#1F3C58]/10 bg-white p-5 shadow-[0_22px_44px_-28px_rgba(17,40,60,0.28)]">
              <DeadlineCalculator />
            </div>
            <div className="rounded-3xl border border-[#1F3C58]/10 bg-white p-5 shadow-[0_22px_44px_-28px_rgba(17,40,60,0.28)]">
              <IdentificationRules />
            </div>
          </aside>
        </section>

        <section className="mt-12 rounded-3xl border border-[#1F3C58]/10 bg-white p-8 shadow-[0_26px_50px_-30px_rgba(17,40,60,0.3)]">
          <h2 className="font-heading text-lg font-semibold text-[#1F3C58]">
            Contact Our Seattle Team
          </h2>
          <p className="mt-2 text-sm text-[#1B1B1B]/75">
            Share your exchange goals, timeline, and preferred asset classes. We respond within one business day with a project plan and intake checklist.
          </p>
          <div className="mt-6">
            <ContactForm source="About page" defaultProjectType="Seattle replacement property" id="about-intake" />
          </div>
        </section>
      </article>
    </div>
  );
}
