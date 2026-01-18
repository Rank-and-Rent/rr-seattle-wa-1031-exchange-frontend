import type { Metadata } from "next";
import { locationsData } from "@/data";
import { LocationsContent } from "@/components/locations/locations-content";
import { buildBreadcrumbJsonLd } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Seattle 1031 Exchange Locations | 1031 Exchange Seattle",
  description:
    "Review the Seattle and Puget Sound markets where we coordinate 1031 exchanges, including Bellevue, Redmond, Kirkland, and more.",
  alternates: {
    canonical: "https://www.1031exchangeseattle.com/locations",
  },
};

const breadcrumbItems = [
  { label: "Home", href: "https://www.1031exchangeseattle.com/" },
  { label: "Locations", href: "https://www.1031exchangeseattle.com/locations" },
];

const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbItems);

export default function LocationsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <LocationsContent locations={locationsData} />
    </>
  );
}
