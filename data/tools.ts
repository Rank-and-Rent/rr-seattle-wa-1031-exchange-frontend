export type ToolInfo = {
  name: string;
  slug: string;
  description: string;
  summary: string;
  icon: "calculator" | "scale" | "identification";
};

export const toolsData: ToolInfo[] = [
  {
    name: "Boot Calculator",
    slug: "boot-calculator",
    description:
      "Model cash boot, mortgage boot, and estimated tax exposure on a Seattle 1031 exchange.",
    summary:
      "Quantify cash and debt boot exposure to understand potential tax owed after your exchange.",
    icon: "calculator",
  },
  {
    name: "Exchange Cost Estimator",
    slug: "exchange-cost-estimator",
    description:
      "Estimate qualified intermediary, escrow, title, and recording fees for a 1031 exchange in Washington.",
    summary:
      "Project intermediary, title, escrow, and recording costs tailored to Pacific Northwest exchanges.",
    icon: "scale",
  },
  {
    name: "Identification Rules Checker",
    slug: "identification-rules-checker",
    description:
      "Verify whether your property identification strategy satisfies the 3-property, 200%, or 95% rules.",
    summary:
      "Validate property counts and fair market values against IRS identification rule thresholds.",
    icon: "identification",
  },
];

export const toolsRouteBase = "/tools";

export const getToolBySlug = (slug: string) =>
  toolsData.find((tool) => tool.slug === slug);

