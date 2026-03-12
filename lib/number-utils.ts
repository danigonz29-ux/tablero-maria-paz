/**
 * Parse a number string that may use periods or commas as thousand separators.
 * Examples: "4.003.624" => 4003624, "4,003,624" => 4003624, "1234" => 1234, "" => 0
 */
export function parseLocalNumber(raw: string): number {
  if (!raw || raw.trim() === "") return 0;
  // Remove spaces
  let cleaned = raw.trim();

  // Determine if we have both . and , => figure out which is decimal
  const hasDot = cleaned.includes(".");
  const hasComma = cleaned.includes(",");

  if (hasDot && hasComma) {
    // If comma appears after last dot, comma is decimal separator
    const lastDot = cleaned.lastIndexOf(".");
    const lastComma = cleaned.lastIndexOf(",");
    if (lastComma > lastDot) {
      // 1.234,56 => dots are thousand sep, comma is decimal
      cleaned = cleaned.replace(/\./g, "").replace(",", ".");
    } else {
      // 1,234.56 => commas are thousand sep, dot is decimal
      cleaned = cleaned.replace(/,/g, "");
    }
  } else if (hasComma) {
    // Could be decimal or thousand separator
    // If there's only one comma and it's followed by 1-2 digits at end, treat as decimal
    const parts = cleaned.split(",");
    if (parts.length === 2 && parts[1].length <= 2) {
      cleaned = cleaned.replace(",", ".");
    } else {
      cleaned = cleaned.replace(/,/g, "");
    }
  } else if (hasDot) {
    // Could be decimal or thousand separator
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      // Multiple dots = thousand separators (e.g. "4.003.624")
      cleaned = cleaned.replace(/\./g, "");
    }
    // Single dot with 1-2 digits after = decimal (default JS behavior)
  }

  const num = Number(cleaned);
  if (isNaN(num)) return 0;
  if (num < 0) return 0;
  return Math.round(num);
}

/**
 * Format a number with dots as thousand separators (Latin American style).
 */
export function formatNumber(n: number): string {
  return n.toLocaleString("es-CL");
}
