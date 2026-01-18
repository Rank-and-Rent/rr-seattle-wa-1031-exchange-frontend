"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { LocationItem } from "@/data";

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

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end bg-[#1a3a52]">
        <div className="absolute inset-0">
          <Image
            src="/homepage-hero/seattle-washington-1031-exchange-1.jpg"
            alt="Seattle Markets"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 md:px-10">
          <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-4">
            Puget Sound Region
          </p>
          <h1 className="font-heading text-5xl md:text-6xl tracking-[0.12em] text-white mb-4">
            Seattle Markets
          </h1>
          <p className="text-white/70 max-w-2xl text-lg">
            Explore the neighborhoods and submarkets where we manage 1031 exchange replacement property programs.
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-6 md:px-10">
          <div className="max-w-md">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search markets..."
              className="w-full px-6 py-4 border border-gray-200 text-[#2c3e50] text-sm focus:border-[#b8a074] focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Markets Grid */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#6b7c8a] mb-6">No markets match your search.</p>
              <Link
                href="/contact"
                className="inline-block px-8 py-4 bg-[#2c3e50] text-xs tracking-[0.2em] uppercase text-white hover:bg-[#1a3a52] transition-colors"
              >
                Contact Us About Custom Markets
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1">
              {filtered.map((location) => (
                <Link
                  key={location.slug}
                  href={location.route}
                  className="group relative aspect-[4/3] overflow-hidden"
                >
                  <Image
                    src={location.image || "/homepage-hero/seattle-washington-1031-exchange-1.jpg"}
                    alt={location.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-[#b8a074] mb-2">
                      {location.type}
                    </p>
                    <h2 className="font-heading text-2xl md:text-3xl tracking-[0.1em] text-white mb-3">
                      {location.name}
                    </h2>
                    <span className="inline-block text-xs tracking-[0.15em] uppercase text-white/70 group-hover:text-[#b8a074] transition-colors">
                      View Market Details
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
