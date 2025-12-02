import type { Language } from '../utils/language';

export type TranslationKey =
  | 'app.title'
  | 'mail.type'
  | 'mail.type.letter'
  | 'mail.type.postcard'
  | 'mail.type.aerogramme'
  | 'mail.type.printed_papers'
  | 'mail.type.items_for_blind'
  | 'mail.type.small_packet'
  | 'mail.type.m_bags'
  | 'mail.type.parcel'
  | 'mail.category'
  | 'mail.category.air'
  | 'mail.category.sal'
  | 'mail.category.surface'
  | 'mail.supplement'
  | 'mail.supplement.registered'
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
  | 'service.china_post'
  | 'service.chunghwa_post'
  | 'service.hongkong_post'
  | 'service.macau_post'
  | 'currency.cny'
  | 'currency.twd'
  | 'currency.hkd'
  | 'currency.mop'
  | 'error.weight'
  | 'error.calculation'
  | 'error.service'
  | 'error.route'
  | 'error.mail_type'
  | 'error.mail_category'
  | 'calculation.fixed-rate'
  | 'calculation.base-weight'
  | 'calculation.additional-weight'
  | 'calculation.tier-range'
  | 'calculation.registration-fee'
  | 'footer.description'
  | 'footer.license'
  | 'footer.source-code';

export const translations: Record<Language, Record<TranslationKey, string>> = {
  'en': {
    'app.title': 'Postage Calculator',
    'mail.type': 'Mail Type',
    'mail.type.letter': 'Letter',
    'mail.type.postcard': 'Postcard',
    'mail.type.aerogramme': 'Aerogramme',
    'mail.type.printed_papers': 'Printed Papers',
    'mail.type.items_for_blind': 'Items for the Blind',
    'mail.type.small_packet': 'Small Packet',
    'mail.type.m_bags': 'M Bags',
    'mail.type.parcel': 'Parcel',
    'mail.category': 'Mail Category',
    'mail.category.air': 'Air Mail',
    'mail.category.sal': 'Surface Air Lifted (SAL)',
    'mail.category.surface': 'Surface Mail',
    'mail.supplement': 'Supplementary Services',
    'mail.supplement.registered': 'Registered ',
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
    'continent.AN': 'Antarctica',
    'weight': 'Weight',
    'weight.grams': 'grams',
    'service.china_post': 'China Post',
    'service.chunghwa_post': 'Chunghwa Post',
    'service.hongkong_post': 'Hongkong Post',
    'service.macau_post': 'Macau Post',
    'currency.cny': 'CNY',
    'currency.twd': 'TWD',
    'currency.hkd': 'HKD',
    'currency.mop': 'MOP',
    'error.weight': 'Invalid weight',
    'error.calculation': 'Unable to calculate postage',
    'error.service': 'Postal service is not available for this origin region',
    'error.route': 'Shipping route is not available for this destination',
    'error.mail_type': 'Mail type is not available for the selected route',
    'error.mail_category': 'Mail category is not available for the selected route',
    'calculation.fixed-rate': 'Fixed Rate',
    'calculation.base-weight': 'Base Weight',
    'calculation.additional-weight': 'Additional Weight',
    'calculation.tier-range': 'Weight',
    'calculation.registration-fee': 'Registration Fee',
    'footer.description': 'Postage calculator for Greater China',
    'footer.source-code': 'Source code',
    'footer.license': ' licensed under GNU AGPL v3',
  },
  'zh-TW': {
    'app.title': '郵費計算機',
    'mail.type': '郵件類型',
    'mail.type.letter': '信件',
    'mail.type.postcard': '明信片',
    'mail.type.aerogramme': '航空郵簡',
    'mail.type.printed_papers': '印刷品',
    'mail.type.items_for_blind': '盲人郵件',
    'mail.type.small_packet': '小郵包',
    'mail.type.m_bags': '印刷品專袋',
    'mail.type.parcel': '包裹',
    'mail.category': '郵件等級',
    'mail.category.air': '航空郵件',
    'mail.category.sal': '空運水陸路 (SAL)',
    'mail.category.surface': '水陸路郵件',
    'mail.supplement': '附加服務',
    'mail.supplement.registered': '掛號',
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
    'continent.AN': '南極洲',
    'weight': '重量',
    'weight.grams': '公克',
    'service.china_post': '中國郵政',
    'service.chunghwa_post': '中華郵政',
    'service.hongkong_post': '香港郵政',
    'service.macau_post': '澳門郵電',
    'currency.cny': '人民幣',
    'currency.twd': '新臺幣',
    'currency.hkd': '港幣',
    'currency.mop': '澳門元',
    'error.weight': '重量無效',
    'error.calculation': '無法計算郵費',
    'error.service': '出發地無郵政服務可用',
    'error.route': '目的地無運送路線可用',
    'error.mail_type': '所選路線不支援此郵件類型',
    'error.mail_category': '所選路線不支援此郵件等級',
    'calculation.fixed-rate': '固定資費',
    'calculation.base-weight': '基本重量',
    'calculation.additional-weight': '額外重量',
    'calculation.tier-range': '重量',
    'calculation.registration-fee': '掛號費',
    'footer.description': '兩岸四地郵費計算機',
    'footer.source-code': '原始碼',
    'footer.license': '以 GNU AGPL v3 授權',
  },
  'zh-CN': {
    'app.title': '邮费计算器',
    'mail.type': '邮件类型',
    'mail.type.letter': '信件',
    'mail.type.postcard': '明信片',
    'mail.type.aerogramme': '航空邮简',
    'mail.type.printed_papers': '印刷品',
    'mail.type.items_for_blind': '盲人邮件',
    'mail.type.small_packet': '小包',
    'mail.type.m_bags': '印刷品专袋',
    'mail.type.parcel': '包裹',
    'mail.category': '邮件等级',
    'mail.category.air': '航空邮件',
    'mail.category.sal': '空运水陆路 (SAL)',
    'mail.category.surface': '水陆路邮件',
    'mail.supplement': '附加业务',
    'mail.supplement.registered': '挂号',
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
    'continent.AN': '南极洲',
    'weight': '重量',
    'weight.grams': '克',
    'service.china_post': '中国邮政',
    'service.chunghwa_post': '中华邮政',
    'service.hongkong_post': '香港邮政',
    'service.macau_post': '澳门邮电',
    'currency.cny': '人民币',
    'currency.twd': '新台币',
    'currency.hkd': '港币',
    'currency.mop': '澳门元',
    'error.weight': '重量无效',
    'error.calculation': '无法计算邮费',
    'error.service': '出发地无邮政服务可用',
    'error.route': '目的地无运送路线可用',
    'error.mail_type': '所选路线不支持此邮件类型',
    'error.mail_category': '所选路线不支持此邮件等级',
    'calculation.fixed-rate': '固定资费',
    'calculation.base-weight': '首重',
    'calculation.additional-weight': '续重',
    'calculation.tier-range': '重量',
    'calculation.registration-fee': '挂号费',
    'footer.description': '两岸四地邮费计算器',
    'footer.source-code': '源代码',
    'footer.license': '以 GNU AGPL v3 授权',
  },
};

export const t = (key: TranslationKey, lang: Language): string => {
  return translations[lang][key] || translations['en'][key] || key;
};

export const s = (section: string, key: string, lang: Language): string => {
  return t(`${section}.${key}` as TranslationKey, lang);
};
