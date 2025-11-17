"use client";

import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";

type BootInputKey =
  | "relinquishedValue"
  | "replacementValue"
  | "cashReceived"
  | "oldMortgage"
  | "newMortgage";

type BootInputs = Record<BootInputKey, string>;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const percentageFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 1,
});

const toNumber = (value: string) => {
  const sanitized = value.replace(/[^\d.-]/g, "").trim();
  if (!sanitized) {
    return 0;
  }

  const parsed = Number(sanitized);
  return Number.isFinite(parsed) ? parsed : NaN;
};

const InfoIcon = ({ className }: { className?: string }) => (
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
      d="M11.25 9h1.5m-1.5 6h1.5m-3-9h7.5a2.25 2.25 0 0 1 2.25 2.25v7.5A2.25 2.25 0 0 1 16.5 18h-9A2.25 2.25 0 0 1 5.25 15.75v-7.5A2.25 2.25 0 0 1 7.5 6h1.372"
    />
  </svg>
);

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

const FIELD_CONFIG: Array<{
  key: BootInputKey;
  label: string;
  helper: string;
  placeholder: string;
}> = [
  {
    key: "relinquishedValue",
    label: "Relinquished property value",
    helper: "Fair market value of the property you are selling.",
    placeholder: "1,450,000",
  },
  {
    key: "replacementValue",
    label: "Replacement property value",
    helper: "Total purchase price for all replacement properties.",
    placeholder: "1,600,000",
  },
  {
    key: "cashReceived",
    label: "Cash received at closing",
    helper:
      "Net exchange proceeds you pulled out of the transaction (cash boot).",
    placeholder: "50,000",
  },
  {
    key: "oldMortgage",
    label: "Relinquished property debt",
    helper: "Outstanding debt paid off on the relinquished property.",
    placeholder: "575,000",
  },
  {
    key: "newMortgage",
    label: "Replacement property debt",
    helper: "New debt placed on the replacement property.",
    placeholder: "520,000",
  },
];

export default function BootCalculator() {
  const [inputs, setInputs] = useState<BootInputs>({
    relinquishedValue: "",
    replacementValue: "",
    cashReceived: "",
    oldMortgage: "",
    newMortgage: "",
  });

  const [taxRate, setTaxRate] = useState("20");

  const parsed = useMemo(() => {
    return Object.entries(inputs).reduce<Record<BootInputKey, number>>(
      (acc, [key, value]) => {
        acc[key as BootInputKey] = toNumber(value);
        return acc;
      },
      {
        relinquishedValue: 0,
        replacementValue: 0,
        cashReceived: 0,
        oldMortgage: 0,
        newMortgage: 0,
      }
    );
  }, [inputs]);

  const rateValue = useMemo(() => {
    const numeric = Number(taxRate);
    if (Number.isFinite(numeric) && numeric >= 0 && numeric <= 100) {
      return numeric / 100;
    }
    return 0.2;
  }, [taxRate]);

  const errors = useMemo(() => {
    const next: Partial<Record<BootInputKey | "taxRate", string>> = {};

    (Object.keys(inputs) as BootInputKey[]).forEach((key) => {
      const value = inputs[key];
      if (!value.trim()) {
        return;
      }
      const numeric = toNumber(value);
      if (!Number.isFinite(numeric)) {
        next[key] = "Enter a valid number.";
      } else if (numeric < 0) {
        next[key] = "Values cannot be negative.";
      }
    });

    if (taxRate.trim()) {
      const numeric = Number(taxRate);
      if (!Number.isFinite(numeric)) {
        next.taxRate = "Enter a valid percentage.";
      } else if (numeric < 0 || numeric > 100) {
        next.taxRate = "Rate must be between 0% and 100%.";
      }
    }

    return next;
  }, [inputs, taxRate]);

  const hasErrors = Object.keys(errors).length > 0;

  const results = useMemo(() => {
    if (hasErrors) {
      return null;
    }

    const propertyBoot = Math.max(
      0,
      parsed.relinquishedValue - parsed.replacementValue
    );
    const cashBoot = Math.max(0, parsed.cashReceived);
    const mortgageBoot = Math.max(0, parsed.oldMortgage - parsed.newMortgage);
    const totalBoot = Math.max(propertyBoot + cashBoot + mortgageBoot, 0);
    const estimatedTax = totalBoot * rateValue;
    const reinvestmentGap = Math.max(
      0,
      parsed.relinquishedValue - parsed.replacementValue
    );

    const reinvestmentCoverage =
      parsed.relinquishedValue > 0
        ? Math.min(
            parsed.replacementValue / parsed.relinquishedValue,
            Number.POSITIVE_INFINITY
          )
        : 0;

    return {
      propertyBoot,
      cashBoot,
      mortgageBoot,
      totalBoot,
      estimatedTax,
      reinvestmentGap,
      reinvestmentCoverage,
    };
  }, [hasErrors, parsed, rateValue]);

  const handleChange =
    (key: BootInputKey) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setInputs((prev) => ({
        ...prev,
        [key]: event.target.value,
      }));
    };

  const handleRateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTaxRate(event.target.value);
  };

  const showResults =
    results &&
    (results.totalBoot > 0 ||
      Object.values(inputs).some((value) => value.trim().length > 0));

  return (
    <section className="tool-card rounded-3xl border border-[#16486C]/20 bg-white p-8 shadow-lg shadow-[#0B3C5D]/5 print:border-[#0B3C5D]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#0B3C5D]">
            Boot Exposure Model
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[#1B1B1B]/80">
            Enter the core economics of your relinquished and replacement
            properties to estimate potential cash and mortgage boot. The model
            assumes illustrative federal and state combined rates—confirm actual
            tax exposure with your advisory team.
          </p>
        </div>
        <div className="rounded-2xl border border-[#C9A227]/20 bg-[#FFF8E1] px-5 py-4 text-sm text-[#4A3A00]">
          <div className="flex items-center gap-3">
            <InfoIcon className="h-5 w-5 text-[#C9A227]" />
            <span className="font-semibold uppercase tracking-wide">
              Quick guidance
            </span>
          </div>
          <p className="mt-2 leading-6">
            Matching or exceeding relinquished value and debt is the fastest way
            to minimize boot. Debt shortfalls and cash pulled out both create
            taxable exposure.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form className="space-y-5">
          <div className="rounded-2xl border border-[#16486C]/15 bg-[#F7FAFC] p-5">
            <h3 className="font-serif text-lg font-semibold text-[#0B3C5D]">
              Transaction inputs
            </h3>
            <p className="mt-1 text-sm text-[#1B1B1B]/70">
              Input dollar amounts without symbols. Negative values are not
              permitted.
            </p>
            <div className="mt-5 space-y-4">
              {FIELD_CONFIG.map((field) => {
                const error = errors[field.key];
                return (
                  <div key={field.key} className="space-y-2">
                    <label
                      htmlFor={field.key}
                      className="block text-xs font-semibold uppercase tracking-[0.28em] text-[#0B3C5D]"
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.key}
                      name={field.key}
                      type="text"
                      inputMode="decimal"
                      value={inputs[field.key]}
                      onChange={handleChange(field.key)}
                      aria-invalid={Boolean(error)}
                      aria-describedby={
                        error ? `${field.key}-error` : `${field.key}-helper`
                      }
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-[#0B3C5D] shadow-sm focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
                    />
                    <p
                      id={`${field.key}-helper`}
                      className="text-xs text-[#1B1B1B]/65"
                    >
                      {field.helper}
                    </p>
                    {error ? (
                      <p
                        id={`${field.key}-error`}
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

          <div className="rounded-2xl border border-[#16486C]/15 bg-[#F7FAFC] p-5">
            <h3 className="font-serif text-lg font-semibold text-[#0B3C5D]">
              Estimated blended tax rate
            </h3>
            <p className="mt-1 text-sm text-[#1B1B1B]/70">
              Combine federal long-term capital gains, depreciation recapture,
              NIIT, and state exposure. Default is 20% for illustration.
            </p>
            <div className="mt-4">
              <label
                htmlFor="taxRate"
                className="block text-xs font-semibold uppercase tracking-[0.28em] text-[#0B3C5D]"
              >
                Tax rate (%)
              </label>
              <input
                id="taxRate"
                name="taxRate"
                type="number"
                min={0}
                max={100}
                step="0.1"
                value={taxRate}
                onChange={handleRateChange}
                aria-invalid={Boolean(errors.taxRate)}
                aria-describedby={errors.taxRate ? "taxRate-error" : undefined}
                className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-[#0B3C5D] shadow-sm focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
              />
              {errors.taxRate ? (
                <p id="taxRate-error" className="mt-1 text-xs text-[#B42318]">
                  {errors.taxRate}
                </p>
              ) : (
                <p className="mt-1 text-xs text-[#1B1B1B]/65">
                  Adjust this to mirror guidance from your CPA.
                </p>
              )}
            </div>
          </div>
        </form>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-[#16486C]/20 bg-[#0B3C5D] p-6 text-white shadow-md">
            <h3 className="font-serif text-xl font-semibold">Results</h3>
            {hasErrors ? (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/30 bg-white/10 p-4 text-sm">
                <AlertIcon className="mt-0.5 h-5 w-5 text-[#C9A227]" />
                <p>
                  Correct the highlighted inputs to view boot exposure. All
                  fields must contain positive values only.
                </p>
              </div>
            ) : !showResults ? (
              <p className="mt-4 text-sm text-[#F5F7FA]/80">
                Enter property values, debt, and cash data to generate a boot
                estimate. Results update as you type.
              </p>
            ) : (
              <>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/25 bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-[#C9A227]">
                      Total boot
                    </p>
                    <p className="mt-2 text-2xl font-semibold">
                      {currencyFormatter.format(results.totalBoot)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/25 bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-[#C9A227]">
                      Estimated tax
                    </p>
                    <p className="mt-2 text-2xl font-semibold">
                      {currencyFormatter.format(results.estimatedTax)}
                    </p>
                    <p className="mt-1 text-xs text-[#F5F7FA]/70">
                      Assumes {percentageFormatter.format(rateValue)} blended
                      rate.
                    </p>
                  </div>
                </div>
                <dl className="mt-6 space-y-4 text-sm">
                  <div className="rounded-xl border border-white/20 bg-white/10 p-4">
                    <dt className="font-semibold uppercase tracking-[0.28em] text-[#C9A227]">
                      Cash boot
                    </dt>
                    <dd className="mt-1 text-base">
                      {currencyFormatter.format(results.cashBoot)}
                    </dd>
                    <p className="mt-1 text-xs text-[#F5F7FA]/70">
                      Cash retained from exchange proceeds is treated as
                      taxable boot.
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/20 bg-white/10 p-4">
                    <dt className="font-semibold uppercase tracking-[0.28em] text-[#C9A227]">
                      Mortgage boot
                    </dt>
                    <dd className="mt-1 text-base">
                      {currencyFormatter.format(results.mortgageBoot)}
                    </dd>
                    <p className="mt-1 text-xs text-[#F5F7FA]/70">
                      Debt paid off and not replaced with equal or greater debt
                      is taxable as mortgage boot.
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/20 bg-white/10 p-4">
                    <dt className="font-semibold uppercase tracking-[0.28em] text-[#C9A227]">
                      Value shortfall
                    </dt>
                    <dd className="mt-1 text-base">
                      {currencyFormatter.format(results.reinvestmentGap)}
                    </dd>
                    <p className="mt-1 text-xs text-[#F5F7FA]/70">
                      Replacement value should meet or exceed relinquished value
                      to avoid property boot.
                    </p>
                  </div>
                </dl>
                <div className="mt-6 rounded-xl border border-white/20 bg-white/10 p-4 text-sm">
                  <div className="flex items-center gap-3">
                    {results.totalBoot > 0 ? (
                      <AlertIcon className="h-5 w-5 text-[#C9A227]" />
                    ) : (
                      <CheckIcon className="h-5 w-5 text-[#C9A227]" />
                    )}
                    <p className="font-semibold uppercase tracking-[0.28em] text-[#C9A227]">
                      Summary
                    </p>
                  </div>
                  <p className="mt-3 leading-6 text-[#F5F7FA]/90">
                    {results.totalBoot > 0
                      ? "Increase replacement value, add additional debt, or roll cash into the new property to reduce your boot exposure."
                      : "Based on the provided inputs, you are on track to fully defer gain without boot exposure. Confirm numbers with your intermediary."}
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="rounded-2xl border border-[#16486C]/15 bg-[#F7FAFC] p-5 text-sm text-[#1B1B1B]/75">
            <h4 className="font-serif text-lg font-semibold text-[#0B3C5D]">
              Boot category explainer
            </h4>
            <ul className="mt-3 space-y-2">
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-[#C9A227]" />
                <span>
                  <strong>Cash boot</strong> is any equity removed from escrow
                  instead of being reinvested.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-[#C9A227]" />
                <span>
                  <strong>Mortgage boot</strong> appears when replacement debt
                  is lower than debt relieved on the relinquished property.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-[#C9A227]" />
                <span>
                  <strong>Property value boot</strong> occurs when you buy less
                  than you sold. Increasing acquisition value reduces exposure.
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
            background: #ffffff !important;
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

