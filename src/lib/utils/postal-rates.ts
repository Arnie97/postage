import {
  getRegionType,
  getChinaPostInternationalZone,
  getChinaPostMainlandZone,
} from '../data/regions';
import { POSTAGE_RATES, RATE_RULES } from '../data/rates';
import type { RateCalculationMethod } from '../data/rates';

export type MailType =
  | 'letter'
  | 'postcard'
  | 'printed_papers'
  | 'items_for_blind'
  | 'small_packet'
  | 'm_bags'
  | 'parcel';

export type MailCategory = 'air' | 'sal' | 'surface';

export interface RateCalculationDetails {
  rateType: 'fixed' | 'tiered' | 'stepped' | 'region_stepped';
  baseWeight?: number;
  basePrice?: number;
  additionalWeight?: number;
  additionalPrice?: number;
  weightStep?: number;
  fixedPrice?: number;
  tierUsed?: { minWeight?: number; maxWeight: number; price: number };
  registrationFee?: number;
}

export interface PostageResult {
  price: number;
  currency: string;
  service: string;
  mailType: string;
  origin: string;
  destination: string;
  weight: number;
  isRegistered?: boolean;
  zoneId?: string;
  mailCategory?: MailCategory;
  ruleId?: string;
  calculationDetails: RateCalculationDetails;
}

// Helper function to get rate method for a specific mail rate and category
function getRateMethod(
  mailRate: any,
  mailCategory?: MailCategory,
): RateCalculationMethod | undefined {
  // Handle domestic and regional rates
  if (!mailCategory || !mailRate?.air) {
    return mailRate;
  }

  // Handle international rates with mail categories
  const internationalRates = mailRate as {
    default?: RateCalculationMethod;
    air?: RateCalculationMethod;
    sal?: RateCalculationMethod;
    surface?: RateCalculationMethod;
  };
  return internationalRates[mailCategory] || internationalRates.default;
}

// Find the best matching rate rule for the given service and destination type
function findBestMatchingRateRule(
  serviceKey: string,
  destinationType: string,
  mailType: string,
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
): PostageResult | null {
  const fromRegionType = getRegionType(fromRegion);

  // Find the service by matching fromRegion
  let serviceKey: string | null = null;
  let serviceData: any = null;

  for (const [key, data] of Object.entries(POSTAGE_RATES)) {
    if (data.fromRegion === fromRegionType) {
      serviceKey = key;
      serviceData = data;
      break;
    }
  }

  if (!serviceKey || !serviceData) return null;

  const fromType = fromRegionType;
  const toType = getRegionType(toRegion);

  // Determine destination type for rate lookup
  let destinationType: string;
  if (toType === fromType) {
    destinationType = 'domestic';
  } else if (toType === 'CN' && fromType !== 'CN') {
    destinationType = 'mainland';
  } else if ((toType === 'TW' || toType === 'HK' || toType === 'MO') && fromType !== toType) {
    destinationType = 'regional';
  } else if (toType === 'TW' && fromType === 'MO') {
    destinationType = 'regional_tw';
  } else {
    destinationType = 'international';
  }

  // Get the rate configuration
  const destinationRates = serviceData.rates[destinationType];
  if (!destinationRates) return null;

  const rateMethod = getRateMethod(destinationRates[mailType], mailCategory);
  if (!rateMethod) return null;

  // Calculate price based on rate method
  let price: number | null = null;
  let zoneId: string | undefined;
  let calculationDetails: RateCalculationDetails;

  switch (rateMethod.type) {
    case 'stepped': {
      if (rateMethod.maxWeight && weight > rateMethod.maxWeight) return null;
      const baseWeight = rateMethod.baseWeight || rateMethod.weightStep;
      if (weight <= baseWeight) {
        price = rateMethod.basePrice;
        calculationDetails = {
          rateType: 'stepped',
          baseWeight,
          basePrice: rateMethod.basePrice,
          additionalWeight: 0,
          additionalPrice: rateMethod.additionalPrice,
          weightStep: rateMethod.weightStep,
        };
      } else {
        const additionalWeight = weight - baseWeight;
        const additionalSteps = Math.ceil(additionalWeight / rateMethod.weightStep);
        price = rateMethod.basePrice + additionalSteps * rateMethod.additionalPrice;
        calculationDetails = {
          rateType: 'stepped',
          baseWeight,
          basePrice: rateMethod.basePrice,
          additionalWeight,
          additionalPrice: rateMethod.additionalPrice,
          weightStep: rateMethod.weightStep,
        };
      }
      break;
    }

    case 'tiered': {
      let tierUsed: { maxWeight: number; price: number; minWeight?: number } | undefined;
      let previousMaxWeight = 0;
      for (const tier of rateMethod.tiers) {
        if (weight <= tier.maxWeight) {
          price = tier.price;
          tierUsed = {
            ...tier,
            minWeight: previousMaxWeight > 0 ? previousMaxWeight + 1 : undefined,
          };
          break;
        }
        previousMaxWeight = tier.maxWeight;
      }
      if (price === null) return null;
      calculationDetails = {
        rateType: 'tiered',
        tierUsed,
      };
      break;
    }

    case 'fixed':
      if (rateMethod.maxWeight && weight > rateMethod.maxWeight) return null;
      price = rateMethod.price;
      calculationDetails = {
        rateType: 'fixed',
        fixedPrice: rateMethod.price,
      };
      break;

    case 'region_stepped': {
      // Get China Post group for destination region
      let zoneNumber: number | undefined;
      if (destinationType == 'international') {
        const chinaPostInternationalZone = getChinaPostInternationalZone(toRegion);
        if (!chinaPostInternationalZone || !mailCategory) return null;

        // Determine which group to use based on mail category and mail type
        const zoneNumberMap = chinaPostInternationalZone[mailCategory];
        const letterTag = (
          mailType !== 'letter' ? 'other' : mailType
        ) as keyof typeof zoneNumberMap;
        zoneNumber = typeof zoneNumberMap === 'object' ? zoneNumberMap?.[letterTag] : zoneNumberMap;
        if (!zoneNumber) return null;

        zoneId = `international_${mailCategory}_${letterTag}_${zoneNumber}`;
      } else if (destinationType === 'domestic' && mailType === 'parcel') {
        zoneNumber = getChinaPostMainlandZone(fromRegion, toRegion);
        if (zoneNumber === undefined) return null;
        zoneId = `domestic__${mailType}_${zoneNumber}`;
      } else {
        return null;
      }

      const groupRates = rateMethod.groups[zoneNumber];
      if (!groupRates) return null;

      // Check weight limit
      if (groupRates.maxWeight && weight > groupRates.maxWeight) return null;

      // Calculate price using group-specific rates
      const baseWeight = groupRates.baseWeight || groupRates.weightStep;
      if (weight <= baseWeight) {
        price = groupRates.basePrice;
        calculationDetails = {
          rateType: 'region_stepped',
          baseWeight,
          basePrice: groupRates.basePrice,
          additionalWeight: 0,
          additionalPrice: groupRates.additionalPrice,
          weightStep: groupRates.weightStep,
        };
      } else {
        const additionalWeight = weight - baseWeight;
        const additionalSteps = Math.ceil(additionalWeight / groupRates.weightStep);
        price = groupRates.basePrice + additionalSteps * groupRates.additionalPrice;
        calculationDetails = {
          rateType: 'region_stepped',
          baseWeight,
          basePrice: groupRates.basePrice,
          additionalWeight,
          additionalPrice: groupRates.additionalPrice,
          weightStep: groupRates.weightStep,
        };
      }
      break;
    }
  }

  if (price === null) return null;

  if (isRegistered) {
    const registrationFee =
      rateMethod?.registrationFee ??
      getRateMethod(destinationRates['letter'], mailCategory)?.registrationFee;
    if (registrationFee) {
      price += registrationFee;
      calculationDetails.registrationFee = registrationFee;
    }
  }

  return {
    price,
    currency: serviceData.currency,
    service: serviceData.serviceName,
    mailType,
    origin: fromRegion,
    destination: toRegion,
    weight,
    isRegistered,
    mailCategory,
    ruleId: findBestMatchingRateRule(serviceKey, destinationType, mailType),
    zoneId,
    calculationDetails,
  };
}
