export type RegionCode = 'CN' | 'HK' | 'MO' | 'TW';
export type PostalServiceName = 'china_post' | 'hongkong_post' | 'macau_post' | 'chunghwa_post';
export type DestinationType = 'domestic' | 'regional' | 'mainland' | 'international';

export interface Region {
  code: string;
  name: {
    'zh-CN': string;
    'zh-TW': string;
    'en': string;
  };
  continent?: 'AS' | 'EU' | 'AF' | 'NA' | 'SA' | 'OC' | 'AN';
  postalZone?: {
    [K in RegionCode]?: PostalZone;
  };
}

export interface PostalZone {
  air?: LetterOtherPostZone | 1 | 2 | 3 | 4 | 5;
  sal?: LetterOtherPostZone;
  surface?: 1 | 2 | 3;
}

interface LetterOtherPostZone {
  letter?: 1 | 2 | 3 | 4;
  other?: 1 | 2 | 3;
}

// 港澳臺地區
// prettier-ignore
export const SPECIAL_REGIONS: Region[] = [
  { code: 'HK', name: { 'zh-CN': '香港', 'zh-TW': '香港', 'en': 'Hong Kong' }, postalZone: { TW: { air: 1 } } },
  { code: 'MO', name: { 'zh-CN': '澳门', 'zh-TW': '澳門', 'en': 'Macau' }, postalZone: { TW: { air: 1 } } },
  { code: 'TW', name: { 'zh-CN': '台湾', 'zh-TW': '臺灣', 'en': 'Taiwan' } },
];

// 中国大陆各省市自治区（按行政区划编码顺序）
export const MAINLAND_PROVINCES: Region[] = [
  { code: 'CN-BJ', name: { 'zh-CN': '北京', 'zh-TW': '北京', 'en': 'Beijing' } },
  { code: 'CN-TJ', name: { 'zh-CN': '天津', 'zh-TW': '天津', 'en': 'Tianjin' } },
  { code: 'CN-HE', name: { 'zh-CN': '河北', 'zh-TW': '河北', 'en': 'Hebei' } },
  { code: 'CN-SX', name: { 'zh-CN': '山西', 'zh-TW': '山西', 'en': 'Shanxi' } },
  { code: 'CN-NM', name: { 'zh-CN': '内蒙古', 'zh-TW': '內蒙古', 'en': 'Inner Mongolia' } },
  { code: 'CN-LN', name: { 'zh-CN': '辽宁', 'zh-TW': '遼寧', 'en': 'Liaoning' } },
  { code: 'CN-JL', name: { 'zh-CN': '吉林', 'zh-TW': '吉林', 'en': 'Jilin' } },
  { code: 'CN-HL', name: { 'zh-CN': '黑龙江', 'zh-TW': '黑龍江', 'en': 'Heilongjiang' } },
  { code: 'CN-SH', name: { 'zh-CN': '上海', 'zh-TW': '上海', 'en': 'Shanghai' } },
  { code: 'CN-JS', name: { 'zh-CN': '江苏', 'zh-TW': '江蘇', 'en': 'Jiangsu' } },
  { code: 'CN-ZJ', name: { 'zh-CN': '浙江', 'zh-TW': '浙江', 'en': 'Zhejiang' } },
  { code: 'CN-AH', name: { 'zh-CN': '安徽', 'zh-TW': '安徽', 'en': 'Anhui' } },
  { code: 'CN-FJ', name: { 'zh-CN': '福建', 'zh-TW': '福建', 'en': 'Fujian' } },
  { code: 'CN-JX', name: { 'zh-CN': '江西', 'zh-TW': '江西', 'en': 'Jiangxi' } },
  { code: 'CN-SD', name: { 'zh-CN': '山东', 'zh-TW': '山東', 'en': 'Shandong' } },
  { code: 'CN-HA', name: { 'zh-CN': '河南', 'zh-TW': '河南', 'en': 'Henan' } },
  { code: 'CN-HB', name: { 'zh-CN': '湖北', 'zh-TW': '湖北', 'en': 'Hubei' } },
  { code: 'CN-HN', name: { 'zh-CN': '湖南', 'zh-TW': '湖南', 'en': 'Hunan' } },
  { code: 'CN-GD', name: { 'zh-CN': '广东', 'zh-TW': '廣東', 'en': 'Guangdong' } },
  { code: 'CN-GX', name: { 'zh-CN': '广西', 'zh-TW': '廣西', 'en': 'Guangxi' } },
  { code: 'CN-HI', name: { 'zh-CN': '海南', 'zh-TW': '海南', 'en': 'Hainan' } },
  { code: 'CN-CQ', name: { 'zh-CN': '重庆', 'zh-TW': '重慶', 'en': 'Chongqing' } },
  { code: 'CN-SC', name: { 'zh-CN': '四川', 'zh-TW': '四川', 'en': 'Sichuan' } },
  { code: 'CN-GZ', name: { 'zh-CN': '贵州', 'zh-TW': '貴州', 'en': 'Guizhou' } },
  { code: 'CN-YN', name: { 'zh-CN': '云南', 'zh-TW': '雲南', 'en': 'Yunnan' } },
  { code: 'CN-XZ', name: { 'zh-CN': '西藏', 'zh-TW': '西藏', 'en': 'Tibet' } },
  { code: 'CN-SN', name: { 'zh-CN': '陕西', 'zh-TW': '陝西', 'en': 'Shaanxi' } },
  { code: 'CN-GS', name: { 'zh-CN': '甘肃', 'zh-TW': '甘肅', 'en': 'Gansu' } },
  { code: 'CN-QH', name: { 'zh-CN': '青海', 'zh-TW': '青海', 'en': 'Qinghai' } },
  { code: 'CN-NX', name: { 'zh-CN': '宁夏', 'zh-TW': '寧夏', 'en': 'Ningxia' } },
  { code: 'CN-XJ', name: { 'zh-CN': '新疆', 'zh-TW': '新疆', 'en': 'Xinjiang' } },
];

// 国际地区（按大洲分组）
// prettier-ignore
export const INTERNATIONAL_REGIONS: Region[] = [
  // 亚洲 (AS)
  { code: 'JP', name: { 'zh-CN': '日本', 'zh-TW': '日本', en: 'Japan' }, continent: 'AS', postalZone: { CN: { air: { letter: 1, other: 1 }, sal: { letter: 1, other: 2 }, surface: 1 }, HK: { air: 2, surface: 2 }, MO: { air: 2, surface: 2 }, TW: { air: 2 } } },
  { code: 'KR', name: { 'zh-CN': '韩国', 'zh-TW': '南韓', en: 'South Korea' }, continent: 'AS', postalZone: { CN: { air: { letter: 1, other: 2 }, sal: { letter: 1, other: 2 }, surface: 1 }, HK: { air: 1, surface: 1 }, MO: { air: 1, surface: 1 }, TW: { air: 2 } } },
  { code: 'KP', name: { 'zh-CN': '朝鲜', 'zh-TW': '北韓', en: 'North Korea' }, continent: 'AS', postalZone: { CN: { air: { letter: 1, other: 2 }, surface: 2 }, HK: { air: 1, surface: 1 }, MO: { air: 3 }, TW: { air: 2 } } },
  { code: 'MN', name: { 'zh-CN': '蒙古', 'zh-TW': '蒙古', en: 'Mongolia' }, continent: 'AS', postalZone: { CN: { air: { letter: 1, other: 2 }, surface: 2 }, HK: { air: 2, surface: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'VN', name: { 'zh-CN': '越南', 'zh-TW': '越南', en: 'Vietnam' }, continent: 'AS', postalZone: { CN: { air: { letter: 1, other: 2 }, surface: 1 }, HK: { air: 1, surface: 1 }, MO: { air: 1 }, TW: { air: 2 } } },
  { code: 'LA', name: { 'zh-CN': '老挝', 'zh-TW': '寮國', en: 'Laos' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 1, surface: 1 }, MO: { air: 1 }, TW: { air: 2 } } },
  { code: 'KH', name: { 'zh-CN': '柬埔寨', 'zh-TW': '柬埔寨', en: 'Cambodia' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 1, surface: 1 }, MO: { air: 1 }, TW: { air: 2 } } },
  { code: 'TH', name: { 'zh-CN': '泰国', 'zh-TW': '泰國', en: 'Thailand' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 1, surface: 1 }, MO: { air: 1, surface: 1 }, TW: { air: 2 } } },
  { code: 'MM', name: { 'zh-CN': '缅甸', 'zh-TW': '緬甸', en: 'Myanmar' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 1, surface: 1 }, MO: { air: 1 }, TW: { air: 2 } } },
  { code: 'MY', name: { 'zh-CN': '马来西亚', 'zh-TW': '馬來西亞', en: 'Malaysia' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 1, surface: 1 }, MO: { air: 1, surface: 1 }, TW: { air: 2 } } },
  { code: 'SG', name: { 'zh-CN': '新加坡', 'zh-TW': '新加坡', en: 'Singapore' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 1, surface: 1 }, MO: { air: 1, surface: 1 }, TW: { air: 2 } } },
  { code: 'ID', name: { 'zh-CN': '印度尼西亚', 'zh-TW': '印尼', en: 'Indonesia' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 1, surface: 1 }, MO: { air: 3 }, TW: { air: 2 } } },
  { code: 'BN', name: { 'zh-CN': '文莱', 'zh-TW': '汶萊', en: 'Brunei' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 1, surface: 1 }, MO: { air: 3 }, TW: { air: 2 } } },
  { code: 'PH', name: { 'zh-CN': '菲律宾', 'zh-TW': '菲律賓', en: 'Philippines' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 1, surface: 1 }, MO: { air: 1, surface: 1 }, TW: { air: 2 } } },
  { code: 'IN', name: { 'zh-CN': '印度', 'zh-TW': '印度', en: 'India' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 1, surface: 1 }, MO: { air: 1, surface: 1 }, TW: { air: 2 } } },
  { code: 'PK', name: { 'zh-CN': '巴基斯坦', 'zh-TW': '巴基斯坦', en: 'Pakistan' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 1 }, MO: { air: 1 }, TW: { air: 2 } } },
  { code: 'BD', name: { 'zh-CN': '孟加拉国', 'zh-TW': '孟加拉', en: 'Bangladesh' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 1 }, MO: { air: 1 }, TW: { air: 2 } } },
  { code: 'LK', name: { 'zh-CN': '斯里兰卡', 'zh-TW': '斯里蘭卡', en: 'Sri Lanka' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 1 }, MO: { air: 1 }, TW: { air: 2 } } },
  { code: 'NP', name: { 'zh-CN': '尼泊尔', 'zh-TW': '尼泊爾', en: 'Nepal' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 1 }, MO: { air: 1 }, TW: { air: 2 } } },
  { code: 'AF', name: { 'zh-CN': '阿富汗', 'zh-TW': '阿富汗', en: 'Afghanistan' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 1 }, MO: { air: 1 }, TW: { air: 2 } } },
  { code: 'KZ', name: { 'zh-CN': '哈萨克斯坦', 'zh-TW': '哈薩克斯坦', en: 'Kazakhstan' }, continent: 'AS', postalZone: { CN: { air: { letter: 1, other: 2 }, surface: 1 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'KG', name: { 'zh-CN': '吉尔吉斯斯坦', 'zh-TW': '吉爾吉斯', en: 'Kyrgyzstan' }, continent: 'AS', postalZone: { CN: { air: { letter: 1, other: 2 }, surface: 1 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'TJ', name: { 'zh-CN': '塔吉克斯坦', 'zh-TW': '塔吉克', en: 'Tajikistan' }, continent: 'AS', postalZone: { CN: { air: { letter: 1, other: 2 }, surface: 1 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'UZ', name: { 'zh-CN': '乌兹别克斯坦', 'zh-TW': '烏茲別克', en: 'Uzbekistan' }, continent: 'AS', postalZone: { CN: { air: { letter: 1, other: 2 }, surface: 1 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'TM', name: { 'zh-CN': '土库曼斯坦', 'zh-TW': '土庫曼', en: 'Turkmenistan' }, continent: 'AS', postalZone: { CN: { air: { letter: 1, other: 2 }, surface: 1 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'AE', name: { 'zh-CN': '阿联酋', 'zh-TW': '阿聯酋', en: 'United Arab Emirates' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 2 }, HK: { air: 2, surface: 2 }, MO: { air: 2, surface: 2 }, TW: { air: 2 } } },
  { code: 'OM', name: { 'zh-CN': '阿曼', 'zh-TW': '阿曼', en: 'Oman' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'BH', name: { 'zh-CN': '巴林', 'zh-TW': '巴林', en: 'Bahrain' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'QA', name: { 'zh-CN': '卡塔尔', 'zh-TW': '卡塔爾', en: 'Qatar' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'KW', name: { 'zh-CN': '科威特', 'zh-TW': '科威特', en: 'Kuwait' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'MV', name: { 'zh-CN': '马尔代夫', 'zh-TW': '馬爾地夫', en: 'Maldives' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 1 }, MO: { air: 1 }, TW: { air: 2 } } },
  { code: 'GE', name: { 'zh-CN': '格鲁吉亚', 'zh-TW': '喬治亞', en: 'Georgia' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, sal: { letter: 3, other: 1 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 2 } } },
  { code: 'AZ', name: { 'zh-CN': '阿塞拜疆', 'zh-TW': '亞塞拜然', en: 'Azerbaijan' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 2 }, sal: { letter: 3, other: 2 } }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'TR', name: { 'zh-CN': '土耳其', 'zh-TW': '土耳其', en: 'Turkey' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 2 }, surface: 2 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'IQ', name: { 'zh-CN': '伊拉克', 'zh-TW': '伊拉克', en: 'Iraq' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 2 }, surface: 2 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'JO', name: { 'zh-CN': '约旦', 'zh-TW': '約旦', en: 'Jordan' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 2 }, surface: 2 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'IR', name: { 'zh-CN': '伊朗', 'zh-TW': '伊朗', en: 'Iran' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'CY', name: { 'zh-CN': '塞浦路斯', 'zh-TW': '賽普勒斯', en: 'Cyprus' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 2 }, sal: { letter: 2, other: 3 } }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'AM', name: { 'zh-CN': '亚美尼亚', 'zh-TW': '亞美尼亞', en: 'Armenia' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, sal: { letter: 3, other: 3 } }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'BT', name: { 'zh-CN': '不丹', 'zh-TW': '不丹', en: 'Bhutan' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 1 }, surface: 1 }, HK: { air: 1 }, MO: { air: 1 }, TW: { air: 2 } } },
  { code: 'XA', name: { 'zh-CN': '亚洲其他地区', 'zh-TW': '亞洲其他地區', en: 'Other Asian Countries' }, continent: 'AS', postalZone: { CN: { air: { letter: 2, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 2 } } },

  // 欧洲 (EU)
  { code: 'GB', name: { 'zh-CN': '英国', 'zh-TW': '英國', en: 'United Kingdom' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 2, surface: 2 }, MO: { air: 2, surface: 2 }, TW: { air: 3 } } },
  { code: 'FR', name: { 'zh-CN': '法国', 'zh-TW': '法國', en: 'France' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 2, surface: 2 }, MO: { air: 2, surface: 2 }, TW: { air: 3 } } },
  { code: 'DE', name: { 'zh-CN': '德国', 'zh-TW': '德國', en: 'Germany' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 2, surface: 2 }, MO: { air: 2, surface: 2 }, TW: { air: 3 } } },
  { code: 'IT', name: { 'zh-CN': '意大利', 'zh-TW': '義大利', en: 'Italy' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 2, surface: 2 }, MO: { air: 2, surface: 2 }, TW: { air: 3 } } },
  { code: 'ES', name: { 'zh-CN': '西班牙', 'zh-TW': '西班牙', en: 'Spain' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 2, surface: 2 }, MO: { air: 2, surface: 2 }, TW: { air: 3 } } },
  { code: 'PT', name: { 'zh-CN': '葡萄牙', 'zh-TW': '葡萄牙', en: 'Portugal' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 2, surface: 2 }, MO: { air: 2, surface: 2 }, TW: { air: 3 } } },
  { code: 'NL', name: { 'zh-CN': '荷兰', 'zh-TW': '荷蘭', en: 'Netherlands' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 2, surface: 2 }, MO: { air: 2, surface: 2 }, TW: { air: 3 } } },
  { code: 'BE', name: { 'zh-CN': '比利时', 'zh-TW': '比利時', en: 'Belgium' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 2, surface: 2 }, MO: { air: 2, surface: 2 }, TW: { air: 3 } } },
  { code: 'RU', name: { 'zh-CN': '俄罗斯', 'zh-TW': '俄羅斯', en: 'Russia' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'AL', name: { 'zh-CN': '阿尔巴尼亚', 'zh-TW': '阿爾巴尼亞', en: 'Albania' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'AD', name: { 'zh-CN': '安道尔', 'zh-TW': '安道爾', en: 'Andorra' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 3 } }, HK: { air: 2 }, MO: { air: 2, surface: 2 }, TW: { air: 3 } } },
  { code: 'AT', name: { 'zh-CN': '奥地利', 'zh-TW': '奧地利', en: 'Austria' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 } }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 3 } } },
  { code: 'BY', name: { 'zh-CN': '白俄罗斯', 'zh-TW': '白俄羅斯', en: 'Belarus' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'BA', name: { 'zh-CN': '波斯尼亚和黑塞哥维那', 'zh-TW': '波士尼亞與赫塞哥維納', en: 'Bosnia and Herzegovina' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'BG', name: { 'zh-CN': '保加利亚', 'zh-TW': '保加利亞', en: 'Bulgaria' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'HR', name: { 'zh-CN': '克罗地亚', 'zh-TW': '克羅地亞', en: 'Croatia' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'CZ', name: { 'zh-CN': '捷克', 'zh-TW': '捷克', en: 'Czech Republic' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'DK', name: { 'zh-CN': '丹麦', 'zh-TW': '丹麥', en: 'Denmark' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'EE', name: { 'zh-CN': '爱沙尼亚', 'zh-TW': '愛沙尼亞', en: 'Estonia' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'FO', name: { 'zh-CN': '法罗群岛', 'zh-TW': '法羅群島', en: 'Faroe Islands' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 3 } }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 3 } } },
  { code: 'FI', name: { 'zh-CN': '芬兰', 'zh-TW': '芬蘭', en: 'Finland' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'GI', name: { 'zh-CN': '直布罗陀', 'zh-TW': '直布羅陀', en: 'Gibraltar' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 3 } }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 3 } } },
  { code: 'GR', name: { 'zh-CN': '希腊', 'zh-TW': '希臘', en: 'Greece' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 2, surface: 2 }, MO: { air: 2, surface: 2 }, TW: { air: 3 } } },
  { code: 'HU', name: { 'zh-CN': '匈牙利', 'zh-TW': '匈牙利', en: 'Hungary' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'IE', name: { 'zh-CN': '爱尔兰', 'zh-TW': '愛爾蘭', en: 'Ireland' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 } }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 3 } } },
  { code: 'IS', name: { 'zh-CN': '冰岛', 'zh-TW': '冰島', en: 'Iceland' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'LV', name: { 'zh-CN': '拉脱维亚', 'zh-TW': '拉脫維亞', en: 'Latvia' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'LI', name: { 'zh-CN': '列支敦士登', 'zh-TW': '列支敦士登', en: 'Liechtenstein' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 3 } }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 3 } } },
  { code: 'LT', name: { 'zh-CN': '立陶宛', 'zh-TW': '立陶宛', en: 'Lithuania' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'LU', name: { 'zh-CN': '卢森堡', 'zh-TW': '盧森堡', en: 'Luxembourg' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 } }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 3 } } },
  { code: 'MT', name: { 'zh-CN': '马耳他', 'zh-TW': '馬耳他', en: 'Malta' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 } }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 3 } } },
  { code: 'MD', name: { 'zh-CN': '摩尔多瓦', 'zh-TW': '摩爾多瓦', en: 'Moldova' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'MC', name: { 'zh-CN': '摩纳哥', 'zh-TW': '摩納哥', en: 'Monaco' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 3 } }, HK: { air: 2 }, MO: { air: 2, surface: 2 }, TW: { air: 3 } } },
  { code: 'ME', name: { 'zh-CN': '黑山', 'zh-TW': '黑山', en: 'Montenegro' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'MK', name: { 'zh-CN': '北马其顿', 'zh-TW': '北馬其頓', en: 'North Macedonia' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'NO', name: { 'zh-CN': '挪威', 'zh-TW': '挪威', en: 'Norway' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3, surface: 2 }, TW: { air: 3 } } },
  { code: 'PL', name: { 'zh-CN': '波兰', 'zh-TW': '波蘭', en: 'Poland' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'RO', name: { 'zh-CN': '罗马尼亚', 'zh-TW': '羅馬尼亞', en: 'Romania' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'SM', name: { 'zh-CN': '圣马力诺', 'zh-TW': '聖馬力諾', en: 'San Marino' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 3 } }, HK: { air: 2 }, MO: { air: 2, surface: 2 }, TW: { air: 3 } } },
  { code: 'RS', name: { 'zh-CN': '塞尔维亚', 'zh-TW': '塞爾維亞', en: 'Serbia' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'SK', name: { 'zh-CN': '斯洛伐克', 'zh-TW': '斯洛伐克', en: 'Slovakia' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'SI', name: { 'zh-CN': '斯洛文尼亚', 'zh-TW': '斯洛文尼亞', en: 'Slovenia' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'SE', name: { 'zh-CN': '瑞典', 'zh-TW': '瑞典', en: 'Sweden' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'CH', name: { 'zh-CN': '瑞士', 'zh-TW': '瑞士', en: 'Switzerland' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 3 } }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 3 } } },
  { code: 'UA', name: { 'zh-CN': '乌克兰', 'zh-TW': '烏克蘭', en: 'Ukraine' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'VA', name: { 'zh-CN': '梵蒂冈', 'zh-TW': '梵蒂岡', en: 'Vatican City' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 3 } }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 3 } } },
  { code: 'XE', name: { 'zh-CN': '欧洲其他地区', 'zh-TW': '歐洲其他地區', en: 'Other European Countries' }, continent: 'EU', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },

  // 非洲 (AF)
  { code: 'EG', name: { 'zh-CN': '埃及', 'zh-TW': '埃及', en: 'Egypt' }, continent: 'AF', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3, surface: 1 }, TW: { air: 3 } } },
  { code: 'ZA', name: { 'zh-CN': '南非', 'zh-TW': '南非', en: 'South Africa' }, continent: 'AF', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3, surface: 2 }, TW: { air: 3 } } },
  { code: 'NG', name: { 'zh-CN': '尼日利亚', 'zh-TW': '奈及利亞', en: 'Nigeria' }, continent: 'AF', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'KE', name: { 'zh-CN': '肯尼亚', 'zh-TW': '肯亞', en: 'Kenya' }, continent: 'AF', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'ET', name: { 'zh-CN': '埃塞俄比亚', 'zh-TW': '衣索比亞', en: 'Ethiopia' }, continent: 'AF', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'GH', name: { 'zh-CN': '加纳', 'zh-TW': '迦納', en: 'Ghana' }, continent: 'AF', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'MA', name: { 'zh-CN': '摩洛哥', 'zh-TW': '摩洛哥', en: 'Morocco' }, continent: 'AF', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'DZ', name: { 'zh-CN': '阿尔及利亚', 'zh-TW': '阿爾及利亞', en: 'Algeria' }, continent: 'AF', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'UG', name: { 'zh-CN': '乌干达', 'zh-TW': '烏干達', en: 'Uganda' }, continent: 'AF', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'TZ', name: { 'zh-CN': '坦桑尼亚', 'zh-TW': '坦尚尼亞', en: 'Tanzania' }, continent: 'AF', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'KM', name: { 'zh-CN': '科摩罗', 'zh-TW': '葛摩', en: 'Comoros' }, continent: 'AF', postalZone: { CN: { air: { letter: 4, other: 3 }, sal: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'LS', name: { 'zh-CN': '莱索托', 'zh-TW': '賴索托', en: 'Lesotho' }, continent: 'AF', postalZone: { CN: { air: { letter: 4, other: 3 }, sal: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'ST', name: { 'zh-CN': '圣多美和普林西比', 'zh-TW': '聖多美普林西比', en: 'Sao Tome and Principe' }, continent: 'AF', postalZone: { CN: { air: { letter: 4, other: 3 }, sal: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'AC', name: { 'zh-CN': '阿森松岛', 'zh-TW': '阿森松島', en: 'Ascension Island' }, continent: 'AF', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 3 } } },
  { code: 'TA', name: { 'zh-CN': '特里斯坦-达库尼亚群岛', 'zh-TW': '特里斯坦-達庫尼亞群島', en: 'Tristan da Cunha' }, continent: 'AF', postalZone: { CN: { air: { letter: 4, other: 3 }, sal: { letter: 4, other: 3 } }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 3 } } },
  { code: 'IC', name: { 'zh-CN': '加那利群岛', 'zh-TW': '加那利群島', en: 'Canary Islands' }, continent: 'AF', postalZone: { CN: { air: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 3 } } },
  { code: 'PT-20', name: { 'zh-CN': '亚速尔群岛', 'zh-TW': '亞速爾群島', en: 'Azores Islands' }, continent: 'AF', postalZone: { CN: { air: { letter: 2, other: 2 }, sal: { letter: 4, other: 3 } }, HK: { air: 2 }, MO: { air: 2, surface: 2 }, TW: { air: 3 } } },
  { code: 'PT-30', name: { 'zh-CN': '马德拉群岛', 'zh-TW': '馬德拉群島', en: 'Madeira Islands' }, continent: 'AF', postalZone: { CN: { air: { letter: 2, other: 2 }, sal: { letter: 4, other: 3 } }, HK: { air: 2 }, MO: { air: 2, surface: 2 }, TW: { air: 3 } } },
  { code: 'XF', name: { 'zh-CN': '非洲其他地区', 'zh-TW': '非洲其他地區', en: 'Other African Countries' }, continent: 'AF', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },

  // 北美洲 (NA)
  { code: 'US', name: { 'zh-CN': '美国', 'zh-TW': '美國', en: 'United States' }, continent: 'NA', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 2, surface: 2 }, MO: { air: 2, surface: 2 }, TW: { air: 5 } } },
  { code: 'CA', name: { 'zh-CN': '加拿大', 'zh-TW': '加拿大', en: 'Canada' }, continent: 'NA', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 2 }, HK: { air: 2, surface: 2 }, MO: { air: 2, surface: 2 }, TW: { air: 4 } } },
  { code: 'MX', name: { 'zh-CN': '墨西哥', 'zh-TW': '墨西哥', en: 'Mexico' }, continent: 'NA', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 3 } } },
  { code: 'GL', name: { 'zh-CN': '格陵兰', 'zh-TW': '格陵蘭', en: 'Greenland' }, continent: 'NA', postalZone: { CN: { air: { letter: 4, other: 3 }, sal: { letter: 4, other: 3 } }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 3 } } },
  { code: 'BM', name: { 'zh-CN': '百慕大', 'zh-TW': '百慕達', en: 'Bermuda' }, continent: 'NA', postalZone: { CN: { air: { letter: 4, other: 3 }, sal: { letter: 4, other: 3 } }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 3 } } },
  { code: 'PM', name: { 'zh-CN': '圣皮埃尔和密克隆', 'zh-TW': '聖皮耶與密克隆', en: 'Saint Pierre and Miquelon' }, continent: 'NA', postalZone: { CN: { air: { letter: 4, other: 3 }, sal: { letter: 4, other: 3 } }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 3 } } },
  { code: 'VI', name: { 'zh-CN': '美属维尔京群岛', 'zh-TW': '美屬維爾京群島', en: 'US Virgin Islands' }, continent: 'NA', postalZone: { CN: { air: { letter: 4, other: 3 }, sal: { letter: 4, other: 3 } }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 4 } } },
  { code: 'PR', name: { 'zh-CN': '波多黎各', 'zh-TW': '波多黎各', en: 'Puerto Rico' }, continent: 'NA', postalZone: { CN: { air: { letter: 4, other: 3 }, sal: { letter: 4, other: 3 } }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 4 } } },
  { code: 'AI', name: { 'zh-CN': '安圭拉岛', 'zh-TW': '安圭拉島', en: 'Anguilla' }, continent: 'NA', postalZone: { CN: { air: { letter: 4, other: 3 }, sal: { letter: 4, other: 3 } }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 3 } } },
  { code: 'XN', name: { 'zh-CN': '北美洲其他地区', 'zh-TW': '北美洲其他地區', en: 'Other N. Am. Countries' }, continent: 'NA', postalZone: { CN: { air: { letter: 4, other: 3 }, sal: { letter: 4, other: 3 } }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 3 } } },

  // 南美洲 (SA)
  { code: 'BR', name: { 'zh-CN': '巴西', 'zh-TW': '巴西', en: 'Brazil' }, continent: 'SA', postalZone: { CN: { air: { letter: 4, other: 3 }, sal: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'AR', name: { 'zh-CN': '阿根廷', 'zh-TW': '阿根廷', en: 'Argentina' }, continent: 'SA', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'CL', name: { 'zh-CN': '智利', 'zh-TW': '智利', en: 'Chile' }, continent: 'SA', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'PE', name: { 'zh-CN': '秘鲁', 'zh-TW': '秘魯', en: 'Peru' }, continent: 'SA', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'CO', name: { 'zh-CN': '哥伦比亚', 'zh-TW': '哥倫比亞', en: 'Colombia' }, continent: 'SA', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'VE', name: { 'zh-CN': '委内瑞拉', 'zh-TW': '委內瑞拉', en: 'Venezuela' }, continent: 'SA', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'EC', name: { 'zh-CN': '厄瓜多尔', 'zh-TW': '厄瓜多', en: 'Ecuador' }, continent: 'SA', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'UY', name: { 'zh-CN': '乌拉圭', 'zh-TW': '烏拉圭', en: 'Uruguay' }, continent: 'SA', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'PY', name: { 'zh-CN': '巴拉圭', 'zh-TW': '巴拉圭', en: 'Paraguay' }, continent: 'SA', postalZone: { CN: { air: { letter: 4, other: 3 }, sal: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'BO', name: { 'zh-CN': '玻利维亚', 'zh-TW': '玻利維亞', en: 'Bolivia' }, continent: 'SA', postalZone: { CN: { air: { letter: 4, other: 3 }, sal: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
  { code: 'XS', name: { 'zh-CN': '南美洲其他地区', 'zh-TW': '南美洲其他地區', en: 'Other S. Am. Countries' }, continent: 'SA', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },

  // 大洋洲 (OC)
  { code: 'AU', name: { 'zh-CN': '澳大利亚', 'zh-TW': '澳洲', en: 'Australia' }, continent: 'OC', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 1 }, HK: { air: 2, surface: 2 }, MO: { air: 2, surface: 2 }, TW: { air: 2 } } },
  { code: 'NZ', name: { 'zh-CN': '新西兰', 'zh-TW': '紐西蘭', en: 'New Zealand' }, continent: 'OC', postalZone: { CN: { air: { letter: 3, other: 2 }, sal: { letter: 3, other: 2 }, surface: 1 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'FJ', name: { 'zh-CN': '斐济', 'zh-TW': '斐濟', en: 'Fiji' }, continent: 'OC', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 1 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'PG', name: { 'zh-CN': '巴布亚新几内亚', 'zh-TW': '巴布亞紐幾內亞', en: 'Papua New Guinea' }, continent: 'OC', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 1 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'NR', name: { 'zh-CN': '瑙鲁', 'zh-TW': '瑙魯', en: 'Nauru' }, continent: 'OC', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 1 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'SB', name: { 'zh-CN': '所罗门群岛', 'zh-TW': '所羅門群島', en: 'Solomon Islands' }, continent: 'OC', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 1 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },
  { code: 'XO', name: { 'zh-CN': '大洋洲其他地区', 'zh-TW': '大洋洲其他地區', en: 'Other Oceanian Countries' }, continent: 'OC', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 2 }, MO: { air: 2 }, TW: { air: 2 } } },

  // 南极洲 (AN)
  { code: 'AQ', name: { 'zh-CN': '南极洲', 'zh-TW': '南極洲', en: 'Antarctica' }, continent: 'AN', postalZone: { CN: { air: { letter: 4, other: 3 }, surface: 2 }, HK: { air: 3, surface: 3 }, MO: { air: 3 }, TW: { air: 3 } } },
];

// 合并所有地区
export const ALL_REGIONS: Region[] = [
  ...SPECIAL_REGIONS,
  ...MAINLAND_PROVINCES,
  ...INTERNATIONAL_REGIONS,
];

// prettier-ignore
const MAINLAND_POSTAL_ZONES: Record<string, string[][]> = {
  AH: [
    ['AH'],
    ['HA', 'HB', 'JS', 'JX', 'SD', 'SH', 'ZJ'],
    ['FJ', 'HE', 'HN', 'SX', 'SN', 'TJ'],
    ['BJ', 'CQ', 'GS', 'GD', 'GX', 'GZ', 'HI', 'JL', 'LN', 'NM', 'NX', 'QH', 'SC'],
    ['HL', 'YN'],
    ['XZ', 'XJ']
  ],

  BJ: [
    ['BJ'],
    ['HE', 'NM', 'SD', 'TJ'],
    ['HA', 'JL', 'JS', 'LN', 'SX'],
    ['AH', 'CQ', 'FJ', 'GS', 'HL', 'HB', 'HN', 'JX', 'NX', 'QH', 'SN', 'SH', 'SC', 'ZJ'],
    ['GD', 'GX', 'GZ', 'HI', 'YN'],
    ['XZ', 'XJ']
  ],

  CQ: [
    ['CQ'],
    ['GZ', 'HB', 'HN', 'SN', 'SC'],
    ['GX', 'YN'],
    ['AH', 'BJ', 'FJ', 'GS', 'GD', 'HI', 'HE', 'HA', 'JS', 'JX', 'NM', 'NX', 'QH', 'SD', 'SX', 'SH', 'TJ', 'ZJ'],
    ['HL', 'JL', 'LN', 'XZ'],
    ['XJ']
  ],

  FJ: [
    ['FJ'],
    ['GD', 'JX', 'ZJ'],
    ['AH', 'HB', 'HN', 'JS', 'SH'],
    ['BJ', 'CQ', 'GX', 'GZ', 'HI', 'HE', 'HA', 'SD', 'SX', 'SN', 'SC', 'TJ'],
    ['GS', 'HL', 'JL', 'LN', 'NM', 'NX', 'QH', 'YN'],
    ['XZ', 'XJ']
  ],

  GS: [
    ['GS'],
    ['NM', 'NX', 'QH', 'SN', 'SC', 'XJ'],
    ['SX'],
    ['AH', 'BJ', 'CQ', 'GZ', 'HE', 'HA', 'HB', 'HN', 'JS', 'JX', 'SD', 'SH', 'TJ', 'YN', 'ZJ'],
    ['FJ', 'GD', 'GX', 'HI', 'HL', 'JL', 'LN', 'XZ'],
    []
  ],

  GD: [
    ['GD'],
    ['FJ', 'GX', 'HI', 'HN', 'JX'],
    ['HB'],
    ['AH', 'CQ', 'GZ', 'HE', 'HA', 'JS', 'SD', 'SX', 'SN', 'SH', 'SC', 'YN', 'ZJ'],
    ['BJ', 'GS', 'LN', 'NM', 'NX', 'QH', 'TJ'],
    ['HL', 'JL', 'XZ', 'XJ']
  ],

  GX: [
    ['GX'],
    ['GD', 'GZ', 'HI', 'HN', 'YN'],
    ['CQ'],
    ['AH', 'FJ', 'HA', 'HB', 'JS', 'JX', 'SN', 'SH', 'SC', 'ZJ'],
    ['BJ', 'GS', 'HE', 'LN', 'NM', 'NX', 'QH', 'SD', 'SX', 'TJ'],
    ['HL', 'JL', 'XZ', 'XJ']
  ],

  GZ: [
    ['GZ'],
    ['CQ', 'GX', 'HN', 'SC', 'YN'],
    [],
    ['AH', 'FJ', 'GS', 'GD', 'HI', 'HE', 'HA', 'HB', 'JS', 'JX', 'NX', 'QH', 'SD', 'SX', 'SN', 'SH', 'ZJ'],
    ['BJ', 'LN', 'NM', 'TJ', 'XZ'],
    ['HL', 'JL', 'XJ']
  ],

  HI: [
    ['HI'],
    ['GD', 'GX'],
    [],
    ['AH', 'CQ', 'FJ', 'GZ', 'HB', 'HN', 'JS', 'JX', 'SC', 'YN', 'ZJ'],
    ['BJ', 'GS', 'HE', 'HA', 'NM', 'NX', 'QH', 'SD', 'SX', 'SN', 'SH', 'TJ'],
    ['HL', 'JL', 'LN', 'XZ', 'XJ']
  ],

  HE: [
    ['HE'],
    ['BJ', 'HA', 'LN', 'NM', 'SD', 'SX', 'TJ'],
    ['AH', 'HB', 'JS', 'NX', 'SN'],
    ['CQ', 'FJ', 'GS', 'GD', 'GZ', 'HL', 'HN', 'JL', 'JX', 'QH', 'SH', 'SC', 'ZJ'],
    ['GX', 'HI', 'XJ', 'YN'],
    ['XZ']
  ],

  HA: [
    ['HA'],
    ['AH', 'HE', 'HB', 'SD', 'SX', 'SN'],
    ['BJ', 'HN', 'JS', 'JX', 'NM', 'SH', 'TJ', 'ZJ'],
    ['CQ', 'FJ', 'GS', 'GD', 'GX', 'GZ', 'HL', 'JL', 'LN', 'NX', 'QH', 'SC'],
    ['HI', 'YN'],
    ['XZ', 'XJ']
  ],

  HL: [
    ['HL'],
    ['JL', 'NM'],
    ['LN'],
    ['BJ', 'HE', 'HA', 'SD', 'SX', 'TJ'],
    ['AH', 'CQ', 'FJ', 'GS', 'HB', 'HN', 'JS', 'JX', 'NX', 'QH', 'SN', 'SH', 'ZJ'],
    ['GD', 'GX', 'GZ', 'HI', 'SC', 'XZ', 'XJ', 'YN']
  ],

  HB: [
    ['HB'],
    ['AH', 'CQ', 'HA', 'HN', 'JX', 'SN'],
    ['FJ', 'GD', 'HE', 'JS', 'SD', 'SX', 'SH', 'ZJ'],
    ['BJ', 'GS', 'GX', 'GZ', 'HI', 'LN', 'NM', 'NX', 'QH', 'SC', 'TJ', 'YN'],
    ['HL', 'JL'],
    ['XZ', 'XJ']
  ],

  HN: [
    ['HN'],
    ['CQ', 'GD', 'GX', 'GZ', 'HB', 'JX'],
    ['AH', 'FJ', 'HA', 'JS', 'SN', 'ZJ'],
    ['BJ', 'GS', 'HI', 'HE', 'NM', 'NX', 'QH', 'SD', 'SX', 'SH', 'SC', 'TJ', 'YN'],
    ['HL', 'JL', 'LN'],
    ['XZ', 'XJ']
  ],

  JL: [
    ['JL'],
    ['HL', 'LN', 'NM'],
    ['BJ', 'TJ'],
    ['AH', 'HE', 'HA', 'JS', 'SD', 'SX', 'SH'],
    ['CQ', 'FJ', 'GS', 'HB', 'HN', 'JX', 'NX', 'QH', 'SN', 'SC', 'ZJ'],
    ['GD', 'GX', 'GZ', 'HI', 'XZ', 'XJ', 'YN']
  ],

  JS: [
    ['JS'],
    ['AH', 'SD', 'SH', 'ZJ'],
    ['BJ', 'FJ', 'HE', 'HA', 'HB', 'HN', 'JX', 'TJ'],
    ['CQ', 'GS', 'GD', 'GX', 'GZ', 'HI', 'JL', 'LN', 'NM', 'NX', 'QH', 'SX', 'SN', 'SC'],
    ['HL', 'YN'],
    ['XZ', 'XJ']
  ],

  JX: [
    ['JX'],
    ['AH', 'FJ', 'GD', 'HB', 'HN', 'ZJ'],
    ['HA', 'JS', 'SH'],
    ['BJ', 'CQ', 'GS', 'GX', 'GZ', 'HI', 'HE', 'NM', 'NX', 'QH', 'SD', 'SX', 'SN', 'SC', 'TJ', 'YN'],
    ['HL', 'JL', 'LN'],
    ['XZ', 'XJ']
  ],

  LN: [
    ['LN'],
    ['HE', 'JL', 'NM'],
    ['BJ', 'HL', 'SD', 'TJ'],
    ['AH', 'HA', 'HB', 'JS', 'NX', 'SX', 'SN', 'SH', 'ZJ'],
    ['CQ', 'FJ', 'GS', 'GD', 'GX', 'GZ', 'HN', 'JX', 'QH', 'SC'],
    ['HI', 'XZ', 'XJ', 'YN']
  ],

  NM: [
    [],
    ['NM', 'BJ', 'GS', 'HE', 'HL', 'JL', 'LN', 'NX', 'SX', 'SN'],
    ['HA', 'SD', 'TJ'],
    ['AH', 'CQ', 'HB', 'HN', 'JS', 'JX', 'QH', 'SH', 'SC', 'ZJ'],
    ['FJ', 'GD', 'GX', 'GZ', 'HI', 'XJ', 'YN'],
    ['XZ']
  ],

  NX: [
    ['NX'],
    ['GS', 'NM', 'SN'],
    ['HE', 'QH', 'SX'],
    ['AH', 'BJ', 'CQ', 'GZ', 'HA', 'HB', 'HN', 'JS', 'JX', 'LN', 'SD', 'SH', 'SC', 'TJ', 'ZJ'],
    ['FJ', 'GD', 'GX', 'HI', 'HL', 'JL', 'XZ', 'XJ', 'YN'],
    []
  ],

  QH: [
    [],
    ['QH', 'GS', 'SC', 'XZ', 'XJ'],
    ['NX', 'SN'],
    ['AH', 'BJ', 'CQ', 'GZ', 'HE', 'HA', 'HB', 'HN', 'JS', 'JX', 'NM', 'SD', 'SX', 'TJ', 'YN'],
    ['FJ', 'GD', 'GX', 'HI', 'HL', 'JL', 'LN', 'SH', 'ZJ'],
    []
  ],

  SD: [
    ['SD'],
    ['AH', 'BJ', 'HE', 'HA', 'JS', 'TJ'],
    ['HB', 'LN', 'NM', 'SX', 'SN', 'SH', 'ZJ'],
    ['CQ', 'FJ', 'GS', 'GD', 'GZ', 'HL', 'HN', 'JL', 'JX', 'NX', 'QH', 'SC'],
    ['GX', 'HI', 'YN'],
    ['XZ', 'XJ']
  ],

  SX: [
    ['SX'],
    ['HE', 'HA', 'NM', 'SN'],
    ['AH', 'BJ', 'GS', 'HB', 'NX', 'SD', 'TJ'],
    ['CQ', 'FJ', 'GD', 'GZ', 'HL', 'HN', 'JL', 'JS', 'JX', 'LN', 'QH', 'SH', 'SC', 'ZJ'],
    ['GX', 'HI', 'XJ', 'YN'],
    ['XZ']
  ],

  SN: [
    ['SN'],
    ['CQ', 'GS', 'HA', 'HB', 'NM', 'NX', 'SX', 'SC'],
    ['AH', 'HE', 'HN', 'QH', 'SD'],
    ['BJ', 'FJ', 'GD', 'GX', 'GZ', 'JS', 'JX', 'LN', 'SH', 'TJ', 'YN', 'ZJ'],
    ['HI', 'HL', 'JL', 'XZ', 'XJ'],
    []
  ],

  SH: [
    ['SH'],
    ['AH', 'JS', 'ZJ'],
    ['FJ', 'HA', 'HB', 'JX', 'SD'],
    ['BJ', 'CQ', 'GS', 'GD', 'GX', 'GZ', 'HE', 'HN', 'JL', 'LN', 'NM', 'NX', 'SX', 'SN', 'SC', 'TJ'],
    ['HI', 'HL', 'QH', 'YN'],
    ['XZ', 'XJ']
  ],

  SC: [
    ['SC'],
    ['CQ', 'GS', 'GZ', 'QH', 'SN', 'XZ', 'YN'],
    [],
    ['AH', 'BJ', 'FJ', 'GD', 'GX', 'HI', 'HE', 'HA', 'HB', 'HN', 'JS', 'JX', 'NM', 'NX', 'SD', 'SX', 'SH', 'TJ', 'ZJ'],
    ['JL', 'LN', 'XJ'],
    ['HL']
  ],

  TJ: [
    ['TJ'],
    ['BJ', 'HE', 'SD'],
    ['AH', 'HA', 'JL', 'JS', 'LN', 'NM', 'SX'],
    ['CQ', 'FJ', 'GS', 'HL', 'HB', 'HN', 'JX', 'NX', 'QH', 'SN', 'SH', 'SC', 'ZJ'],
    ['GD', 'GX', 'GZ', 'HI', 'YN'],
    ['XZ', 'XJ']
  ],

  XZ: [
    [],
    ['XZ', 'QH', 'SC', 'XJ', 'YN'],
    [],
    [],
    ['CQ', 'GS', 'GZ', 'NX', 'SN'],
    ['AH', 'BJ', 'FJ', 'GD', 'GX', 'HI', 'HE', 'HA', 'HL', 'HB', 'HN', 'JL', 'JS', 'JX', 'LN', 'NM', 'SD', 'SX', 'SH', 'TJ', 'ZJ']
  ],

  XJ: [
    [],
    ['XJ', 'GS', 'QH', 'XZ'],
    [],
    [],
    ['HE', 'NM', 'NX', 'SX', 'SN', 'SC'],
    ['AH', 'BJ', 'CQ', 'FJ', 'GD', 'GX', 'GZ', 'HI', 'HA', 'HL', 'HB', 'HN', 'JL', 'JS', 'JX', 'LN', 'SD', 'SH', 'TJ', 'YN', 'ZJ']
  ],

  YN: [
    ['YN'],
    ['GX', 'GZ', 'SC', 'XZ'],
    ['CQ'],
    ['GS', 'GD', 'HI', 'HB', 'HN', 'JX', 'QH', 'SN'],
    ['AH', 'BJ', 'FJ', 'HE', 'HA', 'JS', 'NM', 'NX', 'SD', 'SX', 'SH', 'TJ', 'ZJ'],
    ['HL', 'JL', 'LN', 'XJ']
  ],

  ZJ: [
    ['ZJ'],
    ['AH', 'FJ', 'JS', 'JX', 'SH'],
    ['HA', 'HB', 'HN', 'SD'],
    ['BJ', 'CQ', 'GS', 'GD', 'GX', 'GZ', 'HI', 'HE', 'LN', 'NM', 'NX', 'SX', 'SN', 'SC', 'TJ'],
    ['HL', 'JL', 'QH', 'YN'],
    ['XZ', 'XJ']
  ]
};

// 获取中国邮政境内分区信息
export function getChinaPostMainlandParcelZone(
  fromProvince: string,
  toProvince: string,
): 1 | 2 | 3 | 4 | 5 | 6 | undefined {
  // 移除CN-前缀进行查找
  const fromCode = fromProvince.replace('CN-', '');
  const toCode = toProvince.replace('CN-', '');

  // 查找官方分区映射表
  const zoneMapping = MAINLAND_POSTAL_ZONES[fromCode];
  if (!zoneMapping) {
    return;
  }

  // 查找目标省份在哪个档位
  for (let i = 0; i < zoneMapping.length; i++) {
    if (zoneMapping[i].includes(toCode)) {
      return (i + 1) as 1 | 2 | 3 | 4 | 5 | 6;
    }
  }

  // 同省在映射表中没找到，则默认省份面积小于 70 万平方公里，返回一档
  // 少数省份面积大于 70 万平方公里，则在映射表中做定义，优先级更高
  if (fromCode === toCode) {
    return 1;
  }

  // 不同省间寄递，在映射表中没找到，则默认返回四档
  // 四档的省最多，映射表中不存储，减少数据量
  return;
}

// 根据地区代码获取地区类型
export function getRegionType(region: string): RegionCode | 'XX' {
  if (['CN', 'HK', 'MO', 'TW'].includes(region.substring(0, 2)))
    return region.substring(0, 2) as RegionCode;
  return 'XX';
}

// Helper function to determine destination type for rate lookup
export function getDestinationType(
  fromRegionType: RegionCode,
  toRegionType: RegionCode | 'XX',
): DestinationType {
  switch (true) {
    case fromRegionType === toRegionType:
      return 'domestic';
    case toRegionType === 'CN':
      return 'mainland'; // 澳門郵電寄往內地和臺灣資費不同
    case toRegionType === 'XX':
      return 'international';
    case fromRegionType === 'TW':
      return 'international'; // 臺灣寄往港澳適用國際函件資費表
    default:
      return 'regional';
  }
}

// Get corresponding postal zone for pricing
export function getPostalZone(regionType: RegionCode, destination: string): PostalZone | null {
  const region = ALL_REGIONS.find((r) => r.code === destination);
  return region?.postalZone?.[regionType] || null;
}

// Type definitions for postal zone descriptions
type AllZoneDescriptions = {
  [K in PostalServiceName]?: PostalServiceZoneDescriptions;
};

interface PostalServiceZoneDescriptions {
  domestic?: ZoneDescriptions;
  mainland?: CategoryZoneDescriptions;
  regional?: ZoneDescriptions | CategoryZoneDescriptions;
  international?: ZoneDescriptions | CategoryZoneDescriptions;
}

export interface CategoryZoneDescriptions {
  air?: LetterTagZoneDescriptions;
  sal?: LetterTagZoneDescriptions;
  surface?: LetterTagZoneDescriptions;
}

interface LetterTagZoneDescriptions {
  letter?: ZoneDescriptions;
  other?: ZoneDescriptions;
}

export interface ZoneDescriptions {
  [key: number]: string;
}

export const POSTAL_ZONE_DESCRIPTIONS: AllZoneDescriptions = {
  china_post: {
    domestic: {
      1: '一档：省份面积小于 70 万平方公里的省内寄递',
      2: '二档：相邻省和省会距离不超过 500 公里',
      3: '三档：省会距离 500-1000 公里',
      4: '四档：省会距离 1000-2000 公里',
      5: '五档：省会距离 2000-3000 公里',
      6: '六档：省会距离 3000 公里以上',
    },
    international: {
      air: {
        letter: {
          1: '信函一组：东亚、中亚邻近国家',
          2: '信函二组：其他亚洲国家或地区',
          3: '信函三组：欧洲各国、美加澳新',
          4: '信函四组：拉美、非洲、太平洋岛屿',
        },
        other: {
          1: '包裹一组：阿联酋等亚洲 21 国',
          2: '包裹二组：阿塞拜疆等亚欧 50 国、美加澳新',
          3: '包裹三组：其他国家和地区',
        },
      },
      sal: {
        letter: {
          1: '信函一组：韩国、日本',
          2: '信函二组：塞浦路斯',
          3: '信函三组：亚欧其他国家、美加澳',
          4: '信函四组：美洲、非洲部分国家和地区',
        },
        other: {
          1: '包裹一组：格鲁吉亚',
          2: '包裹二组：阿塞拜疆等 40 国',
          3: '包裹三组：俄罗斯等 27 个国家和地区',
        },
      },
      surface: {
        letter: {
          1: '27 个亚太国家和地区',
          2: '标准资费',
        },
      },
    },
  },
  chunghwa_post: {
    international: {
      1: '香港澳門',
      2: '亞洲及大洋洲',
      3: '歐非中南美洲各地、東經180度以東各島',
      4: '加拿大；美國之屬地或離島',
      5: '美國本土',
    },
  },
};
