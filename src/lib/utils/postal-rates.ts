import { getRegionType } from '../data/regions';
import { POSTAGE_RATES, SERVICE_MAP } from '../data/rates';
import type { RateCalculationMethod } from '../data/rates';

export type MailType = 'letter' | 'parcel' | 'ems' | 'epacket' | 'postcard';

export type DeliveryMethod = 'air' | 'sal' | 'surface';

export interface PostageResult {
  price: number;
  currency: string;
  service: string;
  mailType: string;
  origin: string;
  destination: string;
  weight: number;
  zone?: string;
  deliveryMethod?: DeliveryMethod;
  ruleId?: string;
}

// 主计算函数，根据出发地自动选择邮政服务
export function calculatePostageRate(
  mailType: MailType,
  fromRegion: string,
  toRegion: string,
  weight: number,
  deliveryMethod?: DeliveryMethod,
): PostageResult | null {
  const fromRegionType = getRegionType(fromRegion);

  const serviceKey = SERVICE_MAP[fromRegionType];
  if (!serviceKey) return null;

  const fromType = fromRegionType;
  const toType = getRegionType(toRegion);

  const serviceData = POSTAGE_RATES[serviceKey as keyof typeof POSTAGE_RATES];
  if (!serviceData) return null;

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
  const mailRates = serviceData.rates[mailType];
  if (!mailRates) return null;

  let rateMethod: RateCalculationMethod | undefined;

  // Handle international rates with delivery methods
  if (destinationType === 'international' && deliveryMethod && mailRates.international) {
    if (typeof mailRates.international === 'object' && 'air' in mailRates.international) {
      const internationalRates = mailRates.international as {
        default?: RateCalculationMethod;
        air?: RateCalculationMethod;
        sal?: RateCalculationMethod;
        surface?: RateCalculationMethod;
      };
      rateMethod = internationalRates[deliveryMethod] || internationalRates.default;
    } else {
      rateMethod = mailRates.international as RateCalculationMethod;
    }
  } else {
    // Handle domestic, mainland, and regional rates
    rateMethod = mailRates[destinationType as keyof typeof mailRates] as RateCalculationMethod;
  }

  if (!rateMethod) return null;

  // Calculate price based on rate method
  let price: number | null = null;

  switch (rateMethod.type) {
    case 'stepped': {
      if (rateMethod.maxWeight && weight > rateMethod.maxWeight) return null;
      const weightStep = Math.ceil(weight / rateMethod.weightStep);
      if (weightStep <= 1) {
        price = rateMethod.basePrice;
      } else {
        price = rateMethod.basePrice + (weightStep - 1) * rateMethod.additionalPrice;
      }
      break;
    }

    case 'tiered':
      for (const tier of rateMethod.tiers) {
        if (weight <= tier.maxWeight) {
          price = tier.price;
          break;
        }
      }
      if (price === null) return null;
      break;

    case 'fixed':
      if (rateMethod.maxWeight && weight > rateMethod.maxWeight) return null;
      price = rateMethod.price;
      break;
  }

  if (price === null) return null;

  // Determine rule ID
  let ruleId = '';
  const rulePrefix = serviceKey;
  const mailTypeName = mailType;

  if (mailType === 'epacket') {
    ruleId = `${rulePrefix}_${destinationType}_${mailTypeName}`;
  } else if (destinationType === 'international' && deliveryMethod) {
    ruleId = `${rulePrefix}_${deliveryMethod}_${mailTypeName}`;
  } else {
    ruleId = `${rulePrefix}_${destinationType}_${mailTypeName}`;
  }

  return {
    price,
    currency: serviceData.currency,
    service: serviceData.serviceName,
    mailType,
    origin: fromRegion,
    destination: toRegion,
    weight,
    deliveryMethod,
    ruleId,
  };
}
