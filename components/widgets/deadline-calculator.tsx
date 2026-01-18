"use client";

import { addDays, format } from "date-fns";
import { useMemo, useState } from "react";

const dateFormat = (date: Date, timeZone: string) =>
  format(date, "MMMM d, yyyy") + ` (${timeZone})`;

export const DeadlineCalculator = () => {
  const [closeDate, setCloseDate] = useState("");
  const timeZone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    []
  );

  const parsedDate = closeDate ? new Date(closeDate + "T00:00:00") : null;
  const day45 = parsedDate ? addDays(parsedDate, 45) : null;
  const day180 = parsedDate ? addDays(parsedDate, 180) : null;

  return (
    <section>
      <p className="text-xs tracking-[0.25em] uppercase text-[#b8a074] mb-2">
        Timeline Tool
      </p>
      <h3 className="font-heading text-lg tracking-[0.05em] text-[#2c3e50] mb-2">
        Deadline Calculator
      </h3>
      <p className="text-sm text-[#6b7c8a] mb-4">
        Enter your relinquished closing date to preview statutory milestones.
      </p>
      <div className="space-y-3">
        <label className="flex flex-col gap-2 text-xs tracking-[0.15em] uppercase text-[#6b7c8a]">
          Relinquished closing date
          <input
            type="date"
            value={closeDate}
            onChange={(event) => setCloseDate(event.target.value)}
            className="border border-gray-200 px-4 py-3 text-sm text-[#2c3e50] focus:border-[#b8a074] focus:outline-none"
          />
        </label>
      </div>
      <dl className="mt-6 space-y-4 text-sm">
        <div className="border-l-2 border-[#b8a074] pl-4 py-2 bg-[#f7f6f4]">
          <dt className="text-xs tracking-[0.2em] uppercase text-[#b8a074] mb-1">
            45-day identification
          </dt>
          <dd className="text-[#2c3e50]">
            {day45
              ? dateFormat(day45, timeZone)
              : "Select a closing date"}
          </dd>
        </div>
        <div className="border-l-2 border-[#b8a074] pl-4 py-2 bg-[#f7f6f4]">
          <dt className="text-xs tracking-[0.2em] uppercase text-[#b8a074] mb-1">
            180-day completion
          </dt>
          <dd className="text-[#2c3e50]">
            {day180
              ? dateFormat(day180, timeZone)
              : "Select a closing date"}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-[#6b7c8a]">
        Dates represent calendar days. Confirm with your Qualified Intermediary.
      </p>
    </section>
  );
};
