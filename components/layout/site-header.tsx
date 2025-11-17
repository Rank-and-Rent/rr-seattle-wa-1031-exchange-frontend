"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import site from "@/content/site.json";
import { servicesData, locationsData, toolsData } from "@/data";

type MenuKey = "services" | "locations" | "tools";

type DropdownConfig = {
  key: MenuKey;
  label: string;
  description: string;
};

const DROPDOWNS: DropdownConfig[] = [
  {
    key: "services",
    label: "Services",
    description: "Seattle replacement property expertise",
  },
  {
    key: "locations",
    label: "Locations",
    description: "Trusted markets across the Puget Sound",
  },
  {
    key: "tools",
    label: "Tools",
    description: "Interactive 1031 exchange calculators",
  },
];

const staticNav = [
  { label: "About", href: "/about" },
  { label: "Property Types", href: "/property-types" },
  { label: "Blog", href: "/blog" },
];

// Top 6 services by name (not grouped by category)
const topServices = servicesData.slice(0, 6);
const totalServicesCount = servicesData.length;

const locationList = locationsData.slice(0, 8);
// Count actual locations based on public folder (20 location images)
const totalLocationsCount = 20;

export const SiteHeader = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const dropdownRefs = useRef<Record<MenuKey, HTMLDivElement | null>>({
    services: null,
    locations: null,
    tools: null,
  });
  const hoverTimeouts = useRef<Record<MenuKey, NodeJS.Timeout | null>>({
    services: null,
    locations: null,
    tools: null,
  });

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (openMenu) {
        const target = event.target as Node;
        const dropdownElement = dropdownRefs.current[openMenu];
        const button = document.querySelector(
          `[aria-controls="${openMenu}-dropdown"]`
        );
        const parentContainer = button?.closest(".relative");
        
        if (
          dropdownElement &&
          !dropdownElement.contains(target) &&
          parentContainer &&
          !parentContainer.contains(target)
        ) {
          setOpenMenu(null);
        }
      }
    };

    window.addEventListener("keydown", handleEsc);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleEsc);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
    // Clear any pending hover timeouts when route changes
    Object.values(hoverTimeouts.current).forEach((timeout) => {
      if (timeout) {
        clearTimeout(timeout);
      }
    });
  }, [pathname]);

  useEffect(() => {
    // Cleanup timeouts on unmount
    return () => {
      Object.values(hoverTimeouts.current).forEach((timeout) => {
        if (timeout) {
          clearTimeout(timeout);
        }
      });
    };
  }, []);

  const serviceMenu = useMemo(
    () => (
      <div className="space-y-3">
        <ul className="space-y-2">
          {topServices.map((service) => (
            <li key={service.slug}>
              <Link
                href={service.route}
                className="block rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus-visible:bg-white/10"
              >
                {service.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/services"
          className="flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.26em] text-white transition hover:border-white/60 hover:bg-white/20"
        >
          View All {totalServicesCount} Services
        </Link>
      </div>
    ),
    []
  );

  const locationMenu = useMemo(
    () => (
      <div className="grid gap-3 sm:grid-cols-2">
        {locationList.map((location) => (
          <Link
            key={location.slug}
            href={location.route}
            className="flex flex-col rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-left text-sm text-[#F5F7FA]/90 transition hover:border-white/60 hover:bg-white/10 focus-visible:border-white/60"
          >
            <span className="font-semibold text-white">{location.name}</span>
            <span className="text-xs text-[#F5F7FA]/70">
              1031 replacement paths, FAQs, and lender alignment
            </span>
          </Link>
        ))}
        <Link
          href="/locations"
          className="flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.26em] text-white transition hover:border-white/60 hover:bg-white/20"
        >
          View All {totalLocationsCount} Locations
        </Link>
      </div>
    ),
    []
  );

  const toolsMenu = useMemo(
    () => (
      <div className="grid gap-3 sm:grid-cols-2">
        {toolsData.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="flex flex-col rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-left text-sm text-[#F5F7FA]/90 transition hover:border-white/60 hover:bg-white/10 focus-visible:border-white/60"
          >
            <span className="font-semibold text-white">{tool.name}</span>
            <span className="text-xs text-[#F5F7FA]/70">
              {tool.summary}
            </span>
          </Link>
        ))}
        <Link
          href="/tools"
          className="flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.26em] text-white transition hover:border-white/60 hover:bg-white/20"
        >
          View All Tools
        </Link>
      </div>
    ),
    []
  );

  const renderMenuContent = (menuKey: MenuKey) => {
    if (menuKey === "services") {
      return serviceMenu;
    }
    if (menuKey === "tools") {
      return toolsMenu;
    }

    return locationMenu;
  };

  const toggleMenu = (key: MenuKey, isHover = false) => {
    setOpenMenu((current) => {
      if (isHover) {
        return key;
      }
      return current === key ? null : key;
    });
  };

  const closeMenu = () => {
    setOpenMenu(null);
  };

  return (
    <header className="sticky top-0 z-50 bg-black/95 text-white backdrop-blur-sm border-b border-white/5">
      <div className="mx-auto flex w-full max-w-[1920px] items-center justify-between px-8 py-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/1031-exchange-seattle-wa-logo.png"
            alt={`${site.company} Logo`}
            width={120}
            height={65}
            className="h-16 w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {DROPDOWNS.map((dropdown) => (
            <div
              key={dropdown.key}
              className="relative"
              onMouseEnter={() => {
                // Clear any pending close timeout
                if (hoverTimeouts.current[dropdown.key]) {
                  clearTimeout(hoverTimeouts.current[dropdown.key]!);
                  hoverTimeouts.current[dropdown.key] = null;
                }
                toggleMenu(dropdown.key, true);
              }}
              onMouseLeave={() => {
                // Set a delay before closing to allow movement to dropdown
                hoverTimeouts.current[dropdown.key] = setTimeout(() => {
                  if (openMenu === dropdown.key) {
                    closeMenu();
                  }
                  hoverTimeouts.current[dropdown.key] = null;
                }, 200);
              }}
            >
              <button
                type="button"
                className={clsx(
                  "flex items-center gap-1.5 text-sm font-light tracking-wide transition-colors",
                  openMenu === dropdown.key
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                )}
                aria-expanded={openMenu === dropdown.key}
                aria-controls={`${dropdown.key}-dropdown`}
                onClick={() => toggleMenu(dropdown.key)}
                onFocus={() => toggleMenu(dropdown.key, true)}
                onMouseEnter={() => {
                  // Clear any pending close timeout
                  if (hoverTimeouts.current[dropdown.key]) {
                    clearTimeout(hoverTimeouts.current[dropdown.key]!);
                    hoverTimeouts.current[dropdown.key] = null;
                  }
                  toggleMenu(dropdown.key, true);
                }}
              >
                <span className="uppercase">{dropdown.label}</span>
                <span className={clsx(
                  "text-[10px] transition-transform",
                  openMenu === dropdown.key ? "rotate-180" : ""
                )}>▼</span>
              </button>
              {openMenu === dropdown.key && (
                <div
                  ref={(node) => {
                    dropdownRefs.current[dropdown.key] = node;
                  }}
                  id={`${dropdown.key}-dropdown`}
                  role="menu"
                  className={clsx(
                    "absolute top-full mt-4 z-[100] rounded-lg border border-white/10 bg-black backdrop-blur-xl p-8 shadow-2xl w-[min(36rem,90vw)] lg:w-[min(54rem,70vw)]",
                    dropdown.key === "services" 
                      ? "left-0" 
                      : "left-1/2 -translate-x-1/2"
                  )}
                  style={{ backgroundColor: '#000000' }}
                  onMouseEnter={() => {
                    // Clear any pending close timeout when entering dropdown
                    if (hoverTimeouts.current[dropdown.key]) {
                      clearTimeout(hoverTimeouts.current[dropdown.key]!);
                      hoverTimeouts.current[dropdown.key] = null;
                    }
                    toggleMenu(dropdown.key, true);
                  }}
                  onMouseLeave={() => {
                    // Close when leaving dropdown
                    hoverTimeouts.current[dropdown.key] = setTimeout(() => {
                      closeMenu();
                      hoverTimeouts.current[dropdown.key] = null;
                    }, 150);
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#4DA49B]">
                    {dropdown.description}
                  </p>
                  <div className="mt-5 space-y-5 text-sm">
                    {renderMenuContent(dropdown.key)}
                  </div>
                </div>
              )}
            </div>
          ))}

          {staticNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "text-sm font-light tracking-wide uppercase transition-colors whitespace-nowrap",
                pathname === item.href
                  ? "text-white"
                  : "text-white/80 hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/contact"
            className="ml-4 rounded-full bg-gradient-to-r from-[#4DA49B] to-[#7BC5BD] px-6 py-2.5 text-sm font-medium uppercase tracking-wide text-[#0E2536] transition-opacity hover:opacity-90 whitespace-nowrap"
          >
            Contact Team
          </Link>
        </nav>

        <button
          type="button"
          className="lg:hidden text-white/80 hover:text-white"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span className="flex h-10 w-10 items-center justify-center">
            <span className="h-3 w-4">
              <span className="block h-0.5 w-full bg-white transition-all" />
              <span className="mt-1 block h-0.5 w-full bg-white transition-all" />
              <span className="mt-1 block h-0.5 w-full bg-white transition-all" />
            </span>
          </span>
        </button>
      </div>

      <div
        className={clsx(
          "lg:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <div className="space-y-6 border-t border-white/5 bg-black/98 px-6 py-6">
          {DROPDOWNS.map((dropdown) => (
            <div key={dropdown.key}>
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.24em]"
                aria-expanded={openMenu === dropdown.key}
                onClick={() => toggleMenu(dropdown.key)}
              >
                <span>{dropdown.label}</span>
                <span>{openMenu === dropdown.key ? "−" : "+"}</span>
              </button>
              {openMenu === dropdown.key && (
                <div className="mt-4 space-y-3 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white">
                  {dropdown.key === "services" ? (
                    <div className="space-y-3">
                      <ul className="space-y-2">
                        {topServices.map((service) => (
                          <li key={service.slug}>
                            <Link
                              href={service.route}
                              className="block rounded-lg px-3 py-2 font-semibold hover:bg-white/10"
                            >
                              {service.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href="/services"
                        className="flex items-center justify-center rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.28em]"
                      >
                        View All {totalServicesCount} Services
                      </Link>
                    </div>
                  ) : dropdown.key === "locations" ? (
                    <ul className="space-y-2">
                      {locationList.map((location) => (
                        <li key={location.slug}>
                          <Link
                            href={location.route}
                            className="flex flex-col rounded-lg px-3 py-2 hover:bg-white/10"
                          >
                            <span className="font-semibold">{location.name}</span>
                            <span className="text-xs text-[#E8EDEF]/70">
                              Replacement property coverage and FAQs
                            </span>
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href="/locations"
                          className="flex items-center justify-center rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.28em]"
                        >
                          View All {totalLocationsCount} Locations
                        </Link>
                      </li>
                    </ul>
                  ) : (
                    <ul className="space-y-2">
                      {toolsData.map((tool) => (
                        <li key={tool.slug}>
                          <Link
                            href={`/tools/${tool.slug}`}
                            className="flex flex-col rounded-lg px-3 py-2 hover:bg-white/10"
                          >
                            <span className="font-semibold">{tool.name}</span>
                            <span className="text-xs text-[#E8EDEF]/70">
                              {tool.summary}
                            </span>
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          href="/tools"
                          className="flex items-center justify-center rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.28em]"
                        >
                          View All Tools
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}

          {staticNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-white"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="block rounded-full bg-gradient-to-r from-[#4DA49B] to-[#7BC5BD] px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.24em] text-[#0E2536]"
          >
            Contact Team
          </Link>
        </div>
      </div>
    </header>
  );
};
