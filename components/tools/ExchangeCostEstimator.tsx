"use client";

import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";

type CostInputKey =
  | "propertyValue"
  | "qiFeePercent"
  | "escrowFee"
  | "titleRatePercent"
  | "recordingFees"
  | "otherCosts";

type CostInputs = Record<CostInputKey, string>;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

const toNumber = (value: string) => {
  const sanitized = value.replace(/[^\d.-]/g, "").trim();
  if (!sanitized) {
    return 0;
  }
  const parsed = Number(sanitized);
  return Number.isFinite(parsed) ? parsed : NaN;
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4.5 12.75l6 6 9-13.5"
    />
  </svg>
);

const AlertIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v3.75m0 3.75h.008v.008H12z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
  </svg>
);

const CalculatorIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.5 6h9m-9 3h9m-9 3h9m-9 3h3M6 4.5h12A1.5 1.5 0 0 1 19.5 6v12A1.5 1.5 0 0 1 18 19.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5Z"
    />
  </svg>
);

const FIELD_CONFIG: Array<{
  key: CostInputKey;
  label: string;
  helper: string;
  placeholder: string;
  adornment?: string;
}> = [
  {
    key: "propertyValue",
    label: "Replacement property value",
    helper: "Total contract price for the property you intend to acquire.",
    placeholder: "1,750,000",
  },
  {
    key: "qiFeePercent",
    label: "Qualified intermediary fee (%)",
    helper:
      "Typical Seattle-area fees range from 0.5% to 1.0% depending on complexity.",
    placeholder: "0.75",
    adornment: "%",
  },
  {
    key: "escrowFee",
    label: "Escrow / settlement fee",
    helper:
      "Enter the flat fee quoted by your escrow officer. Washington averages $900–$1,500.",
    placeholder: "1,100",
  },
  {
    key: "titleRatePercent",
    label: "Title insurance rate (%)",
    helper:
      "Estimate the title premium as a percentage of the purchase price. Complex deals trend higher.",
    placeholder: "0.40",
    adornment: "%",
  },
  {
    key: "recordingFees",
    label: "Recording & filing fees",
    helper:
      "King County records deeds around $200. Harris County reference rate is $199.",
    placeholder: "200",
  },
  {
    key: "otherCosts",
    label: "Other closing costs",
    helper:
      "Inspection, environmental, wire, courier, or lender admin expenses tied to the exchange.",
    placeholder: "750",
  },
];

export default function ExchangeCostEstimator() {
  const [inputs, setInputs] = useState<CostInputs>({
    propertyValue: "",
    qiFeePercent: "0.75",
    escrowFee: "1100",
    titleRatePercent: "0.40",
    recordingFees: "200",
    otherCosts: "",
  });

  const errors = useMemo(() => {
    const next: Partial<Record<CostInputKey, string>> = {};

    (Object.keys(inputs) as CostInputKey[]).forEach((key) => {
      const raw = inputs[key];
      if (!raw.trim()) {
        return;
      }
      const numeric = toNumber(raw);
      if (!Number.isFinite(numeric)) {
        next[key] = "Enter a valid number.";
      } else if (numeric < 0) {
        next[key] = "Values cannot be negative.";
      }
    });

    if (toNumber(inputs.qiFeePercent) > 5) {
      next.qiFeePercent = "QI fees rarely exceed 5%. Recheck the value.";
    }
    if (toNumber(inputs.titleRatePercent) > 3) {
      next.titleRatePercent = "Title premiums typically stay under 3%. Verify.";
    }

    return next;
  }, [inputs]);

  const parsed = useMemo(() => {
    return Object.entries(inputs).reduce<Record<CostInputKey, number>>(
      (acc, [key, value]) => {
        acc[key as CostInputKey] = toNumber(value);
        return acc;
      },
      {
        propertyValue: 0,
        qiFeePercent: 0,
        escrowFee: 0,
        titleRatePercent: 0,
        recordingFees: 0,
        otherCosts: 0,
      }
    );
  }, [inputs]);

  const hasErrors = Object.keys(errors).length > 0;

  const results = useMemo(() => {
    if (hasErrors) {
      return null;
    }
    const qiFee = parsed.propertyValue * (parsed.qiFeePercent / 100);
    const titlePremium = parsed.propertyValue * (parsed.titleRatePercent / 100);
    const total =
      qiFee +
      parsed.escrowFee +
      titlePremium +
      parsed.recordingFees +
      parsed.otherCosts;
    const costPerMillion =
      parsed.propertyValue > 0 ? (total / parsed.propertyValue) * 1_000_000 : 0;

    return {
      qiFee,
      escrow: parsed.escrowFee,
      titlePremium,
      recording: parsed.recordingFees,
      other: parsed.otherCosts,
      total,
      costPerMillion,
    };
  }, [hasErrors, parsed]);

  const handleChange =
    (key: CostInputKey) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setInputs((prev) => ({
        ...prev,
        [key]: event.target.value,
      }));
    };

  const showResults =
    results &&
    (results.total > 0 ||
      Object.values(inputs).some((value) => value.trim().length > 0));

  return (
    <section className="tool-card rounded-3xl border border-[#16486C]/20 bg-white p-8 shadow-lg shadow-[#0B3C5D]/5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#0B3C5D]">
            Exchange Cost Projection
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[#1B1B1B]/80">
            Model qualified intermediary, escrow, title, and recording expenses
            for your Seattle-area exchange. Numbers update instantly and help
            you compare multiple replacement scenarios.
          </p>
        </div>
        <div className="rounded-2xl border border-[#16486C]/30 bg-[#0B3C5D] px-5 py-4 text-sm text-white">
          <div className="flex items-center gap-3">
            <CalculatorIcon className="h-5 w-5 text-[#C9A227]" />
            <span className="font-semibold uppercase tracking-[0.28em] text-[#C9A227]">
              Helpful context
            </span>
          </div>
          <p className="mt-2 leading-6 text-[#F5F7FA]/85">
            Washington does not levy a state transfer tax, but title premiums
            and escrow fees have climbed post-2020. Capture updated quotes for
            each property you evaluate.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form className="space-y-5">
          <div className="rounded-2xl border border-[#16486C]/15 bg-[#F7FAFC] p-5">
            <h3 className="font-serif text-lg font-semibold text-[#0B3C5D]">
              Cost inputs
            </h3>
            <p className="mt-1 text-sm text-[#1B1B1B]/70">
              Replace with quotes from your escrow officer, title company, and
              intermediary.
            </p>
            <div className="mt-5 space-y-4">
              {FIELD_CONFIG.map((field) => {
                const error = errors[field.key];
                return (
                  <div key={field.key} className="space-y-2">
                    <label
                      htmlFor={`cost-${field.key}`}
                      className="block text-xs font-semibold uppercase tracking-[0.28em] text-[#0B3C5D]"
                    >
                      {field.label}
                    </label>
                    <div className="relative">
                      <input
                        id={`cost-${field.key}`}
                        name={field.key}
                        type="text"
                        inputMode="decimal"
                        value={inputs[field.key]}
                        onChange={handleChange(field.key)}
                        aria-invalid={Boolean(error)}
                        aria-describedby={
                          error
                            ? `cost-${field.key}-error`
                            : `cost-${field.key}-helper`
                        }
                        placeholder={field.placeholder}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12 text-sm text-[#0B3C5D] shadow-sm focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
                      />
                      {field.adornment ? (
                        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-[#16486C]">
                          {field.adornment}
                        </span>
                      ) : null}
                    </div>
                    <p
                      id={`cost-${field.key}-helper`}
                      className="text-xs text-[#1B1B1B]/65"
                    >
                      {field.helper}
                    </p>
                    {error ? (
                      <p
                        id={`cost-${field.key}-error`}
                        className="text-xs text-[#B42318]"
                      >
                        {error}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </form>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-[#16486C]/20 bg-[#16486C] p-6 text-white shadow-md">
            <h3 className="font-serif text-xl font-semibold">Cost summary</h3>
            {hasErrors ? (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/30 bg-white/10 p-4 text-sm">
                <AlertIcon className="mt-0.5 h-5 w-5 text-[#C9A227]" />
                <p>Resolve highlighted inputs to calculate total exchange cost.</p>
              </div>
            ) : !showResults ? (
              <p className="mt-4 text-sm text-[#F5F7FA]/80">
                Enter purchase price and fee estimates to review the complete
                cost stack. All numbers update as you type.
              </p>
            ) : (
              <>
                <div className="mt-4 rounded-xl border border-white/20 bg-white/10 p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#C9A227]">
                    Total estimated exchange costs
                  </p>
                  <p className="mt-2 text-3xl font-semibold">
                    {currencyFormatter.format(results.total)}
                  </p>
                  {results.costPerMillion > 0 ? (
                    <p className="mt-1 text-xs text-[#F5F7FA]/70">
                      ≈ {currencyFormatter.format(results.costPerMillion)} per
                      $1M acquired
                    </p>
                  ) : null}
                </div>
                <dl className="mt-5 space-y-4 text-sm">
                  <div className="rounded-xl border border-white/20 bg-white/10 p-4">
                    <dt className="flex items-center justify-between font-semibold uppercase tracking-[0.28em] text-[#C9A227]">
                      <span>QI fees</span>
                      <span className="text-[#F5F7FA]">
                        {currencyFormatter.format(results.qiFee)}
                      </span>
                    </dt>
                    <p className="mt-1 text-xs text-[#F5F7FA]/70">
                      Based on {decimalFormatter.format(parsed.qiFeePercent)}% of
                      purchase price.
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/20 bg-white/10 p-4">
                    <dt className="flex items-center justify-between font-semibold uppercase tracking-[0.28em] text-[#C9A227]">
                      <span>Escrow</span>
                      <span className="text-[#F5F7FA]">
                        {currencyFormatter.format(results.escrow)}
                      </span>
                    </dt>
                    <p className="mt-1 text-xs text-[#F5F7FA]/70">
                      Settlement and facilitation for closing coordination.
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/20 bg-white/10 p-4">
                    <dt className="flex items-center justify-between font-semibold uppercase tracking-[0.28em] text-[#C9A227]">
                      <span>Title insurance</span>
                      <span className="text-[#F5F7FA]">
                        {currencyFormatter.format(results.titlePremium)}
                      </span>
                    </dt>
                    <p className="mt-1 text-xs text-[#F5F7FA]/70">
                      Premium estimated at{" "}
                      {decimalFormatter.format(parsed.titleRatePercent)}% of
                      value.
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/20 bg-white/10 p-4">
                    <dt className="flex items-center justify-between font-semibold uppercase tracking-[0.28em] text-[#C9A227]">
                      <span>Recording & filing</span>
                      <span className="text-[#F5F7FA]">
                        {currencyFormatter.format(results.recording)}
                      </span>
                    </dt>
                    <p className="mt-1 text-xs text-[#F5F7FA]/70">
                      Includes King County deed and optional assignment
                      recordings.
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/20 bg-white/10 p-4">
                    <dt className="flex items-center justify-between font-semibold uppercase tracking-[0.28em] text-[#C9A227]">
                      <span>Other costs</span>
                      <span className="text-[#F5F7FA]">
                        {currencyFormatter.format(results.other)}
                      </span>
                    </dt>
                    <p className="mt-1 text-xs text-[#F5F7FA]/70">
                      Third-party fees such as inspections, legal, or lender
                      admin charges.
                    </p>
                  </div>
                </dl>
                <div className="mt-6 rounded-xl border border-white/20 bg-white/10 p-4 text-sm">
                  <div className="flex items-center gap-3">
                    <CheckIcon className="h-5 w-5 text-[#C9A227]" />
                    <p className="font-semibold uppercase tracking-[0.28em] text-[#C9A227]">
                      Tip
                    </p>
                  </div>
                  <p className="mt-3 leading-6 text-[#F5F7FA]/90">
                    Ask your intermediary to outline wire, trust, and overnight
                    fees. Small charges add up when coordinating multiple
                    closings.
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="rounded-2xl border border-[#16486C]/15 bg-[#F7FAFC] p-5 text-sm text-[#1B1B1B]/75">
            <h4 className="font-serif text-lg font-semibold text-[#0B3C5D]">
              Washington & Harris County reference
            </h4>
            <ul className="mt-3 space-y-2">
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-[#C9A227]" />
                <span>
                  Washington collects <strong>no state transfer tax</strong>.
                  Budget only county-level recording.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-[#C9A227]" />
                <span>
                  Harris County, TX averages <strong>$199</strong> deed
                  recording and <strong>$40</strong> per additional page.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-[#C9A227]" />
                <span>
                  Seattle escrow fees are typically <strong>$900–$1,500</strong>
                  for commercial-grade exchanges.
                </span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
      <style jsx>{`
        @media print {
          .tool-card {
            border-color: #0b3c5d !important;
            box-shadow: none !important;
          }
          input {
            border-color: #0b3c5d !important;
          }
        }
      `}</style>
    </section>
  );
}

