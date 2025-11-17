import {
  PageLayoutVariant,
  LayoutAssignments,
  ServiceItem,
  LocationItem,
} from "./types";
import { servicesData } from "./services";
import { locationsData } from "./locations";

export const serviceVariants: PageLayoutVariant[] = [
  {
    key: "classic",
    label: "Classic",
    description: "Traditional layout with hero, description, FAQs, and CTA",
    sections: ["hero", "description", "inclusions", "faqs", "cta"],
    features: {
      toc: false,
      stickyCta: true,
      sidebar: false,
      heroStyle: "gradient",
    },
  },
  {
    key: "detailed",
    label: "Detailed",
    description: "Comprehensive layout with table of contents and sidebar",
    sections: ["hero", "toc", "description", "inclusions", "commonSituations", "faqs", "compliance", "cta"],
    features: {
      toc: true,
      stickyCta: false,
      sidebar: true,
      heroStyle: "image",
    },
  },
  {
    key: "focused",
    label: "Focused",
    description: "Streamlined layout emphasizing key information",
    sections: ["hero", "description", "inclusions", "faqs", "exampleCapability", "cta"],
    features: {
      toc: false,
      stickyCta: true,
      sidebar: false,
      heroStyle: "abstract",
    },
  },
  {
    key: "educational",
    label: "Educational",
    description: "Education-focused layout with expanded FAQs and resources",
    sections: ["hero", "description", "faqs", "compliance", "resources", "cta"],
    features: {
      toc: false,
      stickyCta: false,
      sidebar: false,
      heroStyle: "gradient",
    },
  },
  {
    key: "comparison",
    label: "Comparison",
    description: "Layout highlighting differences and common situations",
    sections: ["hero", "description", "commonSituations", "inclusions", "faqs", "cta"],
    features: {
      toc: false,
      stickyCta: true,
      sidebar: false,
      heroStyle: "abstract",
    },
  },
  {
    key: "minimal",
    label: "Minimal",
    description: "Clean minimal layout with essential information only",
    sections: ["hero", "description", "inclusions", "faqs", "cta"],
    features: {
      toc: false,
      stickyCta: false,
      sidebar: false,
      heroStyle: "gradient",
    },
  },
];

export const locationVariants: PageLayoutVariant[] = [
  {
    key: "map-first",
    label: "Map First",
    description: "Map-focused layout with location details",
    sections: ["hero", "map", "description", "popularPaths", "faqs", "cta"],
    features: {
      toc: false,
      stickyCta: true,
      sidebar: false,
      heroStyle: "map",
    },
  },
  {
    key: "detailed-location",
    label: "Detailed Location",
    description: "Comprehensive location information layout",
    sections: ["hero", "description", "popularPaths", "faqs", "exampleCapability", "cta"],
    features: {
      toc: false,
      stickyCta: false,
      sidebar: false,
      heroStyle: "image",
    },
  },
  {
    key: "paths-focused",
    label: "Paths Focused",
    description: "Emphasizes popular exchange paths for the location",
    sections: ["hero", "popularPaths", "description", "faqs", "cta"],
    features: {
      toc: false,
      stickyCta: true,
      sidebar: false,
      heroStyle: "gradient",
    },
  },
  {
    key: "compact",
    label: "Compact",
    description: "Condensed layout with essential location information",
    sections: ["hero", "description", "popularPaths", "faqs", "cta"],
    features: {
      toc: false,
      stickyCta: false,
      sidebar: false,
      heroStyle: "abstract",
    },
  },
  {
    key: "market-focused",
    label: "Market Focused",
    description: "Highlights market conditions and exchange drivers",
    sections: ["hero", "description", "popularPaths", "faqs", "exampleCapability", "cta"],
    features: {
      toc: false,
      stickyCta: true,
      sidebar: false,
      heroStyle: "image",
    },
  },
  {
    key: "simple",
    label: "Simple",
    description: "Straightforward location page layout",
    sections: ["hero", "description", "faqs", "cta"],
    features: {
      toc: false,
      stickyCta: false,
      sidebar: false,
      heroStyle: "gradient",
    },
  },
];

function assignLayoutsRoundRobin<T extends { slug: string }>(
  items: T[],
  variants: PageLayoutVariant[]
): Record<string, string> {
  const assignments: Record<string, string> = {};
  let variantIndex = 0;
  let lastVariant = "";

  items.forEach((item) => {
    let selectedVariant = variants[variantIndex % variants.length];
    
    if (selectedVariant.key === lastVariant) {
      variantIndex++;
      selectedVariant = variants[variantIndex % variants.length];
    }
    
    assignments[item.slug] = selectedVariant.key;
    lastVariant = selectedVariant.key;
    variantIndex++;
  });

  return assignments;
}

export const assignments: LayoutAssignments = {
  services: assignLayoutsRoundRobin(servicesData, serviceVariants),
  locations: assignLayoutsRoundRobin(locationsData, locationVariants),
};

