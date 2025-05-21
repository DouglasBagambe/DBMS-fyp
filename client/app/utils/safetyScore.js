// client/app/utils/safetyScore.js

/**
 * Incident weights for safety score calculation
 * Higher weight means more impact on safety score
 */
const INCIDENT_WEIGHTS = {
  1: 5.0, // Phone usage (very high risk)
  2: 3.0, // Cigarette usage (moderate risk)
  3: 4.0, // Seatbelt violation (high risk)
  4: 5.0, // Drowsiness (very high risk)
};

/**
 * Base score that all drivers start with
 */
const BASE_SAFETY_SCORE = 100;

/**
 * Maximum deductions allowed (to maintain minimum score)
 */
const MAX_DEDUCTION = 80;

/**
 * Calculate safety score based on incidents and trips
 *
 * @param {Array} incidents - List of incidents
 * @param {Array} trips - List of completed trips
 * @param {Object} options - Additional options for calculation
 * @returns {Object} Safety score information
 */
export const calculateSafetyScore = (
  incidents = [],
  trips = [],
  options = {}
) => {
  // Default options
  const config = {
    timeWindow: 30, // days to consider for recent incidents
    bonusPerSafeTrip: 0.1, // points gained per safe trip
    maxBonus: 20, // maximum bonus points possible
    timeDecay: true, // whether older incidents count less
    ...options,
  };

  // Filter to incidents with valid incident numbers
  const validIncidents = incidents.filter(
    (incident) => incident.incident_no && INCIDENT_WEIGHTS[incident.incident_no]
  );

  // Count completed trips
  const completedTrips = trips.filter(
    (trip) => trip.status === "completed" && trip.end_time
  );

  // Calculate time decay factor if enabled
  const calculateTimeDecay = (date) => {
    if (!config.timeDecay) return 1.0;

    const now = new Date();
    const incidentDate = new Date(date);
    const daysAgo = Math.max(0, (now - incidentDate) / (1000 * 60 * 60 * 24));

    // Incidents in the last 7 days count fully
    if (daysAgo < 7) return 1.0;

    // Incidents older than the time window don't count
    if (daysAgo > config.timeWindow) return 0.0;

    // Linear decay between 7 days and time window
    return 1.0 - (daysAgo - 7) / (config.timeWindow - 7);
  };

  // Calculate incident penalty
  let totalPenalty = 0;
  const incidentBreakdown = {};

  validIncidents.forEach((incident) => {
    const weight = INCIDENT_WEIGHTS[incident.incident_no];
    const decayFactor = calculateTimeDecay(
      incident.created_at || incident.timestamp
    );
    const penalty = weight * decayFactor;

    // Add to total penalty
    totalPenalty += penalty;

    // Track for breakdown
    const type = incident.incident_no;
    if (!incidentBreakdown[type]) {
      incidentBreakdown[type] = { count: 0, penalty: 0 };
    }
    incidentBreakdown[type].count++;
    incidentBreakdown[type].penalty += penalty;
  });

  // Cap the penalty at MAX_DEDUCTION
  totalPenalty = Math.min(totalPenalty, MAX_DEDUCTION);

  // Calculate bonus for safe trips
  const safeTripsCount = completedTrips.length;
  const safeTripsBonus = Math.min(
    safeTripsCount * config.bonusPerSafeTrip,
    config.maxBonus
  );

  // Calculate final score
  const rawScore = BASE_SAFETY_SCORE - totalPenalty + safeTripsBonus;
  const finalScore = Math.round(Math.max(0, Math.min(100, rawScore)));

  // Calculate incident ratio (incidents per trip)
  const incidentRatio =
    safeTripsCount > 0
      ? validIncidents.length / safeTripsCount
      : validIncidents.length;

  // Calculate safety rating label
  let safetyRating;
  if (finalScore >= 90) safetyRating = "Excellent";
  else if (finalScore >= 80) safetyRating = "Good";
  else if (finalScore >= 70) safetyRating = "Satisfactory";
  else if (finalScore >= 60) safetyRating = "Needs Improvement";
  else safetyRating = "Critical";

  // Return comprehensive safety information
  return {
    score: finalScore,
    rating: safetyRating,
    basePenalty: totalPenalty,
    safeTripsBonus,
    incidentBreakdown,
    incidentCount: validIncidents.length,
    tripCount: safeTripsCount,
    incidentRatio: parseFloat(incidentRatio.toFixed(2)),
    lastUpdated: new Date().toISOString(),
  };
};

/**
 * Get severity level based on safety score
 *
 * @param {Number} score - Safety score
 * @returns {String} Severity level (low, medium, high)
 */
export const getScoreSeverity = (score) => {
  if (score >= 80) return "low";
  if (score >= 60) return "medium";
  return "high";
};

/**
 * Get color scheme based on safety score
 *
 * @param {Number} score - Safety score
 * @returns {Object} Color scheme for UI elements
 */
export const getScoreColorScheme = (score) => {
  if (score >= 90)
    return {
      text: "text-green-600 dark:text-green-400",
      bg: "bg-green-500",
      bgLight: "bg-green-100 dark:bg-green-900/30",
      border: "border-green-500",
    };
  if (score >= 80)
    return {
      text: "text-green-600 dark:text-green-400",
      bg: "bg-green-500",
      bgLight: "bg-green-100 dark:bg-green-900/30",
      border: "border-green-500",
    };
  if (score >= 70)
    return {
      text: "text-yellow-600 dark:text-yellow-400",
      bg: "bg-yellow-500",
      bgLight: "bg-yellow-100 dark:bg-yellow-900/30",
      border: "border-yellow-500",
    };
  if (score >= 60)
    return {
      text: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500",
      bgLight: "bg-amber-100 dark:bg-amber-900/30",
      border: "border-amber-500",
    };
  return {
    text: "text-red-600 dark:text-red-400",
    bg: "bg-red-500",
    bgLight: "bg-red-100 dark:bg-red-900/30",
    border: "border-red-500",
  };
};
