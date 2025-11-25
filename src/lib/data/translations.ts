import type { Language } from '../utils/language';

export type TranslationKey =
  | 'app.title'
  | 'mail.type'
  | 'mail.type.letter'
  | 'mail.type.postcard'
  | 'mail.type.printed_papers'
  | 'mail.type.literature_for_blind'
  | 'mail.type.parcel'
  | 'mail.type.small_packet'
  | 'mail.type.ems'
  | 'delivery.method'
  | 'delivery.method.air'
  | 'delivery.method.sal'
  | 'delivery.method.surface'
  | 'sender'
  | 'receiver'
  | 'region.select'
  | 'region.mainland'
  | 'region.special'
  | 'continent.AS'
  | 'continent.EU'
  | 'continent.AF'
  | 'continent.NA'
  | 'continent.SA'
  | 'continent.OC'
  | 'continent.AN'
  | 'weight'
  | 'weight.grams'
  | 'service.auto'
  | 'service.china-post'
  | 'service.chunghwa-post'
  | 'service.hongkong-post'
  | 'service.macau-post'
  | 'currency.cny'
  | 'currency.twd'
  | 'currency.hkd'
  | 'currency.mop'
  | 'error.weight'
  | 'error.calculation'
  | 'footer.description'
  | 'footer.license'
  | 'footer.source-code';

export const translations: Record<Language, Record<TranslationKey, string>> = {
  'en': {
    'app.title': 'Postage Calculator',
    'mail.type': 'Mail Type',
    'mail.type.letter': 'Letter',
    'mail.type.postcard': 'Postcard',
    'mail.type.printed_papers': 'Printed Papers',
    'mail.type.literature_for_blind': 'Literature for the Blind',
    'mail.type.parcel': 'Parcel',
    'mail.type.small_packet': 'Small Packet',
    'mail.type.ems': 'EMS',
    'delivery.method': 'Delivery Method',
    'delivery.method.air': 'Air Mail',
    'delivery.method.sal': 'Surface Air Lifted (SAL)',
    'delivery.method.surface': 'Surface Mail',
    'sender': 'From',
    'receiver': 'To',
    'region.select': 'Select Region',
    'region.mainland': 'Mainland China',
    'region.special': 'Hong Kong, Macau & Taiwan',
    'continent.AS': 'Asia',
    'continent.EU': 'Europe',
    'continent.AF': 'Africa',
    'continent.NA': 'North America',
    'continent.SA': 'South America',
    'continent.OC': 'Oceania',
    'continent.AN': 'Other',
    'weight': 'Weight',
    'weight.grams': 'grams',
    'service.auto': 'Auto-detected service',
    'service.china-post': 'China Post',
    'service.chunghwa-post': 'Chunghwa Post',
    'service.hongkong-post': 'Hongkong Post',
    'service.macau-post': 'Macau Post',
    'currency.cny': 'CNY',
    'currency.twd': 'TWD',
    'currency.hkd': 'HKD',
    'currency.mop': 'MOP',
    'error.weight': 'Please enter a valid weight',
    'error.calculation': 'Unable to calculate postage',
    'footer.description': 'Postage calculator for Greater China',
    'footer.source-code': 'Source code',
    'footer.license': ' licensed under GNU AGPL v3',
  },
  'zh-TW': {
    'app.title': '郵費計算機',
    'mail.type': '郵件類型',
    'mail.type.letter': '信件',
    'mail.type.postcard': '明信片',
    'mail.type.printed_papers': '印刷品',
    'mail.type.literature_for_blind': '盲人讀物',
    'mail.type.parcel': '包裹',
    'mail.type.small_packet': '小包',
    'mail.type.ems': 'EMS',
    'delivery.method': '寄送方式',
    'delivery.method.air': '航空郵件',
    'delivery.method.sal': '空運水陸路 (SAL)',
    'delivery.method.surface': '水陸路郵件',
    'sender': '寄件地',
    'receiver': '收件地',
    'region.select': '選擇地區',
    'region.mainland': '中國大陸',
    'region.special': '港澳台',
    'continent.AS': '亞洲',
    'continent.EU': '歐洲',
    'continent.AF': '非洲',
    'continent.NA': '北美洲',
    'continent.SA': '南美洲',
    'continent.OC': '大洋洲',
    'continent.AN': '其他',
    'weight': '重量',
    'weight.grams': '公克',
    'service.auto': '自動判斷服務',
    'service.china-post': '中國郵政',
    'service.chunghwa-post': '中華郵政',
    'service.hongkong-post': '香港郵政',
    'service.macau-post': '澳門郵電',
    'currency.cny': '人民幣',
    'currency.twd': '新臺幣',
    'currency.hkd': '港幣',
    'currency.mop': '澳門元',
    'error.weight': '請輸入有效的重量',
    'error.calculation': '無法計算郵費',
    'footer.description': '兩岸四地郵費計算機',
    'footer.source-code': '原始碼',
    'footer.license': '以 GNU AGPL v3 授權',
  },
  'zh-CN': {
    'app.title': '邮费计算器',
    'mail.type': '邮件类型',
    'mail.type.letter': '信件',
    'mail.type.postcard': '明信片',
    'mail.type.printed_papers': '印刷品',
    'mail.type.literature_for_blind': '盲人读物',
    'mail.type.parcel': '包裹',
    'mail.type.small_packet': '小包',
    'mail.type.ems': 'EMS',
    'delivery.method': '寄送方式',
    'delivery.method.air': '航空邮件',
    'delivery.method.sal': '空运水陆路 (SAL)',
    'delivery.method.surface': '水陆路邮件',
    'sender': '寄件地',
    'receiver': '收件地',
    'region.select': '选择地区',
    'region.mainland': '中国大陆',
    'region.special': '港澳台',
    'continent.AS': '亚洲',
    'continent.EU': '欧洲',
    'continent.AF': '非洲',
    'continent.NA': '北美洲',
    'continent.SA': '南美洲',
    'continent.OC': '大洋洲',
    'continent.AN': '其他',
    'weight': '重量',
    'weight.grams': '克',
    'service.auto': '自动判断服务',
    'service.china-post': '中国邮政',
    'service.chunghwa-post': '中华邮政',
    'service.hongkong-post': '香港邮政',
    'service.macau-post': '澳门邮电',
    'currency.cny': '人民币',
    'currency.twd': '新台币',
    'currency.hkd': '港币',
    'currency.mop': '澳门元',
    'error.weight': '请输入有效的重量',
    'error.calculation': '无法计算邮费',
    'footer.description': '两岸四地邮费计算器',
    'footer.source-code': '源代码',
    'footer.license': '以 GNU AGPL v3 授权',
  },
};

export const t = (key: TranslationKey, lang: Language): string => {
  return translations[lang][key] || translations['en'][key] || key;
};
