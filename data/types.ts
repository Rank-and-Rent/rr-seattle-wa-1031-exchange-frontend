export type Slug = string;

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ServiceItem {
  slug: Slug;
  name: string;
  short: string;
  route: Slug;
  category: string;
  keywords: string[];
}

export interface ServiceDetail {
  slug: Slug;
  headline: string;
  summary: string;
  outcomes: string[];
  deliverables: string[];
  timeline: string[];
  faqs: FAQItem[];
  seo: {
    title: string;
    description: string;
  };
}

export interface LocationItem {
  slug: Slug;
  name: string;
  route: Slug;
  type: "city" | "neighborhood" | "suburb" | "district" | "remote";
  image?: string;
}

export interface LocationDetail {
  slug: Slug;
  overview: string;
  highlights: string[];
  faqs: FAQItem[];
  seo: {
    title: string;
    description: string;
  };
}

export interface PropertyTypeItem {
  slug: Slug;
  name: string;
  route: Slug;
  summary: string;
  focusAreas: string[];
  heroImage?: string;
}

export interface PropertyTypeDetail {
  slug: Slug;
  overview: string;
  highlights: string[];
  faqs: FAQItem[];
  seo: {
    title: string;
    description: string;
  };
}

export interface InventoryCategory {
  slug: Slug;
  name: string;
  route: Slug;
  note?: string;
  heroImage?: string;
}

export interface ResourceLink {
  key: string;
  label: string;
  href: string;
}

export interface PageLayoutVariant {
  key: string;
  label: string;
  description: string;
  sections: string[];
  features?: {
    toc?: boolean;
    stickyCta?: boolean;
    sidebar?: boolean;
    heroStyle?: "image" | "gradient" | "map" | "abstract";
    schema?: string[];
  };
}

export interface LayoutAssignments {
  services: Record<string, string>;
  locations: Record<string, string>;
}

export interface ServiceBatchItem {
  layoutKey: string;
  mainDescription: string;
  faqs: Array<{ question: string; answer: string }>;
  inclusions: string[];
  commonSituations: string[];
  complianceNote: string;
  exampleCapability: {
    disclaimer: string;
    serviceType: string;
    location: string;
    scope: string;
    clientSituation: string;
    ourApproach: string;
    expectedOutcome: string;
    contactCTA: string;
  };
}

export interface LocationBatchItem {
  layoutKey: string;
  mainDescription: string;
  popularPaths: Array<{
    rank: number;
    type: "service" | "propertyType";
    slug: string;
    name: string;
    whyPopular: string;
  }>;
  faqs: Array<{ question: string; answer: string }>;
  exampleCapability: {
    disclaimer: string;
    location: string;
    situation: string;
    ourApproach: string;
    expectedOutcome: string;
  };
}

export interface InventorySpotlightItem {
  type: string;
  title: string;
  copy: string;
  ctaLabel: string;
  href: string;
  note?: string;
  heroImage?: string;
}

