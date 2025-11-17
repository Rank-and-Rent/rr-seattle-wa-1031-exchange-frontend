import site from "@/content/site.json";
import { getPrimaryMarket } from "@/lib/market";

const { city: PRIMARY_CITY, state: PRIMARY_STATE_ABBR } = getPrimaryMarket();
const PRIMARY_STATE_FULL = "Washington";

export { PRIMARY_STATE_ABBR };

const canonicalFromSite = () => {
  const raw = site.website?.trim();
  if (!raw) {
    return "https://www.1031exchangeseattle.com/";
  }
  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw.endsWith("/") ? raw : `${raw}/`;
  }
  return `https://${raw}${raw.endsWith("/") ? "" : "/"}`;
};

const safeDigits = (value: string) => value.replace(/\D/g, "");

export const CANONICAL_URL = canonicalFromSite();

export const COMPANY_NAME = site.company;
export const PHONE = site.phone;
export const PHONE_DIGITS = safeDigits(site.phoneDigits || site.phone);
export const EMAIL = site.email;
export const ADDRESS = site.address;
export const ADDRESS_CITY = site.mainCity ?? PRIMARY_CITY;
export const ADDRESS_STATE = site.state ?? PRIMARY_STATE_ABBR;

export const PRIMARY_MARKET = {
  city: PRIMARY_CITY,
  stateAbbr: PRIMARY_STATE_ABBR,
  stateFull: PRIMARY_STATE_FULL,
};

export const BUSINESS_HOURS =
  "Monday–Friday, 8:00 AM to 6:00 PM Pacific Time";

export const SOURCE_LABEL =
  process.env.NEXT_PUBLIC_SOURCE || "1031 Exchange Seattle Website";

