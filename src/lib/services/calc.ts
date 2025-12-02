import {
  getRegionType,
  getDestinationType,
  getPostalZone,
  getChinaPostMainlandZone,
  POSTAL_ZONE_DESCRIPTIONS,
  type CategoryZoneDescriptions,
  type ZoneDescriptions,
} from '../data/regions';

import { POSTAGE_RATES, RATE_RULES, type CategoryRates, type Rate } from '../data/rates';

import type { MailType, MailCategory } from '../data/mail-types';

export interface RateCalculationDetails {
  rateType: 'fixed' | 'tiered' | 'stepped' | 'zonal';
  baseWeight?: number;
  basePrice?: number;
  stepMinWeight?: number;
  stepMaxWeight?: number;
  additionalWeight?: number;
  weightStep?: number;
  additionalPrice?: number;
  maxWeight?: number;
  zoneDescription?: string;
  registrationFee?: number;
}

export interface CalculationResult {
  price: number;
  serviceKey: string;
  ruleId?: string;
  calculationDetails: RateCalculationDetails;
}

export interface CalculationError {
  errorType: 'service' | 'route' | 'mail_type' | 'mail_category' | 'weight' | 'calculation';
}

// Helper function to get pricing model for a specific mail category
function getPricingModel(
  mailTypeRate?: Rate | CategoryRates | null,
  mailCategory?: MailCategory,
): Rate | undefined {
  if (!mailTypeRate || !mailCategory || 'type' in mailTypeRate) {
    return mailTypeRate as Rate;
  }
  const categoryRates = mailTypeRate as CategoryRates;
  return categoryRates[mailCategory] ?? categoryRates.air;
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
export function calculatePostageRate(
  mailType: MailType,
  fromRegion: string,
  toRegion: string,
  weight: number,
  mailCategory?: MailCategory,
  isRegistered?: boolean,
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

  const rate = getPricingModel(destinationRates[mailType], mailCategory);
  if (!rate) {
    return { errorType: 'mail_type' };
  }

  // Calculate price based on rate method
  let price: number | undefined;
  let calculationDetails: RateCalculationDetails;

  switch (rate.type) {
    case 'stepped': {
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

      // Calculate price within the tier
      const weightInTier = weight - baseWeight;
      if (tier.weightStep && tier.additionalPrice) {
        let additionalSteps = 0;
        price = tier.basePrice ?? tier.additionalPrice;
        if (weightInTier > 0) {
          additionalSteps = Math.ceil(weightInTier / tier.weightStep);
          price += additionalSteps * tier.additionalPrice;
        }

        calculationDetails = {
          rateType: 'stepped',
          baseWeight: baseWeight,
          basePrice: tier.basePrice ?? tier.additionalPrice,
          stepMinWeight: tier.weightStep * (additionalSteps - 1),
          stepMaxWeight: tier.weightStep * additionalSteps,
          additionalWeight: weightInTier,
          additionalPrice: tier.additionalPrice,
          weightStep: tier.weightStep,
        };
      } else {
        // Fixed pricing within tier (pure tiered mode)
        price = tier.basePrice;
        calculationDetails = {
          rateType: 'tiered',
          baseWeight: baseWeight,
          basePrice: price,
          maxWeight: nextTierBaseWeight,
        };
      }
      break;
    }

    case 'fixed':
      if (rate.maxWeight && weight > rate.maxWeight) {
        return { errorType: 'weight' };
      }
      price = rate.price;
      calculationDetails = {
        rateType: 'fixed',
        basePrice: rate.price,
      };
      break;

    case 'zonal': {
      const destinationZoneDescriptions =
        POSTAL_ZONE_DESCRIPTIONS[serviceData.nameKey]?.[destinationType];

      let zoneDescriptions: ZoneDescriptions | undefined;
      let zoneNumber: number | undefined;
      if (fromRegionType === 'CN' && destinationType === 'domestic' && mailType === 'parcel') {
        zoneNumber = getChinaPostMainlandZone(fromRegion, toRegion);
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

      const zoneRates = rate.zones[zoneNumber];
      if (!zoneRates) {
        return { errorType: 'route' };
      }

      // Check weight limit
      if (zoneRates.maxWeight && weight > zoneRates.maxWeight) {
        return { errorType: 'weight' };
      }

      // Calculate price using zonal rates
      const baseWeight = zoneRates.baseWeight || zoneRates.weightStep;
      let additionalWeight = 0;
      let additionalSteps = 0;
      if (weight <= baseWeight) {
        price = zoneRates.basePrice;
      } else {
        additionalWeight = weight - baseWeight;
        additionalSteps = Math.ceil(additionalWeight / zoneRates.weightStep);
        price = zoneRates.basePrice + additionalSteps * zoneRates.additionalPrice;
      }
      calculationDetails = {
        rateType: 'zonal',
        baseWeight,
        basePrice: zoneRates.basePrice,
        stepMinWeight: zoneRates.weightStep * (additionalSteps - 1),
        stepMaxWeight: zoneRates.weightStep * additionalSteps,
        additionalWeight,
        additionalPrice: zoneRates.additionalPrice,
        weightStep: zoneRates.weightStep,
        zoneDescription: zoneDescriptions?.[zoneNumber],
      };
      break;
    }
  }

  if (price === undefined) {
    console.error(rate);
    return { errorType: 'calculation' };
  }

  if (isRegistered) {
    const registrationFee =
      rate?.registrationFee ??
      getPricingModel(destinationRates['letter'], mailCategory)?.registrationFee;
    if (registrationFee) {
      price += registrationFee;
      calculationDetails.registrationFee = registrationFee;
    }
  }

  return {
    price,
    serviceKey: serviceData.nameKey,
    ruleId: findBestMatchingRateRule(serviceData.nameKey, destinationType, mailType),
    calculationDetails,
  };
}
