import type { Metadata } from "next";
import { propertyTypesData } from "@/data";
import { PropertyTypesContent } from "@/components/property-types/property-types-content";
import { Breadcrumbs, buildBreadcrumbJsonLd } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "1031 Exchange Property Types | 1031 Exchange Seattle",
  description:
    "Review the property types we underwrite for Seattle investors, including NNN retail, multifamily, industrial, medical office, and more.",
  alternates: {
    canonical: "https://www.1031exchangeseattle.com/property-types",
  },
};

const breadcrumbItems = [
  { label: "Home", href: "https://www.1031exchangeseattle.com/" },
  { label: "Property Types", href: "https://www.1031exchangeseattle.com/property-types" },
];

const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

export default function PropertyTypesPage() {
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
        <PropertyTypesContent propertyTypes={propertyTypesData} />
      </div>
    </>
  );
}
