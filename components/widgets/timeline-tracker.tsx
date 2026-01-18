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
    <section>
      <p className="text-xs tracking-[0.25em] uppercase text-[#b8a074] mb-2">
        Progress Tracking
      </p>
      <h3 className="font-heading text-lg tracking-[0.05em] text-[#2c3e50] mb-2">
        Timeline Tracker
      </h3>
      <p className="text-sm text-[#6b7c8a] mb-4">
        Monitor each milestone from sale to replacement closing.
      </p>
      <div className="space-y-2 mb-4">
        {timelineSteps.map((step, index) => (
          <button
            key={step.title}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`w-full border px-4 py-3 text-left text-sm transition ${
              activeIndex === index
                ? "border-[#b8a074] bg-[#f7f6f4] text-[#2c3e50]"
                : "border-gray-200 bg-white text-[#6b7c8a] hover:border-[#b8a074]/50"
            }`}
          >
            {step.title}
          </button>
        ))}
      </div>
      <div className="border-l-2 border-[#b8a074] pl-4 py-3 bg-[#f7f6f4]">
        <p className="text-sm text-[#2c3e50]">{timelineSteps[activeIndex].description}</p>
        <p className="mt-3 text-xs text-[#6b7c8a]">
          Keep your intermediary, CPA, attorney, and lenders updated.
        </p>
      </div>
    </section>
  );
};
