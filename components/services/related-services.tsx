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
    <div className="bg-white border border-gray-100 p-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-[#b8a074] mb-1">
            Related Services
          </p>
          <p className="text-sm text-[#6b7c8a]">
            Filter additional strategies to support your exchange.
          </p>
        </div>
      </div>
      <div className="mb-4">
        <SearchInput
          label="Filter related services"
          placeholder="Filter related services"
          onSearch={setQuery}
          onClear={() => setQuery("")}
          size="sm"
        />
      </div>
      {noResults && (
        <div className="border border-gray-100 bg-[#f7f6f4] p-4 text-xs text-[#6b7c8a]">
          <p>No related services matched &ldquo;{query}&rdquo;. We can still support that requirement.</p>
          <Link
            href={`/contact?projectType=${encodeURIComponent(query)}#contact-intake`}
            className="mt-3 inline-block px-4 py-2 border border-[#2c3e50] text-xs tracking-[0.15em] uppercase text-[#2c3e50] hover:bg-[#2c3e50] hover:text-white transition-all"
          >
            Contact about {query}
          </Link>
        </div>
      )}
      <div className="space-y-4">
        {filtered.slice(0, 4).map((service) => (
          <article
            key={service.slug}
            className="border border-gray-100 bg-[#f7f6f4] p-4"
          >
            <p className="text-xs tracking-[0.2em] uppercase text-[#b8a074] mb-1">
              {service.category}
            </p>
            <h3 className="font-heading text-sm tracking-[0.05em] text-[#2c3e50] mb-2">
              {service.name}
            </h3>
            <p className="text-xs text-[#6b7c8a] mb-4">{service.short}</p>
            <div className="flex flex-wrap gap-2">
              <Link
                href={service.route}
                className="px-3 py-1.5 bg-[#2c3e50] text-[10px] tracking-[0.15em] uppercase text-white hover:bg-[#1a3a52] transition-colors"
              >
                View Service
              </Link>
              <Link
                href={`/contact?projectType=${encodeURIComponent(service.name)}#contact-intake`}
                className="px-3 py-1.5 border border-[#2c3e50] text-[10px] tracking-[0.15em] uppercase text-[#2c3e50] hover:bg-[#2c3e50] hover:text-white transition-all"
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
