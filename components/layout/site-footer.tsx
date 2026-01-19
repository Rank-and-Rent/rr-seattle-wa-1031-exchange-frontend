import Link from "next/link";
import site from "@/content/site.json";
import { servicesData, locationsData, toolsData } from "@/data";

export const SiteFooter = () => {
  return (
    <footer className="bg-[#1a3a52] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Contact */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#b8a074] mb-6">Contact</p>
            <div className="space-y-3 text-sm text-white/80">
              <a href={`tel:${site.phoneDigits}`} className="block hover:text-white transition-colors">
                {site.phone}
              </a>
              <a href={`mailto:${site.email}`} className="block hover:text-white transition-colors">
                {site.email}
              </a>
            </div>
          </div>

          {/* Address */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#b8a074] mb-6">Address</p>
            <div className="text-sm text-white/80">
              <p>{site.address}</p>
              <p>{site.mainCity}, {site.state}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#b8a074] mb-6">Quick Links</p>
            <div className="space-y-2 text-sm text-white/80">
              <Link href="/services" className="block hover:text-white transition-colors">Services</Link>
              <Link href="/locations" className="block hover:text-white transition-colors">Locations</Link>
              <Link href="/tools" className="block hover:text-white transition-colors">Tools</Link>
              <Link href="/about" className="block hover:text-white transition-colors">About</Link>
              <Link href="/blog" className="block hover:text-white transition-colors">Blog</Link>
              <Link href="/contact" className="block hover:text-white transition-colors">Contact</Link>
            </div>
          </div>

          {/* Tools */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#b8a074] mb-6">Tools</p>
            <div className="space-y-2 text-sm text-white/80">
              {toolsData.map((tool) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="block hover:text-white transition-colors">
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Location Map */}
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#b8a074] mb-6">Location</p>
            <div className="w-full h-48 border border-white/20 rounded">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`}
              />
            </div>
          </div>
        </div>

        {/* Service Areas */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <p className="text-xs tracking-[0.2em] uppercase text-[#b8a074] mb-6">Service Areas</p>
          <div className="flex flex-wrap gap-3">
            {locationsData.slice(0, 10).map((loc) => (
              <Link
                key={loc.slug}
                href={loc.route}
                className="px-4 py-2 border border-white/20 text-xs tracking-[0.1em] uppercase text-white/70 hover:border-[#b8a074] hover:text-white transition-all"
              >
                {loc.name}
              </Link>
            ))}
            <Link
              href="/locations"
              className="px-4 py-2 border border-[#b8a074]/50 text-xs tracking-[0.1em] uppercase text-[#b8a074] hover:bg-[#b8a074] hover:text-white transition-all"
            >
              View All
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs text-white/50">
            <div className="flex flex-wrap items-center gap-4">
              <span>&copy; {new Date().getFullYear()} {site.company}</span>
              <span className="hidden md:inline">|</span>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
          <p className="mt-4 text-xs text-white/40 max-w-3xl">
            This site provides educational information about 1031 exchanges. We are not a Qualified Intermediary, 
            law firm, broker, or CPA. Consult your advisors before executing exchange strategies.
          </p>
        </div>
      </div>
    </footer>
  );
};
