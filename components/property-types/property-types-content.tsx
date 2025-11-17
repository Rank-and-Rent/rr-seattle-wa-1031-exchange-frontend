"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { PropertyTypeItem } from "@/data";
import { SearchInput } from "@/components/ui/search-input";

interface PropertyTypesContentProps {
  propertyTypes: PropertyTypeItem[];
}

export const PropertyTypesContent = ({ propertyTypes }: PropertyTypesContentProps) => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) {
      return propertyTypes;
    }
    const normalized = query.trim().toLowerCase();
    return propertyTypes.filter((type) =>
      [type.name, type.summary, ...type.focusAreas]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    );
  }, [propertyTypes, query]);

  const noResults = query.trim().length > 0 && filtered.length === 0;

  return (
    <div className="mx-auto max-w-wrapper px-6 py-24 md:px-10 md:py-32">
      <div className="max-w-3xl">
        <h1 className="font-heading text-3xl font-semibold text-[#1F3C58] sm:text-4xl">
          1031 Exchange Property Types
        </h1>
        <p className="mt-4 text-base leading-7 text-[#1B1B1B]/80">
          Filter the asset classes we model for Seattle investors. Each type includes underwriting focus areas, rent roll considerations, and exit planning notes.
        </p>
      </div>
      <div className="mt-10 space-y-6">
        <SearchInput
          label="Search property types"
          placeholder="Search by property type or focus area"
          onSearch={setQuery}
          onClear={() => setQuery("")}
        />
        {noResults && (
          <div className="rounded-3xl border border-[#1F3C58]/10 bg-[#F5F7FA] p-4 text-sm text-[#1B1B1B]/75">
            <p>No property types matched "{query}". Request a custom underwriting package and we will prepare guidance.</p>
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
        {filtered.map((type) => (
          <div
            key={type.slug}
            className="flex h-full flex-col overflow-hidden rounded-3xl border border-[#1F3C58]/12 bg-white shadow-[0_22px_44px_-30px_rgba(17,40,60,0.26)]"
          >
            {type.heroImage && (
              <div className="relative h-48 w-full">
                <Image
                  src={type.heroImage}
                  alt={`${type.name} property type`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="flex flex-1 flex-col p-6">
              <h2 className="font-heading text-lg font-semibold text-[#1F3C58]">
                {type.name}
              </h2>
            <p className="mt-3 text-sm text-[#1B1B1B]/75">{type.summary}</p>
            <ul className="mt-4 space-y-2 text-sm text-[#1B1B1B]/70">
              {type.focusAreas.map((focus) => (
                <li key={focus} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#4DA49B]" />
                  <span>{focus}</span>
                </li>
              ))}
            </ul>
              <div className="mt-6">
                <Link
                  href={type.route}
                  className="inline-flex rounded-full border border-[#1F3C58] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#1F3C58] hover:bg-[#1F3C58] hover:text-[#F5F7FA]"
                >
                  Request Briefing
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
