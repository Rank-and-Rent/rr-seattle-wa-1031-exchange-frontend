import Link from "next/link";
import site from "@/content/site.json";
import { servicesData, locationsData, toolsData } from "@/data";
import { getPrimaryMarket } from "@/lib/market";
import { BUSINESS_HOURS } from "@/lib/config";

const { city: PRIMARY_CITY, state: PRIMARY_STATE_ABBR } = getPrimaryMarket();

const quickServiceLinks = servicesData.slice(0, 6);
const quickLocationLinks = locationsData.slice(0, 6);

const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
  `${PRIMARY_CITY}, ${PRIMARY_STATE_ABBR}`
)}&output=embed`;

export const SiteFooter = () => {
  return (
    <footer className="bg-[#0E2536] text-[#F5F7FA]">
      <div className="mx-auto grid max-w-wrapper gap-12 px-6 py-16 md:px-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="space-y-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#4DA49B]">
              {site.company}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Precision guidance for {PRIMARY_CITY}, {PRIMARY_STATE_ABBR} investors.
            </h2>
            <p className="mt-4 text-sm text-[#E8EDEF]/80">
              We help you identify, verify, and secure 1031 replacement properties nationwide while maintaining Seattle-based accountability. We are not a Qualified Intermediary; we coordinate project management with your selected intermediary, CPA, and legal counsel.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#4DA49B]">
                Contact
              </p>
              <div className="mt-3 space-y-2 text-sm text-[#F5F7FA]/90">
                <p>{site.company}</p>
                <p>{site.address}</p>
                <a
                  href={`tel:${site.phoneDigits}`}
                  className="block text-[#F5F7FA] transition hover:text-white"
                >
                  {site.phone}
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="block text-[#F5F7FA] transition hover:text-white"
                >
                  {site.email}
                </a>
                <p className="text-xs text-[#E8EDEF]/70">Hours: {BUSINESS_HOURS}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#4DA49B]">
                Quick Links
              </p>
              <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-[#F5F7FA]/85">
                {servicesData.slice(0, 8).map((service) => (
                  <Link
                    key={service.slug}
                    href={service.route}
                    className="transition hover:text-white"
                  >
                    {service.name}
                  </Link>
                ))}
                <Link href="/services" className="transition hover:text-white font-medium">
                  View All {servicesData.length} Services
                </Link>
                <Link href="/blog" className="transition hover:text-white">
                  Blog
                </Link>
                <Link href="/privacy" className="transition hover:text-white">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="transition hover:text-white">
                  Terms of Service
                </Link>
                <Link href="/sitemap.xml" className="transition hover:text-white">
                  Sitemap
                </Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#4DA49B]">
                Tools
              </p>
              <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-[#F5F7FA]/85">
                {toolsData.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="transition hover:text-white"
                  >
                    {tool.name}
                  </Link>
                ))}
                <Link href="/tools" className="transition hover:text-white">
                  View All Tools
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-3xl border border-white/15 bg-white/5 p-4 text-sm text-[#F5F7FA]/85">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#4DA49B]">
              Service Area Highlights
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {locationsData.slice(0, 8).map((location) => (
                <Link
                  key={location.slug}
                  href={location.route}
                  className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white transition hover:border-white/60 hover:bg-white/10"
                >
                  {location.name}
                </Link>
              ))}
              <Link
                href="/locations"
                className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.24em] text-white transition hover:border-white/60 hover:bg-white/10 font-medium"
              >
                View All 20 Locations
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/15">
            <iframe
              title={`${PRIMARY_CITY}, ${PRIMARY_STATE_ABBR} service area map`}
              src={mapSrc}
              className="h-64 w-full"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="space-y-2 text-xs text-[#E8EDEF]/70">
            <p>This site helps investors identify potential replacement properties for Section 1031 exchanges.</p>
            <p>This site is not a Qualified Intermediary, law firm, broker, or CPA.</p>
            <p>Investors should consult a Qualified Intermediary and tax advisor before acting on exchange strategies.</p>
            <p>© {new Date().getFullYear()} {site.company}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
