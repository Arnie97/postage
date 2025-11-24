export interface Region {
  code: string;
  name: {
    'zh-CN': string;
    'zh-TW': string;
    'en': string;
  };
  continent?: 'AS' | 'AF' | 'EU' | 'NA' | 'SA' | 'OC' | 'AN';
}

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

// 港澳台地区（按港澳台顺序）
export const SPECIAL_REGIONS: Region[] = [
  { code: 'HK', name: { 'zh-CN': '香港', 'zh-TW': '香港', 'en': 'Hong Kong' } },
  { code: 'MO', name: { 'zh-CN': '澳门', 'zh-TW': '澳門', 'en': 'Macau' } },
  { code: 'TW', name: { 'zh-CN': '台湾', 'zh-TW': '臺灣', 'en': 'Taiwan' } },
];

// 国际地区（按大洲分组）
// prettier-ignore
export const INTERNATIONAL_REGIONS: Region[] = [
  // 亚洲 (AS)
  { code: 'JP', name: { 'zh-CN': '日本', 'zh-TW': '日本', en: 'Japan' }, continent: 'AS' },
  { code: 'KR', name: { 'zh-CN': '韩国', 'zh-TW': '韓國', en: 'South Korea' }, continent: 'AS' },
  { code: 'KP', name: { 'zh-CN': '朝鲜', 'zh-TW': '朝鮮', en: 'North Korea' }, continent: 'AS' },
  { code: 'MN', name: { 'zh-CN': '蒙古', 'zh-TW': '蒙古', en: 'Mongolia' }, continent: 'AS' },
  { code: 'VN', name: { 'zh-CN': '越南', 'zh-TW': '越南', en: 'Vietnam' }, continent: 'AS' },
  { code: 'LA', name: { 'zh-CN': '老挝', 'zh-TW': '寮國', en: 'Laos' }, continent: 'AS' },
  { code: 'KH', name: { 'zh-CN': '柬埔寨', 'zh-TW': '柬埔寨', en: 'Cambodia' }, continent: 'AS' },
  { code: 'TH', name: { 'zh-CN': '泰国', 'zh-TW': '泰國', en: 'Thailand' }, continent: 'AS' },
  { code: 'MM', name: { 'zh-CN': '缅甸', 'zh-TW': '緬甸', en: 'Myanmar' }, continent: 'AS' },
  { code: 'MY', name: { 'zh-CN': '马来西亚', 'zh-TW': '馬來西亞', en: 'Malaysia' }, continent: 'AS' },
  { code: 'SG', name: { 'zh-CN': '新加坡', 'zh-TW': '新加坡', en: 'Singapore' }, continent: 'AS' },
  { code: 'ID', name: { 'zh-CN': '印度尼西亚', 'zh-TW': '印尼', en: 'Indonesia' }, continent: 'AS' },
  { code: 'BN', name: { 'zh-CN': '文莱', 'zh-TW': '汶萊', en: 'Brunei' }, continent: 'AS' },
  { code: 'PH', name: { 'zh-CN': '菲律宾', 'zh-TW': '菲律賓', en: 'Philippines' }, continent: 'AS' },
  { code: 'IN', name: { 'zh-CN': '印度', 'zh-TW': '印度', en: 'India' }, continent: 'AS' },
  { code: 'PK', name: { 'zh-CN': '巴基斯坦', 'zh-TW': '巴基斯坦', en: 'Pakistan' }, continent: 'AS' },
  { code: 'BD', name: { 'zh-CN': '孟加拉国', 'zh-TW': '孟加拉', en: 'Bangladesh' }, continent: 'AS' },
  { code: 'LK', name: { 'zh-CN': '斯里兰卡', 'zh-TW': '斯里蘭卡', en: 'Sri Lanka' }, continent: 'AS' },
  { code: 'NP', name: { 'zh-CN': '尼泊尔', 'zh-TW': '尼泊爾', en: 'Nepal' }, continent: 'AS' },
  { code: 'AF', name: { 'zh-CN': '阿富汗', 'zh-TW': '阿富汗', en: 'Afghanistan' }, continent: 'AS' },
  { code: 'XA', name: { 'zh-CN': '亚洲其他地区', 'zh-TW': '亞洲其他地區', en: 'Other Asian Countries' }, continent: 'AS' },

  // 非洲 (AF)
  { code: 'EG', name: { 'zh-CN': '埃及', 'zh-TW': '埃及', en: 'Egypt' }, continent: 'AF' },
  { code: 'ZA', name: { 'zh-CN': '南非', 'zh-TW': '南非', en: 'South Africa' }, continent: 'AF' },
  { code: 'NG', name: { 'zh-CN': '尼日利亚', 'zh-TW': '奈及利亞', en: 'Nigeria' }, continent: 'AF' },
  { code: 'KE', name: { 'zh-CN': '肯尼亚', 'zh-TW': '肯亞', en: 'Kenya' }, continent: 'AF' },
  { code: 'ET', name: { 'zh-CN': '埃塞俄比亚', 'zh-TW': '衣索比亞', en: 'Ethiopia' }, continent: 'AF' },
  { code: 'GH', name: { 'zh-CN': '加纳', 'zh-TW': '迦納', en: 'Ghana' }, continent: 'AF' },
  { code: 'MA', name: { 'zh-CN': '摩洛哥', 'zh-TW': '摩洛哥', en: 'Morocco' }, continent: 'AF' },
  { code: 'DZ', name: { 'zh-CN': '阿尔及利亚', 'zh-TW': '阿爾及利亞', en: 'Algeria' }, continent: 'AF' },
  { code: 'UG', name: { 'zh-CN': '乌干达', 'zh-TW': '烏干達', en: 'Uganda' }, continent: 'AF' },
  { code: 'TZ', name: { 'zh-CN': '坦桑尼亚', 'zh-TW': '坦尚尼亞', en: 'Tanzania' }, continent: 'AF' },
  { code: 'XF', name: { 'zh-CN': '非洲其他地区', 'zh-TW': '非洲其他地區', en: 'Other Africa' }, continent: 'AF' },

  // 欧洲 (EU)
  { code: 'GB', name: { 'zh-CN': '英国', 'zh-TW': '英國', en: 'United Kingdom' }, continent: 'EU' },
  { code: 'FR', name: { 'zh-CN': '法国', 'zh-TW': '法國', en: 'France' }, continent: 'EU' },
  { code: 'DE', name: { 'zh-CN': '德国', 'zh-TW': '德國', en: 'Germany' }, continent: 'EU' },
  { code: 'IT', name: { 'zh-CN': '意大利', 'zh-TW': '義大利', en: 'Italy' }, continent: 'EU' },
  { code: 'ES', name: { 'zh-CN': '西班牙', 'zh-TW': '西班牙', en: 'Spain' }, continent: 'EU' },
  { code: 'PT', name: { 'zh-CN': '葡萄牙', 'zh-TW': '葡萄牙', en: 'Portugal' }, continent: 'EU' },
  { code: 'NL', name: { 'zh-CN': '荷兰', 'zh-TW': '荷蘭', en: 'Netherlands' }, continent: 'EU' },
  { code: 'BE', name: { 'zh-CN': '比利时', 'zh-TW': '比利時', en: 'Belgium' }, continent: 'EU' },
  { code: 'RU', name: { 'zh-CN': '俄罗斯', 'zh-TW': '俄羅斯', en: 'Russia' }, continent: 'EU' },
  { code: 'XE', name: { 'zh-CN': '欧洲其他地区', 'zh-TW': '歐洲其他地區', en: 'Other Europe' }, continent: 'EU' },

  // 北美洲 (NA)
  { code: 'US', name: { 'zh-CN': '美国', 'zh-TW': '美國', en: 'United States' }, continent: 'NA' },
  { code: 'CA', name: { 'zh-CN': '加拿大', 'zh-TW': '加拿大', en: 'Canada' }, continent: 'NA' },
  { code: 'MX', name: { 'zh-CN': '墨西哥', 'zh-TW': '墨西哥', en: 'Mexico' }, continent: 'NA' },
  { code: 'XN', name: { 'zh-CN': '北美洲其他地区', 'zh-TW': '北美洲其他地區', en: 'Other North America' }, continent: 'NA' },

  // 南美洲 (SA)
  { code: 'BR', name: { 'zh-CN': '巴西', 'zh-TW': '巴西', en: 'Brazil' }, continent: 'SA' },
  { code: 'AR', name: { 'zh-CN': '阿根廷', 'zh-TW': '阿根廷', en: 'Argentina' }, continent: 'SA' },
  { code: 'CL', name: { 'zh-CN': '智利', 'zh-TW': '智利', en: 'Chile' }, continent: 'SA' },
  { code: 'PE', name: { 'zh-CN': '秘鲁', 'zh-TW': '祕魯', en: 'Peru' }, continent: 'SA' },
  { code: 'CO', name: { 'zh-CN': '哥伦比亚', 'zh-TW': '哥倫比亞', en: 'Colombia' }, continent: 'SA' },
  { code: 'VE', name: { 'zh-CN': '委内瑞拉', 'zh-TW': '委內瑞拉', en: 'Venezuela' }, continent: 'SA' },
  { code: 'EC', name: { 'zh-CN': '厄瓜多尔', 'zh-TW': '厄瓜多', en: 'Ecuador' }, continent: 'SA' },
  { code: 'UY', name: { 'zh-CN': '乌拉圭', 'zh-TW': '烏拉圭', en: 'Uruguay' }, continent: 'SA' },
  { code: 'PY', name: { 'zh-CN': '巴拉圭', 'zh-TW': '巴拉圭', en: 'Paraguay' }, continent: 'SA' },
  { code: 'BO', name: { 'zh-CN': '玻利维亚', 'zh-TW': '玻利維亞', en: 'Bolivia' }, continent: 'SA' },
  { code: 'XS', name: { 'zh-CN': '其他南美洲地区', 'zh-TW': '其他南美洲地區', en: 'Other South America' }, continent: 'SA' },

  // 大洋洲 (OC)
  { code: 'AU', name: { 'zh-CN': '澳大利亚', 'zh-TW': '澳洲', en: 'Australia' }, continent: 'OC' },
  { code: 'NZ', name: { 'zh-CN': '新西兰', 'zh-TW': '紐西蘭', en: 'New Zealand' }, continent: 'OC' },
  { code: 'FJ', name: { 'zh-CN': '斐济', 'zh-TW': '斐濟', en: 'Fiji' }, continent: 'OC' },
  { code: 'PG', name: { 'zh-CN': '巴布亚新几内亚', 'zh-TW': '巴布亞紐幾內亞', en: 'Papua New Guinea' }, continent: 'OC' },
  { code: 'XO', name: { 'zh-CN': '其他大洋洲地区', 'zh-TW': '其他大洋洲地區', en: 'Other Oceania' }, continent: 'OC' },

  // 南极洲 (AN - Antarctica)
  { code: 'AQ', name: { 'zh-CN': '南极洲', 'zh-TW': '南極洲', en: 'Antarctica' }, continent: 'AN' },
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

// 邮政分区说明
export const POSTAL_ZONES = {
  1: '一档：省份面积小于70万平方公里的省内寄递',
  2: '二档：相邻省和省会距离不超过500公里',
  3: '三档：省会距离500-1000公里',
  4: '四档：省会距离1000-2000公里',
  5: '五档：省会距离2000-3000公里',
  6: '六档：省会距离3000公里以上',
};

// 获取邮政分区（基于官方分区表）
export function getPostalZone(fromProvince: string, toProvince: string): 1 | 2 | 3 | 4 | 5 | 6 {
  // 移除CN-前缀进行查找
  const fromCode = fromProvince.replace('CN-', '');
  const toCode = toProvince.replace('CN-', '');

  // 查找官方分区映射表
  const zoneMapping = MAINLAND_POSTAL_ZONES[fromCode];
  if (!zoneMapping) {
    // 如果没有映射，返回四档作为默认值
    return 4;
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
  return 4;
}

// 根据地区代码获取地区类型
export function getRegionType(regionCode: string): 'CN' | 'HK' | 'MO' | 'TW' | 'XX' {
  if (['CN', 'HK', 'MO', 'TW'].includes(regionCode.substring(0, 2)))
    return regionCode.substring(0, 2) as 'CN' | 'HK' | 'MO' | 'TW';
  return 'XX';
}
