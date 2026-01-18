"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ServiceItem } from "@/data";
import site from "@/content/site.json";

interface ServicesContentProps {
  services: ServiceItem[];
}

export const ServicesContent = ({ services }: ServicesContentProps) => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(services.map((s) => s.category));
    return Array.from(cats);
  }, [services]);

  const filtered = useMemo(() => {
    let result = services;
    
    if (activeCategory) {
      result = result.filter((s) => s.category === activeCategory);
    }
    
    if (query.trim()) {
      const normalized = query.trim().toLowerCase();
      result = result.filter((service) => {
        const haystack = [service.name, service.short, ...service.keywords]
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalized);
      });
    }
    
    return result;
  }, [query, services, activeCategory]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-end bg-[#1a3a52]">
        <div className="absolute inset-0">
          <Image
            src="/homepage-hero/seattle-washington-1031-exchange-2.jpg"
            alt="Seattle 1031 Exchange Services"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 md:px-10">
          <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-4">
            Our Expertise
          </p>
          <h1 className="font-heading text-5xl md:text-6xl tracking-[0.12em] text-white mb-4">
            Exchange Services
          </h1>
          <p className="text-white/70 max-w-2xl text-lg">
            Comprehensive 1031 exchange coordination for Washington investors. Every service includes lender-ready analysis and compliance support.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white border-b border-gray-100 sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center gap-8 overflow-x-auto py-6 scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 text-xs tracking-[0.2em] uppercase pb-1 transition-colors ${
                !activeCategory 
                  ? 'text-[#2c3e50] border-b-2 border-[#b8a074]' 
                  : 'text-[#6b7c8a] hover:text-[#2c3e50]'
              }`}
            >
              All Services
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 text-xs tracking-[0.2em] uppercase pb-1 transition-colors ${
                  activeCategory === cat 
                    ? 'text-[#2c3e50] border-b-2 border-[#b8a074]' 
                    : 'text-[#6b7c8a] hover:text-[#2c3e50]'
                }`}
              >
                {cat}
              </button>
            ))}
            <div className="flex-shrink-0 ml-auto">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="px-4 py-2 border border-gray-200 text-sm text-[#2c3e50] focus:border-[#b8a074] focus:outline-none w-48"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-[#f7f6f4] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#6b7c8a] mb-6">No services match your criteria.</p>
              <Link
                href="/contact"
                className="inline-block px-8 py-4 bg-[#2c3e50] text-xs tracking-[0.2em] uppercase text-white hover:bg-[#1a3a52] transition-colors"
              >
                Contact Us About Custom Services
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((service) => (
                <Link
                  key={service.slug}
                  href={service.route}
                  className="group bg-white p-8 hover:shadow-[0_20px_40px_-20px_rgba(26,58,82,0.15)] transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-[#b8a074]">
                      {service.category}
                    </p>
                    <span className="text-[#2c3e50] opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </span>
                  </div>
                  <h2 className="font-heading text-xl tracking-[0.05em] text-[#2c3e50] mb-4 group-hover:text-[#b8a074] transition-colors">
                    {service.name}
                  </h2>
                  <p className="text-sm text-[#6b7c8a] leading-relaxed mb-6">
                    {service.short}
                  </p>
                  <span className="text-xs tracking-[0.15em] uppercase text-[#2c3e50] border-b border-[#2c3e50] pb-1 group-hover:text-[#b8a074] group-hover:border-[#b8a074] transition-colors">
                    Learn More
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#2c3e50] py-20">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <p className="text-xs tracking-[0.35em] uppercase text-[#b8a074] mb-4">
            Ready to Start?
          </p>
          <h2 className="font-heading text-3xl md:text-4xl tracking-[0.1em] text-white mb-6">
            Let&apos;s Discuss Your Exchange
          </h2>
          <p className="text-white/70 mb-10 max-w-2xl mx-auto">
            Call {site.phone} or share your requirements through our intake form. We respond within one business day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-10 py-4 bg-[#b8a074] text-xs tracking-[0.2em] uppercase text-white hover:bg-[#a08960] transition-colors"
            >
              Contact Us
            </Link>
            <a
              href={`tel:${site.phoneDigits}`}
              className="px-10 py-4 border border-white/40 text-xs tracking-[0.2em] uppercase text-white hover:bg-white hover:text-[#2c3e50] transition-all"
            >
              Call {site.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
