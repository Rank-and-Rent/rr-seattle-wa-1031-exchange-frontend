import type { Metadata } from "next";
import { servicesData, type ServiceItem } from "@/data";
import { ServicesContent } from "@/components/services/services-content";
import { Breadcrumbs, buildBreadcrumbJsonLd } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Seattle 1031 Exchange Services | 1031 Exchange Seattle",
  description:
    "Explore the 1031 exchange services we provide for Seattle and Washington investors, including replacement property identification, underwriting, and timeline management.",
  alternates: {
    canonical: "https://www.1031exchangeseattle.com/services",
  },
};

const breadcrumbItems = [
  { label: "Home", href: "https://www.1031exchangeseattle.com/" },
  { label: "Services", href: "https://www.1031exchangeseattle.com/services" },
];

const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="bg-[#F5F7FA]">
        <div className="mx-auto max-w-wrapper px-6 pt-12 md:px-10">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <ServicesContent services={servicesData as ServiceItem[]} />
      </div>
    </>
  );
}

