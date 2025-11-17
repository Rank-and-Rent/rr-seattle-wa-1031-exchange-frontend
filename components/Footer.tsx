import Link from "next/link";
import site from "@/content/site.json";
import { toolsData } from "@/data/tools";

export default function Footer() {
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(site.address)}&output=embed`;

  return (
    <footer className="border-t border-outline bg-panel mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-ink dark:text-zinc-50 mb-4">
              {site.company}
            </h3>
            <p className="text-sm text-ink/70 dark:text-zinc-400 mb-2">{site.address}</p>
            <p className="text-sm text-ink/70 dark:text-zinc-400 mb-2">
              <a href={`tel:${site.phoneDigits}`} className="hover:text-primary">
                {site.phone}
              </a>
            </p>
            <p className="text-sm text-ink/70 dark:text-zinc-400">
              <a href={`mailto:${site.email}`} className="hover:text-primary">
                {site.email}
              </a>
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink dark:text-zinc-50 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-sm text-ink/70 dark:text-zinc-400 hover:text-primary">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/locations" className="text-sm text-ink/70 dark:text-zinc-400 hover:text-primary">
                  Locations
                </Link>
              </li>
              <li>
                <Link href="/inventory" className="text-sm text-ink/70 dark:text-zinc-400 hover:text-primary">
                  Inventory
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-ink/70 dark:text-zinc-400 hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink dark:text-zinc-50 mb-4">Tools</h4>
            <ul className="space-y-2">
              {toolsData.map((tool) => (
                <li key={tool.slug}>
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="text-sm text-ink/70 dark:text-zinc-400 hover:text-primary"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/tools"
                  className="text-sm font-medium text-primary hover:text-primary/80"
                >
                  View All Tools
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink dark:text-zinc-50 mb-4">Location</h4>
            <div className="w-full h-48 border border-outline rounded">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={mapEmbedUrl}
              />
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-outline">
          <p className="text-xs text-ink/50 dark:text-zinc-500 text-center">
            Disclosure: This site routes inquiries to our chosen fulfillment partner for 1031 exchange advisory and property identification support.
          </p>
          <p className="text-xs text-ink/50 dark:text-zinc-500 text-center mt-2">
            Educational content only. Not tax, legal, or investment advice.
          </p>
        </div>
      </div>
    </footer>
  );
}

