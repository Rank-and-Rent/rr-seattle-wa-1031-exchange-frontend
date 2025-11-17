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
  <section className="rounded-3xl border border-[#1F3C58]/15 bg-white/70 p-6 shadow-[0_20px_40px_-32px_rgba(17,40,60,0.4)]">
    <h3 className="text-lg font-semibold text-[#1F3C58]">
      Identification Rules Explained
    </h3>
    <p className="mt-2 text-sm text-[#1B1B1B]/75">
      Use this guide to determine how you will complete the identification letter. We prepare letter drafts, valuation support, and backup scenarios so your ${PRIMARY_CITY}, ${PRIMARY_STATE_ABBR} exchange maintains compliance through day forty-five.
    </p>
    <div className="mt-6 space-y-5">
      {rules.map((rule) => (
        <div key={rule.title} className="rounded-2xl border border-[#4DA49B]/30 bg-[#F5F7FA] p-4">
          <h4 className="text-sm font-semibold text-[#1F3C58]">{rule.title}</h4>
          <p className="mt-2 text-sm text-[#1B1B1B]/75">{rule.description}</p>
        </div>
      ))}
    </div>
    <p className="mt-4 text-xs text-[#1B1B1B]/60">
      We coordinate with your intermediary, CPA, and counsel, provide documentation, and maintain audit-ready files. We do not provide legal or tax advice.
    </p>
  </section>
);
