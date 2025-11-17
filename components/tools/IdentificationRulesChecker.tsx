"use client";

import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";

type RuleInputKey =
  | "propertyCount"
  | "totalIdentifiedValue"
  | "relinquishedValue"
  | "expectedAcquiredValue";

type RuleInputs = Record<RuleInputKey, string>;

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

const StatusIcon = ({
  status,
  className,
}: {
  status: "pass" | "warning" | "fail";
  className?: string;
}) => {
  if (status === "pass") {
    return (
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
  }

  if (status === "warning") {
    return (
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
          d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
        />
      </svg>
    );
  }

  return (
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
        d="M12 9v3m0 3h.01m9-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
};

const FIELD_CONFIG: Array<{
  key: RuleInputKey;
  label: string;
  helper: string;
  placeholder: string;
  required?: boolean;
  type: "number" | "currency";
}> = [
  {
    key: "propertyCount",
    label: "Number of properties identified",
    helper: "Count every distinct parcel listed on your identification notice.",
    placeholder: "4",
    required: true,
    type: "number",
  },
  {
    key: "totalIdentifiedValue",
    label: "Total fair market value of identified properties",
    helper:
      "Sum of the fair market value (FMV) for every property on the identification list.",
    placeholder: "3,500,000",
    required: true,
    type: "currency",
  },
  {
    key: "relinquishedValue",
    label: "Relinquished property value",
    helper: "FMV of the property (or portfolio) you sold.",
    placeholder: "1,800,000",
    required: true,
    type: "currency",
  },
  {
    key: "expectedAcquiredValue",
    label: "Value you expect to acquire",
    helper:
      "Optional: use the FMV of properties you will actually close. Defaults to total identified value.",
    placeholder: "3,325,000",
    required: false,
    type: "currency",
  },
];

export default function IdentificationRulesChecker() {
  const [inputs, setInputs] = useState<RuleInputs>({
    propertyCount: "",
    totalIdentifiedValue: "",
    relinquishedValue: "",
    expectedAcquiredValue: "",
  });

  const errors = useMemo(() => {
    const next: Partial<Record<RuleInputKey, string>> = {};

    FIELD_CONFIG.forEach((field) => {
      const value = inputs[field.key];
      if (!value.trim()) {
        if (field.required) {
          next[field.key] = "This field is required.";
        }
        return;
      }

      if (field.type === "number") {
        const parsed = Number(value);
        if (!Number.isInteger(parsed) || parsed < 0) {
          next[field.key] = "Enter a whole number of properties.";
        }
      } else {
        const numeric = toNumber(value);
        if (!Number.isFinite(numeric)) {
          next[field.key] = "Enter a valid dollar amount.";
        } else if (numeric < 0) {
          next[field.key] = "Values cannot be negative.";
        }
      }
    });

    return next;
  }, [inputs]);

  const parsed = useMemo(() => {
    return {
      propertyCount: Number(inputs.propertyCount) || 0,
      totalIdentifiedValue: toNumber(inputs.totalIdentifiedValue),
      relinquishedValue: toNumber(inputs.relinquishedValue),
      expectedAcquiredValue: inputs.expectedAcquiredValue.trim()
        ? toNumber(inputs.expectedAcquiredValue)
        : toNumber(inputs.totalIdentifiedValue),
    };
  }, [inputs]);

  const hasErrors = Object.keys(errors).length > 0;

  const rules = useMemo(() => {
    if (hasErrors) {
      return null;
    }

    const threePropertyRule =
      parsed.propertyCount > 0 && parsed.propertyCount <= 3;
    const twoHundredPercentRule =
      parsed.totalIdentifiedValue > 0 &&
      parsed.totalIdentifiedValue <= parsed.relinquishedValue * 2;

    const ninetyFivePercentRule =
      parsed.totalIdentifiedValue > 0 &&
      parsed.expectedAcquiredValue >= parsed.totalIdentifiedValue * 0.95;

    const coverageRatio =
      parsed.relinquishedValue > 0
        ? parsed.totalIdentifiedValue / parsed.relinquishedValue
        : 0;

    return {
      threePropertyRule,
      twoHundredPercentRule,
      ninetyFivePercentRule,
      coverageRatio,
    };
  }, [hasErrors, parsed]);

  const handleChange =
    (key: RuleInputKey) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setInputs((prev) => ({
        ...prev,
        [key]: event.target.value,
      }));
    };

  const ruleStatus = (isValid: boolean, fallback: boolean) => {
    if (isValid) {
      return "pass" as const;
    }
    return fallback ? ("warning" as const) : ("fail" as const);
  };

  const showResults =
    rules &&
    Object.values(inputs).some((value) => value.trim().length > 0) &&
    !hasErrors;

  return (
    <section className="tool-card rounded-3xl border border-[#16486C]/20 bg-white p-8 shadow-lg shadow-[#0B3C5D]/5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-[#0B3C5D]">
            Identification Compliance Check
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[#1B1B1B]/80">
            Confirm whether your identification list fits within the IRS 3
            property, 200%, or 95% rules. Each rule offers a different path to
            compliance—understanding where you stand protects your exchange.
          </p>
        </div>
        <div className="rounded-2xl border border-[#C9A227]/30 bg-[#FFF8E1] px-5 py-4 text-sm text-[#4A3A00]">
          <p className="font-semibold uppercase tracking-[0.28em] text-[#C9A227]">
            Pro insight
          </p>
          <p className="mt-2 leading-6">
            If you identify more than three properties, document why you meet
            the 200% or 95% test. Include FMV support in the identification
            letter.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form className="space-y-5">
          <div className="rounded-2xl border border-[#16486C]/15 bg-[#F7FAFC] p-5">
            <h3 className="font-serif text-lg font-semibold text-[#0B3C5D]">
              Identification snapshot
            </h3>
            <p className="mt-1 text-sm text-[#1B1B1B]/70">
              Provide the counts and fair market value for your identified
              properties.
            </p>
            <div className="mt-5 space-y-4">
              {FIELD_CONFIG.map((field) => {
                const error = errors[field.key];
                return (
                  <div key={field.key} className="space-y-2">
                    <label
                      htmlFor={`rule-${field.key}`}
                      className="block text-xs font-semibold uppercase tracking-[0.28em] text-[#0B3C5D]"
                    >
                      {field.label}
                    </label>
                    <input
                      id={`rule-${field.key}`}
                      name={field.key}
                      type={field.type === "number" ? "number" : "text"}
                      inputMode={field.type === "number" ? "numeric" : "decimal"}
                      value={inputs[field.key]}
                      onChange={handleChange(field.key)}
                      aria-invalid={Boolean(error)}
                      aria-describedby={
                        error
                          ? `rule-${field.key}-error`
                          : `rule-${field.key}-helper`
                      }
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-[#0B3C5D] shadow-sm focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
                    />
                    <p
                      id={`rule-${field.key}-helper`}
                      className="text-xs text-[#1B1B1B]/65"
                    >
                      {field.helper}
                    </p>
                    {error ? (
                      <p
                        id={`rule-${field.key}-error`}
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
          <div className="rounded-2xl border border-[#16486C]/20 bg-[#0B3C5D] p-6 text-white shadow-md">
            <h3 className="font-serif text-xl font-semibold">Rule status</h3>
            {hasErrors ? (
              <p className="mt-4 rounded-xl border border-white/30 bg-white/10 p-4 text-sm">
                Complete all required inputs with valid numbers to evaluate
                identification rules.
              </p>
            ) : !showResults ? (
              <p className="mt-4 text-sm text-[#F5F7FA]/80">
                Enter property counts and fair market values to check compliance
                instantly.
              </p>
            ) : rules ? (
              <>
                <div className="mt-5 space-y-4">
                  {[
                    {
                      title: "3-property rule",
                      description:
                        "Identify up to three properties of any value.",
                      valid: rules.threePropertyRule,
                      fallback: parsed.propertyCount <= 0,
                      detail: `Identified ${parsed.propertyCount} properties.`,
                    },
                    {
                      title: "200% rule",
                      description:
                        "Identify more than three properties if total FMV stays within 200% of relinquished value.",
                      valid: rules.twoHundredPercentRule,
                      fallback: parsed.propertyCount <= 3,
                      detail: `Identified FMV is ${currencyFormatter.format(
                        parsed.totalIdentifiedValue
                      )}; limit is ${currencyFormatter.format(
                        parsed.relinquishedValue * 2
                      )}.`,
                    },
                    {
                      title: "95% rule",
                      description:
                        "Acquire at least 95% of the aggregate FMV of all identified properties.",
                      valid: rules.ninetyFivePercentRule,
                      fallback: parsed.expectedAcquiredValue === 0,
                      detail: `Expected acquisition covers ${percentageFormatter.format(
                        parsed.totalIdentifiedValue > 0
                          ? parsed.expectedAcquiredValue /
                              parsed.totalIdentifiedValue
                          : 0
                      )} of identified value.`,
                    },
                  ].map((rule) => {
                    const status = ruleStatus(rule.valid, rule.fallback);
                    return (
                      <div
                        key={rule.title}
                        className="rounded-xl border border-white/25 bg-white/10 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#C9A227]">
                              {rule.title}
                            </p>
                            <p className="mt-1 text-sm text-[#F5F7FA]/85">
                              {rule.description}
                            </p>
                          </div>
                          <StatusIcon
                            status={status}
                            className={`h-7 w-7 ${
                              status === "pass"
                                ? "text-[#C9A227]"
                                : status === "warning"
                                ? "text-[#F7B538]"
                                : "text-[#B42318]"
                            }`}
                          />
                        </div>
                        <p className="mt-2 text-xs text-[#F5F7FA]/70">
                          {rule.detail}
                        </p>
                        {status === "warning" ? (
                          <p className="mt-1 text-xs text-[#F5F7FA]/60">
                            Provide updated data to evaluate this rule more
                            accurately.
                          </p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 rounded-xl border border-white/20 bg-white/10 p-4 text-sm">
                  <p className="font-semibold uppercase tracking-[0.28em] text-[#C9A227]">
                    Coverage ratio
                  </p>
                  <p className="mt-2 text-2xl font-semibold">
                    {percentageFormatter.format(rules.coverageRatio)}
                  </p>
                  <p className="mt-1 text-xs text-[#F5F7FA]/70">
                    Ratio compares identified FMV to relinquished FMV. Staying
                    above 100% reduces boot exposure.
                  </p>
                </div>
              </>
            ) : null}
          </div>
          <div className="rounded-2xl border border-[#16486C]/15 bg-[#F7FAFC] p-5 text-sm text-[#1B1B1B]/75">
            <h4 className="font-serif text-lg font-semibold text-[#0B3C5D]">
              Rule quick reference
            </h4>
            <ul className="mt-3 space-y-2">
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-[#C9A227]" />
                <span>
                  Use the <strong>3-property rule</strong> whenever possible—it
                  offers the simplest compliance path.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-[#C9A227]" />
                <span>
                  If identifying more than three, keep total FMV under{" "}
                  <strong>200%</strong> of what you sold.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-[#C9A227]" />
                <span>
                  The <strong>95% rule</strong> requires closing on nearly every
                  property you identified—coordinate closely with your QI.
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

