/**
 * Formats or converts any price string or cached dollar amount into Indian Rupees (INR / ₹)
 */
export function formatINR(price: string | number | undefined | null): string {
  if (!price && price !== 0) return '₹249';

  const priceStr = String(price).trim();

  // If already properly formatted in INR
  if (priceStr.startsWith('₹')) {
    return priceStr;
  }

  // Convert old cached dollar amounts to realistic Indian Rupee amounts
  if (priceStr.includes('$')) {
    if (priceStr.includes('55')) return '₹499';
    if (priceStr.includes('52')) return '₹249';
    if (priceStr.includes('50')) return '₹299';
    if (priceStr.includes('48')) return '₹299';
    if (priceStr.includes('45')) return '₹299';
    if (priceStr.includes('42')) return '₹399/hr';
    if (priceStr.includes('40')) return '₹349/hr';
    if (priceStr.includes('38')) return '₹299';
    if (priceStr.includes('35')) return '₹499';
    if (priceStr.includes('32')) return '₹399/day';
    if (priceStr.includes('28')) return '₹299/hr';
    if (priceStr.includes('25')) return '₹199/walk';

    // Generic fallback for any other dollar value
    const numericOnly = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    if (!isNaN(numericOnly)) {
      if (numericOnly < 100) {
        return `₹${Math.round(numericOnly * 10)}`;
      }
      return `₹${Math.round(numericOnly)}`;
    }
  }

  // Pure numeric string or number
  const num = parseFloat(priceStr);
  if (!isNaN(num)) {
    return `₹${num}`;
  }

  return `₹${priceStr.replace(/^\$+/, '')}`;
}
