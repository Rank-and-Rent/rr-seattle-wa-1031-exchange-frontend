"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ServiceItem } from "@/data";
import site from "@/content/site.json";
import { SearchInput } from "@/components/ui/search-input";
import { DeadlineCalculator } from "@/components/widgets/deadline-calculator";
import { IdentificationRules } from "@/components/widgets/identification-rules";

interface ServicesContentProps {
  services: ServiceItem[];
}

export const ServicesContent = ({ services }: ServicesContentProps) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return services;
    }
    const normalized = query.trim().toLowerCase();
    const exact = services.find(
      (service) => service.name.toLowerCase() === normalized
    );
    if (exact) {
      return [exact];
    }
    return services.filter((service) => {
      const haystack = [service.name, service.short, ...service.keywords]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [query, services]);

  const noResults = query.trim().length > 0 && filtered.length === 0;

  return (
    <div className="mx-auto max-w-wrapper px-6 py-24 md:px-10 md:py-32">
      <div className="max-w-3xl">
        <h1 className="font-heading text-3xl font-semibold text-[#1F3C58] sm:text-4xl">
          Seattle 1031 Exchange Services
        </h1>
        <p className="mt-4 text-base leading-7 text-[#1B1B1B]/80">
          Browse the strategies we deploy for Seattle, WA investors. Search by asset class, deadline, or support need to surface the right engagement. Every service includes lender-ready analysis, secure documentation, and coordination with your Qualified Intermediary.
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="space-y-6">
          <SearchInput
            label="Search services"
            placeholder="Search by strategy or asset type"
            onSearch={setQuery}
            onClear={() => setQuery("")}
          />
          {noResults && (
            <div className="space-y-3 rounded-3xl border border-[#1F3C58]/10 bg-[#F5F7FA] p-5 text-sm text-[#1B1B1B]/80">
              <p>No services matched "{query}". We can still design a program for that focus.</p>
              <Link
                href={`/contact?projectType=${encodeURIComponent(query)}#contact-intake`}
                className="inline-flex rounded-full border border-[#1F3C58] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#1F3C58] hover:bg-[#1F3C58] hover:text-[#F5F7FA]"
              >
                Contact the Seattle team about {query}
              </Link>
            </div>
          )}

          <div className="grid gap-5">
            {filtered.map((service) => (
              <article
                key={service.slug}
                className="rounded-3xl border border-[#1F3C58]/10 bg-white p-6 shadow-[0_22px_48px_-28px_rgba(17,40,60,0.28)]"
              >
                <p className="font-heading text-xs font-semibold uppercase tracking-[0.28em] text-[#4DA49B]">
                  {service.category}
                </p>
                <h2 className="mt-3 text-xl font-semibold text-[#1F3C58]">
                  {service.name}
                </h2>
                <p className="mt-3 text-sm text-[#1B1B1B]/80">{service.short}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={service.route}
                    className="rounded-full bg-[#1F3C58] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#F5F7FA] hover:bg-[#274f74]"
                  >
                    View Service Details
                  </Link>
                  <Link
                    href={`/contact?projectType=${encodeURIComponent(service.name)}#contact-intake`}
                    className="rounded-full border border-[#1F3C58] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#1F3C58] hover:bg-[#1F3C58] hover:text-[#F5F7FA]"
                  >
                    Prefill Contact Form
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-[#1F3C58]/15 bg-white p-5 shadow-[0_22px_44px_-30px_rgba(17,40,60,0.28)]">
            <h2 className="font-heading text-lg font-semibold text-[#1F3C58]">
              Timeline Tools
            </h2>
            <p className="mt-2 text-sm text-[#1B1B1B]/75">
              Keep 45-day and 180-day milestones visible while you vet services.
            </p>
            <div className="mt-4 space-y-4">
              <DeadlineCalculator />
              <IdentificationRules />
            </div>
          </div>
          <div className="rounded-3xl border border-[#1F3C58]/15 bg-[#F5F7FA] p-5 text-sm text-[#1B1B1B]/75">
            <p>
              Ready to start? Call {site.phone} or share your requirements through the intake form. We respond within one business day.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
