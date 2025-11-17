import { LocationDetail, LocationItem } from "./types";
import { getPrimaryMarket } from "@/lib/market";
import { servicesData } from "./services";
import { processTemplateVars } from "@/lib/template";

const { city: PRIMARY_CITY, state: PRIMARY_STATE_ABBR } = getPrimaryMarket();

export const locationsData: LocationItem[] = [
  {
    slug: "downtown-seattle",
    name: `Downtown ${PRIMARY_CITY}`,
    route: "/locations/downtown-seattle",
    type: "city",
  },
  {
    slug: "south-lake-union",
    name: "South Lake Union",
    route: "/locations/south-lake-union",
    type: "district",
  },
  {
    slug: "bellevue-core",
    name: "Bellevue Core",
    route: "/locations/bellevue-core",
    type: "suburb",
  },
  {
    slug: "kirkland-waterfront",
    name: "Kirkland Waterfront",
    route: "/locations/kirkland-waterfront",
    type: "suburb",
  },
  {
    slug: "redmond-tech-corridor",
    name: "Redmond Tech Corridor",
    route: "/locations/redmond-tech-corridor",
    type: "suburb",
  },
  {
    slug: "ballard-maritime-district",
    name: "Ballard Maritime District",
    route: "/locations/ballard-maritime-district",
    type: "neighborhood",
  },
  {
    slug: "capitol-hill-pike-pine",
    name: "Capitol Hill Pike-Pine",
    route: "/locations/capitol-hill-pike-pine",
    type: "neighborhood",
  },
  {
    slug: "fremont-innovation-hub",
    name: "Fremont Innovation Hub",
    route: "/locations/fremont-innovation-hub",
    type: "neighborhood",
  },
  {
    slug: "issaquah-highlands",
    name: "Issaquah Highlands",
    route: "/locations/issaquah-highlands",
    type: "suburb",
  },
  {
    slug: "mercer-island-town-center",
    name: "Mercer Island Town Center",
    route: "/locations/mercer-island-town-center",
    type: "suburb",
  },
];

const defaultHighlights = [
  "Access to institutional-grade single tenant NNN inventory with credit tenants",
  "Availability of stabilized multifamily assets with predictable NOI",
  "Active lender relationships covering bank, credit union, and debt fund programs",
  "Local professionals for inspections, environmental reviews, and valuation support",
];

const buildFAQs = (locationName: string): LocationDetail["faqs"] => [
  {
    question: `Does ${locationName}, ${PRIMARY_STATE_ABBR} qualify for like-kind replacement property?`,
    answer:
      `${locationName}, ${PRIMARY_STATE_ABBR} assets qualify for exchanges when held for investment or productive use. We document lease profiles, hold intent, and valuation support to satisfy your intermediary and CPA.`,
  },
  {
    question: `Can you identify ${locationName}, ${PRIMARY_STATE_ABBR} assets within 45 days?`,
    answer:
      `Yes. We prepare short lists and backup assets for ${locationName}, ${PRIMARY_STATE_ABBR} so your identification letter is compliant and actionable.`,
  },
  {
    question: `Will you coordinate local diligence in ${locationName}, ${PRIMARY_STATE_ABBR}?`,
    answer:
      `We schedule inspections, environmental reviews, and municipal conversations in ${locationName}, ${PRIMARY_STATE_ABBR} while reinforcing that we are not acting as a Qualified Intermediary.`,
  },
  {
    question: `Can you source lenders familiar with ${locationName}, ${PRIMARY_STATE_ABBR}?`,
    answer:
      `We introduce lenders who regularly finance ${locationName}, ${PRIMARY_STATE_ABBR} acquisitions and align debt structures with your exchange timetable.`,
  },
];

const locationDetailsRaw: Record<string, LocationDetail> = {
  "downtown-seattle": {
    slug: "downtown-seattle",
    overview:
      `Downtown ${PRIMARY_CITY} offers high-credit office, hospitality, and mixed-use inventory near regional transit, the legal core, and waterfront redevelopments. Investors use this submarket to secure stabilized cash flow and Class A tenants while maintaining visibility in ${PRIMARY_CITY}, ${PRIMARY_STATE_ABBR}.`,
    highlights: [
      "Presence of trophy and near-trophy office assets with long-term leases",
      "Proximity to waterfront redevelopment and convention traffic",
      "Institutional property management and security infrastructure",
      "Public transit access supporting talent retention and leasing velocity",
    ],
    faqs: buildFAQs(`Downtown ${PRIMARY_CITY}`),
    seo: {
      title: `Downtown ${PRIMARY_CITY} 1031 Exchange Support | 1031 Exchange Seattle`,
      description:
        `Source replacement properties in Downtown ${PRIMARY_CITY}, ${PRIMARY_STATE_ABBR} with data-backed underwriting, lender coordination, and compliant identification.`,
    },
  },
  "south-lake-union": {
    slug: "south-lake-union",
    overview:
      "South Lake Union combines life science, technology, and residential towers in one walkable district, creating exchange opportunities with strong tenant demand and premium lease structures.",
    highlights: [
      "Life science-ready facilities with specialized infrastructure",
      "Tech campus adjacency driving long-term office demand",
      "Limited land supply preserving value for mixed-use towers",
      "Access to waterfront parks and urban amenities attractive to tenants",
    ],
    faqs: buildFAQs("South Lake Union"),
    seo: {
      title: "South Lake Union 1031 Exchange Support | 1031 Exchange Seattle",
      description:
        "Leverage South Lake Union, WA replacement properties with life science and tech tenant demand, exchange compliance, and underwriting support.",
    },
  },
  "bellevue-core": {
    slug: "bellevue-core",
    overview:
      "Bellevue Core delivers Class A office towers, high-credit retail pads, and luxury multifamily assets supported by rapid corporate expansion and eastside demographics.",
    highlights: [
      "Institutional office towers with blue-chip tenancy",
      "Net lease retail pads adjacent to regional malls",
      "Transit investments supporting future value creation",
      "Diverse debt sources competing for Bellevue assets",
    ],
    faqs: buildFAQs("Bellevue Core"),
    seo: {
      title: "Bellevue Core 1031 Exchange Support | 1031 Exchange Seattle",
      description:
        "Exchange into Bellevue Core, WA assets with corporate tenancy, lender-ready diligence, and timeline management.",
    },
  },
  "kirkland-waterfront": {
    slug: "kirkland-waterfront",
    overview:
      "Kirkland Waterfront blends boutique office, hospitality, and infill retail with exceptional livability, attracting investors seeking lifestyle-oriented cash flow.",
    highlights: [
      "Limited-supply waterfront office and retail",
      "Hospitality assets with year-round visitation",
      "Strong residential spending supporting street retail",
      "Marina and park investments increasing foot traffic",
    ],
    faqs: buildFAQs("Kirkland Waterfront"),
    seo: {
      title: "Kirkland Waterfront 1031 Exchange Support | 1031 Exchange Seattle",
      description:
        "Target Kirkland Waterfront, WA replacement assets with curated lists, underwriting, and compliance support.",
    },
  },
  "redmond-tech-corridor": {
    slug: "redmond-tech-corridor",
    overview:
      "Redmond Tech Corridor serves enterprise tenants and innovation campuses, offering logistics, office, and multifamily assets aligned with long-term tech expansion.",
    highlights: [
      "Corporate campuses anchoring rental demand",
      "Industrial-flex inventory linked to tech supply chains",
      "Regional trail and transit access for workforce commutes",
      "Pipeline of mixed-use developments supporting amenities",
    ],
    faqs: buildFAQs("Redmond Tech Corridor"),
    seo: {
      title: "Redmond Tech Corridor 1031 Exchange Support | 1031 Exchange Seattle",
      description:
        "Identify Redmond, WA tech corridor replacement properties with verified tenants, debt alignment, and exchange compliance.",
    },
  },
  "ballard-maritime-district": {
    slug: "ballard-maritime-district",
    overview:
      "Ballard Maritime District delivers industrial, maritime, and mixed-use investment opportunities anchored by port access and established neighborhoods.",
    highlights: [
      "Maritime industrial assets with long-term tenants",
      "Adaptive reuse opportunities in historic structures",
      "Proximity to residential demand supporting retail",
      "Active small business community sustaining occupancy",
    ],
    faqs: buildFAQs("Ballard Maritime District"),
    seo: {
      title: "Ballard Maritime District 1031 Exchange Support | 1031 Exchange Seattle",
      description:
        "Exchange into Ballard, WA assets with maritime industrial tenants, adaptive reuse options, and compliance support.",
    },
  },
  "capitol-hill-pike-pine": {
    slug: "capitol-hill-pike-pine",
    overview:
      "Capitol Hill Pike-Pine combines retail, entertainment, and multifamily density, providing exchange investors with high foot traffic and resilient rental demand.",
    highlights: [
      "Street retail with strong local and regional operators",
      "Multifamily assets with consistent lease-up velocity",
      "Creative office conversions attracting high-growth tenants",
      "Nightlife and cultural institutions that anchor visitation",
    ],
    faqs: buildFAQs("Capitol Hill Pike-Pine"),
    seo: {
      title: "Capitol Hill Pike-Pine 1031 Exchange Support | 1031 Exchange Seattle",
      description:
        "Target Capitol Hill, WA replacement properties with lifestyle-driven tenants, underwriting, and timeline control.",
    },
  },
  "fremont-innovation-hub": {
    slug: "fremont-innovation-hub",
    overview:
      "Fremont Innovation Hub hosts tech, creative office, and specialty retail in an urban village setting, providing diversification for exchange investors.",
    highlights: [
      "Creative office space with innovation tenants",
      "Retail and restaurant mix catering to daytime and evening crowds",
      "Cycling and transit connectivity supporting sustainability mandates",
      "Opportunities for adaptive reuse and infill development",
    ],
    faqs: buildFAQs("Fremont Innovation Hub"),
    seo: {
      title: "Fremont Innovation Hub 1031 Exchange Support | 1031 Exchange Seattle",
      description:
        "Invest in Fremont, WA replacement properties with creative office demand, retail performance, and structured underwriting.",
    },
  },
  "issaquah-highlands": {
    slug: "issaquah-highlands",
    overview:
      "Issaquah Highlands combines master-planned residential, medical, and retail assets with strong household incomes and sustained population growth.",
    highlights: [
      "Medical office and urgent care facilities serving the plateau",
      "Grocery-anchored retail with daily-needs traffic",
      "Multifamily communities with high retention",
      "Outdoor access and trail systems supporting lifestyle demand",
    ],
    faqs: buildFAQs("Issaquah Highlands"),
    seo: {
      title: "Issaquah Highlands 1031 Exchange Support | 1031 Exchange Seattle",
      description:
        "Source Issaquah, WA replacement assets with medical office, retail, and multifamily stability backed by data-rich underwriting.",
    },
  },
  "mercer-island-town-center": {
    slug: "mercer-island-town-center",
    overview:
      "Mercer Island Town Center offers low-vacancy retail, medical, and office properties supported by affluent households and central lake positioning.",
    highlights: [
      "Limited supply of high-credit retail and office",
      "Medical office clusters serving island residents",
      "Convenient access to Seattle and Bellevue job centers",
      "Stable rent growth supported by household incomes",
    ],
    faqs: buildFAQs("Mercer Island Town Center"),
    seo: {
      title: "Mercer Island Town Center 1031 Exchange Support | 1031 Exchange Seattle",
      description:
        "Invest in Mercer Island, WA replacement properties with high-income demographics, underwriting, and deadline controls.",
    },
  },
};

// Process template variables in locationDetails
export const locationDetails = processTemplateVars(locationDetailsRaw) as Record<string, LocationDetail>;

export const featuredServicesForLocations = servicesData.slice(0, 6);

