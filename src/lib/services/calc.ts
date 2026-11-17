import {
  getRegionType,
  getDestinationType,
  getPostalZone,
  getChinaPostMainlandParcelZone,
  POSTAL_ZONE_DESCRIPTIONS,
  type CategoryZoneDescriptions,
  type ZoneDescriptions,
} from '../data/regions';

import {
  POSTAGE_RATES,
  RATE_RULES,
  type CategoryRates,
  type DestinationRates,
  type Rate,
  type SteppedRate,
  type FixedRate,
  type ZonalRate,
  type RateTier,
  type SupplementRates,
} from '../data/rates';

import type { MailType, MailCategory } from '../data/mail-types';

export interface RateCalculationDetails {
  rateType: 'fixed' | 'tiered' | 'stepped';
  totalPrice: number;
  baseWeight?: number;
  basePrice?: number;
  stepMinWeight?: number;
  stepMaxWeight?: number;
  additionalWeight?: number;
  weightStep?: number;
  additionalPrice?: number;
  maxWeight?: number;
  zoneDescription?: string;
}

export interface SupplementFees {
  originalPrice: number;
  registrationFee?: number;
  doorstepDeliveryFee?: number;
  insuranceCommission?: number;
  insuranceFee?: number;
  adviceOfReceiptFee?: number;
  posteRestanteFee?: number;
  ruleDiscount?: number;
  stampDiscount?: number;
  discountedPrice?: number;
}

export interface CalculationResult {
  serviceKey: string;
  ruleId?: string;
  details: RateCalculationDetails;
  supplements: SupplementFees;
}

export interface CalculationError {
  errorType: 'service' | 'route' | 'mail_type' | 'mail_category' | 'weight' | 'calculation';
}

// Helper function to get pricing model for a specific mail category
export function getPricingModel(
  mailTypeRate?: Rate | CategoryRates | null,
  mailCategory?: MailCategory,
): Rate | undefined {
  if (!mailTypeRate) return undefined;
  if ('type' in mailTypeRate) return mailTypeRate;
  if (!mailCategory) return undefined;
  return mailTypeRate[mailCategory] ?? mailTypeRate.air;
}

function getOwnSupplementRates(
  mailTypeRate?: Rate | CategoryRates | null,
  mailCategory?: MailCategory,
): SupplementRates {
  const rate = getPricingModel(mailTypeRate, mailCategory);
  if (!rate || !mailTypeRate) return {};

  const common = 'type' in mailTypeRate ? undefined : mailTypeRate.supplements;
  return {
    registrationFee: rate.supplements?.registrationFee ?? common?.registrationFee,
    doorstepDelivery: rate.supplements?.doorstepDelivery ?? common?.doorstepDelivery,
    adviceOfReceipt: rate.supplements?.adviceOfReceipt ?? common?.adviceOfReceipt,
  };
}

export function getSupplementRates(
  mailTypeRate?: Rate | CategoryRates | null,
  destinationRates?: DestinationRates,
  mailCategory?: MailCategory,
): SupplementRates {
  if (!getPricingModel(mailTypeRate, mailCategory)) return {};

  const ownSupplements = getOwnSupplementRates(mailTypeRate, mailCategory);
  return {
    registrationFee:
      ownSupplements.registrationFee ?? destinationRates?.supplements?.registrationFee,
    doorstepDelivery:
      ownSupplements.doorstepDelivery ?? destinationRates?.supplements?.doorstepDelivery,
    adviceOfReceipt:
      ownSupplements.adviceOfReceipt ?? destinationRates?.supplements?.adviceOfReceipt,
  };
}

// Find the best matching rate rule for the given service and destination type
function findBestMatchingRateRule(
  serviceKey: string,
  destinationType: string,
  mailType: MailType,
): string | undefined {
  // Generate possible rule IDs in order of preference (most specific to least specific)
  const possibleRuleIds = [
    // Most specific: service_destination_mailtype
    `${serviceKey}_${destinationType}_${mailType}`,
    // Medium specific: service_destination
    `${serviceKey}_${destinationType}`,
    // Least specific: just service (fallback)
    serviceKey,
  ];

  // Find the first match in RATE_RULES
  for (const ruleId of possibleRuleIds) {
    if (RATE_RULES[ruleId]) {
      return ruleId;
    }
  }

  return undefined;
}

// 主计算函数，根据出发地自动选择邮政服务
export function calculatePostage(
  mailType: MailType,
  fromRegion: string,
  toRegion: string,
  weight: number,
  mailCategory?: MailCategory,
  registeredMail?: boolean,
  doorstepDelivery?: boolean,
  packageValue?: number,
  adviceOfReceipt?: boolean,
  discountRuleIndex?: number,
  stampDiscountPercent?: number,
): CalculationResult | CalculationError {
  // Type guard: check if fromRegionType is a valid RegionCode
  const fromRegionType = getRegionType(fromRegion);
  if (fromRegionType === 'XX') {
    return { errorType: 'service' };
  }

  // Find the service by matching fromRegion
  const serviceData = POSTAGE_RATES[fromRegionType];
  if (!serviceData) {
    return { errorType: 'service' };
  }

  // Determine destination type for rate lookup
  const toRegionType = getRegionType(toRegion);
  const destinationType = getDestinationType(fromRegionType, toRegionType);
  const destinationRates = serviceData.rates[destinationType];
  if (!destinationRates) {
    return { errorType: 'route' };
  }

  const mailTypeRate = destinationRates[mailType];
  if (!mailTypeRate) {
    return { errorType: 'mail_type' };
  }
  const rate = getPricingModel(mailTypeRate, mailCategory);
  if (!rate) {
    return { errorType: mailCategory ? 'mail_type' : 'calculation' };
  }

  // Calculate price based on rate method
  let rateResults: RateCalculationDetails | CalculationError;
  switch (rate.type) {
    case 'stepped':
      rateResults = calculateSteppedRate(rate, weight);
      break;
    case 'fixed':
      rateResults = calculateFixedRate(rate, weight);
      break;
    case 'zonal': {
      const destinationZoneDescriptions =
        POSTAL_ZONE_DESCRIPTIONS[serviceData.nameKey]?.[destinationType];
      let zoneDescriptions: ZoneDescriptions | undefined;
      let zoneNumber: number | undefined;
      if (fromRegionType === 'CN' && destinationType === 'domestic' && mailType === 'parcel') {
        zoneNumber = getChinaPostMainlandParcelZone(fromRegion, toRegion);
        zoneDescriptions = destinationZoneDescriptions as ZoneDescriptions;
      } else {
        const postalZone = getPostalZone(fromRegionType, toRegion);
        if (!postalZone || !mailCategory) {
          return { errorType: 'mail_category' };
        }

        // Determine which zone to use based on mail category and mail type
        const zoneNumberMap = postalZone[mailCategory];
        const letterTag = mailType !== 'letter' ? 'other' : mailType;
        zoneNumber = typeof zoneNumberMap === 'object' ? zoneNumberMap?.[letterTag] : zoneNumberMap;
        zoneDescriptions =
          (destinationZoneDescriptions as CategoryZoneDescriptions)?.[mailCategory]?.[letterTag] ??
          (destinationZoneDescriptions as ZoneDescriptions);
      }

      if (!zoneNumber) {
        return { errorType: 'route' };
      }
      rateResults = calculateZonalRate(rate, weight, zoneNumber, zoneDescriptions);
      break;
    }
  }
  if (!rateResults) {
    console.error(rate);
    return { errorType: 'calculation' };
  } else if ('errorType' in rateResults) {
    return rateResults;
  }

  // Apply supplements
  const supplements = calculateSupplementFees(
    rateResults.totalPrice,
    rate,
    mailTypeRate,
    destinationRates,
    mailCategory,
    registeredMail,
    doorstepDelivery,
    packageValue,
    adviceOfReceipt,
    discountRuleIndex,
    stampDiscountPercent,
  );
  if ('errorType' in supplements) {
    return supplements;
  }

  return {
    serviceKey: serviceData.nameKey,
    ruleId: findBestMatchingRateRule(serviceData.nameKey, destinationType, mailType),
    details: rateResults,
    supplements,
  };
}

function calculateSteppedRate(
  rate: SteppedRate,
  weight: number,
): RateCalculationDetails | CalculationError {
  if (weight > (rate.maxWeight ?? Infinity)) {
    return { errorType: 'weight' };
  }

  // Find the appropriate tier based on weight and baseWeight values
  let tier, baseWeight, nextTier, nextTierBaseWeight;

  for (let i = 0; i < rate.tiers.length; i++) {
    const currentTier = rate.tiers[i];
    baseWeight = currentTier.baseWeight ?? currentTier.weightStep ?? 0;
    nextTier = rate.tiers[i + 1];
    nextTierBaseWeight = nextTier
      ? (nextTier.baseWeight ?? nextTier.weightStep ?? 0)
      : (rate.maxWeight ?? Infinity);

    if (weight <= nextTierBaseWeight) {
      tier = currentTier;
      break;
    }
  }

  if (!tier || baseWeight === undefined) {
    console.error(rate);
    return { errorType: 'weight' };
  }

  return getCalculationDetails(weight, tier, nextTierBaseWeight);
}

function calculateFixedRate(
  rate: FixedRate,
  weight: number,
): RateCalculationDetails | CalculationError {
  if (weight > (rate.maxWeight ?? Infinity)) {
    return { errorType: 'weight' };
  }
  return {
    rateType: 'fixed',
    totalPrice: rate.price,
    basePrice: rate.price,
  };
}

function calculateZonalRate(
  rate: ZonalRate,
  weight: number,
  zoneNumber: number,
  zoneDescriptions?: ZoneDescriptions,
): RateCalculationDetails | CalculationError {
  const zoneRates = rate.zones[zoneNumber];
  if (!zoneRates) {
    return { errorType: 'route' };
  }

  // Check weight limit
  if (zoneRates.maxWeight && weight > zoneRates.maxWeight) {
    return { errorType: 'weight' };
  }

  // Calculate price using zonal rates
  const details = getCalculationDetails(
    weight,
    zoneRates,
    zoneRates.maxWeight ?? zoneRates.baseWeight ?? zoneRates.weightStep ?? 0,
  );
  details.zoneDescription = zoneDescriptions?.[zoneNumber];
  return details;
}

// Calculate supplement fees and discounts
function calculateSupplementFees(
  originalPrice: number,
  rate: Rate,
  mailTypeRate: Rate | CategoryRates,
  destinationRates?: DestinationRates,
  mailCategory?: MailCategory,
  registeredMail?: boolean,
  doorstepDelivery?: boolean,
  packageValue?: number,
  adviceOfReceipt?: boolean,
  discountRuleIndex?: number,
  stampDiscountPercent?: number,
): SupplementFees | CalculationError {
  const supplements: SupplementFees = { originalPrice };
  const supplementRates = getSupplementRates(mailTypeRate, destinationRates, mailCategory);
  // Customer discounts do not apply to insurance charges.
  let discountablePrice = originalPrice;
  let insuranceCharge = 0;

  if (registeredMail) {
    supplements.registrationFee = supplementRates.registrationFee;
    discountablePrice += supplements.registrationFee ?? 0;
  }

  if (doorstepDelivery) {
    supplements.doorstepDeliveryFee = supplementRates.doorstepDelivery;
    discountablePrice += supplements.doorstepDeliveryFee ?? 0;
  }

  if (packageValue) {
    const insuranceRate = getPricingModel(destinationRates?.insurance, mailCategory);
    if (insuranceRate) {
      supplements.insuranceCommission =
        getOwnSupplementRates(destinationRates?.insurance, mailCategory).registrationFee ?? 0;

      const insuranceResult = calculateSteppedRate(insuranceRate as SteppedRate, packageValue);
      if ('errorType' in insuranceResult) {
        return insuranceResult;
      }

      supplements.insuranceFee = insuranceResult.totalPrice;
      insuranceCharge = supplements.insuranceCommission + supplements.insuranceFee;
    }
  }

  if (adviceOfReceipt) {
    supplements.adviceOfReceiptFee = supplementRates.adviceOfReceipt;
    discountablePrice += supplements.adviceOfReceiptFee ?? 0;
  }

  supplements.originalPrice = discountablePrice + insuranceCharge;

  if (discountRuleIndex !== undefined && rate.discounts && rate.discounts[discountRuleIndex]) {
    const discount = rate.discounts[discountRuleIndex];
    supplements.ruleDiscount = ((discount.pricePercent - 100) / 100) * discountablePrice;
    if (discount.maxDiscount !== undefined && supplements.ruleDiscount < -discount.maxDiscount) {
      supplements.ruleDiscount = -discount.maxDiscount;
    }
    supplements.discountedPrice = discountablePrice + supplements.ruleDiscount + insuranceCharge;
  }

  if (stampDiscountPercent && stampDiscountPercent != 100) {
    if (supplements.discountedPrice === undefined) {
      supplements.discountedPrice = supplements.originalPrice;
    }
    supplements.stampDiscount = ((stampDiscountPercent - 100) / 100) * supplements.discountedPrice;
    supplements.discountedPrice += supplements.stampDiscount;
  }

  return supplements;
}

// Calculate price within the tier
function getCalculationDetails(
  weight: number,
  tier: RateTier,
  maxWeight?: number,
): RateCalculationDetails {
  const baseWeight = tier.baseWeight ?? tier.weightStep ?? 0;
  const additionalWeight = weight - baseWeight;
  let totalPrice: number | undefined;
  if (tier.weightStep && tier.additionalPrice) {
    let additionalSteps = 0;
    totalPrice = tier.basePrice ?? tier.additionalPrice;
    if (additionalWeight > 0) {
      additionalSteps = Math.ceil(additionalWeight / tier.weightStep);
      totalPrice += additionalSteps * tier.additionalPrice;
    }

    return {
      rateType: 'stepped',
      totalPrice,
      baseWeight,
      basePrice: tier.basePrice ?? tier.additionalPrice,
      stepMinWeight: tier.weightStep * (additionalSteps - 1),
      stepMaxWeight: tier.weightStep * additionalSteps,
      additionalWeight,
      additionalPrice: tier.additionalPrice,
      weightStep: tier.weightStep,
    };
  } else {
    // Fixed pricing within tier (pure tiered mode)
    return {
      rateType: 'tiered',
      totalPrice: tier.basePrice ?? 0,
      baseWeight,
      basePrice: tier.basePrice,
      maxWeight: maxWeight,
    };
  }
}
