export type MailCategory = 'air' | 'sal' | 'surface';

export type MailType =
  | 'letter'
  | 'postcard'
  | 'aerogramme'
  | 'printed_papers'
  | 'items_for_blind'
  | 'small_packet'
  | 'm_bags'
  | 'parcel';

export const ALL_MAIL_TYPES: MailType[] = [
  'letter',
  'postcard',
  'aerogramme',
  'printed_papers',
  'items_for_blind',
  'small_packet',
  'm_bags',
  'parcel',
];
