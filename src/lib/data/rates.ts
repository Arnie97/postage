import type { MailType } from '../utils/postal-rates';

export interface SteppedRate {
  type: 'stepped';
  basePrice: number;
  additionalPrice: number;
  weightStep: number;
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
      basePrice: number;
      additionalPrice: number;
      weightStep: number;
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
    [key in MailType]?: {
      domestic?: RateCalculationMethod;
      mainland?: RateCalculationMethod;
      regional?: RateCalculationMethod;
      regional_tw?: RateCalculationMethod;
      international?:
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
      letter: {
        domestic: {
          type: 'stepped',
          basePrice: 1.2,
          additionalPrice: 0.8,
          weightStep: 20,
          maxWeight: 100,
        },
        regional: {
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
        international: {
          air: {
            type: 'region_stepped',
            groups: {
              1: { basePrice: 5.0, additionalPrice: 1.0, weightStep: 10, maxWeight: 100 },
              2: { basePrice: 5.5, additionalPrice: 1.5, weightStep: 10, maxWeight: 100 },
              3: { basePrice: 6.0, additionalPrice: 1.8, weightStep: 10, maxWeight: 100 },
              4: { basePrice: 7.0, additionalPrice: 2.3, weightStep: 10, maxWeight: 100 },
            },
          },
          sal: {
            type: 'region_stepped',
            groups: {
              1: { basePrice: 4.5, additionalPrice: 0.5, weightStep: 10, maxWeight: 100 },
              2: { basePrice: 5.0, additionalPrice: 0.6, weightStep: 10, maxWeight: 100 },
              3: { basePrice: 5.5, additionalPrice: 0.7, weightStep: 10, maxWeight: 100 },
              4: { basePrice: 6.5, additionalPrice: 0.8, weightStep: 10, maxWeight: 100 },
            },
          },
          surface: {
            type: 'region_stepped',
            groups: {
              1: { basePrice: 3.5, additionalPrice: 0.4, weightStep: 10, maxWeight: 100 }, // 27 asia-pacific countries
              2: { basePrice: 4.0, additionalPrice: 0.5, weightStep: 10, maxWeight: 100 }, // standard rate
            },
          },
        },
      },
      postcard: {
        domestic: {
          type: 'fixed',
          price: 0.8,
          maxWeight: 20,
        },
        regional: {
          type: 'fixed',
          price: 3.5,
          maxWeight: 20,
        },
        international: {
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
      },
      small_packet: {
        domestic: {
          type: 'region_stepped',
          groups: {
            1: { basePrice: 0x5, additionalPrice: 1.0, weightStep: 1000 },
            2: { basePrice: 0x6, additionalPrice: 1.5, weightStep: 1000 },
            3: { basePrice: 0x7, additionalPrice: 2.0, weightStep: 1000 },
            4: { basePrice: 0x8, additionalPrice: 3.0, weightStep: 1000 },
            5: { basePrice: 0x9, additionalPrice: 4.0, weightStep: 1000 },
            6: { basePrice: 0xa, additionalPrice: 5.0, weightStep: 1000 },
          },
        },
        international: {
          air: {
            type: 'region_stepped',
            groups: {
              1: { basePrice: 25, additionalPrice: 23, weightStep: 100 },
              2: { basePrice: 30, additionalPrice: 27, weightStep: 100 },
              3: { basePrice: 35, additionalPrice: 33, weightStep: 100 },
            },
          },
          sal: {
            type: 'region_stepped',
            groups: {
              1: { basePrice: 22, additionalPrice: 18, weightStep: 100 },
              2: { basePrice: 27, additionalPrice: 23, weightStep: 100 },
              3: { basePrice: 32, additionalPrice: 28, weightStep: 100 },
            },
          },
          surface: {
            type: 'stepped',
            basePrice: 18,
            additionalPrice: 13,
            weightStep: 100,
          },
        },
      },
      ems: {
        domestic: {
          type: 'stepped',
          basePrice: 15.0,
          additionalPrice: 5.0,
          weightStep: 500,
        },
        regional: {
          type: 'stepped',
          basePrice: 28.0,
          additionalPrice: 15.0,
          weightStep: 500,
        },
        international: {
          air: {
            type: 'region_stepped',
            groups: {
              1: { basePrice: 40.0, additionalPrice: 20.0, weightStep: 500 },
              2: { basePrice: 45.0, additionalPrice: 25.0, weightStep: 500 },
              3: { basePrice: 50.0, additionalPrice: 30.0, weightStep: 500 },
              4: { basePrice: 60.0, additionalPrice: 35.0, weightStep: 500 },
            },
          },
        },
      },
      printed_papers: {
        domestic: {
          type: 'stepped',
          basePrice: 1.0,
          additionalPrice: 0.6,
          weightStep: 20,
          maxWeight: 500,
        },
        regional: {
          type: 'stepped',
          basePrice: 3.5,
          additionalPrice: 1.3,
          weightStep: 10,
          maxWeight: 500,
        },
        international: {
          air: {
            type: 'region_stepped',
            groups: {
              1: { basePrice: 4.5, additionalPrice: 2.2, weightStep: 10, maxWeight: 500 },
              2: { basePrice: 5.0, additionalPrice: 2.5, weightStep: 10, maxWeight: 500 },
              3: { basePrice: 6.0, additionalPrice: 2.8, weightStep: 10, maxWeight: 500 },
            },
          },
          sal: {
            type: 'region_stepped',
            groups: {
              1: { basePrice: 4.0, additionalPrice: 1.9, weightStep: 10, maxWeight: 500 },
              2: { basePrice: 4.5, additionalPrice: 2.2, weightStep: 10, maxWeight: 500 },
              3: { basePrice: 5.0, additionalPrice: 2.5, weightStep: 10, maxWeight: 500 },
            },
          },
          surface: {
            type: 'stepped',
            basePrice: 4.0,
            additionalPrice: 1.8,
            weightStep: 10,
            maxWeight: 500,
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
      letter: {
        domestic: {
          type: 'stepped',
          basePrice: 8,
          additionalPrice: 5,
          weightStep: 20,
          maxWeight: 100,
        },
        mainland: {
          type: 'stepped',
          basePrice: 9,
          additionalPrice: 7,
          weightStep: 20,
          maxWeight: 100,
        },
        regional: {
          type: 'stepped',
          basePrice: 9,
          additionalPrice: 7,
          weightStep: 20,
          maxWeight: 100,
        },
        international: {
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
      },
      parcel: {
        domestic: {
          type: 'stepped',
          basePrice: 65,
          additionalPrice: 10,
          weightStep: 1000,
        },
        mainland: {
          type: 'stepped',
          basePrice: 150,
          additionalPrice: 75,
          weightStep: 500,
        },
        regional: {
          type: 'stepped',
          basePrice: 120,
          additionalPrice: 60,
          weightStep: 500,
        },
        international: {
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
      },
      small_packet: {
        mainland: {
          type: 'stepped',
          basePrice: 65,
          additionalPrice: 10,
          weightStep: 100,
          maxWeight: 2000,
        },
        international: {
          type: 'stepped',
          basePrice: 85,
          additionalPrice: 15,
          weightStep: 100,
          maxWeight: 2000,
        },
      },
      ems: {
        domestic: {
          type: 'stepped',
          basePrice: 120,
          additionalPrice: 30,
          weightStep: 500,
        },
        mainland: {
          type: 'stepped',
          basePrice: 260,
          additionalPrice: 130,
          weightStep: 500,
        },
        regional: {
          type: 'stepped',
          basePrice: 220,
          additionalPrice: 110,
          weightStep: 500,
        },
        international: {
          type: 'stepped',
          basePrice: 320,
          additionalPrice: 160,
          weightStep: 500,
        },
      },
      postcard: {
        domestic: {
          type: 'fixed',
          price: 5,
          maxWeight: 20,
        },
        mainland: {
          type: 'fixed',
          price: 6,
          maxWeight: 20,
        },
        regional: {
          type: 'fixed',
          price: 6,
          maxWeight: 20,
        },
        international: {
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
      },
      printed_papers: {
        domestic: {
          type: 'stepped',
          basePrice: 6,
          additionalPrice: 4,
          weightStep: 20,
          maxWeight: 500,
        },
        mainland: {
          type: 'stepped',
          basePrice: 7,
          additionalPrice: 5,
          weightStep: 20,
          maxWeight: 500,
        },
        regional: {
          type: 'stepped',
          basePrice: 7,
          additionalPrice: 5,
          weightStep: 20,
          maxWeight: 500,
        },
        international: {
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
      },
    },
  },

  // Hong Kong Post
  hongkong_post: {
    serviceName: 'Hong Kong Post',
    currency: 'HKD',
    fromRegion: 'HK',
    rates: {
      letter: {
        domestic: {
          type: 'tiered',
          tiers: [
            { maxWeight: 30, price: 2.2 },
            { maxWeight: 50, price: 3.7 },
            { maxWeight: 100, price: 5.5 },
          ],
        },
        mainland: {
          type: 'tiered',
          tiers: [
            { maxWeight: 30, price: 3.2 },
            { maxWeight: 50, price: 5.2 },
            { maxWeight: 100, price: 7.8 },
          ],
        },
        regional: {
          type: 'tiered',
          tiers: [
            { maxWeight: 30, price: 4.2 },
            { maxWeight: 50, price: 6.8 },
            { maxWeight: 100, price: 10.2 },
          ],
        },
        international: {
          type: 'tiered',
          tiers: [
            { maxWeight: 30, price: 4.9 },
            { maxWeight: 50, price: 7.9 },
            { maxWeight: 100, price: 11.8 },
          ],
        },
      },
      parcel: {
        domestic: {
          type: 'stepped',
          basePrice: 26,
          additionalPrice: 6,
          weightStep: 1000,
        },
        mainland: {
          type: 'stepped',
          basePrice: 55,
          additionalPrice: 25,
          weightStep: 500,
        },
        regional: {
          type: 'stepped',
          basePrice: 75,
          additionalPrice: 35,
          weightStep: 500,
        },
        international: {
          type: 'stepped',
          basePrice: 95,
          additionalPrice: 45,
          weightStep: 500,
        },
      },
      small_packet: {
        international: {
          type: 'stepped',
          basePrice: 25,
          additionalPrice: 3,
          weightStep: 100,
          maxWeight: 2000,
        },
      },
      ems: {
        domestic: {
          type: 'stepped',
          basePrice: 27,
          additionalPrice: 7,
          weightStep: 500,
        },
        mainland: {
          type: 'stepped',
          basePrice: 85,
          additionalPrice: 40,
          weightStep: 500,
        },
        regional: {
          type: 'stepped',
          basePrice: 115,
          additionalPrice: 55,
          weightStep: 500,
        },
        international: {
          type: 'stepped',
          basePrice: 145,
          additionalPrice: 70,
          weightStep: 500,
        },
      },
      postcard: {
        domestic: {
          type: 'fixed',
          price: 2.0,
          maxWeight: 20,
        },
        mainland: {
          type: 'fixed',
          price: 2.5,
          maxWeight: 20,
        },
        regional: {
          type: 'fixed',
          price: 3.0,
          maxWeight: 20,
        },
        international: {
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
      },
      printed_papers: {
        domestic: {
          type: 'tiered',
          tiers: [
            { maxWeight: 30, price: 1.8 },
            { maxWeight: 50, price: 3.0 },
            { maxWeight: 100, price: 4.5 },
            { maxWeight: 500, price: 15.0 },
          ],
        },
        mainland: {
          type: 'tiered',
          tiers: [
            { maxWeight: 30, price: 2.5 },
            { maxWeight: 50, price: 4.2 },
            { maxWeight: 100, price: 6.3 },
            { maxWeight: 500, price: 20.0 },
          ],
        },
        regional: {
          type: 'tiered',
          tiers: [
            { maxWeight: 30, price: 3.5 },
            { maxWeight: 50, price: 5.8 },
            { maxWeight: 100, price: 8.7 },
            { maxWeight: 500, price: 25.0 },
          ],
        },
        international: {
          type: 'tiered',
          tiers: [
            { maxWeight: 30, price: 4.0 },
            { maxWeight: 50, price: 6.5 },
            { maxWeight: 100, price: 9.8 },
            { maxWeight: 500, price: 30.0 },
          ],
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
      letter: {
        domestic: {
          type: 'tiered',
          tiers: [
            { maxWeight: 50, price: 2.0 },
            { maxWeight: 100, price: 3.0 },
          ],
        },
        mainland: {
          type: 'stepped',
          basePrice: 2.5,
          additionalPrice: 1.5,
          weightStep: 20,
          maxWeight: 100,
        },
        regional: {
          type: 'stepped',
          basePrice: 2.5,
          additionalPrice: 1.5,
          weightStep: 20,
          maxWeight: 100,
        },
        regional_tw: {
          type: 'stepped',
          basePrice: 3.5,
          additionalPrice: 2.5,
          weightStep: 20,
          maxWeight: 100,
        },
        international: {
          type: 'stepped',
          basePrice: 4.0,
          additionalPrice: 3.0,
          weightStep: 20,
          maxWeight: 100,
        },
      },
      parcel: {
        domestic: {
          type: 'stepped',
          basePrice: 8,
          additionalPrice: 3,
          weightStep: 1000,
        },
        mainland: {
          type: 'stepped',
          basePrice: 25,
          additionalPrice: 12,
          weightStep: 500,
        },
        regional: {
          type: 'stepped',
          basePrice: 35,
          additionalPrice: 18,
          weightStep: 500,
        },
        international: {
          type: 'stepped',
          basePrice: 45,
          additionalPrice: 25,
          weightStep: 500,
        },
      },
      small_packet: {
        international: {
          type: 'stepped',
          basePrice: 28,
          additionalPrice: 4,
          weightStep: 100,
          maxWeight: 2000,
        },
      },
      ems: {
        domestic: {
          type: 'stepped',
          basePrice: 15,
          additionalPrice: 5,
          weightStep: 500,
        },
        mainland: {
          type: 'stepped',
          basePrice: 80,
          additionalPrice: 35,
          weightStep: 500,
        },
        regional: {
          type: 'stepped',
          basePrice: 120,
          additionalPrice: 55,
          weightStep: 500,
        },
        international: {
          type: 'stepped',
          basePrice: 150,
          additionalPrice: 75,
          weightStep: 500,
        },
      },
      postcard: {
        domestic: {
          type: 'fixed',
          price: 2.0,
          maxWeight: 20,
        },
        mainland: {
          type: 'fixed',
          price: 2.5,
          maxWeight: 20,
        },
        regional: {
          type: 'fixed',
          price: 3.0,
          maxWeight: 20,
        },
        international: {
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
      },
      printed_papers: {
        domestic: {
          type: 'tiered',
          tiers: [
            { maxWeight: 50, price: 1.5 },
            { maxWeight: 100, price: 2.5 },
            { maxWeight: 500, price: 10.0 },
          ],
        },
        mainland: {
          type: 'stepped',
          basePrice: 2.0,
          additionalPrice: 1.2,
          weightStep: 20,
          maxWeight: 500,
        },
        regional: {
          type: 'stepped',
          basePrice: 2.0,
          additionalPrice: 1.2,
          weightStep: 20,
          maxWeight: 500,
        },
        regional_tw: {
          type: 'stepped',
          basePrice: 3.0,
          additionalPrice: 2.0,
          weightStep: 20,
          maxWeight: 500,
        },
        international: {
          type: 'stepped',
          basePrice: 3.5,
          additionalPrice: 2.5,
          weightStep: 20,
          maxWeight: 500,
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
