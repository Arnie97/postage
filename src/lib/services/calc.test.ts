import { describe, it, expect } from 'vitest';
import { calculatePostage, getSupplementRates } from './calc';
import type { MailType, MailCategory } from '../data/mail-types';
import { POSTAGE_RATES, type CategoryRates, type FixedRate, type Rate } from '../data/rates';
import type { CalculationResult, CalculationError, RateCalculationDetails } from './calc';

describe('calculatePostage', () => {
  // Helper function to check if result is an error
  function isError(result: CalculationResult | CalculationError): result is CalculationError {
    return 'errorType' in result;
  }

  describe('Successful Calculations', () => {
    interface TestCase {
      description: string;
      input: {
        mailType: MailType;
        fromRegion: string;
        toRegion: string;
        weight: number;
        mailCategory?: MailCategory;
        registeredMail?: boolean;
      };
      expected: Partial<RateCalculationDetails> & {
        serviceKey?: string;
        supplements?: {
          registrationFee?: number;
          insuranceFee?: number;
        };
        originalPrice?: number;
      };
    }

    const successTestCases: TestCase[] = [
      // Fixed Rate Pricing
      {
        description: 'China Post domestic postcard - tiered rate',
        input: { mailType: 'postcard', fromRegion: 'CN-BJ', toRegion: 'CN-SH', weight: 15 },
        expected: {
          totalPrice: 0.8,
          originalPrice: 0.8,
          serviceKey: 'china_post',
          rateType: 'tiered',
          basePrice: 0.8,
        },
      },

      // Stepped Rate Pricing - Single Tier
      {
        description: 'China Post domestic letter - base weight within first step',
        input: { mailType: 'letter', fromRegion: 'CN-BJ', toRegion: 'CN-SH', weight: 20 },
        expected: {
          totalPrice: 1.2,
          originalPrice: 1.2,
          rateType: 'stepped',
          baseWeight: 20,
          basePrice: 1.2,
          additionalWeight: 0,
        },
      },
      {
        description: 'China Post domestic letter - weight exceeding first step',
        input: { mailType: 'letter', fromRegion: 'CN-BJ', toRegion: 'CN-SH', weight: 35 },
        expected: {
          totalPrice: 2.4,
          originalPrice: 2.4,
          rateType: 'stepped',
          baseWeight: 20,
          basePrice: 1.2,
          additionalWeight: 15,
          additionalPrice: 1.2,
          weightStep: 20,
        },
      },
      {
        description: 'China Post domestic letter - multiple steps',
        input: { mailType: 'letter', fromRegion: 'CN-BJ', toRegion: 'CN-SH', weight: 65 },
        expected: { totalPrice: 4.8, originalPrice: 4.8, additionalWeight: 45 },
      },

      // Zonal Rate Pricing
      {
        description: 'China Post international air mail - Zone 3',
        input: {
          mailType: 'letter',
          fromRegion: 'CN-BJ',
          toRegion: 'US',
          weight: 25,
          mailCategory: 'air',
        },
        expected: {
          totalPrice: 7.8,
          originalPrice: 7.8,
          rateType: 'stepped',
          baseWeight: 20,
          basePrice: 6.0,
          additionalWeight: 5,
          additionalPrice: 1.8,
        },
      },
      {
        description: 'China Post international air mail - Zone 1 base weight',
        input: {
          mailType: 'letter',
          fromRegion: 'CN-BJ',
          toRegion: 'JP',
          weight: 20,
          mailCategory: 'air',
        },
        expected: { totalPrice: 5.0, originalPrice: 5.0, additionalWeight: 0 },
      },

      // Multi-Tier Stepped Pricing with proper mail categories
      {
        description: 'China Post to Hong Kong air - first tier',
        input: {
          mailType: 'letter',
          fromRegion: 'CN-BJ',
          toRegion: 'HK',
          weight: 15,
          mailCategory: 'air',
        },
        expected: {
          totalPrice: 2.5,
          originalPrice: 2.5,
          rateType: 'stepped',
          baseWeight: 0,
          basePrice: 1.5,
        },
      },
      {
        description: 'China Post to Hong Kong air - middle tier',
        input: {
          mailType: 'letter',
          fromRegion: 'CN-BJ',
          toRegion: 'HK',
          weight: 75,
          mailCategory: 'air',
        },
        expected: { totalPrice: 8.0, originalPrice: 8.0, baseWeight: 50, basePrice: 6.5 },
      },

      // Registration Fees
      {
        description: 'China Post domestic letter with registration',
        input: {
          mailType: 'letter',
          fromRegion: 'CN-BJ',
          toRegion: 'CN-SH',
          weight: 20,
          registeredMail: true,
        },
        expected: { totalPrice: 1.2, supplements: { registrationFee: 3.0 }, originalPrice: 4.2 },
      },
      {
        description: 'China Post domestic letter without registration',
        input: {
          mailType: 'letter',
          fromRegion: 'CN-BJ',
          toRegion: 'CN-SH',
          weight: 20,
          registeredMail: false,
        },
        expected: { totalPrice: 1.2, originalPrice: 1.2 },
      },

      // Multiple Postal Services
      {
        description: 'Chunghwa Post domestic rates',
        input: { mailType: 'letter', fromRegion: 'TW-TPE', toRegion: 'TW-KHH', weight: 20 },
        expected: { totalPrice: 8, originalPrice: 8, serviceKey: 'chunghwa_post' },
      },
      {
        description: 'Hong Kong Post domestic rates',
        input: { mailType: 'letter', fromRegion: 'HK', toRegion: 'HK', weight: 25 },
        expected: { totalPrice: 2.2, originalPrice: 2.2, serviceKey: 'hongkong_post' },
      },
      {
        description: 'Macau Post domestic rates',
        input: { mailType: 'letter', fromRegion: 'MO', toRegion: 'MO', weight: 15 },
        expected: { totalPrice: 2.5, originalPrice: 2.5, serviceKey: 'macau_post' },
      },

      // Edge Cases
      {
        description: 'Items for blind (free mail)',
        input: {
          mailType: 'items_for_blind',
          fromRegion: 'CN-BJ',
          toRegion: 'CN-SH',
          weight: 1000,
        },
        expected: { totalPrice: 0.0, originalPrice: 0.0, rateType: 'fixed' },
      },
    ];

    successTestCases.forEach((testCase) => {
      it(testCase.description, () => {
        const result = calculatePostage(
          testCase.input.mailType,
          testCase.input.fromRegion,
          testCase.input.toRegion,
          testCase.input.weight,
          testCase.input.mailCategory,
          testCase.input.registeredMail,
        );

        expect(isError(result)).toBe(false);
        if (!isError(result)) {
          // Check details properties
          if (testCase.expected.totalPrice !== undefined) {
            expect(result.details.totalPrice).toBe(testCase.expected.totalPrice);
          }
          if (testCase.expected.rateType !== undefined) {
            expect(result.details.rateType).toBe(testCase.expected.rateType);
          }
          if (testCase.expected.baseWeight !== undefined) {
            expect(result.details.baseWeight).toBe(testCase.expected.baseWeight);
          }
          if (testCase.expected.basePrice !== undefined) {
            expect(result.details.basePrice).toBe(testCase.expected.basePrice);
          }
          if (testCase.expected.additionalWeight !== undefined) {
            expect(result.details.additionalWeight).toBe(testCase.expected.additionalWeight);
          }
          if (testCase.expected.additionalPrice !== undefined) {
            expect(result.details.additionalPrice).toBe(testCase.expected.additionalPrice);
          }
          if (testCase.expected.weightStep !== undefined) {
            expect(result.details.weightStep).toBe(testCase.expected.weightStep);
          }
          if (testCase.expected.supplements?.registrationFee !== undefined) {
            expect(result.supplements.registrationFee).toBe(
              testCase.expected.supplements.registrationFee,
            );
          } else if (testCase.input.registeredMail === false) {
            expect(result.supplements.registrationFee).toBeUndefined();
          }
          expect(result.supplements.originalPrice).toBe(testCase.expected.originalPrice);

          // Check service key
          if (testCase.expected.serviceKey !== undefined) {
            expect(result.serviceKey).toBe(testCase.expected.serviceKey);
          }
        }
      });
    });

    // Special test for mail category comparison
    it('China Post international air vs sal comparison', () => {
      const airResult = calculatePostage('letter', 'CN-BJ', 'US', 20, 'air');
      const salResult = calculatePostage('letter', 'CN-BJ', 'US', 20, 'sal');

      expect(isError(airResult)).toBe(false);
      expect(isError(salResult)).toBe(false);
      if (!isError(airResult) && !isError(salResult)) {
        expect(airResult.details.totalPrice!).toBeGreaterThan(salResult.details.totalPrice!);
      }
    });
  });

  describe('Doorstep delivery', () => {
    it.each([
      { weight: 20, postage: 1.2 },
      { weight: 35, postage: 2.4 },
    ])(
      'charges 2 yuan for a registered domestic letter weighing $weight g',
      ({ weight, postage }) => {
        const result = calculatePostage('letter', 'CN-BJ', 'CN-SH', weight, undefined, true, true);

        expect(isError(result)).toBe(false);
        if (!isError(result)) {
          expect(result.supplements.registrationFee).toBe(3);
          expect(result.supplements.doorstepDeliveryFee).toBe(2);
          expect(result.supplements.originalPrice).toBeCloseTo(postage + 3 + 2);
        }
      },
    );

    it.each([
      { mailType: 'postcard' as const, weight: 20 },
      { mailType: 'aerogramme' as const, weight: 20 },
      { mailType: 'printed_papers' as const, weight: 20 },
      { mailType: 'items_for_blind' as const, weight: 20 },
    ])('does not charge doorstep delivery for domestic $mailType', ({ mailType, weight }) => {
      const result = calculatePostage(mailType, 'CN-BJ', 'CN-SH', weight, undefined, true, true);

      expect(isError(result)).toBe(false);
      if (!isError(result)) {
        expect(result.supplements.registrationFee).toBe(3);
        expect(result.supplements.doorstepDeliveryFee).toBeUndefined();
        expect(result.supplements.originalPrice).toBeCloseTo(result.details.totalPrice + 3);
      }
    });

    it.each([
      { from: 'CN-BJ', to: 'HK', category: 'air' as const },
      { from: 'CN-BJ', to: 'MO', category: 'air' as const },
      { from: 'CN-BJ', to: 'TW', category: 'air' as const },
      { from: 'CN-BJ', to: 'US', category: 'air' as const },
      { from: 'TW-TPE', to: 'TW-KHH', category: undefined },
    ])('does not charge doorstep delivery from $from to $to', ({ from, to, category }) => {
      const result = calculatePostage('letter', from, to, 20, category, true, true);

      expect(isError(result)).toBe(false);
      if (!isError(result)) {
        expect(result.supplements.doorstepDeliveryFee).toBeUndefined();
        expect(result.supplements.originalPrice).toBeCloseTo(
          result.details.totalPrice + (result.supplements.registrationFee ?? 0),
        );
      }
    });

    it('does not charge doorstep delivery when it is not selected', () => {
      const result = calculatePostage('letter', 'CN-BJ', 'CN-SH', 20, undefined, true, false);

      expect(isError(result)).toBe(false);
      if (!isError(result)) {
        expect(result.supplements.doorstepDeliveryFee).toBeUndefined();
        expect(result.supplements.originalPrice).toBeCloseTo(4.2);
      }
    });

    it('combines doorstep delivery with insurance, receipt, and discounts', () => {
      const result = calculatePostage(
        'letter',
        'CN-BJ',
        'CN-SH',
        20,
        undefined,
        true,
        true,
        200,
        true,
        0,
        50,
      );

      expect(isError(result)).toBe(false);
      if (!isError(result)) {
        expect(result.supplements.registrationFee).toBe(3);
        expect(result.supplements.doorstepDeliveryFee).toBe(2);
        expect(result.supplements.insuranceFee).toBe(2);
        expect(result.supplements.adviceOfReceiptFee).toBe(3);
        expect(result.supplements.originalPrice).toBeCloseTo(11.2);
        expect(result.supplements.ruleDiscount).toBeCloseTo(-1.2);
        expect(result.supplements.stampDiscount).toBeCloseTo(-5);
        expect(result.supplements.discountedPrice).toBeCloseTo(5);
      }
    });

    it('reads the domestic doorstep rate for letters and postcards', () => {
      const destinationRates = POSTAGE_RATES.CN.rates.domestic!;
      expect(getSupplementRates(destinationRates.letter, destinationRates).doorstepDelivery).toBe(
        2,
      );
      expect(
        getSupplementRates(destinationRates.postcard, destinationRates).doorstepDelivery,
      ).toBeUndefined();
    });

    it.each([
      { registered: false, doorstep: false, insuredValue: undefined, total: 8 },
      { registered: true, doorstep: true, insuredValue: undefined, total: 8 },
      { registered: false, doorstep: false, insuredValue: 200, total: 10 },
      { registered: true, doorstep: true, insuredValue: 200, total: 10 },
    ])(
      'includes registration and delivery in domestic parcel postage with insurance value $insuredValue',
      ({ registered, doorstep, insuredValue, total }) => {
        const destinationRates = POSTAGE_RATES.CN.rates.domestic!;
        expect(getSupplementRates(destinationRates.parcel, destinationRates)).toMatchObject({
          registrationFee: 0,
          doorstepDelivery: 0,
          adviceOfReceipt: 3,
        });

        const result = calculatePostage(
          'parcel',
          'CN-BJ',
          'CN-SH',
          500,
          undefined,
          registered,
          doorstep,
          insuredValue,
        );

        expect(isError(result)).toBe(false);
        if (!isError(result)) {
          expect(result.supplements.registrationFee).toBeUndefined();
          expect(result.supplements.doorstepDeliveryFee).toBeUndefined();
          expect(result.supplements.insuranceFee).toBe(insuredValue ? 2 : undefined);
          expect(result.supplements.originalPrice).toBeCloseTo(total);
        }
      },
    );
  });

  describe('Advice of receipt', () => {
    it.each([
      { registered: false, advice: false, total: 1.2 },
      { registered: false, advice: true, total: 4.2 },
      { registered: true, advice: false, total: 4.2 },
      { registered: true, advice: true, total: 7.2 },
    ])(
      'charges selected services: registered=$registered, advice=$advice',
      ({ registered, advice, total }) => {
        const result = calculatePostage(
          'letter',
          'CN-BJ',
          'CN-SH',
          20,
          undefined,
          registered,
          undefined,
          undefined,
          advice,
        );

        expect(isError(result)).toBe(false);
        if (!isError(result)) {
          expect(result.supplements.registrationFee).toBe(registered ? 3 : undefined);
          expect(result.supplements.adviceOfReceiptFee).toBe(advice ? 3 : undefined);
          expect(result.supplements.posteRestanteFee).toBeUndefined();
          expect(result.supplements.originalPrice).toBeCloseTo(total);
        }
      },
    );

    it.each([
      { destination: 'HK', category: 'air' as const, postage: 2.5 },
      { destination: 'HK', category: 'surface' as const, postage: 1.5 },
      { destination: 'MO', category: 'air' as const, postage: 2.5 },
      { destination: 'MO', category: 'surface' as const, postage: 1.5 },
      { destination: 'TW', category: 'air' as const, postage: 2.5 },
      { destination: 'TW', category: 'surface' as const, postage: 1.5 },
    ])(
      'charges 3 yuan for $category letters to $destination',
      ({ destination, category, postage }) => {
        const result = calculatePostage(
          'letter',
          'CN-BJ',
          destination,
          20,
          category,
          true,
          undefined,
          undefined,
          true,
        );

        expect(isError(result)).toBe(false);
        if (!isError(result)) {
          expect(result.details.totalPrice).toBe(postage);
          expect(result.supplements.registrationFee).toBe(16);
          expect(result.supplements.adviceOfReceiptFee).toBe(3);
          expect(result.supplements.originalPrice).toBeCloseTo(postage + 16 + 3);
        }
      },
    );

    it.each(['HK', 'MO', 'TW'])(
      'uses the regional supplement fees for a postcard to %s',
      (destination) => {
        const result = calculatePostage(
          'postcard',
          'CN-BJ',
          destination,
          20,
          'air',
          true,
          undefined,
          undefined,
          true,
        );

        expect(isError(result)).toBe(false);
        if (!isError(result)) {
          expect(result.supplements.registrationFee).toBe(16);
          expect(result.supplements.adviceOfReceiptFee).toBe(3);
          expect(result.supplements.originalPrice).toBeCloseTo(23);
        }
      },
    );

    it('uses the domestic supplement fees for an aerogramme', () => {
      const result = calculatePostage(
        'aerogramme',
        'CN-BJ',
        'CN-SH',
        20,
        undefined,
        true,
        undefined,
        undefined,
        true,
      );

      expect(isError(result)).toBe(false);
      if (!isError(result)) {
        expect(result.supplements.registrationFee).toBe(3);
        expect(result.supplements.adviceOfReceiptFee).toBe(3);
        expect(result.supplements.posteRestanteFee).toBeUndefined();
        expect(result.supplements.originalPrice).toBeCloseTo(6.8);
      }
    });

    it('charges the domestic postcard registration and receipt fees', () => {
      const result = calculatePostage(
        'postcard',
        'CN-BJ',
        'CN-SH',
        20,
        undefined,
        true,
        undefined,
        undefined,
        true,
      );

      expect(isError(result)).toBe(false);
      if (!isError(result)) {
        expect(result.supplements.registrationFee).toBe(3);
        expect(result.supplements.adviceOfReceiptFee).toBe(3);
        expect(result.supplements.originalPrice).toBeCloseTo(6.8);
      }
    });

    it('does not apply fees configured for a different route', () => {
      const result = calculatePostage(
        'letter',
        'CN-BJ',
        'US',
        20,
        'air',
        false,
        undefined,
        undefined,
        true,
      );

      expect(isError(result)).toBe(false);
      if (!isError(result)) {
        expect(result.supplements.adviceOfReceiptFee).toBeUndefined();
        expect(result.supplements.posteRestanteFee).toBeUndefined();
        expect(result.supplements.originalPrice).toBeCloseTo(6);
      }
    });

    it('includes the added services when calculating discounts', () => {
      const result = calculatePostage(
        'letter',
        'CN-BJ',
        'CN-SH',
        20,
        undefined,
        true,
        undefined,
        undefined,
        true,
        0,
        50,
      );

      expect(isError(result)).toBe(false);
      if (!isError(result)) {
        expect(result.supplements.originalPrice).toBeCloseTo(7.2);
        expect(result.supplements.ruleDiscount).toBeCloseTo(-1.2);
        expect(result.supplements.stampDiscount).toBeCloseTo(-3);
        expect(result.supplements.discountedPrice).toBeCloseTo(3);
      }
    });

    it('excludes insurance from the customer discount before applying the stamp discount', () => {
      const result = calculatePostage(
        'parcel',
        'CN-BJ',
        'CN-SH',
        500,
        undefined,
        true,
        undefined,
        200,
        true,
        0,
        50,
      );

      expect(isError(result)).toBe(false);
      if (!isError(result)) {
        expect(result.details.totalPrice).toBe(8);
        expect(result.supplements.registrationFee).toBeUndefined();
        expect(result.supplements.insuranceCommission).toBe(0);
        expect(result.supplements.insuranceFee).toBe(2);
        expect(result.supplements.adviceOfReceiptFee).toBe(3);
        expect(result.supplements.posteRestanteFee).toBeUndefined();
        expect(result.supplements.originalPrice).toBeCloseTo(13);
        expect(result.supplements.ruleDiscount).toBeCloseTo(-2.2);
        expect(result.supplements.stampDiscount).toBeCloseTo(-5.4);
        expect(result.supplements.discountedPrice).toBeCloseTo(5.4);
      }
    });

    it('combines registration, insurance and receipt before the stamp discount', () => {
      const result = calculatePostage(
        'letter',
        'CN-BJ',
        'HK',
        20,
        'air',
        true,
        undefined,
        200,
        true,
        undefined,
        50,
      );

      expect(isError(result)).toBe(false);
      if (!isError(result)) {
        expect(result.supplements.registrationFee).toBe(16);
        expect(result.supplements.insuranceCommission).toBe(2);
        expect(result.supplements.insuranceFee).toBe(3);
        expect(result.supplements.adviceOfReceiptFee).toBe(3);
        expect(result.supplements.posteRestanteFee).toBeUndefined();
        expect(result.supplements.originalPrice).toBeCloseTo(26.5);
        expect(result.supplements.stampDiscount).toBeCloseTo(-13.25);
        expect(result.supplements.discountedPrice).toBeCloseTo(13.25);
      }
    });

    it('prefers a mail-specific fee, including zero, to the route defaults', () => {
      const rate: FixedRate = { type: 'fixed', price: 1, supplements: { adviceOfReceipt: 0 } };
      const destinationRates = { supplements: { registrationFee: 3, adviceOfReceipt: 3 } };

      expect(getSupplementRates(rate, destinationRates)).toMatchObject({
        registrationFee: 3,
        adviceOfReceipt: 0,
      });
      expect(getSupplementRates(undefined, destinationRates)).toEqual({});
    });

    it('omits a zero-priced advice of receipt from the calculation', () => {
      const destinationRates = POSTAGE_RATES.CN.rates.domestic!;
      const letter = destinationRates.letter as Rate;
      const previousSupplements = letter.supplements;
      letter.supplements = { ...previousSupplements, adviceOfReceipt: 0 };

      try {
        const result = calculatePostage(
          'letter',
          'CN-BJ',
          'CN-SH',
          20,
          undefined,
          true,
          undefined,
          undefined,
          true,
        );
        expect(isError(result)).toBe(false);
        if (!isError(result)) {
          expect(result.supplements.adviceOfReceiptFee).toBeUndefined();
          expect(result.supplements.originalPrice).toBeCloseTo(4.2);
        }
      } finally {
        letter.supplements = previousSupplements;
      }
    });
  });

  describe('Shared supplement rates', () => {
    it.each(['HK', 'MO', 'TW'])(
      'uses regional defaults for an aerogramme to %s without a mail category',
      (destination) => {
        const result = calculatePostage(
          'aerogramme',
          'CN-BJ',
          destination,
          20,
          undefined,
          true,
          undefined,
          undefined,
          true,
        );

        expect(isError(result)).toBe(false);
        if (!isError(result)) {
          expect(result.supplements.registrationFee).toBe(16);
          expect(result.supplements.adviceOfReceiptFee).toBe(3);
          expect(result.supplements.originalPrice).toBeCloseTo(20.8);
        }
      },
    );

    it('keeps the M-bag registration override and uses the regional receipt fee', () => {
      const result = calculatePostage(
        'm_bags',
        'CN-BJ',
        'HK',
        5000,
        'air',
        true,
        undefined,
        undefined,
        true,
      );

      expect(isError(result)).toBe(false);
      if (!isError(result)) {
        expect(result.supplements.registrationFee).toBe(80);
        expect(result.supplements.adviceOfReceiptFee).toBe(3);
        expect(result.supplements.originalPrice).toBeCloseTo(263);
      }
    });

    it.each([
      {
        mailType: 'postcard' as const,
        from: 'CN-BJ',
        to: 'US',
        weight: 20,
        category: 'air' as const,
        registration: 16,
        total: 21,
      },
      {
        mailType: 'aerogramme' as const,
        from: 'CN-BJ',
        to: 'US',
        weight: 20,
        category: undefined,
        registration: 16,
        total: 21.5,
      },
      {
        mailType: 'postcard' as const,
        from: 'TW-TPE',
        to: 'TW-KHH',
        weight: 20,
        category: undefined,
        registration: 20,
        total: 25,
      },
      {
        mailType: 'postcard' as const,
        from: 'TW-TPE',
        to: 'US',
        weight: 20,
        category: 'air' as const,
        registration: 65,
        total: 76,
      },
      {
        mailType: 'm_bags' as const,
        from: 'TW-TPE',
        to: 'US',
        weight: 10000,
        category: 'air' as const,
        registration: 150,
        total: 3730,
      },
    ])(
      'uses the configured registration fee for $mailType from $from to $to',
      ({ mailType, from, to, weight, category, registration, total }) => {
        const result = calculatePostage(mailType, from, to, weight, category, true);
        expect(isError(result)).toBe(false);
        if (!isError(result)) {
          expect(result.supplements.registrationFee).toBe(registration);
          expect(result.supplements.originalPrice).toBeCloseTo(total);
        }
      },
    );

    it.each(['air', 'sal', 'surface'] as const)(
      'uses the shared registration fee for international %s letters',
      (category) => {
        const result = calculatePostage('letter', 'CN-BJ', 'US', 20, category, true);
        expect(isError(result)).toBe(false);
        if (!isError(result)) {
          expect(result.supplements.registrationFee).toBe(16);
          expect(result.supplements.originalPrice).toBeCloseTo(result.details.totalPrice + 16);
        }
      },
    );

    it.each([
      { destination: 'HK', category: 'air' as const },
      { destination: 'HK', category: 'surface' as const },
      { destination: 'US', category: 'air' as const },
      { destination: 'US', category: 'sal' as const },
      { destination: 'US', category: 'surface' as const },
    ])(
      'uses the shared registration fee for $category M-bags to $destination',
      ({ destination, category }) => {
        const result = calculatePostage('m_bags', 'CN-BJ', destination, 5000, category, true);
        expect(isError(result)).toBe(false);
        if (!isError(result)) {
          expect(result.supplements.registrationFee).toBe(80);
          expect(result.supplements.originalPrice).toBeCloseTo(result.details.totalPrice + 80);
        }
      },
    );

    it('prefers a category override, then the mail-type fee, then the route defaults', () => {
      const destinationRates = { supplements: { registrationFee: 16, adviceOfReceipt: 3 } };
      const rates: CategoryRates = {
        supplements: { registrationFee: 80 },
        air: { type: 'fixed', price: 1, supplements: { registrationFee: 0 } },
        surface: { type: 'fixed', price: 1 },
      };

      expect(getSupplementRates(rates, destinationRates, 'air')).toMatchObject({
        registrationFee: 0,
        adviceOfReceipt: 3,
      });
      expect(getSupplementRates(rates, destinationRates, 'surface')).toMatchObject({
        registrationFee: 80,
        adviceOfReceipt: 3,
      });
      expect(getSupplementRates(rates, destinationRates)).toEqual({});
    });

    it('does not use letter-only fees for other mail types', () => {
      const letter: FixedRate = {
        type: 'fixed',
        price: 1,
        supplements: { registrationFee: 33, adviceOfReceipt: 7 },
      };
      const rate: FixedRate = { type: 'fixed', price: 1 };
      expect(getSupplementRates(rate, { letter })).toEqual({
        registrationFee: undefined,
        doorstepDelivery: undefined,
        adviceOfReceipt: undefined,
      });
      expect(
        getSupplementRates(rate, {
          supplements: { registrationFee: 16, adviceOfReceipt: 3 },
          letter,
        }),
      ).toMatchObject({
        registrationFee: 16,
        adviceOfReceipt: 3,
      });
    });

    it('uses a shared insurance commission without falling back to the letter fee', () => {
      const regionalRates = POSTAGE_RATES.CN.rates.regional!;
      const previousInsurance = regionalRates.insurance;
      regionalRates.insurance = {
        supplements: { registrationFee: 2 },
        air: {
          type: 'stepped',
          tiers: [{ weightStep: 200, additionalPrice: 3 }],
          maxWeight: 20000,
        },
      };

      try {
        const result = calculatePostage('letter', 'CN-BJ', 'HK', 20, 'air', false, undefined, 200);
        expect(isError(result)).toBe(false);
        if (!isError(result)) {
          expect(result.supplements.insuranceCommission).toBe(2);
          expect(result.supplements.insuranceFee).toBe(3);
          expect(result.supplements.originalPrice).toBeCloseTo(7.5);
        }
      } finally {
        regionalRates.insurance = previousInsurance;
      }
    });
  });

  describe('Domestic conscript discount', () => {
    it.each([
      { weight: 20, registered: false, stamp: undefined, original: 1.2, expected: 0 },
      { weight: 20, registered: true, stamp: undefined, original: 4.2, expected: 3 },
      { weight: 21, registered: false, stamp: undefined, original: 2.4, expected: 1.2 },
      { weight: 101, registered: true, stamp: undefined, original: 11, expected: 9.8 },
      { weight: 20, registered: false, stamp: 45, original: 1.2, expected: 0 },
      { weight: 21, registered: true, stamp: 50, original: 5.4, expected: 2.1 },
      { weight: 60, registered: false, stamp: 75, original: 3.6, expected: 1.8 },
    ])(
      'charges only the payable portion: $weight g, registered=$registered, stamp=$stamp',
      ({ weight, registered, stamp, original, expected }) => {
        const result = calculatePostage(
          'letter',
          'CN-HI',
          'CN-XJ',
          weight,
          undefined,
          registered,
          undefined,
          undefined,
          undefined,
          0,
          stamp,
        );
        expect(isError(result)).toBe(false);
        if (!isError(result)) {
          expect(result.supplements.originalPrice).toBeCloseTo(original);
          expect(result.supplements.ruleDiscount).toBeCloseTo(-1.2);
          expect(result.supplements.discountedPrice).toBeCloseTo(expected);
        }
      },
    );

    it('keeps excess postcard charges payable', () => {
      const result = calculatePostage(
        'postcard',
        'CN-HI',
        'CN-XJ',
        21,
        undefined,
        false,
        undefined,
        undefined,
        undefined,
        0,
        50,
      );
      expect(isError(result)).toBe(false);
      if (!isError(result)) expect(result.supplements.discountedPrice).toBeCloseTo(2.6);
    });

    it('preserves parcel percentage discounts', () => {
      const result = calculatePostage(
        'parcel',
        'CN-BJ',
        'CN-SH',
        500,
        undefined,
        false,
        undefined,
        undefined,
        undefined,
        0,
      );
      expect(isError(result)).toBe(false);
      if (!isError(result))
        expect(result.supplements.discountedPrice).toBeCloseTo(
          result.supplements.originalPrice * 0.8,
        );
    });
  });

  describe('Error Handling', () => {
    interface ErrorTestCase {
      description: string;
      input: {
        mailType: MailType;
        fromRegion: string;
        toRegion: string;
        weight: number;
        mailCategory?: MailCategory;
        registeredMail?: boolean;
      };
      expectedError: CalculationError['errorType'];
    }

    const errorTestCases: ErrorTestCase[] = [
      {
        description: 'unsupported origin region',
        input: { mailType: 'letter', fromRegion: 'US', toRegion: 'CN-BJ', weight: 20 },
        expectedError: 'service',
      },
      {
        description: 'unsupported destination',
        input: { mailType: 'letter', fromRegion: 'CN-BJ', toRegion: 'INVALID', weight: 20 },
        expectedError: 'calculation',
      },
      {
        description: 'unsupported mail type',
        input: { mailType: 'parcel', fromRegion: 'MO', toRegion: 'CN-BJ', weight: 20 },
        expectedError: 'mail_type',
      },
      {
        description: 'missing required mail category for international',
        input: { mailType: 'letter', fromRegion: 'CN-BJ', toRegion: 'US', weight: 20 },
        expectedError: 'calculation',
      },
      {
        description: 'weight exceeding maxWeight for fixed rate',
        input: { mailType: 'aerogramme', fromRegion: 'CN-BJ', toRegion: 'CN-SH', weight: 25 },
        expectedError: 'weight',
      },
      {
        description: 'China Post to Hong Kong - first tier requires mail category',
        input: { mailType: 'letter', fromRegion: 'CN-BJ', toRegion: 'HK', weight: 15 },
        expectedError: 'calculation',
      },
      {
        description: 'China Post to Hong Kong - middle tier requires mail category',
        input: { mailType: 'letter', fromRegion: 'CN-BJ', toRegion: 'HK', weight: 75 },
        expectedError: 'calculation',
      },
      {
        description: 'China Post to Hong Kong - last tier requires mail category',
        input: { mailType: 'letter', fromRegion: 'CN-BJ', toRegion: 'HK', weight: 1500 },
        expectedError: 'calculation',
      },
      {
        description: 'China Post to Hong Kong - exact tier boundary requires mail category',
        input: { mailType: 'letter', fromRegion: 'CN-BJ', toRegion: 'HK', weight: 20 },
        expectedError: 'calculation',
      },
      {
        description: 'weight exceeding global maxWeight',
        input: { mailType: 'letter', fromRegion: 'CN-BJ', toRegion: 'HK', weight: 2500 },
        expectedError: 'calculation',
      },
    ];

    errorTestCases.forEach((testCase) => {
      it(`should return ${testCase.expectedError} error for ${testCase.description}`, () => {
        const result = calculatePostage(
          testCase.input.mailType,
          testCase.input.fromRegion,
          testCase.input.toRegion,
          testCase.input.weight,
          testCase.input.mailCategory,
          testCase.input.registeredMail,
        );

        expect(isError(result)).toBe(true);
        if (isError(result)) {
          expect(result.errorType).toBe(testCase.expectedError);
        }
      });
    });
  });
});
