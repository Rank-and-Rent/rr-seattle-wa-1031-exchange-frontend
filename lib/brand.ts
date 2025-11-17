import {
  ADDRESS,
  CANONICAL_URL,
  COMPANY_NAME,
  EMAIL,
  PHONE,
  PHONE_DIGITS,
  PRIMARY_MARKET,
  SOURCE_LABEL,
} from "@/lib/config";

const LOGO_URL =
  process.env.NEXT_PUBLIC_BRAND_LOGO ||
  "https://www.1031exchangeseattle.com/file.svg";

export function getBrand() {
  const primary = "#1F3C58";
  const accent = "#4DA49B";
  const dark = "#0E1D2B";

  return {
    subject: "We received your 1031 exchange inquiry",
    preheader:
      "Thanks for reaching out. A Seattle 1031 specialist will reply within one business day.",
    company_name: COMPANY_NAME,
    logo_url: LOGO_URL,
    city_state: `${PRIMARY_MARKET.city}, ${PRIMARY_MARKET.stateAbbr}`,
    brand_accent: accent,
    cta_dark_bg: dark,
    bg_color: "#FFFFFF",
    text_dark: "#0B1722",
    text_muted: "#4A5B6C",
    text_body: "#1F3C58",
    text_faint: "#8FA4B8",
    border_color: "#E2E8F0",
    card_header_bg: "#F5F7FA",

    hero_title: "Your 1031 exchange request is confirmed.",
    hero_subtitle:
      "We will review your goals and follow up shortly with next steps for property identification and compliance.",
    details_title: "Submitted information",

    call_cta_label: "Call Now",
    call_phone: PHONE,
    call_phone_plain: PHONE_DIGITS,
    site_cta_label: "Visit Website",
    site_url: CANONICAL_URL,

    address_line: ADDRESS,
    footer_note:
      "Educational content only. Coordinate with your intermediary, CPA, and legal advisors for final guidance.",
    submitted_date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),

    brand_title: COMPANY_NAME,
    brand_tagline:
      "Seattle 1031 exchange property identification and compliance support.",
    brand_dark_bg: dark,
    brand_gold: accent,
    supportPhone: PHONE,
    supportEmail: EMAIL,
    service_area: `${PRIMARY_MARKET.city} and the Pacific Northwest`,
    portfolio_url: CANONICAL_URL,
    portfolio_blurb:
      "Institutional-grade property identification, underwriting, and timeline management for 1031 investors.",
    intro_copy:
      "We coordinate 1031 exchange identification, diligence, and closing milestones with precise documentation and lender collaboration.",
    source_label: SOURCE_LABEL,
  };
}

