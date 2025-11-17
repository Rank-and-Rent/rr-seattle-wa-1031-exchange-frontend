"use client";

import { useState } from "react";

const timelineSteps = [
  {
    title: "Relinquished Property Closing",
    description:
      "Document sale terms, confirm intermediary wiring instructions, and deliver closing statements within twenty-four hours.",
  },
  {
    title: "Day 0-15: Intake and Strategy",
    description:
      "Define investment criteria, line up lenders, gather due diligence templates, and launch replacement property sourcing.",
  },
  {
    title: "Day 16-30: Identification Drafting",
    description:
      "Shortlist replacement properties, schedule site walks, complete underwriting, and brief advisors on likely selection.",
  },
  {
    title: "Day 31-45: Letter Submission",
    description:
      "Finalize valuation support, coordinate with your intermediary, and submit the signed identification letter before midnight of day forty-five.",
  },
  {
    title: "Day 46-120: Diligence and Financing",
    description:
      "Complete inspections, negotiate purchase agreements, finalize loan terms, and order third-party reports.",
  },
  {
    title: "Day 121-180: Closing",
    description:
      "Prepare closing statements, verify intermediary fund transfers, and confirm lender funding so replacements close on or before day one hundred eighty.",
  },
];

export const TimelineTracker = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="rounded-3xl border border-[#1F3C58]/15 bg-white/70 p-6 shadow-[0_20px_44px_-32px_rgba(17,40,60,0.35)]">
      <h3 className="text-lg font-semibold text-[#1F3C58]">
        Exchange Timeline Tracker
      </h3>
      <p className="mt-2 text-sm text-[#1B1B1B]/75">
        Monitor each milestone from sale to replacement closing. Select a step to review the focus items and assign responsibilities to your advisors.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
        <ul className="space-y-2">
          {timelineSteps.map((step, index) => (
            <li key={step.title}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition ${
                  activeIndex === index
                    ? "border-[#4DA49B] bg-[#4DA49B]/15 text-[#1F3C58]"
                    : "border-[#1F3C58]/20 bg-white text-[#0E2536] hover:border-[#4DA49B]/40"
                }`}
              >
                {step.title}
              </button>
            </li>
          ))}
        </ul>
        <div className="rounded-3xl border border-[#1F3C58]/10 bg-[#F5F7FA] p-5 text-sm text-[#1B1B1B]/80">
          <p>{timelineSteps[activeIndex].description}</p>
          <p className="mt-4 text-xs text-[#1B1B1B]/60">
            Keep your intermediary, CPA, attorney, and lenders updated on each milestone. We manage the project plan, but all compliance decisions remain with your licensed advisors.
          </p>
        </div>
      </div>
    </section>
  );
};
