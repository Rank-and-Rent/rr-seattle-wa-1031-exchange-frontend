"use client";

import { useState } from "react";
import Link from "next/link";
import site from "@/content/site.json";

export const StickyCta = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end space-y-4">
      <div className="hidden lg:flex">
        <Link
          href="/contact#contact-intake"
          className="rounded-full bg-[#4DA49B] px-5 py-3 text-sm font-semibold uppercase tracking-[0.28em] text-[#0E2536] shadow-[0_20px_46px_-24px_rgba(77,164,155,0.8)] transition hover:bg-[#7BC5BD]"
        >
          Contact Seattle Team
        </Link>
      </div>

      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-full bg-[#1F3C58] px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-[#F5F7FA] shadow-lg"
          aria-expanded={mobileOpen}
          aria-controls="mobile-sticky-cta"
        >
          {mobileOpen ? "Hide Help" : "Need 1031 Help?"}
        </button>
        {mobileOpen && (
          <div
            id="mobile-sticky-cta"
            className="mt-3 space-y-2 rounded-2xl border border-white/20 bg-[#0E2536]/95 p-4 text-sm text-white shadow-lg"
          >
            <a
              href={`tel:${site.phoneDigits}`}
              className="block rounded-full bg-[#4DA49B] px-4 py-2 text-center font-semibold uppercase tracking-[0.24em] text-[#0E2536]"
            >
              Call {site.phone}
            </a>
            <Link
              href="/contact#contact-intake"
              className="block rounded-full border border-white/30 px-4 py-2 text-center font-semibold uppercase tracking-[0.24em] text-white"
            >
              Message Team
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
