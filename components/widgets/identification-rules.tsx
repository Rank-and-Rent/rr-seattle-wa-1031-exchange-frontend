import { getPrimaryMarket } from "@/lib/market";

const { city: PRIMARY_CITY, state: PRIMARY_STATE_ABBR } = getPrimaryMarket();

const rules = [
  {
    title: "Three-Property Rule",
    description: `Identify up to three properties of any value. We document pricing support, lender feedback, and compliance notes for each ${PRIMARY_CITY}, ${PRIMARY_STATE_ABBR} asset so your intermediary accepts the letter without revisions.`,
  },
  {
    title: "200 Percent Rule",
    description: `Identify more than three properties as long as combined fair market value stays below 200 percent of the relinquished property value. We track valuation evidence for every property to prove compliance.`,
  },
  {
    title: "95 Percent Rule",
    description: `Identify any number of properties and close on at least 95 percent of the aggregate value. This strategy supports diversified portfolios and DST placements when executed with strict tracking.`,
  },
];

export const IdentificationRules = () => (
  <section>
    <p className="text-xs tracking-[0.25em] uppercase text-[#b8a074] mb-2">
      Compliance Guide
    </p>
    <h3 className="font-heading text-lg tracking-[0.05em] text-[#2c3e50] mb-2">
      Identification Rules
    </h3>
    <p className="text-sm text-[#6b7c8a] mb-4">
      Use this guide to determine how you will complete the identification letter.
    </p>
    <div className="space-y-4">
      {rules.map((rule) => (
        <div key={rule.title} className="border-l-2 border-[#b8a074] pl-4 py-2 bg-[#f7f6f4]">
          <h4 className="font-heading text-sm tracking-[0.05em] text-[#2c3e50] mb-1">{rule.title}</h4>
          <p className="text-xs text-[#6b7c8a] leading-relaxed">{rule.description}</p>
        </div>
      ))}
    </div>
    <p className="mt-4 text-xs text-[#6b7c8a]">
      We coordinate with your intermediary, CPA, and counsel. We do not provide legal or tax advice.
    </p>
  </section>
);
