import { parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * REPO #5 / Phone Security & Anti-Spam Validation Engine (libphonenumber-js ⭐ 17k+)
 * 
 * Capabilities:
 * 1. Strict Indian Telecom (+91) Mobile Validation
 * 2. Auto-formatting into clean national format (e.g. +91 98112 34567)
 * 3. Smart Anti-Scam Masking (e.g. +91 98*** **456) when 'Sold It' or logged out
 */

export function validateIndianMobile(rawPhone) {
  if (!rawPhone) return { isValid: false, formatted: "", error: "कृपया मोबाइल नंबर दर्ज करें" };

  try {
    const phoneNumber = parsePhoneNumberFromString(rawPhone.toString(), "IN");
    if (!phoneNumber) {
      return { isValid: false, formatted: rawPhone, error: "अमान्य मोबाइल नंबर प्रारूप" };
    }

    const isValid = phoneNumber.isValid() && phoneNumber.country === "IN";
    return {
      isValid,
      formatted: phoneNumber.formatInternational(), // e.g. "+91 98112 34567"
      national: phoneNumber.formatNational(),       // e.g. "098112 34567"
      uri: phoneNumber.getURI(),                     // e.g. "tel:+919811234567"
      number: phoneNumber.number,                    // e.g. "+919811234567"
      error: isValid ? "" : "कृपया 10 अंकों का वैध भारतीय मोबाइल नंबर डालें"
    };
  } catch (err) {
    return { isValid: false, formatted: rawPhone, error: "फोन नंबर सत्यापन में त्रुटि" };
  }
}

/**
 * Privacy & Anti-Scam Number Masking
 * Hides middle digits for unauthenticated users or when 'Sold It' is enabled
 */
export function maskPhoneNumber(rawPhone) {
  if (!rawPhone) return "******";
  const str = rawPhone.toString().trim();
  if (str.length < 8) return "******";

  // Retain country code and first 2 + last 3 digits
  const parts = str.split(" ");
  if (parts.length >= 2) {
    const prefix = parts.slice(0, -1).join(" ");
    const num = parts[parts.length - 1];
    return `${prefix} ${num.slice(0, 2)}*** *${num.slice(-2)}`;
  }

  return str.slice(0, 4) + " **** " + str.slice(-3);
}
