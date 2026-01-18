"use client";

import { useState } from "react";
import Link from "next/link";
import site from "@/content/site.json";

export const StickyCta = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Desktop */}
      <div className="hidden lg:block">
        <Link
          href="/contact"
          className="px-6 py-3 bg-[#b8a074] text-white text-xs tracking-[0.15em] uppercase shadow-lg hover:bg-[#a08960] transition-colors"
        >
          Contact Us
        </Link>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-12 h-12 bg-[#b8a074] text-white shadow-lg flex items-center justify-center"
          aria-label="Contact options"
        >
          {open ? (
            <span className="text-xl">&times;</span>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          )}
        </button>
        {open && (
          <div className="absolute bottom-14 right-0 w-44 bg-white shadow-xl border border-gray-100 p-4 space-y-3">
            <a
              href={`tel:${site.phoneDigits}`}
              className="block py-2 px-4 text-center text-xs tracking-[0.15em] uppercase border border-[#b8a074] text-[#b8a074] hover:bg-[#b8a074] hover:text-white transition-all"
            >
              Call
            </a>
            <Link
              href="/contact"
              className="block py-2 px-4 text-center text-xs tracking-[0.15em] uppercase border border-[#2c3e50] text-[#2c3e50] hover:bg-[#2c3e50] hover:text-white transition-all"
            >
              Message
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
