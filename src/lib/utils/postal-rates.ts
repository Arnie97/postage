import { getPostalZone, getRegionType } from '../data/regions';

export type MailType = 'letter' | 'parcel' | 'ems' | 'epacket';

export interface PostageResult {
  price: number;
  currency: string;
  service: string;
  mailType: string;
  origin: string;
  destination: string;
  weight: number;
  zone?: string;
}

// 中国邮政包裹分区资费表（根据发改价格规〔2017〕629号）
const CHINA_POST_PARCEL_ZONE_RATES = {
  // 一档（本埠）包裹资费
  1: {
    base: 3.0, // 首重500g
    additional: 1.0, // 续重每500g
  },

  // 二档包裹资费
  2: {
    base: 6.0, // 首重500g
    additional: 2.0, // 续重每500g
  },

  // 三档包裹资费
  3: {
    base: 6.0, // 首重500g
    additional: 2.0, // 续重每500g
  },

  // 四档包裹资费
  4: {
    base: 8.0, // 首重500g
    additional: 3.0, // 续重每500g
  },

  // 五档包裹资费
  5: {
    base: 8.0, // 首重500g
    additional: 3.0, // 续重每500g
  },

  // 六档包裹资费
  6: {
    base: 10.0, // 首重500g
    additional: 4.0, // 续重每500g
  },
};

// 中国邮政信函资费
const CHINA_POST_LETTER_RATES = {
  // 国内信函
  domestic: {
    base: 1.2, // 首重20g
    additional: 0.8, // 续重每20g
  },

  // 港澳台信函
  regional: {
    base: 1.5, // 首重20g
    additional: 1.0, // 续重每20g
  },

  // 国际信函（第一区：亚洲）
  international: {
    base: 3.0, // 首重20g
    additional: 2.0, // 续重每20g
  },
};

// 中国邮政EMS资费
const CHINA_POST_EMS_RATES = {
  // 国内EMS
  domestic: {
    base: 15.0, // 首重500g
    additional: 5.0, // 续重每500g
  },

  // 港澳台EMS
  regional: {
    base: 28.0, // 首重500g
    additional: 15.0, // 续重每500g
  },

  // 国际EMS（第一区）
  international: {
    base: 40.0, // 首重500g
    additional: 20.0, // 续重每500g
  },
};

// 计算中国邮政费率
export function calculateChinaPostRate(
  mailType: MailType,
  fromRegion: string,
  toRegion: string,
  weight: number, // 克
): PostageResult | null {
  const fromType = getRegionType(fromRegion);
  const toType = getRegionType(toRegion);

  // 只有从中国大陆出发才使用中国邮政
  if (fromType !== 'CN') {
    return null;
  }

  let price = 0;
  let zone = '';

  switch (mailType) {
    case 'letter':
      if (toType === 'CN') {
        // 国内信函
        const rates = CHINA_POST_LETTER_RATES.domestic;
        if (weight <= 20) {
          price = rates.base;
        } else if (weight <= 100) {
          price = rates.base + Math.ceil((weight - 20) / 20) * rates.additional;
        } else {
          return null; // 信函超重
        }
      } else if (toType === 'TW' || toType === 'HK' || toType === 'MO') {
        // 港澳台信函
        const rates = CHINA_POST_LETTER_RATES.regional;
        if (weight <= 20) {
          price = rates.base;
        } else if (weight <= 100) {
          price = rates.base + Math.ceil((weight - 20) / 20) * rates.additional;
        } else {
          return null;
        }
      } else {
        // 国际信函
        const rates = CHINA_POST_LETTER_RATES.international;
        if (weight <= 20) {
          price = rates.base;
        } else if (weight <= 100) {
          price = rates.base + Math.ceil((weight - 20) / 20) * rates.additional;
        } else {
          return null;
        }
      }
      break;

    case 'parcel':
      if (toType === 'CN') {
        // 国内包裹，按分区计费
        const postalZone = getPostalZone(fromRegion, toRegion);
        zone = postalZone.toString();
        const rates = CHINA_POST_PARCEL_ZONE_RATES[postalZone];

        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) {
          price = rates.base;
        } else {
          price = rates.base + (weightStep - 1) * rates.additional;
        }
      } else if (toType === 'TW' || toType === 'HK' || toType === 'MO') {
        // 港澳台包裹
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) {
          price = 15;
        } else {
          price = 15 + (weightStep - 1) * 8;
        }
      } else {
        // 国际包裹
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) {
          price = 30;
        } else {
          price = 30 + (weightStep - 1) * 15;
        }
      }
      break;

    case 'ems':
      if (toType === 'CN') {
        // 国内EMS
        const rates = CHINA_POST_EMS_RATES.domestic;
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) {
          price = rates.base;
        } else {
          price = rates.base + (weightStep - 1) * rates.additional;
        }
      } else if (toType === 'TW' || toType === 'HK' || toType === 'MO') {
        // 港澳台EMS
        const rates = CHINA_POST_EMS_RATES.regional;
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) {
          price = rates.base;
        } else {
          price = rates.base + (weightStep - 1) * rates.additional;
        }
      } else {
        // 国际EMS
        const rates = CHINA_POST_EMS_RATES.international;
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) {
          price = rates.base;
        } else {
          price = rates.base + (weightStep - 1) * rates.additional;
        }
      }
      break;

    case 'epacket':
      if (toType === 'XX') {
        // 国际e小包
        const weightStep = Math.ceil(weight / 100);
        if (weightStep <= 5) {
          price = 8;
        } else if (weightStep <= 20) {
          price = 8 + (weightStep - 5) * 1.5;
        } else {
          return null; // 超重
        }
      } else {
        return null; // e小包只支持国际
      }
      break;

    default:
      return null;
  }

  if (price === 0) return null;

  return {
    price,
    currency: 'CNY',
    service: 'China Post',
    mailType,
    origin: fromRegion,
    destination: toRegion,
    weight,
    zone,
  };
}

// 计算台湾邮政费率
export function calculateTaiwanPostRate(
  mailType: MailType,
  fromRegion: string,
  toRegion: string,
  weight: number,
): PostageResult | null {
  const fromType = getRegionType(fromRegion);
  const toType = getRegionType(toRegion);

  // 只有从台湾出发才使用中华邮政
  if (fromType !== 'TW') {
    return null;
  }

  let price = 0;

  switch (mailType) {
    case 'letter':
      if (toType === 'TW') {
        // 台湾岛内
        if (weight <= 20) price = 8;
        else if (weight <= 100) price = 8 + Math.ceil((weight - 20) / 20) * 5;
        else return null;
      } else if (toType === 'CN') {
        // 寄往大陆
        if (weight <= 20) price = 9;
        else if (weight <= 100) price = 9 + Math.ceil((weight - 20) / 20) * 7;
        else return null;
      } else if (toType === 'HK' || toType === 'MO') {
        // 寄往港澳
        if (weight <= 20) price = 9;
        else if (weight <= 100) price = 9 + Math.ceil((weight - 20) / 20) * 7;
        else return null;
      } else {
        // 国际
        if (weight <= 20) price = 13;
        else if (weight <= 100) price = 13 + Math.ceil((weight - 20) / 20) * 9;
        else return null;
      }
      break;

    case 'parcel':
      if (toType === 'TW') {
        const weightInKg = Math.ceil(weight / 1000);
        if (weightInKg <= 1) price = 65;
        else price = 65 + (weightInKg - 1) * 10;
      } else if (toType === 'CN') {
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) price = 150;
        else price = 150 + (weightStep - 1) * 75;
      } else if (toType === 'HK' || toType === 'MO') {
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) price = 120;
        else price = 120 + (weightStep - 1) * 60;
      } else {
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) price = 190;
        else price = 190 + (weightStep - 1) * 95;
      }
      break;

    case 'ems':
      if (toType === 'TW') {
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) price = 120;
        else price = 120 + (weightStep - 1) * 30;
      } else if (toType === 'CN') {
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) price = 260;
        else price = 260 + (weightStep - 1) * 130;
      } else if (toType === 'HK' || toType === 'MO') {
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) price = 220;
        else price = 220 + (weightStep - 1) * 110;
      } else {
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) price = 320;
        else price = 320 + (weightStep - 1) * 160;
      }
      break;

    case 'epacket':
      if (toType === 'CN') {
        const weightStep = Math.ceil(weight / 100);
        if (weightStep <= 5) price = 65;
        else if (weightStep <= 20) price = 65 + (weightStep - 5) * 10;
        else return null;
      } else if (toType === 'XX') {
        const weightStep = Math.ceil(weight / 100);
        if (weightStep <= 5) price = 85;
        else if (weightStep <= 20) price = 85 + (weightStep - 5) * 15;
        else return null;
      } else {
        return null;
      }
      break;

    default:
      return null;
  }

  if (price === 0) return null;

  return {
    price,
    currency: 'TWD',
    service: 'Chunghwa Post',
    mailType,
    origin: fromRegion,
    destination: toRegion,
    weight,
  };
}

// 计算香港邮政费率
export function calculateHongKongPostRate(
  mailType: MailType,
  fromRegion: string,
  toRegion: string,
  weight: number,
): PostageResult | null {
  const fromType = getRegionType(fromRegion);
  const toType = getRegionType(toRegion);

  // 只有从香港出发才使用香港邮政
  if (fromType !== 'HK') {
    return null;
  }

  let price = 0;

  switch (mailType) {
    case 'letter':
      if (toType === 'HK') {
        // 香港本地
        if (weight <= 30) price = 2.2;
        else if (weight <= 50) price = 3.7;
        else if (weight <= 100) price = 5.5;
        else return null;
      } else if (toType === 'CN' || toType === 'MO') {
        // 寄往大陆/澳门
        if (weight <= 30) price = 3.2;
        else if (weight <= 50) price = 5.2;
        else if (weight <= 100) price = 7.8;
        else return null;
      } else if (toType === 'TW') {
        // 寄往台湾
        if (weight <= 30) price = 4.2;
        else if (weight <= 50) price = 6.8;
        else if (weight <= 100) price = 10.2;
        else return null;
      } else {
        // 国际
        if (weight <= 30) price = 4.9;
        else if (weight <= 50) price = 7.9;
        else if (weight <= 100) price = 11.8;
        else return null;
      }
      break;

    case 'parcel':
      if (toType === 'HK') {
        const weightInKg = Math.ceil(weight / 1000);
        if (weightInKg <= 1) price = 26;
        else price = 26 + (weightInKg - 1) * 6;
      } else if (toType === 'CN' || toType === 'MO') {
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) price = 55;
        else price = 55 + (weightStep - 1) * 25;
      } else if (toType === 'TW') {
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) price = 75;
        else price = 75 + (weightStep - 1) * 35;
      } else {
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) price = 95;
        else price = 95 + (weightStep - 1) * 45;
      }
      break;

    case 'ems':
      if (toType === 'HK') {
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) price = 27;
        else price = 27 + (weightStep - 1) * 7;
      } else if (toType === 'CN' || toType === 'MO') {
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) price = 85;
        else price = 85 + (weightStep - 1) * 40;
      } else if (toType === 'TW') {
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) price = 115;
        else price = 115 + (weightStep - 1) * 55;
      } else {
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) price = 145;
        else price = 145 + (weightStep - 1) * 70;
      }
      break;

    case 'epacket':
      if (toType === 'XX') {
        const weightStep = Math.ceil(weight / 100);
        if (weightStep <= 5) price = 25;
        else if (weightStep <= 20) price = 25 + (weightStep - 5) * 3;
        else return null;
      } else {
        return null;
      }
      break;

    default:
      return null;
  }

  if (price === 0) return null;

  return {
    price,
    currency: 'HKD',
    service: 'Hong Kong Post',
    mailType,
    origin: fromRegion,
    destination: toRegion,
    weight,
  };
}

// 计算澳门邮政费率
export function calculateMacauPostRate(
  mailType: MailType,
  fromRegion: string,
  toRegion: string,
  weight: number,
): PostageResult | null {
  const fromType = getRegionType(fromRegion);
  const toType = getRegionType(toRegion);

  // 只有从澳门出发才使用澳门邮政
  if (fromType !== 'MO') {
    return null;
  }

  let price = 0;

  switch (mailType) {
    case 'letter':
      if (toType === 'MO') {
        // 澳门本地信件
        if (weight <= 50) price = 2.0;
        else if (weight <= 100) price = 3.0;
        else return null;
      } else if (toType === 'CN') {
        // 寄往大陆
        if (weight <= 20) price = 2.5;
        else if (weight <= 100) price = 2.5 + Math.ceil((weight - 20) / 20) * 1.5;
        else return null;
      } else if (toType === 'HK') {
        // 寄往香港
        if (weight <= 20) price = 2.5;
        else if (weight <= 100) price = 2.5 + Math.ceil((weight - 20) / 20) * 1.5;
        else return null;
      } else if (toType === 'TW') {
        // 寄往台湾
        if (weight <= 20) price = 3.5;
        else if (weight <= 100) price = 3.5 + Math.ceil((weight - 20) / 20) * 2.5;
        else return null;
      } else {
        // 国际信件
        if (weight <= 20) price = 4.0;
        else if (weight <= 100) price = 4.0 + Math.ceil((weight - 20) / 20) * 3.0;
        else return null;
      }
      break;

    case 'parcel':
      if (toType === 'MO') {
        // 澳门本地包裹
        const weightInKg = Math.ceil(weight / 1000);
        if (weightInKg <= 1) price = 8;
        else price = 8 + (weightInKg - 1) * 3;
      } else if (toType === 'CN' || toType === 'HK') {
        // 寄往大陆/香港
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) price = 25;
        else price = 25 + (weightStep - 1) * 12;
      } else if (toType === 'TW') {
        // 寄往台湾
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) price = 35;
        else price = 35 + (weightStep - 1) * 18;
      } else {
        // 国际包裹
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) price = 45;
        else price = 45 + (weightStep - 1) * 25;
      }
      break;

    case 'ems':
      if (toType === 'MO') {
        // 澳门本地EMS
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) price = 15;
        else price = 15 + (weightStep - 1) * 5;
      } else if (toType === 'CN' || toType === 'HK') {
        // 寄往大陆/香港EMS
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) price = 80;
        else price = 80 + (weightStep - 1) * 35;
      } else if (toType === 'TW') {
        // 寄往台湾EMS
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) price = 120;
        else price = 120 + (weightStep - 1) * 55;
      } else {
        // 国际EMS
        const weightStep = Math.ceil(weight / 500);
        if (weightStep <= 1) price = 150;
        else price = 150 + (weightStep - 1) * 75;
      }
      break;

    case 'epacket':
      if (toType === 'XX') {
        // 国际e小包
        const weightStep = Math.ceil(weight / 100);
        if (weightStep <= 5) price = 28;
        else if (weightStep <= 20) price = 28 + (weightStep - 5) * 4;
        else return null;
      } else {
        return null; // e小包只支持国际
      }
      break;

    default:
      return null;
  }

  if (price === 0) return null;

  return {
    price,
    currency: 'MOP',
    service: 'Macau Post',
    mailType,
    origin: fromRegion,
    destination: toRegion,
    weight,
  };
}

type CalculatorFunction = (
  mailType: MailType,
  fromRegion: string,
  toRegion: string,
  weight: number,
) => PostageResult | null;

const REGION_CALCULATOR_MAP = new Map<string, CalculatorFunction>([
  ['CN', calculateChinaPostRate],
  ['TW', calculateTaiwanPostRate],
  ['HK', calculateHongKongPostRate],
  ['MO', calculateMacauPostRate],
]);

// 主计算函数，根据出发地自动选择邮政服务
export function calculatePostageRate(
  mailType: MailType,
  fromRegion: string,
  toRegion: string,
  weight: number,
): PostageResult | null {
  const regionType = getRegionType(fromRegion);
  const calculator = REGION_CALCULATOR_MAP.get(regionType);

  return calculator ? calculator(mailType, fromRegion, toRegion, weight) : null;
}
