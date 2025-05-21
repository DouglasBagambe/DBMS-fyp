/**
 * Utility functions for incident management
 */

// Constants for incident types
export const INCIDENT_TYPES = {
  1: {
    type: "PHONE_USAGE",
    message: "Phone usage detected",
    severity: "high",
    displayName: "Phone Usage",
    title: "Phone Use Detected",
    description: "Driver was using mobile phone while driving",
    action: "Review distracted driving policy",
  },
  2: {
    type: "CIGARETTE",
    message: "Cigarette usage detected",
    severity: "medium",
    displayName: "Cigarette Usage",
    title: "Cigarette Usage Detected",
    description: "Driver was smoking while driving",
    action: "Review vehicle smoking policy",
  },
  3: {
    type: "SEATBELT",
    message: "Seatbelt violation detected",
    severity: "medium",
    displayName: "Seatbelt Violation",
    title: "Seatbelt Violation",
    description: "Driver was not wearing seatbelt",
    action: "Review safety protocols",
  },
  4: {
    type: "DROWSINESS",
    message: "Driver drowsiness detected",
    severity: "high",
    displayName: "Drowsiness",
    title: "Drowsiness Detected",
    description: "Driver appears to be drowsy or falling asleep",
    action: "Suggest driver takes a break",
  },
};

/**
 * Get incident type information based on incident number
 * @param {number} incidentNo - The incident number (1-4)
 * @returns {Object|null} Incident type information or null if not found
 */
export const getIncidentInfo = (incidentNo) => {
  // Convert string incident numbers to numeric
  const numIncidentNo =
    typeof incidentNo === "string" ? parseInt(incidentNo, 10) : incidentNo;

  return INCIDENT_TYPES[numIncidentNo] || null;
};

/**
 * Convert between incident_type strings and incident_no numbers
 * @param {string|number} value - Incident type string or number
 * @returns {Object} Object with incident_no and normalized value
 */
export const normalizeIncidentType = (value) => {
  // If it's already a number between 1-4, return it
  if (typeof value === "number" && value >= 1 && value <= 4) {
    return { incident_no: value, normalized: true };
  }

  // If it's a string that can be parsed directly to a valid incident number
  if (typeof value === "string") {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= 4) {
      return { incident_no: num, normalized: true };
    }

    // Convert to lowercase for case-insensitive matching of text types
    const lowerType = value.toLowerCase().trim();

    // Map text descriptions to incident numbers
    if (lowerType.includes("phone") || lowerType === "phone usage") {
      return { incident_no: 1, normalized: true }; // Phone usage
    }

    if (lowerType.includes("cigarette") || lowerType.includes("smoking")) {
      return { incident_no: 2, normalized: true }; // Cigarette
    }

    if (
      lowerType.includes("seatbelt") ||
      lowerType.includes("belt") ||
      lowerType === "seatbelt absence" ||
      lowerType === "no seatbelt"
    ) {
      return { incident_no: 3, normalized: true }; // Seatbelt
    }

    if (
      lowerType.includes("sleep") ||
      lowerType.includes("drowsy") ||
      lowerType === "sleepy" ||
      lowerType === "drowsiness"
    ) {
      return { incident_no: 4, normalized: true }; // Drowsiness
    }
  }

  // Default to seatbelt (3) as most common violation if we can't determine
  console.log("Unknown incident type, defaulting to Seatbelt (3):", value);
  return { incident_no: 3, normalized: false };
};
