"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ServiceItem } from "@/data";
import { SearchInput } from "@/components/ui/search-input";

interface RelatedServicesProps {
  services: ServiceItem[];
}

export const RelatedServices = ({ services }: RelatedServicesProps) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return services;
    }
    const normalized = query.trim().toLowerCase();
    return services.filter((service) =>
      service.name.toLowerCase().includes(normalized)
    );
  }, [query, services]);

  const noResults = query.trim().length > 0 && filtered.length === 0;

  return (
    <div className="rounded-3xl border border-[#1F3C58]/10 bg-white p-5 shadow-[0_22px_44px_-28px_rgba(17,40,60,0.28)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-heading text-xs font-semibold uppercase tracking-[0.3em] text-[#4DA49B]">
            Related Services
          </p>
          <p className="text-sm text-[#1B1B1B]/75">
            Filter additional strategies to support your exchange.
          </p>
        </div>
      </div>
      <div className="mt-4">
        <SearchInput
          label="Filter related services"
          placeholder="Filter related services"
          onSearch={setQuery}
          onClear={() => setQuery("")}
          size="sm"
        />
      </div>
      {noResults && (
        <div className="mt-4 space-y-3 rounded-2xl border border-[#1F3C58]/15 bg-[#F5F7FA] p-4 text-xs text-[#1B1B1B]/75">
          <p>No related services matched "{query}". We can still support that requirement.</p>
          <Link
            href={`/contact?projectType=${encodeURIComponent(query)}#contact-intake`}
            className="inline-flex rounded-full border border-[#1F3C58] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#1F3C58] hover:bg-[#1F3C58] hover:text-[#F5F7FA]"
          >
            Contact about {query}
          </Link>
        </div>
      )}
      <div className="mt-5 grid gap-4">
        {filtered.slice(0, 4).map((service) => (
          <article
            key={service.slug}
            className="rounded-2xl border border-[#1F3C58]/15 bg-[#F5F7FA] p-4"
          >
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.26em] text-[#4DA49B]">
              {service.category}
            </p>
            <h3 className="mt-2 text-sm font-semibold text-[#1F3C58]">
              {service.name}
            </h3>
            <p className="mt-2 text-xs text-[#1B1B1B]/70">{service.short}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={service.route}
                className="rounded-full bg-[#1F3C58] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#F5F7FA] hover:bg-[#274f74]"
              >
                View Service
              </Link>
              <Link
                href={`/contact?projectType=${encodeURIComponent(service.name)}#contact-intake`}
                className="rounded-full border border-[#1F3C58] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1F3C58] hover:bg-[#1F3C58] hover:text-[#F5F7FA]"
              >
                Prefill Contact
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
