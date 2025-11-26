import type { MailType } from '../utils/postal-rates';

export interface SteppedRate {
  type: 'stepped';
  baseWeight?: number; // Weight covered by base price (defaults to weightStep if not specified)
  basePrice: number;
  weightStep: number;
  additionalPrice: number;
  maxWeight?: number;
}

export interface TieredRate {
  type: 'tiered';
  tiers: Array<{
    maxWeight: number;
    price: number;
  }>;
}

export interface FixedRate {
  type: 'fixed';
  price: number;
  maxWeight?: number;
}

export interface RegionBasedSteppedRate {
  type: 'region_stepped';
  groups: {
    [groupNumber: number]: {
      baseWeight?: number; // Weight covered by base price (defaults to weightStep if not specified)
      basePrice: number;
      weightStep: number;
      additionalPrice: number;
      maxWeight?: number;
    };
  };
}

export type RateCalculationMethod = SteppedRate | TieredRate | FixedRate | RegionBasedSteppedRate;

export interface PostalServiceRates {
  serviceName: string;
  currency: string;
  fromRegion: 'CN' | 'TW' | 'HK' | 'MO';
  rates: {
    domestic?: {
      [key in MailType]?: RateCalculationMethod;
    };
    mainland?: {
      [key in MailType]?: RateCalculationMethod;
    };
    regional?: {
      [key in MailType]?: RateCalculationMethod;
    };
    regional_tw?: {
      [key in MailType]?: RateCalculationMethod;
    };
    international?: {
      [key in MailType]?:
        | RateCalculationMethod
        | {
            default?: RateCalculationMethod;
            air?: RateCalculationMethod;
            sal?: RateCalculationMethod;
            surface?: RateCalculationMethod;
          };
    };
  };
}

// Universal Postal Rate Data Table
export const POSTAGE_RATES: Record<string, PostalServiceRates> = {
  // China Post (中国邮政)
  china_post: {
    serviceName: 'China Post',
    currency: 'CNY',
    fromRegion: 'CN',
    rates: {
      domestic: {
        letter: {
          type: 'stepped',
          baseWeight: 20,
          basePrice: 1.2,
          weightStep: 20,
          additionalPrice: 0.8,
          maxWeight: 2000,
        },
        postcard: {
          type: 'fixed',
          price: 0.8,
          maxWeight: 20,
        },
        printed_papers: {
          type: 'stepped',
          basePrice: 1.2,
          weightStep: 100,
          additionalPrice: 0.4,
          maxWeight: 35000,
        },
        items_for_blind: {
          type: 'fixed',
          price: 0.0,
          maxWeight: 35000,
        },
        small_packet: {
          type: 'stepped',
          baseWeight: 100,
          basePrice: 8.0,
          weightStep: 100,
          additionalPrice: 2.0,
          maxWeight: 2000,
        },
        m_bags: {
          type: 'stepped',
          baseWeight: 100,
          basePrice: 8.0,
          weightStep: 100,
          additionalPrice: 0.4,
          maxWeight: 25000,
        },
        parcel: {
          type: 'region_stepped',
          groups: {
            1: { basePrice: 0x5, weightStep: 1000, additionalPrice: 1.0, maxWeight: 50000 },
            2: { basePrice: 0x6, weightStep: 1000, additionalPrice: 1.5, maxWeight: 50000 },
            3: { basePrice: 0x7, weightStep: 1000, additionalPrice: 2.0, maxWeight: 50000 },
            4: { basePrice: 0x8, weightStep: 1000, additionalPrice: 3.0, maxWeight: 50000 },
            5: { basePrice: 0x9, weightStep: 1000, additionalPrice: 4.0, maxWeight: 50000 },
            6: { basePrice: 0xa, weightStep: 1000, additionalPrice: 5.0, maxWeight: 50000 },
          },
        },
        ems: {
          type: 'stepped',
          baseWeight: 500,
          basePrice: 20.0,
          weightStep: 500,
          additionalPrice: 10.0,
        },
      },
      regional: {
        letter: {
          type: 'tiered',
          tiers: [
            { maxWeight: 20, price: 1.5 },
            { maxWeight: 50, price: 2.8 },
            { maxWeight: 100, price: 4.0 },
            { maxWeight: 250, price: 8.5 },
            { maxWeight: 500, price: 16.7 },
            { maxWeight: 1000, price: 31.7 },
            { maxWeight: 2000, price: 55.8 },
          ],
        },
        postcard: {
          type: 'fixed',
          price: 3.5,
          maxWeight: 20,
        },
        printed_papers: {
          type: 'stepped',
          baseWeight: 20,
          basePrice: 3.5,
          weightStep: 10,
          additionalPrice: 1.3,
          maxWeight: 500,
        },
        items_for_blind: {
          type: 'fixed',
          price: 0.0,
          maxWeight: 35000,
        },
        small_packet: {
          type: 'stepped',
          baseWeight: 100,
          basePrice: 8.0,
          weightStep: 100,
          additionalPrice: 2.0,
          maxWeight: 2000,
        },
        m_bags: {
          type: 'stepped',
          baseWeight: 5000,
          basePrice: 12.0,
          weightStep: 1000,
          additionalPrice: 0.6,
          maxWeight: 35000,
        },
        parcel: {
          type: 'stepped',
          baseWeight: 1000,
          basePrice: 20.0,
          weightStep: 1000,
          additionalPrice: 8.0,
          maxWeight: 20000,
        },
        ems: {
          type: 'stepped',
          baseWeight: 500,
          basePrice: 28.0,
          weightStep: 500,
          additionalPrice: 15.0,
        },
      },
      international: {
        letter: {
          air: {
            type: 'region_stepped',
            groups: {
              1: { baseWeight: 20, basePrice: 5.0, weightStep: 10, additionalPrice: 1.0, maxWeight: 100 },
              2: { baseWeight: 20, basePrice: 5.5, weightStep: 10, additionalPrice: 1.5, maxWeight: 100 },
              3: { baseWeight: 20, basePrice: 6.0, weightStep: 10, additionalPrice: 1.8, maxWeight: 100 },
              4: { baseWeight: 20, basePrice: 7.0, weightStep: 10, additionalPrice: 2.3, maxWeight: 100 },
            },
          },
          sal: {
            type: 'region_stepped',
            groups: {
              1: { baseWeight: 20, basePrice: 4.5, weightStep: 10, additionalPrice: 0.5, maxWeight: 100 },
              2: { baseWeight: 20, basePrice: 5.0, weightStep: 10, additionalPrice: 0.6, maxWeight: 100 },
              3: { baseWeight: 20, basePrice: 5.5, weightStep: 10, additionalPrice: 0.7, maxWeight: 100 },
              4: { baseWeight: 20, basePrice: 6.5, weightStep: 10, additionalPrice: 0.8, maxWeight: 100 },
            },
          },
          surface: {
            type: 'region_stepped',
            groups: {
              1: { baseWeight: 20, basePrice: 3.5, weightStep: 10, additionalPrice: 0.4, maxWeight: 100 }, // 27 asia-pacific countries
              2: { baseWeight: 20, basePrice: 4.0, weightStep: 10, additionalPrice: 0.5, maxWeight: 100 }, // standard rate
            },
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
        small_packet: {
          air: {
            type: 'region_stepped',
            groups: {
              1: { baseWeight: 100, basePrice: 25, weightStep: 100, additionalPrice: 23 },
              2: { baseWeight: 100, basePrice: 30, weightStep: 100, additionalPrice: 27 },
              3: { baseWeight: 100, basePrice: 35, weightStep: 100, additionalPrice: 33 },
            },
          },
          sal: {
            type: 'region_stepped',
            groups: {
              1: { baseWeight: 100, basePrice: 22, weightStep: 100, additionalPrice: 18 },
              2: { baseWeight: 100, basePrice: 27, weightStep: 100, additionalPrice: 23 },
              3: { baseWeight: 100, basePrice: 32, weightStep: 100, additionalPrice: 28 },
            },
          },
          surface: {
            type: 'stepped',
            baseWeight: 100,
            basePrice: 18,
            weightStep: 100,
            additionalPrice: 13,
          },
        },
        printed_papers: {
          air: {
            type: 'region_stepped',
            groups: {
              1: { baseWeight: 20, basePrice: 4.5, weightStep: 10, additionalPrice: 2.2, maxWeight: 500 },
              2: { baseWeight: 20, basePrice: 5.0, weightStep: 10, additionalPrice: 2.5, maxWeight: 500 },
              3: { baseWeight: 20, basePrice: 6.0, weightStep: 10, additionalPrice: 2.8, maxWeight: 500 },
            },
          },
          sal: {
            type: 'region_stepped',
            groups: {
              1: { baseWeight: 20, basePrice: 4.0, weightStep: 10, additionalPrice: 1.9, maxWeight: 500 },
              2: { baseWeight: 20, basePrice: 4.5, weightStep: 10, additionalPrice: 2.2, maxWeight: 500 },
              3: { baseWeight: 20, basePrice: 5.0, weightStep: 10, additionalPrice: 2.5, maxWeight: 500 },
            },
          },
          surface: {
            type: 'stepped',
            baseWeight: 20,
            basePrice: 4.0,
            weightStep: 10,
            additionalPrice: 1.8,
            maxWeight: 500,
          },
        },
        m_bags: {
          air: {
            type: 'region_stepped',
            groups: {
              1: { baseWeight: 5000, basePrice: 485, weightStep: 1000, additionalPrice: 100, maxWeight: 30000 },
              2: { baseWeight: 5000, basePrice: 610, weightStep: 1000, additionalPrice: 120, maxWeight: 30000 },
              3: { baseWeight: 5000, basePrice: 730, weightStep: 1000, additionalPrice: 145, maxWeight: 30000 },
            },
          },
          sal: {
            type: 'region_stepped',
            groups: {
              1: { baseWeight: 5000, basePrice: 455, weightStep: 1000, additionalPrice: 100, maxWeight: 30000 },
              2: { baseWeight: 5000, basePrice: 600, weightStep: 1000, additionalPrice: 120, maxWeight: 30000 },
              3: { baseWeight: 5000, basePrice: 730, weightStep: 1000, additionalPrice: 145, maxWeight: 30000 },
            },
          },
          surface: {
            type: 'stepped',
            baseWeight: 5000,
            basePrice: 200,
            weightStep: 1000,
            additionalPrice: 50,
            maxWeight: 30000,
          },
        },
        items_for_blind: {
          air: {
            type: 'region_stepped',
            groups: {
              1: { basePrice: 0, weightStep: 10, additionalPrice: 0.6, maxWeight: 7000 },
              2: { basePrice: 0, weightStep: 10, additionalPrice: 0.8, maxWeight: 7000 },
              3: { basePrice: 0, weightStep: 10, additionalPrice: 1.0, maxWeight: 7000 },
            },
          },
          sal: {
            type: 'region_stepped',
            groups: {
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
      },
    },
  },

  // Taiwan Post (Chunghwa Post)
  chunghwa_post: {
    serviceName: 'Chunghwa Post',
    currency: 'TWD',
    fromRegion: 'TW',
    rates: {
      domestic: {
        letter: {
          type: 'stepped',
          baseWeight: 20,
          basePrice: 8,
          weightStep: 20,
          additionalPrice: 5,
          maxWeight: 100,
        },
        postcard: {
          type: 'fixed',
          price: 5,
          maxWeight: 20,
        },
        printed_papers: {
          type: 'stepped',
          basePrice: 6,
          additionalPrice: 4,
          baseWeight: 20,
          weightStep: 20,
          maxWeight: 500,
        },
        items_for_blind: {
          type: 'fixed',
          price: 0.0,
          maxWeight: 7000,
        },
        small_packet: {
          type: 'stepped',
          basePrice: 45,
          additionalPrice: 8,
          baseWeight: 100,
          weightStep: 100,
          maxWeight: 2000,
        },
        m_bags: {
          type: 'stepped',
          basePrice: 35,
          additionalPrice: 2,
          baseWeight: 100,
          weightStep: 100,
          maxWeight: 30000,
        },
        parcel: {
          type: 'stepped',
          baseWeight: 1000,
          basePrice: 65,
          weightStep: 1000,
          additionalPrice: 10,
        },
        ems: {
          type: 'stepped',
          baseWeight: 500,
          basePrice: 120,
          weightStep: 500,
          additionalPrice: 30,
        },
      },
      mainland: {
        letter: {
          type: 'stepped',
          basePrice: 9,
          additionalPrice: 7,
          baseWeight: 20,
          weightStep: 20,
          maxWeight: 100,
        },
        postcard: {
          type: 'fixed',
          price: 6,
          maxWeight: 20,
        },
        printed_papers: {
          type: 'stepped',
          basePrice: 7,
          additionalPrice: 5,
          weightStep: 20,
          maxWeight: 500,
        },
        items_for_blind: {
          type: 'fixed',
          price: 0.0,
          maxWeight: 7000,
        },
        small_packet: {
          type: 'stepped',
          basePrice: 65,
          additionalPrice: 10,
          baseWeight: 100,
          weightStep: 100,
          maxWeight: 2000,
        },
        m_bags: {
          type: 'stepped',
          basePrice: 45,
          additionalPrice: 3,
          weightStep: 100,
          maxWeight: 30000,
        },
        parcel: {
          type: 'stepped',
          basePrice: 150,
          additionalPrice: 75,
          baseWeight: 500,
          weightStep: 500,
        },
        ems: {
          type: 'stepped',
          basePrice: 260,
          additionalPrice: 130,
          baseWeight: 500,
          weightStep: 500,
        },
      },
      regional: {
        letter: {
          type: 'stepped',
          basePrice: 9,
          additionalPrice: 7,
          weightStep: 20,
          maxWeight: 100,
        },
        postcard: {
          type: 'fixed',
          price: 6,
          maxWeight: 20,
        },
        printed_papers: {
          type: 'stepped',
          basePrice: 7,
          additionalPrice: 5,
          weightStep: 20,
          maxWeight: 500,
        },
        items_for_blind: {
          type: 'fixed',
          price: 0.0,
          maxWeight: 7000,
        },
        small_packet: {
          type: 'stepped',
          basePrice: 55,
          additionalPrice: 12,
          baseWeight: 100,
          weightStep: 100,
          maxWeight: 2000,
        },
        m_bags: {
          type: 'stepped',
          basePrice: 40,
          additionalPrice: 3,
          weightStep: 100,
          maxWeight: 30000,
        },
        parcel: {
          type: 'stepped',
          basePrice: 120,
          additionalPrice: 60,
          weightStep: 500,
        },
        ems: {
          type: 'stepped',
          basePrice: 220,
          additionalPrice: 110,
          weightStep: 500,
        },
      },
      international: {
        letter: {
          default: {
            type: 'stepped',
            basePrice: 13,
            additionalPrice: 9,
            weightStep: 20,
            maxWeight: 100,
          },
          air: {
            type: 'stepped',
            basePrice: 15,
            additionalPrice: 8,
            weightStep: 10,
            maxWeight: 100,
          },
          sal: {
            type: 'stepped',
            basePrice: 12,
            additionalPrice: 6,
            weightStep: 10,
            maxWeight: 100,
          },
          surface: {
            type: 'stepped',
            basePrice: 10,
            additionalPrice: 5,
            weightStep: 10,
            maxWeight: 100,
          },
        },
        postcard: {
          air: {
            type: 'fixed',
            price: 13,
            maxWeight: 20,
          },
          sal: {
            type: 'fixed',
            price: 10,
            maxWeight: 20,
          },
          surface: {
            type: 'fixed',
            price: 8,
            maxWeight: 20,
          },
        },
        printed_papers: {
          default: {
            type: 'stepped',
            basePrice: 10,
            additionalPrice: 7,
            weightStep: 20,
            maxWeight: 500,
          },
          air: {
            type: 'stepped',
            basePrice: 12,
            additionalPrice: 6,
            weightStep: 10,
            maxWeight: 500,
          },
          sal: {
            type: 'stepped',
            basePrice: 9,
            additionalPrice: 5,
            weightStep: 10,
            maxWeight: 500,
          },
          surface: {
            type: 'stepped',
            basePrice: 8,
            additionalPrice: 4,
            weightStep: 10,
            maxWeight: 500,
          },
        },
        small_packet: {
          type: 'stepped',
          basePrice: 85,
          additionalPrice: 15,
          weightStep: 100,
          maxWeight: 2000,
        },
        m_bags: {
          default: {
            type: 'stepped',
            basePrice: 65,
            additionalPrice: 4,
            weightStep: 100,
            maxWeight: 30000,
          },
          air: {
            type: 'stepped',
            basePrice: 75,
            additionalPrice: 5,
            weightStep: 100,
            maxWeight: 30000,
          },
          sal: {
            type: 'stepped',
            basePrice: 60,
            additionalPrice: 3,
            weightStep: 100,
            maxWeight: 30000,
          },
          surface: {
            type: 'stepped',
            basePrice: 50,
            additionalPrice: 2,
            weightStep: 100,
            maxWeight: 30000,
          },
        },
        parcel: {
          default: {
            type: 'stepped',
            basePrice: 190,
            additionalPrice: 95,
            weightStep: 500,
          },
          air: {
            type: 'stepped',
            basePrice: 250,
            additionalPrice: 120,
            weightStep: 1000,
          },
          sal: {
            type: 'stepped',
            basePrice: 180,
            additionalPrice: 80,
            weightStep: 1000,
          },
          surface: {
            type: 'stepped',
            basePrice: 120,
            additionalPrice: 50,
            weightStep: 1000,
          },
        },
        ems: {
          type: 'stepped',
          basePrice: 320,
          additionalPrice: 160,
          weightStep: 500,
        },
      },
    },
  },

  // Hong Kong Post
  hongkong_post: {
    serviceName: 'Hong Kong Post',
    currency: 'HKD',
    fromRegion: 'HK',
    rates: {
      domestic: {
        letter: {
          type: 'tiered',
          tiers: [
            { maxWeight: 30, price: 2.2 },
            { maxWeight: 50, price: 3.7 },
            { maxWeight: 100, price: 5.5 },
          ],
        },
        postcard: {
          type: 'fixed',
          price: 2.0,
          maxWeight: 20,
        },
        printed_papers: {
          type: 'tiered',
          tiers: [
            { maxWeight: 30, price: 1.8 },
            { maxWeight: 50, price: 3.0 },
            { maxWeight: 100, price: 4.5 },
            { maxWeight: 500, price: 15.0 },
          ],
        },
        items_for_blind: {
          type: 'fixed',
          price: 0.0,
          maxWeight: 7000,
        },
        small_packet: {
          type: 'stepped',
          basePrice: 22,
          additionalPrice: 4,
          baseWeight: 100,
          weightStep: 100,
          maxWeight: 2000,
        },
        m_bags: {
          type: 'stepped',
          basePrice: 45,
          additionalPrice: 3,
          weightStep: 100,
          maxWeight: 30000,
        },
        parcel: {
          type: 'stepped',
          basePrice: 26,
          additionalPrice: 6,
          weightStep: 1000,
        },
        ems: {
          type: 'stepped',
          basePrice: 27,
          additionalPrice: 7,
          weightStep: 500,
        },
      },
      mainland: {
        letter: {
          type: 'tiered',
          tiers: [
            { maxWeight: 30, price: 3.2 },
            { maxWeight: 50, price: 5.2 },
            { maxWeight: 100, price: 7.8 },
          ],
        },
        postcard: {
          type: 'fixed',
          price: 2.5,
          maxWeight: 20,
        },
        printed_papers: {
          type: 'tiered',
          tiers: [
            { maxWeight: 30, price: 2.5 },
            { maxWeight: 50, price: 4.2 },
            { maxWeight: 100, price: 6.3 },
            { maxWeight: 500, price: 20.0 },
          ],
        },
        items_for_blind: {
          type: 'fixed',
          price: 0.0,
          maxWeight: 7000,
        },
        small_packet: {
          type: 'stepped',
          basePrice: 28,
          additionalPrice: 5,
          baseWeight: 100,
          weightStep: 100,
          maxWeight: 2000,
        },
        m_bags: {
          type: 'stepped',
          basePrice: 50,
          additionalPrice: 4,
          weightStep: 100,
          maxWeight: 30000,
        },
        parcel: {
          type: 'stepped',
          basePrice: 55,
          additionalPrice: 25,
          weightStep: 500,
        },
        ems: {
          type: 'stepped',
          basePrice: 85,
          additionalPrice: 40,
          weightStep: 500,
        },
      },
      regional: {
        letter: {
          type: 'tiered',
          tiers: [
            { maxWeight: 30, price: 4.2 },
            { maxWeight: 50, price: 6.8 },
            { maxWeight: 100, price: 10.2 },
          ],
        },
        postcard: {
          type: 'fixed',
          price: 3.0,
          maxWeight: 20,
        },
        printed_papers: {
          type: 'tiered',
          tiers: [
            { maxWeight: 30, price: 3.5 },
            { maxWeight: 50, price: 5.8 },
            { maxWeight: 100, price: 8.7 },
            { maxWeight: 500, price: 25.0 },
          ],
        },
        items_for_blind: {
          type: 'fixed',
          price: 0.0,
          maxWeight: 7000,
        },
        small_packet: {
          type: 'stepped',
          basePrice: 32,
          additionalPrice: 6,
          baseWeight: 100,
          weightStep: 100,
          maxWeight: 2000,
        },
        m_bags: {
          type: 'stepped',
          basePrice: 55,
          additionalPrice: 5,
          weightStep: 100,
          maxWeight: 30000,
        },
        parcel: {
          type: 'stepped',
          basePrice: 75,
          additionalPrice: 35,
          weightStep: 500,
        },
        ems: {
          type: 'stepped',
          basePrice: 115,
          additionalPrice: 55,
          weightStep: 500,
        },
      },
      international: {
        letter: {
          type: 'tiered',
          tiers: [
            { maxWeight: 30, price: 4.9 },
            { maxWeight: 50, price: 7.9 },
            { maxWeight: 100, price: 11.8 },
          ],
        },
        postcard: {
          air: {
            type: 'fixed',
            price: 4.9,
            maxWeight: 20,
          },
          sal: {
            type: 'fixed',
            price: 4.0,
            maxWeight: 20,
          },
          surface: {
            type: 'fixed',
            price: 3.5,
            maxWeight: 20,
          },
        },
        printed_papers: {
          type: 'tiered',
          tiers: [
            { maxWeight: 30, price: 4.0 },
            { maxWeight: 50, price: 6.5 },
            { maxWeight: 100, price: 9.8 },
            { maxWeight: 500, price: 30.0 },
          ],
        },
        small_packet: {
          type: 'stepped',
          basePrice: 25,
          additionalPrice: 3,
          weightStep: 100,
          maxWeight: 2000,
        },
        parcel: {
          type: 'stepped',
          basePrice: 95,
          additionalPrice: 45,
          weightStep: 500,
        },
        ems: {
          type: 'stepped',
          basePrice: 145,
          additionalPrice: 70,
          weightStep: 500,
        },
      },
    },
  },

  // Macau Post
  macau_post: {
    serviceName: 'Macau Post',
    currency: 'MOP',
    fromRegion: 'MO',
    rates: {
      domestic: {
        letter: {
          type: 'tiered',
          tiers: [
            { maxWeight: 50, price: 2.0 },
            { maxWeight: 100, price: 3.0 },
          ],
        },
        postcard: {
          type: 'fixed',
          price: 2.0,
          maxWeight: 20,
        },
        printed_papers: {
          type: 'tiered',
          tiers: [
            { maxWeight: 50, price: 1.5 },
            { maxWeight: 100, price: 2.5 },
            { maxWeight: 500, price: 10.0 },
          ],
        },
        items_for_blind: {
          type: 'fixed',
          price: 0.0,
          maxWeight: 7000,
        },
        small_packet: {
          type: 'stepped',
          basePrice: 18,
          additionalPrice: 3,
          baseWeight: 100,
          weightStep: 100,
          maxWeight: 2000,
        },
        m_bags: {
          type: 'stepped',
          basePrice: 25,
          additionalPrice: 2,
          weightStep: 100,
          maxWeight: 30000,
        },
        parcel: {
          type: 'stepped',
          basePrice: 8,
          additionalPrice: 3,
          weightStep: 1000,
        },
        ems: {
          type: 'stepped',
          basePrice: 15,
          additionalPrice: 5,
          weightStep: 500,
        },
      },
      mainland: {
        letter: {
          type: 'stepped',
          basePrice: 2.5,
          additionalPrice: 1.5,
          weightStep: 20,
          maxWeight: 100,
        },
        postcard: {
          type: 'fixed',
          price: 2.5,
          maxWeight: 20,
        },
        printed_papers: {
          type: 'stepped',
          basePrice: 2.0,
          additionalPrice: 1.2,
          weightStep: 20,
          maxWeight: 500,
        },
        items_for_blind: {
          type: 'fixed',
          price: 0.0,
          maxWeight: 7000,
        },
        small_packet: {
          type: 'stepped',
          basePrice: 22,
          additionalPrice: 4,
          baseWeight: 100,
          weightStep: 100,
          maxWeight: 2000,
        },
        m_bags: {
          type: 'stepped',
          basePrice: 30,
          additionalPrice: 3,
          weightStep: 100,
          maxWeight: 30000,
        },
        parcel: {
          type: 'stepped',
          basePrice: 25,
          additionalPrice: 12,
          weightStep: 500,
        },
        ems: {
          type: 'stepped',
          basePrice: 80,
          additionalPrice: 35,
          weightStep: 500,
        },
      },
      regional: {
        letter: {
          type: 'stepped',
          basePrice: 2.5,
          additionalPrice: 1.5,
          weightStep: 20,
          maxWeight: 100,
        },
        postcard: {
          type: 'fixed',
          price: 3.0,
          maxWeight: 20,
        },
        printed_papers: {
          type: 'stepped',
          basePrice: 2.0,
          additionalPrice: 1.2,
          weightStep: 20,
          maxWeight: 500,
        },
        items_for_blind: {
          type: 'fixed',
          price: 0.0,
          maxWeight: 7000,
        },
        small_packet: {
          type: 'stepped',
          basePrice: 25,
          additionalPrice: 5,
          baseWeight: 100,
          weightStep: 100,
          maxWeight: 2000,
        },
        m_bags: {
          type: 'stepped',
          basePrice: 35,
          additionalPrice: 4,
          weightStep: 100,
          maxWeight: 30000,
        },
        parcel: {
          type: 'stepped',
          basePrice: 35,
          additionalPrice: 18,
          weightStep: 500,
        },
        ems: {
          type: 'stepped',
          basePrice: 120,
          additionalPrice: 55,
          weightStep: 500,
        },
      },
      regional_tw: {
        letter: {
          type: 'stepped',
          basePrice: 3.5,
          additionalPrice: 2.5,
          weightStep: 20,
          maxWeight: 100,
        },
        printed_papers: {
          type: 'stepped',
          basePrice: 3.0,
          additionalPrice: 2.0,
          weightStep: 20,
          maxWeight: 500,
        },
      },
      international: {
        letter: {
          type: 'stepped',
          basePrice: 4.0,
          additionalPrice: 3.0,
          weightStep: 20,
          maxWeight: 100,
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
        printed_papers: {
          type: 'stepped',
          basePrice: 3.5,
          additionalPrice: 2.5,
          weightStep: 20,
          maxWeight: 500,
        },
        small_packet: {
          type: 'stepped',
          basePrice: 28,
          additionalPrice: 4,
          weightStep: 100,
          maxWeight: 2000,
        },
        parcel: {
          type: 'stepped',
          basePrice: 45,
          additionalPrice: 25,
          weightStep: 500,
        },
        ems: {
          type: 'stepped',
          basePrice: 150,
          additionalPrice: 75,
          weightStep: 500,
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
    url: 'https://www.gz.gov.cn/zwgk/zdly/jghsf/jfbz/spjg/content/post_2852139.html',
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

  // Chunghwa Post Rules
  chunghwa_post_domestic_letter: {
    name: '國內函件資費表',
    url: 'https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=20501',
  },
  chunghwa_post_regional_letter: {
    name: '大陸郵件資費表',
    url: 'https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=20505',
  },
  chunghwa_post_international_letter: {
    name: '國際函件資費表',
    url: 'https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=20503',
  },
  chunghwa_post_domestic_parcel: {
    name: '國內包裹資費表',
    url: 'https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=2050106',
  },
  chunghwa_post_international_parcel: {
    name: '國際包裹資費表',
    url: 'https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=2050401',
  },
  chunghwa_post_domestic_ems: {
    name: '國內快捷郵件資費表',
    url: 'https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=2050106',
  },
  chunghwa_post_mainland_ems: {
    name: '兩岸郵政速遞(快捷)郵件資費表',
    url: 'https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=1396492589492',
  },
  chunghwa_post_international_ems: {
    name: '國際快捷郵件資費表',
    url: 'https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=2050401',
  },
  chunghwa_post_mainland_small_packet: {
    name: '兩岸郵政e小包資費表',
    url: 'https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=1404380075391',
  },
  chunghwa_post_international_small_packet: {
    name: '國際e小包資費表',
    url: 'https://www.post.gov.tw/post/internet/Postal/index.jsp?ID=1521427719836',
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
