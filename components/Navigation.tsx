"use client";

import Link from "next/link";
import { useState } from "react";
import site from "@/content/site.json";
import { servicesData } from "@/data/services";
import { locationsData } from "@/data/locations";
import { toolsData } from "@/data/tools";

export default function Navigation() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [locationsOpen, setLocationsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<
    "services" | "locations" | "tools" | null
  >(null);

  const topServices = site.servicesNav
    .map((slug) => servicesData.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => s !== undefined)
    .slice(0, 8);

  const topLocations = site.locationsNav
    .map((slug) => locationsData.find((l) => l.slug === slug))
    .filter((l): l is NonNullable<typeof l> => l !== undefined);

  const topTools = toolsData;

  const toggleMobileSection = (section: "services" | "locations" | "tools") => {
    setMobileSection((prev) => (prev === section ? null : section));
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileSection(null);
  };

  return (
    <nav className="border-b border-outline bg-white dark:bg-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-semibold text-ink dark:text-zinc-50">
            {site.company}
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <button
                className="text-ink dark:text-zinc-50 hover:text-primary"
                onMouseEnter={() => {
                  setServicesOpen(true);
                  setLocationsOpen(false);
                  setToolsOpen(false);
                }}
                onMouseLeave={() => setServicesOpen(false)}
                onClick={() => {
                  setServicesOpen((prev) => !prev);
                  setLocationsOpen(false);
                  setToolsOpen(false);
                }}
              >
                Services
              </button>
              {servicesOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-black border border-outline shadow-lg z-50"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <div className="py-2">
                    {topServices.map((service) => (
                      <Link
                        key={service.slug}
                        href={service.route}
                        className="block px-4 py-2 text-sm text-ink dark:text-zinc-50 hover:bg-panel"
                      >
                        {service.name}
                      </Link>
                    ))}
                    <Link
                      href="/services"
                      className="block px-4 py-2 text-sm font-medium text-primary border-t border-outline mt-2"
                    >
                      View All Services
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="relative group">
              <button
                className="text-ink dark:text-zinc-50 hover:text-primary"
                onMouseEnter={() => {
                  setLocationsOpen(true);
                  setServicesOpen(false);
                  setToolsOpen(false);
                }}
                onMouseLeave={() => setLocationsOpen(false)}
                onClick={() => {
                  setLocationsOpen((prev) => !prev);
                  setServicesOpen(false);
                  setToolsOpen(false);
                }}
              >
                Locations
              </button>
              {locationsOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-black border border-outline shadow-lg z-50"
                  onMouseEnter={() => setLocationsOpen(true)}
                  onMouseLeave={() => setLocationsOpen(false)}
                >
                  <div className="py-2">
                    {topLocations.map((location) => (
                      <Link
                        key={location.slug}
                        href={location.route}
                        className="block px-4 py-2 text-sm text-ink dark:text-zinc-50 hover:bg-panel"
                      >
                        {location.name}, {site.state}
                      </Link>
                    ))}
                    <Link
                      href="/locations"
                      className="block px-4 py-2 text-sm font-medium text-primary border-t border-outline mt-2"
                    >
                      View All Locations
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="relative group">
              <button
                className="text-ink dark:text-zinc-50 hover:text-primary"
                onMouseEnter={() => {
                  setToolsOpen(true);
                  setServicesOpen(false);
                  setLocationsOpen(false);
                }}
                onMouseLeave={() => setToolsOpen(false)}
                onClick={() => {
                  setToolsOpen((prev) => !prev);
                  setServicesOpen(false);
                  setLocationsOpen(false);
                }}
              >
                Tools
              </button>
              {toolsOpen && (
                <div
                  className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-black border border-outline shadow-lg z-50"
                  onMouseEnter={() => setToolsOpen(true)}
                  onMouseLeave={() => setToolsOpen(false)}
                >
                  <div className="py-2">
                    {topTools.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        className="block px-4 py-2 text-sm text-ink dark:text-zinc-50 hover:bg-panel"
                      >
                        {tool.name}
                      </Link>
                    ))}
                    <Link
                      href="/tools"
                      className="block px-4 py-2 text-sm font-medium text-primary border-t border-outline mt-2"
                    >
                      View All Tools
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <Link href="/inventory" className="text-ink dark:text-zinc-50 hover:text-primary">
              Inventory
            </Link>
            {site.extraLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-ink dark:text-zinc-50 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-outline bg-white px-3 py-2 text-sm text-ink shadow-sm transition hover:bg-panel md:hidden"
              onClick={() =>
                setMobileOpen((prev) => {
                  const next = !prev;
                  if (!next) {
                    setMobileSection(null);
                  }
                  return next;
                })
              }
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              <span className="flex h-4 w-4 flex-col justify-between">
                <span className="h-0.5 w-full bg-ink" />
                <span className="h-0.5 w-full bg-ink" />
                <span className="h-0.5 w-full bg-ink" />
              </span>
            </button>
            <a
              href={`tel:${site.phoneDigits}`}
              className="rounded-full bg-primary text-primaryfg px-5 py-2 text-sm font-medium"
            >
              Call Now
            </a>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-outline bg-white dark:bg-black">
            <div className="space-y-4 py-4">
              <div className="px-2">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg bg-panel px-4 py-3 text-left text-sm font-medium text-ink dark:text-zinc-50"
                  onClick={() => toggleMobileSection("services")}
                  aria-expanded={mobileSection === "services"}
                >
                  <span>Services</span>
                  <span>{mobileSection === "services" ? "−" : "+"}</span>
                </button>
                {mobileSection === "services" && (
                  <div className="mt-2 space-y-2 rounded-lg border border-outline bg-white px-3 py-3 dark:bg-black">
                    {topServices.map((service) => (
                      <Link
                        key={service.slug}
                        href={service.route}
                        onClick={closeMobileMenu}
                        className="block rounded-md px-3 py-2 text-sm text-ink hover:bg-panel dark:text-zinc-50"
                      >
                        {service.name}
                      </Link>
                    ))}
                    <Link
                      href="/services"
                      onClick={closeMobileMenu}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-primary"
                    >
                      View All Services
                    </Link>
                  </div>
                )}
              </div>
              <div className="px-2">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg bg-panel px-4 py-3 text-left text-sm font-medium text-ink dark:text-zinc-50"
                  onClick={() => toggleMobileSection("locations")}
                  aria-expanded={mobileSection === "locations"}
                >
                  <span>Locations</span>
                  <span>{mobileSection === "locations" ? "−" : "+"}</span>
                </button>
                {mobileSection === "locations" && (
                  <div className="mt-2 space-y-2 rounded-lg border border-outline bg-white px-3 py-3 dark:bg-black">
                    {topLocations.map((location) => (
                      <Link
                        key={location.slug}
                        href={location.route}
                        onClick={closeMobileMenu}
                        className="block rounded-md px-3 py-2 text-sm text-ink hover:bg-panel dark:text-zinc-50"
                      >
                        {location.name}, {site.state}
                      </Link>
                    ))}
                    <Link
                      href="/locations"
                      onClick={closeMobileMenu}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-primary"
                    >
                      View All Locations
                    </Link>
                  </div>
                )}
              </div>
              <div className="px-2">
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg bg-panel px-4 py-3 text-left text-sm font-medium text-ink dark:text-zinc-50"
                  onClick={() => toggleMobileSection("tools")}
                  aria-expanded={mobileSection === "tools"}
                >
                  <span>Tools</span>
                  <span>{mobileSection === "tools" ? "−" : "+"}</span>
                </button>
                {mobileSection === "tools" && (
                  <div className="mt-2 space-y-2 rounded-lg border border-outline bg-white px-3 py-3 dark:bg-black">
                    {topTools.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        onClick={closeMobileMenu}
                        className="block rounded-md px-3 py-2 text-sm text-ink hover:bg-panel dark:text-zinc-50"
                      >
                        {tool.name}
                      </Link>
                    ))}
                    <Link
                      href="/tools"
                      onClick={closeMobileMenu}
                      className="block rounded-md px-3 py-2 text-sm font-medium text-primary"
                    >
                      View All Tools
                    </Link>
                  </div>
                )}
              </div>
              <div className="px-2 space-y-2">
                <Link
                  href="/inventory"
                  onClick={closeMobileMenu}
                  className="block rounded-lg bg-panel px-4 py-3 text-sm font-medium text-ink hover:bg-panel/70 dark:text-zinc-50"
                >
                  Inventory
                </Link>
                {site.extraLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className="block rounded-lg bg-panel px-4 py-3 text-sm font-medium text-ink hover:bg-panel/70 dark:text-zinc-50"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

