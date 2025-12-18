/**
 * Utility functions for handling numbers in Arabic and English
 */

// Map of Arabic-Indic digits to Western digits
const arabicToWesternMap: Record<string, string> = {
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
};

/**
 * Convert Arabic-Indic numerals to Western numerals
 * Example: "٣٠" -> "30", "١٢٣" -> "123"
 */
export function convertArabicToWesternNumerals(input: string): string {
  if (typeof input !== 'string') return input;
  
  return input.replace(/[٠-٩]/g, (match) => arabicToWesternMap[match] || match);
}

/**
 * Sanitize numeric input - converts Arabic numerals and ensures valid number format
 */
export function sanitizeNumericInput(value: any): string | number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  // Convert to string first
  const strValue = String(value);
  
  // Convert Arabic numerals to Western
  const westernValue = convertArabicToWesternNumerals(strValue);
  
  // Remove any non-numeric characters except decimal point, minus sign, and scientific notation
  const cleaned = westernValue.replace(/[^\d.e\-+]/gi, '');
  
  // If it's empty after cleaning, return null
  if (!cleaned) {
    return null;
  }
  
  // Try to parse as number
  const parsed = parseFloat(cleaned);
  
  // Return parsed number if valid, otherwise return cleaned string
  return isNaN(parsed) ? cleaned : parsed;
}

/**
 * Convert form data numerals from Arabic to Western for all numeric fields
 */
export function sanitizeFormData(
  formData: Record<string, any>,
  fields: Array<{ id: string; type: string }>
): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(formData)) {
    const field = fields.find(f => f.id === key);
    
    // If it's a number field, sanitize the input
    if (field && field.type === 'number') {
      sanitized[key] = sanitizeNumericInput(value);
    } else if (typeof value === 'string') {
      // For text fields, still convert Arabic numerals but keep as string
      sanitized[key] = convertArabicToWesternNumerals(value);
    } else {
      // Keep other types as-is
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}
