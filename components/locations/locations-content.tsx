"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { LocationItem } from "@/data";
import { SearchInput } from "@/components/ui/search-input";

interface LocationsContentProps {
  locations: LocationItem[];
}

export const LocationsContent = ({ locations }: LocationsContentProps) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return locations;
    }
    const normalized = query.trim().toLowerCase();
    return locations.filter((location) =>
      location.name.toLowerCase().includes(normalized)
    );
  }, [locations, query]);

  const noResults = query.trim().length > 0 && filtered.length === 0;

  return (
    <div className="mx-auto max-w-wrapper px-6 py-24 md:px-10 md:py-32">
      <div className="max-w-3xl">
        <h1 className="font-heading text-3xl font-semibold text-[#1F3C58] sm:text-4xl">
          Seattle and Puget Sound Coverage
        </h1>
        <p className="mt-4 text-base leading-7 text-[#1B1B1B]/80">
          Explore the neighborhoods and submarkets where we manage 1031 exchange replacement property programs. Each location includes market context, FAQs, and service recommendations.
        </p>
      </div>
      <div className="mt-10 space-y-6">
        <SearchInput
          label="Search locations"
          placeholder="Search by city or neighborhood"
          onSearch={setQuery}
          onClear={() => setQuery("")}
        />
        {noResults && (
          <div className="rounded-3xl border border-[#1F3C58]/10 bg-[#F5F7FA] p-4 text-sm text-[#1B1B1B]/75">
            <p>No locations matched "{query}". Request a custom market briefing and we will prepare replacement options.</p>
            <Link
              href={`/contact?projectType=${encodeURIComponent(query)}#contact-intake`}
              className="mt-3 inline-flex rounded-full border border-[#1F3C58] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#1F3C58] hover:bg-[#1F3C58] hover:text-[#F5F7FA]"
            >
              Contact us about {query}
            </Link>
          </div>
        )}
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((location) => (
          <Link
            key={location.slug}
            href={location.route}
            className="flex h-full flex-col justify-between rounded-3xl border border-[#1F3C58]/12 bg-white px-5 py-6 shadow-[0_22px_44px_-30px_rgba(17,40,60,0.26)] transition hover:border-[#1F3C58]"
          >
            <div>
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.28em] text-[#4DA49B]">
                {location.type}
              </p>
              <h2 className="mt-2 text-lg font-semibold text-[#1F3C58]">
                {location.name}
              </h2>
              <p className="mt-3 text-sm text-[#1B1B1B]/75">
                View local FAQs, service recommendations, and identification strategies.
              </p>
            </div>
            <span className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#1F3C58]">
              View Market Brief
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
