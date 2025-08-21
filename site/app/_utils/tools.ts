import { Month, Months } from "./types";
/**
 * Converts a 0-based integer (0 = January) to a Month string.
 */
export function intToMonth(index: number): Month | undefined {
  return Months[index];
}

/**
 * Converts a Month string to a 0-based integer (0 = January).
 */
export function monthToInt(month: Month): number {
  return Months.indexOf(month.toLowerCase() as Month);
}

export function objectToUrlParams(obj: Record<string, any>): string {
  const params = Object.entries(obj)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        key + '=' + String(value)
    )
    .join('&');
  return params;
}

export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
  );
}



