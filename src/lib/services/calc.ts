import {
  getRegionType,
  getPostalZone,
  getChinaPostMainlandZone,
  getDestinationType,
} from '../data/regions';
import { POSTAGE_RATES, RATE_RULES } from '../data/rates';
import type { RateCalculationMethod } from '../data/rates';
import type { MailType, MailCategory } from '../data/mail-types';

export interface RateCalculationDetails {
  rateType: 'fixed' | 'tiered' | 'stepped' | 'zonal';
  baseWeight?: number;
  basePrice?: number;
  additionalWeight?: number;
  additionalPrice?: number;
  weightStep?: number;
  fixedPrice?: number;
  tierUsed?: { minWeight?: number; maxWeight: number; price: number };
  registrationFee?: number;
}

export interface CalculationResult {
  price: number;
  currency: string;
  serviceKey: string;
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

export interface CalculationError {
  errorType: 'service' | 'route' | 'mail_type' | 'mail_category' | 'weight' | 'calculation';
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
): CalculationResult | CalculationError {
  // Type guard: check if fromRegionType is a valid RegionCode
  const fromRegionType = getRegionType(fromRegion);
  if (fromRegionType === 'XX') {
    return { errorType: 'service' };
  }

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

  if (!serviceKey || !serviceData) {
    return { errorType: 'service' };
  }

  // Determine destination type for rate lookup
  const toRegionType = getRegionType(toRegion);
  const destinationType = getDestinationType(fromRegionType, toRegionType);
  const destinationRates = serviceData.rates[destinationType];
  if (!destinationRates) {
    return { errorType: 'route' };
  }

  const rate = getRateMethod(destinationRates[mailType], mailCategory);
  if (!rate) {
    return { errorType: 'mail_type' };
  }

  // Calculate price based on rate method
  let price: number | null = null;
  let zoneId: string | undefined;
  let calculationDetails: RateCalculationDetails;

  switch (rate.type) {
    case 'stepped': {
      if (rate.maxWeight && weight > rate.maxWeight) {
        return { errorType: 'weight' };
      }
      const baseWeight = rate.baseWeight || rate.weightStep;
      if (weight <= baseWeight) {
        price = rate.basePrice;
        calculationDetails = {
          rateType: 'stepped',
          baseWeight,
          basePrice: rate.basePrice,
          additionalWeight: 0,
          additionalPrice: rate.additionalPrice,
          weightStep: rate.weightStep,
        };
      } else {
        const additionalWeight = weight - baseWeight;
        const additionalSteps = Math.ceil(additionalWeight / rate.weightStep);
        price = rate.basePrice + additionalSteps * rate.additionalPrice;
        calculationDetails = {
          rateType: 'stepped',
          baseWeight,
          basePrice: rate.basePrice,
          additionalWeight,
          additionalPrice: rate.additionalPrice,
          weightStep: rate.weightStep,
        };
      }
      break;
    }

    case 'tiered': {
      let tierUsed: { maxWeight: number; price: number; minWeight?: number } | undefined;
      let previousMaxWeight = 0;
      for (const tier of rate.tiers) {
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
      if (price === null) {
        return { errorType: 'weight' };
      }
      calculationDetails = {
        rateType: 'tiered',
        tierUsed,
      };
      break;
    }

    case 'fixed':
      if (rate.maxWeight && weight > rate.maxWeight) {
        return { errorType: 'weight' };
      }
      price = rate.price;
      calculationDetails = {
        rateType: 'fixed',
        fixedPrice: rate.price,
      };
      break;

    case 'zonal': {
      // Get China Post group for destination region
      let zoneNumber: number | undefined;
      if (fromRegionType === 'CN' && destinationType === 'domestic' && mailType === 'parcel') {
        zoneNumber = getChinaPostMainlandZone(fromRegion, toRegion);
        if (!zoneNumber) {
          return { errorType: 'route' };
        }
        zoneId = `domestic__${mailType}_${zoneNumber}`;
      }

      const postalZone = getPostalZone(fromRegionType, toRegion);
      if (!postalZone || !mailCategory) {
        return { errorType: 'mail_category' };
      }

      // Determine which zone to use based on mail category and mail type
      const zoneNumberMap = postalZone[mailCategory];
      const letterTag = (mailType !== 'letter' ? 'other' : mailType) as keyof typeof zoneNumberMap;
      zoneNumber = typeof zoneNumberMap === 'object' ? zoneNumberMap?.[letterTag] : zoneNumberMap;
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
      if (weight <= baseWeight) {
        price = zoneRates.basePrice;
        calculationDetails = {
          rateType: 'zonal',
          baseWeight,
          basePrice: zoneRates.basePrice,
          additionalWeight: 0,
          additionalPrice: zoneRates.additionalPrice,
          weightStep: zoneRates.weightStep,
        };
      } else {
        const additionalWeight = weight - baseWeight;
        const additionalSteps = Math.ceil(additionalWeight / zoneRates.weightStep);
        price = zoneRates.basePrice + additionalSteps * zoneRates.additionalPrice;
        calculationDetails = {
          rateType: 'zonal',
          baseWeight,
          basePrice: zoneRates.basePrice,
          additionalWeight,
          additionalPrice: zoneRates.additionalPrice,
          weightStep: zoneRates.weightStep,
        };
      }
      break;
    }
  }

  if (price === null) {
    console.error(rate);
    return { errorType: 'calculation' };
  }

  if (isRegistered) {
    const registrationFee =
      rate?.registrationFee ??
      getRateMethod(destinationRates['letter'], mailCategory)?.registrationFee;
    if (registrationFee) {
      price += registrationFee;
      calculationDetails.registrationFee = registrationFee;
    }
  }

  return {
    price,
    currency: serviceData.currency,
    serviceKey,
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
