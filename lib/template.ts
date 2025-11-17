import { getPrimaryMarket } from "@/lib/market";

/**
 * Replaces template variables in strings with actual values.
 * Supports ${PRIMARY_CITY} and ${PRIMARY_STATE_ABBR} variables.
 */
export function replaceTemplateVars(text: string): string {
  const { city, state } = getPrimaryMarket();
  
  return text
    .replace(/\$\{PRIMARY_CITY\}/g, city)
    .replace(/\$\{PRIMARY_STATE_ABBR\}/g, state);
}

/**
 * Recursively processes an object to replace template variables in all string values.
 */
export function processTemplateVars<T>(obj: T): T {
  if (typeof obj === "string") {
    return replaceTemplateVars(obj) as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(processTemplateVars) as T;
  }
  
  if (obj && typeof obj === "object") {
    const processed = {} as T;
    for (const [key, value] of Object.entries(obj)) {
      (processed as Record<string, unknown>)[key] = processTemplateVars(value);
    }
    return processed;
  }
  
  return obj;
}

