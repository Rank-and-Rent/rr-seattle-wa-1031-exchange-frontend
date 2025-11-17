"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { getPrimaryMarket } from "@/lib/market";

const { city: PRIMARY_CITY, state: PRIMARY_STATE_ABBR } = getPrimaryMarket();

interface PropertyInput {
  name: string;
  address: string;
  estimatedValue: string;
}

const emptyProperty = (): PropertyInput => ({
  name: "",
  address: "",
  estimatedValue: "",
});

export const IdentificationLetterHelper = () => {
  const [taxpayerName, setTaxpayerName] = useState("");
  const [intermediaryName, setIntermediaryName] = useState("");
  const [closingDate, setClosingDate] = useState("");
  const [properties, setProperties] = useState<PropertyInput[]>([
    emptyProperty(),
    emptyProperty(),
    emptyProperty(),
  ]);

  const formattedDate = closingDate
    ? format(new Date(closingDate + "T00:00:00"), "MMMM d, yyyy")
    : "";

  const letterBody = useMemo(() => {
    const lines = [
      `Dear ${intermediaryName || "Qualified Intermediary"},`,
      "",
      `Re: 1031 Exchange Identification for ${taxpayerName || "Taxpayer"}`,
      "",
      `In connection with my exchange of property relinquished in ${PRIMARY_CITY}, ${PRIMARY_STATE_ABBR}, please accept the following properties as my formal identification list.`,
      "",
    ];

    properties
      .filter((property) => property.name.trim())
      .forEach((property, index) => {
        lines.push(
          `${index + 1}. ${property.name} | ${property.address || "Address pending"} | Estimated Value: ${property.estimatedValue || "TBD"}`
        );
      });

    lines.push(
      "",
      "The taxpayer intends to acquire one or more of the properties listed above in accordance with the three-property rule." +
        " Backup properties may be substituted within the statutory window if necessary.",
      "",
      `Closing date for relinquished property: ${formattedDate || "Pending"}.`,
      "",
      "Please confirm receipt of this identification list. Do not hesitate to contact me with any questions.",
      "",
      "Sincerely,",
      taxpayerName || "Taxpayer"
    );

    return lines.join("\n");
  }, [formattedDate, intermediaryName, properties, taxpayerName]);

  const updateProperty = (index: number, field: keyof PropertyInput, value: string) => {
    setProperties((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  return (
    <section className="rounded-3xl border border-[#1F3C58]/15 bg-white/70 p-6 shadow-[0_20px_44px_-32px_rgba(17,40,60,0.35)]">
      <h3 className="text-lg font-semibold text-[#1F3C58]">
        Identification Letter Helper
      </h3>
      <p className="mt-2 text-sm text-[#1B1B1B]/75">
        Draft a compliant identification letter. Share the output with your intermediary and advisors. We provide this tool for convenience and always defer to your Qualified Intermediary for final documentation.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-semibold text-[#1F3C58]">
          Taxpayer name
          <input
            value={taxpayerName}
            onChange={(event) => setTaxpayerName(event.target.value)}
            className="rounded-2xl border border-[#1F3C58]/20 px-3 py-2 text-sm text-[#0E2536] focus:border-[#4DA49B] focus:outline-none focus:ring-2 focus:ring-[#4DA49B]/40"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-[#1F3C58]">
          Intermediary name
          <input
            value={intermediaryName}
            onChange={(event) => setIntermediaryName(event.target.value)}
            className="rounded-2xl border border-[#1F3C58]/20 px-3 py-2 text-sm text-[#0E2536] focus:border-[#4DA49B] focus:outline-none focus:ring-2 focus:ring-[#4DA49B]/40"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-semibold text-[#1F3C58]">
          Relinquished closing date
          <input
            type="date"
            value={closingDate}
            onChange={(event) => setClosingDate(event.target.value)}
            className="rounded-2xl border border-[#1F3C58]/20 px-3 py-2 text-sm text-[#0E2536] focus:border-[#4DA49B] focus:outline-none focus:ring-2 focus:ring-[#4DA49B]/40"
          />
        </label>
      </div>

      <div className="mt-6 space-y-4">
        {properties.map((property, index) => (
          <div key={index} className="rounded-2xl border border-[#1F3C58]/10 bg-[#F5F7FA] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#4DA49B]">
              Property {index + 1}
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1F3C58]">
                Name
                <input
                  value={property.name}
                  onChange={(event) => updateProperty(index, "name", event.target.value)}
                  className="rounded-xl border border-[#1F3C58]/20 px-3 py-2 text-sm text-[#0E2536] focus:border-[#4DA49B] focus:outline-none focus:ring-2 focus:ring-[#4DA49B]/40"
                  placeholder="Asset name"
                />
              </label>
              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1F3C58]">
                Address
                <input
                  value={property.address}
                  onChange={(event) => updateProperty(index, "address", event.target.value)}
                  className="rounded-xl border border-[#1F3C58]/20 px-3 py-2 text-sm text-[#0E2536] focus:border-[#4DA49B] focus:outline-none focus:ring-2 focus:ring-[#4DA49B]/40"
                  placeholder="Street, city, state"
                />
              </label>
              <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1F3C58]">
                Estimated value
                <input
                  value={property.estimatedValue}
                  onChange={(event) => updateProperty(index, "estimatedValue", event.target.value)}
                  className="rounded-xl border border-[#1F3C58]/20 px-3 py-2 text-sm text-[#0E2536] focus:border-[#4DA49B] focus:outline-none focus:ring-2 focus:ring-[#4DA49B]/40"
                  placeholder="$0.00"
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <label className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4DA49B]">
          Identification letter draft
        </label>
        <textarea
          value={letterBody}
          readOnly
          rows={12}
          className="mt-3 w-full rounded-3xl border border-[#1F3C58]/20 bg-[#0E2536]/90 px-4 py-3 text-sm text-[#F5F7FA]"
        />
      </div>
    </section>
  );
};
