import type { MailType, MailCategory } from './mail-types';
import type { RegionCode, PostalServiceName, DestinationType } from './regions';

export interface DiscountRule {
  name: {
    'zh-CN': string;
    'zh-TW': string;
    'en': string;
  };
  pricePercent: number;
}

export interface SteppedRate {
  type: 'stepped';
  tiers: Array<{
    baseWeight?: number; // When to switch to this tier (defaults to weightStep)
    basePrice?: number; // Base price for this tier
    weightStep?: number; // Optional: enables stepped pricing
    additionalPrice?: number; // Optional: price per additional step
  }>;
  maxWeight?: number; // Global max weight constraint
  registrationFee?: number;
  discounts?: DiscountRule[];
}

export interface FixedRate {
  type: 'fixed';
  price: number;
  maxWeight?: number;
  registrationFee?: number;
  discounts?: DiscountRule[];
}

export interface ZonalRate {
  type: 'zonal';
  zones: {
    [zoneNumber: number]: {
      baseWeight?: number; // Weight covered by base price (defaults to weightStep if not specified)
      basePrice?: number;
      weightStep?: number;
      additionalPrice?: number;
      maxWeight?: number;
    };
  };
  registrationFee?: number;
  discounts?: DiscountRule[];
}

export interface RateTier {
  baseWeight?: number; // Weight covered by base price (defaults to weightStep if not specified)
  basePrice?: number;
  weightStep?: number;
  additionalPrice?: number;
}

export interface PostalService {
  nameKey: PostalServiceName;
  currency: string;
  primaryColor: string;
  secondaryColor: string;
  rates: {
    [K in DestinationType]?: {
      [K in MailType]?: CategoryRates | Rate | null;
    };
  };
}

export type CategoryRates = {
  [K in MailCategory]?: Rate;
};

export type Rate = SteppedRate | FixedRate | ZonalRate;

// Universal Postal Rate Data Table
export const POSTAGE_RATES: Record<RegionCode, PostalService> = {
  // China Post (中国邮政)
  CN: {
    nameKey: 'china_post',
    currency: 'CNY',
    primaryColor: '#059669', // Forest Green (from logo)
    secondaryColor: '#f59e0b', // Golden Yellow (from logo)
    rates: {
      domestic: {
        insurance: {
          type: 'stepped',
          tiers: [{ baseWeight: 100, basePrice: 1, weightStep: 1, additionalPrice: 0.01 }],
          maxWeight: 20000,
        },
        letter: {
          type: 'stepped',
          tiers: [
            { weightStep: 20, additionalPrice: 1.2 },
            { basePrice: 6.0, weightStep: 100, additionalPrice: 2.0 },
          ],
          maxWeight: 2000,
          registrationFee: 3,
          discounts: [
            {
              name: {
                'zh-CN': '义务兵免费信件',
                'zh-TW': '義務兵免費信件',
                'en': 'Free Mail for PLA / PAP Conscripts',
              },
              pricePercent: 0,
            },
          ],
        },
        postcard: {
          type: 'stepped',
          tiers: [
            { baseWeight: 0, basePrice: 0.8 },
            { baseWeight: 20, basePrice: 4 },
            { baseWeight: 1000, basePrice: 6 },
            { baseWeight: 3000, basePrice: 11 },
          ],
          maxWeight: 5000,
          discounts: [
            {
              name: {
                'zh-CN': '义务兵免费信件',
                'zh-TW': '義務兵免費信件',
                'en': 'Free Mail for PLA / PAP Conscripts',
              },
              pricePercent: 0,
            },
          ],
        },
        aerogramme: {
          type: 'fixed',
          price: 0.8,
          maxWeight: 20,
        },
        printed_papers: {
          type: 'stepped',
          tiers: [{ basePrice: 1.2, weightStep: 100, additionalPrice: 0.4 }],
          maxWeight: 35000,
        },
        items_for_blind: {
          type: 'fixed',
          price: 0.0,
          maxWeight: 35000,
        },
        parcel: {
          type: 'zonal',
          zones: {
            1: { basePrice: 0x5, weightStep: 1000, additionalPrice: 1.0, maxWeight: 50000 },
            2: { basePrice: 0x6, weightStep: 1000, additionalPrice: 1.5, maxWeight: 50000 },
            3: { basePrice: 0x7, weightStep: 1000, additionalPrice: 2.0, maxWeight: 50000 },
            4: { basePrice: 0x8, weightStep: 1000, additionalPrice: 3.0, maxWeight: 50000 },
            5: { basePrice: 0x9, weightStep: 1000, additionalPrice: 4.0, maxWeight: 50000 },
            6: { basePrice: 0xa, weightStep: 1000, additionalPrice: 5.0, maxWeight: 50000 },
          },
          discounts: [
            {
              name: {
                'zh-CN': '师生及新市民U+卡持卡人',
                'zh-TW': '師生及新市民U+卡持卡人',
                'en': 'Teachers, Students and U+ Cardholders',
              },
              pricePercent: 80,
            },
            {
              name: {
                'zh-CN': '解放军和武警官兵、文职及退役军人；残疾人',
                'zh-TW': '解放軍和武警官兵、文職及退役軍人；殘障人士',
                'en': 'Disabled People, PLA / PAP Military Personnel, and Veterans',
              },
              pricePercent: 70,
            },
          ],
        },
      },
      regional: {
        insurance: {
          type: 'stepped',
          tiers: [{ weightStep: 200, additionalPrice: 3 }],
          maxWeight: 20000,
          registrationFee: 2,
        },
        letter: {
          air: {
            type: 'stepped',
            tiers: [
              { weightStep: 10, additionalPrice: 0.5, baseWeight: 0, basePrice: 1.5 },
              { weightStep: 10, additionalPrice: 0.5, baseWeight: 20, basePrice: 3.8 },
              { weightStep: 10, additionalPrice: 0.5, baseWeight: 50, basePrice: 6.5 },
              { weightStep: 10, additionalPrice: 0.5, baseWeight: 100, basePrice: 13.5 },
              { weightStep: 10, additionalPrice: 0.5, baseWeight: 250, basePrice: 29.2 },
              { weightStep: 10, additionalPrice: 0.5, baseWeight: 500, basePrice: 56.7 },
              { weightStep: 10, additionalPrice: 0.5, baseWeight: 1000, basePrice: 105.8 },
            ],
            maxWeight: 2000,
            registrationFee: 16,
          },
          surface: {
            type: 'stepped',
            tiers: [
              { baseWeight: 0, basePrice: 1.5 },
              { baseWeight: 20, basePrice: 2.8 },
              { baseWeight: 50, basePrice: 4.0 },
              { baseWeight: 100, basePrice: 8.5 },
              { baseWeight: 250, basePrice: 16.7 },
              { baseWeight: 500, basePrice: 31.7 },
              { baseWeight: 1000, basePrice: 55.8 },
            ],
            maxWeight: 2000,
            registrationFee: 16,
          },
        },
        postcard: {
          air: {
            type: 'fixed',
            price: 4.0, // + 0.5
            maxWeight: 20,
          },
          surface: {
            type: 'fixed',
            price: 3.5,
            maxWeight: 20,
          },
        },
        aerogramme: {
          type: 'fixed',
          price: 1.8,
          maxWeight: 20,
        },
        printed_papers: {
          air: {
            type: 'stepped',
            tiers: [{ baseWeight: 20, basePrice: 4.5, weightStep: 10, additionalPrice: 1.8 }], // + 0.5
            maxWeight: 500,
          },
          surface: {
            type: 'stepped',
            tiers: [{ baseWeight: 20, basePrice: 3.5, weightStep: 10, additionalPrice: 1.3 }],
            maxWeight: 500,
          },
        },
        items_for_blind: {
          air: {
            type: 'stepped',
            tiers: [{ weightStep: 10, additionalPrice: 0.5 }],
            maxWeight: 35000,
          },
          surface: {
            type: 'fixed',
            price: 0.0,
            maxWeight: 35000,
          },
        },
        small_packet: {
          air: {
            // TODO: not exactly correct
            type: 'stepped',
            tiers: [{ basePrice: 20, weightStep: 100, additionalPrice: 18 }],
            maxWeight: 2000,
          },
          surface: {
            type: 'stepped',
            tiers: [{ basePrice: 15, weightStep: 100, additionalPrice: 13 }],
            maxWeight: 2000,
          },
        },
        m_bags: {
          air: {
            // TODO: not exactly correct
            type: 'stepped',
            tiers: [{ baseWeight: 5000, basePrice: 180, weightStep: 1000, additionalPrice: 45 }],
            maxWeight: 35000,
            registrationFee: 80,
          },
          surface: {
            type: 'stepped',
            tiers: [{ baseWeight: 5000, basePrice: 430, weightStep: 1000, additionalPrice: 95 }],
            maxWeight: 35000,
            registrationFee: 80,
          },
        },
      },
      international: {
        insurance: {
          type: 'stepped',
          tiers: [{ weightStep: 100, additionalPrice: 1 }],
          maxWeight: 20000,
          registrationFee: 2,
        },
        letter: {
          air: {
            type: 'zonal',
            zones: {
              1: { baseWeight: 20, basePrice: 5.0, weightStep: 10, additionalPrice: 1.0, maxWeight: 100 },
              2: { baseWeight: 20, basePrice: 5.5, weightStep: 10, additionalPrice: 1.5, maxWeight: 100 },
              3: { baseWeight: 20, basePrice: 6.0, weightStep: 10, additionalPrice: 1.8, maxWeight: 100 },
              4: { baseWeight: 20, basePrice: 7.0, weightStep: 10, additionalPrice: 2.3, maxWeight: 100 },
            },
            registrationFee: 16,
          },
          sal: {
            type: 'zonal',
            zones: {
              1: { baseWeight: 20, basePrice: 4.5, weightStep: 10, additionalPrice: 0.5, maxWeight: 100 },
              2: { baseWeight: 20, basePrice: 5.0, weightStep: 10, additionalPrice: 0.6, maxWeight: 100 },
              3: { baseWeight: 20, basePrice: 5.5, weightStep: 10, additionalPrice: 0.7, maxWeight: 100 },
              4: { baseWeight: 20, basePrice: 6.5, weightStep: 10, additionalPrice: 0.8, maxWeight: 100 },
            },
            registrationFee: 16,
          },
          surface: {
            type: 'zonal',
            zones: {
              1: { baseWeight: 20, basePrice: 3.5, weightStep: 10, additionalPrice: 0.4, maxWeight: 100 }, // 27 asia-pacific countries
              2: { baseWeight: 20, basePrice: 4.0, weightStep: 10, additionalPrice: 0.5, maxWeight: 100 }, // standard rate
            },
            registrationFee: 16,
          },
        },
        postcard: {
          air: {
            type: 'fixed',
            price: 5.0,
            maxWeight: 20,
          },
          sal: {
            type: 'fixed',
            price: 4.5,
            maxWeight: 20,
          },
          surface: {
            type: 'fixed',
            price: 3.5,
            maxWeight: 20,
          },
        },
        aerogramme: {
          type: 'fixed',
          price: 5.5,
          maxWeight: 20,
        },
        printed_papers: {
          air: {
            type: 'zonal',
            zones: {
              1: { baseWeight: 20, basePrice: 4.5, weightStep: 10, additionalPrice: 2.2, maxWeight: 500 },
              2: { baseWeight: 20, basePrice: 5.0, weightStep: 10, additionalPrice: 2.5, maxWeight: 500 },
              3: { baseWeight: 20, basePrice: 6.0, weightStep: 10, additionalPrice: 2.8, maxWeight: 500 },
            },
          },
          sal: {
            type: 'zonal',
            zones: {
              1: { baseWeight: 20, basePrice: 4.0, weightStep: 10, additionalPrice: 1.9, maxWeight: 500 },
              2: { baseWeight: 20, basePrice: 4.5, weightStep: 10, additionalPrice: 2.2, maxWeight: 500 },
              3: { baseWeight: 20, basePrice: 5.0, weightStep: 10, additionalPrice: 2.5, maxWeight: 500 },
            },
          },
          surface: {
            type: 'stepped',
            tiers: [{ basePrice: 4.0, weightStep: 10, additionalPrice: 1.8 }],
            maxWeight: 500,
          },
        },
        items_for_blind: {
          air: {
            type: 'zonal',
            zones: {
              1: { basePrice: 0, weightStep: 10, additionalPrice: 0.6, maxWeight: 7000 },
              2: { basePrice: 0, weightStep: 10, additionalPrice: 0.8, maxWeight: 7000 },
              3: { basePrice: 0, weightStep: 10, additionalPrice: 1.0, maxWeight: 7000 },
            },
          },
          sal: {
            type: 'zonal',
            zones: {
              1: { basePrice: 0, weightStep: 10, additionalPrice: 0.3, maxWeight: 7000 },
              2: { basePrice: 0, weightStep: 10, additionalPrice: 0.3, maxWeight: 7000 },
              3: { basePrice: 0, weightStep: 10, additionalPrice: 0.4, maxWeight: 7000 },
            },
          },
          surface: {
            type: 'fixed',
            price: 0.0,
            maxWeight: 7000,
          },
        },
        small_packet: {
          air: {
            type: 'zonal',
            zones: {
              1: { baseWeight: 100, basePrice: 25, weightStep: 100, additionalPrice: 23 },
              2: { baseWeight: 100, basePrice: 30, weightStep: 100, additionalPrice: 27 },
              3: { baseWeight: 100, basePrice: 35, weightStep: 100, additionalPrice: 33 },
            },
          },
          sal: {
            type: 'zonal',
            zones: {
              1: { baseWeight: 100, basePrice: 22, weightStep: 100, additionalPrice: 18 },
              2: { baseWeight: 100, basePrice: 27, weightStep: 100, additionalPrice: 23 },
              3: { baseWeight: 100, basePrice: 32, weightStep: 100, additionalPrice: 28 },
            },
          },
          surface: {
            type: 'stepped',
            tiers: [{ basePrice: 18, weightStep: 100, additionalPrice: 13 }],
          },
        },
        m_bags: {
          air: {
            type: 'zonal',
            zones: {
              1: { baseWeight: 5000, basePrice: 485, weightStep: 1000, additionalPrice: 100, maxWeight: 30000 },
              2: { baseWeight: 5000, basePrice: 610, weightStep: 1000, additionalPrice: 120, maxWeight: 30000 },
              3: { baseWeight: 5000, basePrice: 730, weightStep: 1000, additionalPrice: 145, maxWeight: 30000 },
            },
            registrationFee: 80,
          },
          sal: {
            type: 'zonal',
            zones: {
              1: { baseWeight: 5000, basePrice: 455, weightStep: 1000, additionalPrice: 100, maxWeight: 30000 },
              2: { baseWeight: 5000, basePrice: 600, weightStep: 1000, additionalPrice: 120, maxWeight: 30000 },
              3: { baseWeight: 5000, basePrice: 730, weightStep: 1000, additionalPrice: 145, maxWeight: 30000 },
            },
            registrationFee: 80,
          },
          surface: {
            type: 'stepped',
            tiers: [{ basePrice: 200, weightStep: 1000, additionalPrice: 50 }],
            maxWeight: 30000,
            registrationFee: 80,
          },
        },
      },
    },
  },

  // Chunghwa Post (中華郵政)
  TW: {
    nameKey: 'chunghwa_post',
    currency: 'TWD',
    primaryColor: '#dd2222',
    secondaryColor: '#2147a5',
    rates: {
      domestic: {
        letter: {
          type: 'stepped',
          tiers: [
            { baseWeight: 0, basePrice: 8 },
            { baseWeight: 20, basePrice: 16 },
            { baseWeight: 50, basePrice: 24 },
            { baseWeight: 100, basePrice: 40 },
            { baseWeight: 250, basePrice: 72 },
            { baseWeight: 500, basePrice: 112 },
            { baseWeight: 1000, basePrice: 160 },
            { baseWeight: 2000, basePrice: 160, weightStep: 1000, additionalPrice: 48 },
          ],
          maxWeight: 20000,
          registrationFee: 20,
        },
        postcard: {
          type: 'fixed',
          price: 5,
          maxWeight: 20,
        },
        aerogramme: {
          type: 'fixed',
          price: 6,
          maxWeight: 20,
        },
        printed_papers: {
          type: 'stepped',
          tiers: [
            { baseWeight: 0, basePrice: 6 },
            { baseWeight: 50, basePrice: 11 },
            { baseWeight: 100, basePrice: 16 },
            { baseWeight: 250, basePrice: 32 },
            { baseWeight: 500, basePrice: 56 },
            { baseWeight: 1000, basePrice: 88 },
            { baseWeight: 2000, basePrice: 88, weightStep: 1000, additionalPrice: 32 },
          ],
          maxWeight: 5000,
        },
        small_packet: {
          type: 'stepped',
          tiers: [{ weightStep: 100, additionalPrice: 12 }],
          maxWeight: 1000,
        },
      },
      mainland: {
        letter: {
          air: {
            type: 'stepped',
            tiers: [{ basePrice: 9, weightStep: 20, additionalPrice: 6 }],
            maxWeight: 2000,
          },
          surface: {
            type: 'stepped',
            tiers: [
              { baseWeight: 0, basePrice: 7 },
              { baseWeight: 20, basePrice: 17 },
              { baseWeight: 100, basePrice: 17 },
              { baseWeight: 250, basePrice: 32 },
              { baseWeight: 500, basePrice: 62 },
              { baseWeight: 1000, basePrice: 108 },
              { baseWeight: 2000, basePrice: 176 },
            ],
            maxWeight: 2000,
          },
        },
        postcard: {
          air: {
            type: 'fixed',
            price: 6,
            maxWeight: 20,
          },
          surface: {
            type: 'fixed',
            price: 5,
            maxWeight: 20,
          },
        },
        aerogramme: {
          type: 'fixed',
          price: 8,
          maxWeight: 20,
        },
        printed_papers: {
          air: {
            type: 'stepped',
            tiers: [{ basePrice: 7, weightStep: 20, additionalPrice: 5 }],
            maxWeight: 2000,
          },
          surface: {
            type: 'stepped',
            tiers: [
              { baseWeight: 0, basePrice: 5 },
              { baseWeight: 20, basePrice: 10 },
              { baseWeight: 100, basePrice: 20 },
              { baseWeight: 250, basePrice: 35 },
              { baseWeight: 500, basePrice: 57 },
              { baseWeight: 1000, basePrice: 81 },
              { baseWeight: 2000, basePrice: 81, weightStep: 1000, additionalPrice: 40 },
            ],
            maxWeight: 5000,
          },
        },
        items_for_blind: {
          air: {
            type: 'stepped',
            tiers: [{ basePrice: 5, weightStep: 20, additionalPrice: 4 }],
            maxWeight: 7000,
          },
          surface: {
            type: 'fixed',
            price: 0,
            maxWeight: 7000,
          },
        },
        small_packet: {
          air: {
            type: 'stepped',
            tiers: [{ basePrice: 7, weightStep: 20, additionalPrice: 5 }],
            maxWeight: 2000,
          },
          surface: {
            type: 'stepped',
            tiers: [
              { baseWeight: 100, basePrice: 10 },
              { baseWeight: 250, basePrice: 20 },
              { baseWeight: 500, basePrice: 35 },
              { baseWeight: 1000, basePrice: 57 },
              { baseWeight: 2000, basePrice: 81 },
            ],
            maxWeight: 2000,
          },
        },
        m_bags: {
          type: 'stepped',
          tiers: [{ weightStep: 1000, additionalPrice: 124 }],
          maxWeight: 25000,
        },
      },
      international: {
        letter: {
          type: 'zonal',
          zones: {
            1: { weightStep: 20, maxWeight: 2000, basePrice: 9, additionalPrice: 6 },
            2: { weightStep: 10, maxWeight: 2000, basePrice: 13, additionalPrice: 9 },
            3: { weightStep: 10, maxWeight: 2000, basePrice: 17, additionalPrice: 14 },
            4: { weightStep: 10, maxWeight: 2000, basePrice: 15, additionalPrice: 13 },
            5: { weightStep: 10, maxWeight: 2000, basePrice: 15, additionalPrice: 13 },
          },
          registrationFee: 65,
        },
        postcard: {
          type: 'zonal',
          zones: {
            1: { baseWeight: 20, maxWeight: 20, basePrice: 6 },
            2: { baseWeight: 20, maxWeight: 20, basePrice: 10 },
            3: { baseWeight: 20, maxWeight: 20, basePrice: 12 },
            4: { baseWeight: 20, maxWeight: 20, basePrice: 11 },
            5: { baseWeight: 20, maxWeight: 20, basePrice: 11 },
          },
        },
        aerogramme: {
          type: 'zonal',
          zones: {
            1: { baseWeight: 20, maxWeight: 20, basePrice: 8 },
            2: { baseWeight: 20, maxWeight: 20, basePrice: 11 },
            3: { baseWeight: 20, maxWeight: 20, basePrice: 14 },
            4: { baseWeight: 20, maxWeight: 20, basePrice: 12 },
            5: { baseWeight: 20, maxWeight: 20, basePrice: 12 },
          },
        },
        printed_papers: {
          type: 'zonal',
          zones: {
            1: { weightStep: 20, maxWeight: 5000, basePrice: 7, additionalPrice: 5 },
            2: { weightStep: 20, maxWeight: 5000, basePrice: 10, additionalPrice: 7 },
            3: { weightStep: 20, maxWeight: 5000, basePrice: 13, additionalPrice: 10 },
            4: { weightStep: 20, maxWeight: 5000, basePrice: 13, additionalPrice: 10 },
            5: { weightStep: 20, maxWeight: 5000, basePrice: 13, additionalPrice: 10 },
          },
        },
        items_for_blind: {
          type: 'zonal',
          zones: {
            1: { basePrice: 5, weightStep: 20, additionalPrice: 4, maxWeight: 7000 },
            2: { basePrice: 7, weightStep: 20, additionalPrice: 5, maxWeight: 7000 },
            3: { basePrice: 8, weightStep: 20, additionalPrice: 6, maxWeight: 7000 },
            4: { basePrice: 8, weightStep: 20, additionalPrice: 6, maxWeight: 7000 },
            5: { basePrice: 8, weightStep: 20, additionalPrice: 6, maxWeight: 7000 },
          },
        },
        small_packet: {
          type: 'zonal',
          zones: {
            1: { weightStep: 20, maxWeight: 2000, basePrice: 7, additionalPrice: 5 },
            2: { weightStep: 20, maxWeight: 2000, basePrice: 10, additionalPrice: 7 },
            3: { weightStep: 20, maxWeight: 2000, basePrice: 13, additionalPrice: 10 },
            4: { weightStep: 20, maxWeight: 2000, basePrice: 13, additionalPrice: 10 },
            5: { weightStep: 100, maxWeight: 2000, basePrice: 130, additionalPrice: 27 },
          },
        },
        m_bags: {
          type: 'zonal',
          zones: {
            1: { baseWeight: 10000, basePrice: 1240, weightStep: 1000, additionalPrice: 124, maxWeight: 25000 },
            2: { baseWeight: 10000, basePrice: 1950, weightStep: 1000, additionalPrice: 195, maxWeight: 25000 },
            3: { baseWeight: 10000, basePrice: 3580, weightStep: 1000, additionalPrice: 358, maxWeight: 20000 },
            4: { baseWeight: 10000, basePrice: 3580, weightStep: 1000, additionalPrice: 358, maxWeight: 20000 },
            5: { baseWeight: 10000, basePrice: 3580, weightStep: 1000, additionalPrice: 358, maxWeight: 20000 },
          },
          registrationFee: 150,
        },
      },
    },
  },

  // Hongkong Post (香港郵政)
  HK: {
    nameKey: 'hongkong_post',
    currency: 'HKD',
    primaryColor: '#16875a',
    secondaryColor: '#323092',
    rates: {
      domestic: {
        letter: {
          type: 'stepped',
          tiers: [
            { baseWeight: 0, basePrice: 2.2 },
            { baseWeight: 30, basePrice: 3.3 },
            { baseWeight: 50, basePrice: 5.4 },
            { baseWeight: 100, basePrice: 7.9 },
            { baseWeight: 250, basePrice: 14.6 },
          ],
          maxWeight: 500,
        },
        postcard: {
          type: 'fixed',
          price: 2.0,
          maxWeight: 20,
        },
        aerogramme: {
          type: 'fixed',
          price: 2.5,
          maxWeight: 20,
        },
        printed_papers: {
          type: 'stepped',
          tiers: [
            { baseWeight: 0, basePrice: 1.8 },
            { baseWeight: 30, basePrice: 3.0 },
            { baseWeight: 50, basePrice: 4.5 },
            { baseWeight: 100, basePrice: 15.0 },
          ],
          maxWeight: 500,
        },
        items_for_blind: {
          type: 'fixed',
          price: 0.0,
          maxWeight: 7000,
        },
        small_packet: {
          type: 'stepped',
          tiers: [
            { baseWeight: 0, basePrice: 5.6 },
            { baseWeight: 100, basePrice: 8.2 },
            { baseWeight: 250, basePrice: 15.5 },
            { baseWeight: 500, basePrice: 30.0 },
            { baseWeight: 1000, basePrice: 48.0 },
          ],
          maxWeight: 2000,
        },
        m_bags: {
          type: 'stepped',
          tiers: [
            {
              basePrice: 45,
              weightStep: 100,
              additionalPrice: 3,
            },
          ],
          maxWeight: 30000,
        },
        parcel: {
          type: 'stepped',
          tiers: [
            { baseWeight: 0, basePrice: 77 },
            { baseWeight: 3000, basePrice: 93 },
            { baseWeight: 4000, basePrice: 109 },
            { baseWeight: 5000, basePrice: 129 },
            { baseWeight: 6000, basePrice: 151 },
            { baseWeight: 7000, basePrice: 166 },
            { baseWeight: 8000, basePrice: 177 },
            { baseWeight: 9000, basePrice: 188 },
            { baseWeight: 11000, basePrice: 194 },
            { baseWeight: 13000, basePrice: 225 },
            { baseWeight: 16000, basePrice: 245 },
          ],
          maxWeight: 20000,
        },
      },
      mainland: {
        letter: {
          air: {
            type: 'stepped',
            tiers: [{ baseWeight: 30, basePrice: 6.4, weightStep: 10, additionalPrice: 1.7 }],
            maxWeight: 500,
          },
          surface: {
            type: 'stepped',
            tiers: [
              { baseWeight: 0, basePrice: 2.8 },
              { baseWeight: 20, basePrice: 4.5 },
              { baseWeight: 50, basePrice: 8.4 },
              { baseWeight: 100, basePrice: 16.6 },
              { baseWeight: 250, basePrice: 31.8 },
            ],
            maxWeight: 500,
          },
        },
        postcard: {
          air: {
            type: 'stepped',
            tiers: [{ baseWeight: 20, basePrice: 3.7, weightStep: 10, additionalPrice: 1.7 }],
            maxWeight: 50,
          },
          surface: {
            type: 'stepped',
            tiers: [
              { baseWeight: 0, basePrice: 2.8 },
              { baseWeight: 20, basePrice: 4.5 },
            ],
            maxWeight: 50,
          },
        },
        printed_papers: {
          air: {
            type: 'stepped',
            tiers: [{ baseWeight: 30, basePrice: 6.4, weightStep: 10, additionalPrice: 1.7 }],
            maxWeight: 500,
          },
          surface: {
            type: 'stepped',
            tiers: [
              { baseWeight: 0, basePrice: 4.6 },
              { baseWeight: 50, basePrice: 8.4 },
              { baseWeight: 100, basePrice: 16.6 },
              { baseWeight: 250, basePrice: 31.8 },
            ],
            maxWeight: 500,
          },
        },
        items_for_blind: {
          type: 'fixed',
          price: 0.0,
          maxWeight: 7000,
        },
        small_packet: {
          air: {
            type: 'stepped',
            tiers: [{ baseWeight: 30, basePrice: 6.7, weightStep: 10, additionalPrice: 1.7 }],
            maxWeight: 2000,
          },
          surface: {
            type: 'stepped',
            tiers: [
              { baseWeight: 0, basePrice: 8.6 },
              { baseWeight: 100, basePrice: 16.9 },
              { baseWeight: 250, basePrice: 32.2 },
              { baseWeight: 500, basePrice: 55.5 },
              { baseWeight: 1000, basePrice: 85.3 },
            ],
            maxWeight: 2000,
          },
        },
        m_bags: {
          type: 'stepped',
          tiers: [
            {
              basePrice: 50,
              weightStep: 100,
              additionalPrice: 4,
            },
          ],
          maxWeight: 30000,
        },
        parcel: {
          type: 'stepped',
          tiers: [
            {
              basePrice: 55,
              weightStep: 500,
              additionalPrice: 25,
            },
          ],
        },
      },
      regional: {
        letter: {
          type: 'stepped',
          tiers: [
            { baseWeight: 0, basePrice: 4.2 },
            { baseWeight: 30, basePrice: 6.8 },
            { baseWeight: 50, basePrice: 10.2 },
          ],
          maxWeight: 100,
        },
        postcard: {
          type: 'fixed',
          price: 3.0,
          maxWeight: 20,
        },
        printed_papers: {
          type: 'stepped',
          tiers: [
            { baseWeight: 0, basePrice: 3.5 },
            { baseWeight: 30, basePrice: 5.8 },
            { baseWeight: 50, basePrice: 8.7 },
            { baseWeight: 100, basePrice: 25.0 },
          ],
          maxWeight: 500,
        },
        items_for_blind: {
          type: 'fixed',
          price: 0.0,
          maxWeight: 7000,
        },
        small_packet: {
          type: 'stepped',
          tiers: [
            {
              basePrice: 32,
              weightStep: 100,
              additionalPrice: 6,
            },
          ],
          maxWeight: 2000,
        },
        m_bags: {
          type: 'stepped',
          tiers: [
            {
              basePrice: 55,
              weightStep: 100,
              additionalPrice: 5,
            },
          ],
          maxWeight: 30000,
        },
        parcel: {
          type: 'stepped',
          tiers: [
            {
              basePrice: 75,
              weightStep: 500,
              additionalPrice: 35,
            },
          ],
        },
      },
      international: {
        letter: {
          air: {
            type: 'zonal',
            zones: {
              1: { baseWeight: 30, basePrice: 6.6, weightStep: 10, additionalPrice: 2.0, maxWeight: 500 },
              2: { baseWeight: 30, basePrice: 8.2, weightStep: 10, additionalPrice: 2.1, maxWeight: 500 },
              3: { baseWeight: 30, basePrice: 8.4, weightStep: 10, additionalPrice: 2.2, maxWeight: 500 },
            },
          },
          surface: {
            type: 'zonal',
            zones: {
              1: { baseWeight: 20, basePrice: 3.5, weightStep: 30, additionalPrice: 2.7, maxWeight: 500 },
              2: { baseWeight: 20, basePrice: 5.0, weightStep: 30, additionalPrice: 2.9, maxWeight: 500 },
              3: { baseWeight: 20, basePrice: 5.3, weightStep: 30, additionalPrice: 2.9, maxWeight: 500 },
            },
          },
        },
        postcard: {
          air: {
            type: 'zonal',
            zones: {
              1: { baseWeight: 20, basePrice: 4.0, weightStep: 10, additionalPrice: 2.4, maxWeight: 50 },
              2: { baseWeight: 20, basePrice: 5.4, weightStep: 10, additionalPrice: 2.7, maxWeight: 50 },
              3: { baseWeight: 20, basePrice: 5.5, weightStep: 10, additionalPrice: 2.8, maxWeight: 50 },
            },
          },
          surface: {
            type: 'zonal',
            zones: {
              1: { baseWeight: 20, basePrice: 3.5, weightStep: 30, additionalPrice: 2.7, maxWeight: 50 },
              2: { baseWeight: 20, basePrice: 5.0, weightStep: 30, additionalPrice: 2.9, maxWeight: 50 },
              3: { baseWeight: 20, basePrice: 5.3, weightStep: 30, additionalPrice: 2.9, maxWeight: 50 },
            },
          },
        },
        printed_papers: {
          air: {
            type: 'zonal',
            zones: {
              1: { baseWeight: 30, basePrice: 6.6, weightStep: 10, additionalPrice: 2.0, maxWeight: 500 },
              2: { baseWeight: 30, basePrice: 8.2, weightStep: 10, additionalPrice: 2.1, maxWeight: 500 },
              3: { baseWeight: 30, basePrice: 8.4, weightStep: 10, additionalPrice: 2.2, maxWeight: 500 },
            },
          },
          surface: {
            type: 'zonal',
            zones: {
              1: { baseWeight: 50, basePrice: 6.3, weightStep: 50, additionalPrice: 4.2, maxWeight: 500 },
              2: { baseWeight: 50, basePrice: 8.0, weightStep: 50, additionalPrice: 4.0, maxWeight: 500 },
              3: { baseWeight: 50, basePrice: 8.3, weightStep: 50, additionalPrice: 4.0, maxWeight: 500 },
            },
          },
        },
        small_packet: {
          air: {
            type: 'zonal',
            zones: {
              1: { baseWeight: 30, basePrice: 6.8, weightStep: 10, additionalPrice: 2.0, maxWeight: 2000 },
              2: { baseWeight: 30, basePrice: 8.4, weightStep: 10, additionalPrice: 2.1, maxWeight: 2000 },
              3: { baseWeight: 30, basePrice: 8.6, weightStep: 10, additionalPrice: 2.2, maxWeight: 2000 },
            },
          },
          surface: {
            type: 'zonal',
            zones: {
              1: { baseWeight: 100, basePrice: 10.8, weightStep: 100, additionalPrice: 10.2, maxWeight: 2000 },
              2: { baseWeight: 100, basePrice: 12.3, weightStep: 100, additionalPrice: 11.4, maxWeight: 2000 },
              3: { baseWeight: 100, basePrice: 12.6, weightStep: 100, additionalPrice: 11.7, maxWeight: 2000 },
            },
          },
        },
        parcel: {
          type: 'stepped',
          tiers: [
            {
              basePrice: 95,
              weightStep: 500,
              additionalPrice: 45,
            },
          ],
        },
      },
    },
  },

  // Macau Post (澳門郵電)
  MO: {
    nameKey: 'macau_post',
    currency: 'MOP',
    primaryColor: '#0071ba',
    secondaryColor: '#cf202e',
    rates: {
      domestic: {
        letter: {
          type: 'stepped',
          tiers: [
            { baseWeight: 0, basePrice: 2.5 },
            { baseWeight: 20, basePrice: 3.0 },
            { baseWeight: 50, basePrice: 3.5 },
            { baseWeight: 100, basePrice: 4.5 },
            { baseWeight: 150, basePrice: 5.5 },
            { baseWeight: 200, basePrice: 6.0 },
            { baseWeight: 250, basePrice: 10.5 },
            { baseWeight: 500, basePrice: 21.0 },
            { basePrice: 21.0, weightStep: 1000, additionalPrice: 8.5 },
          ],
          maxWeight: 2000,
        },
        parcel: {
          type: 'stepped',
          tiers: [
            { baseWeight: 0, basePrice: 2.5 },
            { baseWeight: 20, basePrice: 3.0 },
            { baseWeight: 50, basePrice: 3.5 },
            { baseWeight: 100, basePrice: 4.5 },
            { baseWeight: 150, basePrice: 5.5 },
            { baseWeight: 200, basePrice: 6.0 },
            { baseWeight: 250, basePrice: 10.5 },
            { baseWeight: 500, basePrice: 21.0 },
            { basePrice: 21.0, weightStep: 1000, additionalPrice: 8.5 },
          ],
        },
      },
      mainland: {
        letter: {
          surface: {
            type: 'stepped',
            tiers: [
              { baseWeight: 0, basePrice: 4.0 },
              { baseWeight: 20, basePrice: 6.5 },
              { baseWeight: 50, basePrice: 9.5 },
              { baseWeight: 100, basePrice: 20 },
              { baseWeight: 250, basePrice: 28 },
              { baseWeight: 300, basePrice: 35 },
              { baseWeight: 400, basePrice: 35, weightStep: 20, additionalPrice: 1.5 },
              { basePrice: 80, weightStep: 1000, additionalPrice: 60 },
            ],
          },
          air: {
            type: 'stepped',
            tiers: [
              {
                basePrice: 4.5,
                weightStep: 10,
                additionalPrice: 1,
              },
            ],
            maxWeight: 100,
          },
        },
        printed_papers: {
          surface: {
            type: 'stepped',
            tiers: [
              { baseWeight: 100, basePrice: 6 },
              { baseWeight: 200, basePrice: 15, weightStep: 100, additionalPrice: 6 },
            ],
          },
          air: {
            type: 'stepped',
            tiers: [
              {
                basePrice: 12.0,
                weightStep: 100,
                additionalPrice: 9.5,
              },
            ],
            maxWeight: 2000,
          },
        },
        small_packet: {
          surface: {
            type: 'stepped',
            tiers: [
              {
                basePrice: 6.0,
                weightStep: 100,
                additionalPrice: 6.0,
              },
            ],
            maxWeight: 2000,
          },
          air: {
            type: 'stepped',
            tiers: [
              {
                basePrice: 12.0,
                weightStep: 100,
                additionalPrice: 9.5,
              },
            ],
            maxWeight: 2000,
          },
        },
        m_bags: {
          surface: {
            type: 'stepped',
            tiers: [
              {
                basePrice: 80.0,
                weightStep: 1000,
                additionalPrice: 20.0,
              },
            ],
            maxWeight: 30000,
          },
          air: {
            type: 'stepped',
            tiers: [
              {
                basePrice: 180.0,
                weightStep: 1000,
                additionalPrice: 40.0,
              },
            ],
            maxWeight: 30000,
          },
        },
      },
      regional: {
        letter: {
          surface: {
            type: 'stepped',
            tiers: [
              { baseWeight: 0, basePrice: 4.0 },
              { baseWeight: 20, basePrice: 6.5 },
              { baseWeight: 50, basePrice: 9.5 },
              { baseWeight: 100, basePrice: 20 },
              { baseWeight: 250, basePrice: 28 },
              { baseWeight: 300, basePrice: 35 },
              { baseWeight: 400, basePrice: 35, weightStep: 20, additionalPrice: 1.5 },
              { basePrice: 80, weightStep: 1000, additionalPrice: 60 },
            ],
            maxWeight: 2000,
          },
          air: {
            type: 'stepped',
            tiers: [
              {
                basePrice: 4.0,
                weightStep: 10,
                additionalPrice: 1.5,
              },
            ],
            maxWeight: 100,
          },
        },
        postcard: {
          surface: {
            type: 'fixed',
            price: 4.5,
            maxWeight: 20,
          },
          air: {
            type: 'fixed',
            price: 4.0,
            maxWeight: 20,
          },
        },
        aerogramme: {
          surface: {
            type: 'fixed',
            price: 4.5,
            maxWeight: 20,
          },
          air: {
            type: 'fixed',
            price: 4.0,
            maxWeight: 20,
          },
        },
        printed_papers: {
          surface: {
            type: 'stepped',
            tiers: [
              {
                basePrice: 10.0,
                weightStep: 100,
                additionalPrice: 9.0,
              },
            ],
            maxWeight: 2000,
          },
          air: {
            type: 'stepped',
            tiers: [
              {
                basePrice: 13.5,
                weightStep: 100,
                additionalPrice: 11.0,
              },
            ],
            maxWeight: 2000,
          },
        },
        items_for_blind: {
          type: 'fixed',
          price: 0.0,
          maxWeight: 7000,
        },
        small_packet: {
          surface: {
            type: 'stepped',
            tiers: [
              {
                basePrice: 10.0,
                weightStep: 100,
                additionalPrice: 9.0,
              },
            ],
            maxWeight: 2000,
          },
          air: {
            type: 'stepped',
            tiers: [
              {
                basePrice: 13.5,
                weightStep: 100,
                additionalPrice: 11.0,
              },
            ],
            maxWeight: 2000,
          },
        },
        m_bags: {
          surface: {
            type: 'stepped',
            tiers: [
              {
                basePrice: 180.0,
                weightStep: 1000,
                additionalPrice: 40.0,
              },
            ],
            maxWeight: 30000,
          },
          air: {
            type: 'stepped',
            tiers: [
              {
                basePrice: 280.0,
                weightStep: 1000,
                additionalPrice: 50.0,
              },
            ],
            maxWeight: 30000,
          },
        },
      },
      international: {
        letter: {
          surface: {
            // TODO: zonal tiers
            type: 'stepped',
            tiers: [
              { baseWeight: 0, basePrice: 5.0 },
              { baseWeight: 20, basePrice: 12.0 },
              { baseWeight: 100, basePrice: 30.0 },
              { baseWeight: 200, basePrice: 50.0 },
              { baseWeight: 350, basePrice: 65.0 },
              { baseWeight: 500, basePrice: 85.0 },
              { baseWeight: 750, basePrice: 103.0 },
            ],
            maxWeight: 1000,
          },
          air: {
            type: 'stepped',
            tiers: [
              {
                basePrice: 4.5,
                weightStep: 10,
                additionalPrice: 2.0,
              },
            ],
            maxWeight: 100,
          },
        },
        postcard: {
          air: {
            type: 'fixed',
            price: 4.5,
            maxWeight: 20,
          },
          sal: {
            type: 'fixed',
            price: 3.8,
            maxWeight: 20,
          },
          surface: {
            type: 'fixed',
            price: 3.2,
            maxWeight: 20,
          },
        },
        aerogramme: {
          surface: {
            type: 'fixed',
            price: 5.0,
            maxWeight: 20,
          },
        },
        printed_papers: {
          surface: {
            type: 'stepped',
            tiers: [
              {
                basePrice: 12.0,
                weightStep: 100,
                additionalPrice: 10.0,
              },
            ],
            maxWeight: 2000,
          },
          air: {
            type: 'stepped',
            tiers: [
              {
                basePrice: 18.0,
                weightStep: 100,
                additionalPrice: 16.0,
              },
            ],
            maxWeight: 2000,
          },
        },
        small_packet: {
          surface: {
            type: 'stepped',
            tiers: [
              {
                basePrice: 12.0,
                weightStep: 100,
                additionalPrice: 10.0,
              },
            ],
            maxWeight: 2000,
          },
          air: {
            type: 'stepped',
            tiers: [
              {
                basePrice: 18.0,
                weightStep: 100,
                additionalPrice: 16.0,
              },
            ],
            maxWeight: 2000,
          },
        },
        m_bags: {
          surface: {
            type: 'stepped',
            tiers: [
              {
                basePrice: 200.0,
                weightStep: 1000,
                additionalPrice: 40.0,
              },
            ],
            maxWeight: 30000,
          },
          air: {
            type: 'stepped',
            tiers: [
              {
                basePrice: 450.0,
                weightStep: 1000,
                additionalPrice: 70.0,
              },
            ],
            maxWeight: 30000,
          },
        },
      },
    },
  },
};

// Rate Rules Mapping with names and URLs
export const RATE_RULES: Record<string, { name: string; url: string }> = {
  // China Post Rules
  china_post_domestic: {
    name: '国内信函资费',
    url: 'https://zwfw.spb.gov.cn/spbptyjywzf/',
  },
  china_post_regional: {
    name: '港澳台地区函件资费表',
    url: 'https://www.chinapost.com.cn/xhtml1/report/19101/1784-1.htm',
  },
  china_post_international: {
    name: '国际函件资费表',
    url: 'https://www.chinapost.com.cn/xhtml1/report/19101/1959-1.htm',
  },
  china_post_domestic_parcel: {
    name: '国内包裹资费',
    url: 'https://www.ndrc.gov.cn/xxgk/zcfb/ghxwj/201704/t20170412_960915.html',
  },
  china_post_domestic_postcard: {
    name: '家乡包裹贴',
    url: 'http://www.lc0011.com/show.aspx?id=302478&cid=10',
  },

  // Chunghwa Post Rules
  chunghwa_post_domestic: {
    name: '國內郵件資費表',
    url: 'https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=20501',
  },
  chunghwa_post_international_ems: {
    name: '國際快捷郵件資費表',
    url: 'https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=20502',
  },
  chunghwa_post_international: {
    name: '國際函件資費表',
    url: 'https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=2020204',
  },
  chunghwa_post_international_small_packet: {
    name: '國際e小包資費表',
    url: 'https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=1521427719836',
  },
  chunghwa_post_international_parcel: {
    name: '國際包裹資費表',
    url: 'https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=2050401',
  },
  chunghwa_post_mainland: {
    name: '大陸郵件資費表',
    url: 'https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=20505',
  },
  chunghwa_post_mainland_ems: {
    name: '兩岸郵政速遞(快捷)郵件資費表',
    url: 'https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=1396492589492',
  },
  chunghwa_post_mainland_small_packet: {
    name: '兩岸郵政e小包資費表',
    url: 'https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=1404380075391',
  },
  chunghwa_post: {
    name: '中華郵政資費表',
    url: 'https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=205',
  },

  // Hongkong Post Rules
  hongkong_post: {
    name: '郵費',
    url: 'https://www.hongkongpost.hk/tc/other/2022/postage/index.html',
  },

  // Macau Post Rules
  macau_post: {
    name: '服務收費',
    url: 'https://www.ctt.gov.mo/macaupost/Contents/CorresPostage.aspx',
  },
};
