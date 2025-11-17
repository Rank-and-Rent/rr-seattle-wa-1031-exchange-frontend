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
    <section className="rounded-3xl border border-[#4DA49B]/40 bg-white/70 p-6 shadow-[0_20px_46px_-28px_rgba(17,40,60,0.35)]">
      <h3 className="text-lg font-semibold text-[#1F3C58]">
        45-Day and 180-Day Deadline Calculator
      </h3>
      <p className="mt-2 text-sm text-[#1B1B1B]/75">
        Enter your relinquished closing date to preview statutory milestones. Share the outputs with your intermediary, CPA, and lender to keep every stakeholder aligned.
      </p>
      <div className="mt-4 space-y-3">
        <label className="flex flex-col gap-2 text-sm font-semibold text-[#1F3C58]">
          Relinquished closing date
          <input
            type="date"
            value={closeDate}
            onChange={(event) => setCloseDate(event.target.value)}
            className="rounded-2xl border border-[#1F3C58]/20 px-3 py-2 text-sm text-[#0E2536] focus:border-[#4DA49B] focus:outline-none focus:ring-2 focus:ring-[#4DA49B]/40"
          />
        </label>
      </div>
      <dl className="mt-6 grid gap-4 text-sm">
        <div className="rounded-2xl border border-[#1F3C58]/10 bg-[#F5F7FA] px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4DA49B]">
            45-day identification deadline
          </dt>
          <dd className="mt-2 text-[#1F3C58]">
            {day45
              ? dateFormat(day45, timeZone)
              : "Select a closing date to calculate the deadline."}
          </dd>
        </div>
        <div className="rounded-2xl border border-[#1F3C58]/10 bg-[#F5F7FA] px-4 py-3">
          <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-[#4DA49B]">
            180-day exchange completion deadline
          </dt>
          <dd className="mt-2 text-[#1F3C58]">
            {day180
              ? dateFormat(day180, timeZone)
              : "Select a closing date to calculate the deadline."}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-xs text-[#1B1B1B]/65">
        Dates represent calendar days. Confirm every milestone with your Qualified Intermediary. We coordinate stakeholder updates but do not provide intermediary services.
      </p>
    </section>
  );
};
