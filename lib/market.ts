import site from "@/content/site.json";

const FALLBACK_CITY = "PRIMARY_CITY";
const FALLBACK_STATE = "PRIMARY_STATE_ABBR";

export const getPrimaryMarket = () => {
  const city = site?.mainCity?.trim();
  const state = site?.state?.trim();

  return {
    city: city && city.length > 0 ? city : FALLBACK_CITY,
    state: state && state.length > 0 ? state : FALLBACK_STATE,
  } as const;
};
