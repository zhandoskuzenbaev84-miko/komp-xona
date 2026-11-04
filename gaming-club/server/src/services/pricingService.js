/**
 * Pricing Engine conforming strictly to the specification in malumot.md
 *
 * Rates:
 * PC Station:
 *   - 1 Hour: 10,000 UZS
 *   - 2 Hours Block: 17,000 UZS (saves 3,000 UZS per 2-hour block)
 *   - Formula: (Math.floor(hours / 2) * 17000) + ((hours % 2) * 10000)
 *
 * PS5 VIP Room:
 *   - 1 Hour: 45,000 UZS
 *   - 2 Hours Block: 80,000 UZS (saves 10,000 UZS per 2-hour block)
 *   - Formula: (Math.floor(hours / 2) * 80000) + ((hours % 2) * 45000)
 *
 * Bulk / Team Booking Rule (5+ Stations):
 *   - If station count >= 5:
 *     - Automatically grant +1 Hour FREE Bonus to all booked stations
 *     - totalDuration = requestedHours + 1, but client only pays for requestedHours
 */

export const PC_HOURLY_RATE = 10000;
export const PC_TWO_HOUR_BLOCK_RATE = 17000;

export const PS_HOURLY_RATE = 45000;
export const PS_TWO_HOUR_BLOCK_RATE = 80000;

/**
 * Calculate cost for a single station for specified hours
 */
export const calculateSingleStationPrice = (stationType, hours) => {
  const isPC = stationType.toUpperCase().includes('PC');
  const isPS = stationType.toUpperCase().includes('PS');

  if (isPC) {
    const basePrice = hours * PC_HOURLY_RATE;
    const finalPrice = Math.floor(hours / 2) * PC_TWO_HOUR_BLOCK_RATE + (hours % 2) * PC_HOURLY_RATE;
    const tieredDiscount = basePrice - finalPrice;
    return {
      type: 'PC',
      basePrice,
      finalPrice,
      tieredDiscount,
      hourlyRate: PC_HOURLY_RATE,
    };
  }

  if (isPS) {
    const basePrice = hours * PS_HOURLY_RATE;
    const finalPrice = Math.floor(hours / 2) * PS_TWO_HOUR_BLOCK_RATE + (hours % 2) * PS_HOURLY_RATE;
    const tieredDiscount = basePrice - finalPrice;
    return {
      type: 'PS5',
      basePrice,
      finalPrice,
      tieredDiscount,
      hourlyRate: PS_HOURLY_RATE,
    };
  }

  // Fallback default
  return {
    type: stationType,
    basePrice: hours * PC_HOURLY_RATE,
    finalPrice: hours * PC_HOURLY_RATE,
    tieredDiscount: 0,
    hourlyRate: PC_HOURLY_RATE,
  };
};

/**
 * Master calculation utility conforming strictly to Business Rules & Pricing Engine
 * @param {Array<Object|string>} stations - Array of station objects or station types
 * @param {number} requestedHours - Number of hours user requested (billable)
 * @returns {Object} Full breakdown of the price, discounts, and duration
 */
export const calculateBookingSummary = (stations = [], requestedHours = 1) => {
  const hours = Math.max(1, parseInt(requestedHours, 10) || 1);
  const stationCount = Array.isArray(stations) ? stations.length : Math.max(1, parseInt(stations, 10) || 1);

  let totalBasePrice = 0;
  let totalTieredDiscount = 0;
  let totalFinalPrice = 0;
  const breakdown = [];

  const stationList = Array.isArray(stations) && stations.length > 0
    ? stations
    : Array(stationCount).fill({ type: 'PC' });

  for (const st of stationList) {
    const type = typeof st === 'string' ? st : (st.type || 'PC');
    const stationPricing = calculateSingleStationPrice(type, hours);
    totalBasePrice += stationPricing.basePrice;
    totalTieredDiscount += stationPricing.tieredDiscount;
    totalFinalPrice += stationPricing.finalPrice;
    breakdown.push({
      stationId: st.id || st.code || null,
      type: stationPricing.type,
      singleFinalPrice: stationPricing.finalPrice,
      singleBasePrice: stationPricing.basePrice,
      singleDiscount: stationPricing.tieredDiscount,
    });
  }

  // Bulk / Team Booking Rule (5+ Stations)
  const isBulkBooking = stationCount >= 5;
  const bonusHours = isBulkBooking ? 1 : 0;
  const totalDurationHours = hours + bonusHours;

  return {
    stationCount,
    requestedHours: hours,
    bonusHours,
    totalDurationHours,
    isBulkDiscountApplied: isBulkBooking,
    bonusDescription: isBulkBooking
      ? '🎉 Bulk Team Booking Perk: +1 FREE Bonus Hour applied to all stations!'
      : null,
    basePrice: totalBasePrice,
    tieredDiscount: totalTieredDiscount,
    finalPrice: totalFinalPrice,
    breakdown,
  };
};
