import { describe, it, expect } from 'vitest';
import { calculatePostageRate } from './calc';
import type { MailType } from '../data/mail-types';
import type { CalculationResult, CalculationError, RateCalculationDetails } from './calc';

describe('calculatePostageRate', () => {
  // Helper function to check if result is an error
  function isError(result: CalculationResult | CalculationError): result is CalculationError {
    return 'errorType' in result;
  }

  describe('Successful Calculations', () => {
    interface TestCase {
      description: string;
      input: {
        mailType: string;
        fromRegion: string;
        toRegion: string;
        weight: number;
        mailCategory?: 'air' | 'sal';
        isRegistered?: boolean;
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
        description: 'China Post domestic postcard - fixed rate',
        input: { mailType: 'postcard', fromRegion: 'CN-BJ', toRegion: 'CN-SH', weight: 15 },
        expected: {
          totalPrice: 0.8,
          originalPrice: 0.8,
          serviceKey: 'china_post',
          rateType: 'fixed',
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
          isRegistered: true,
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
          isRegistered: false,
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
        const result = calculatePostageRate(
          testCase.input.mailType as MailType,
          testCase.input.fromRegion,
          testCase.input.toRegion,
          testCase.input.weight,
          testCase.input.mailCategory,
          testCase.input.isRegistered,
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
          } else if (testCase.input.isRegistered === false) {
            expect(result.supplements.registrationFee).toBeUndefined();
          }
          expect(result.originalPrice).toBe(testCase.expected.originalPrice);

          // Check service key
          if (testCase.expected.serviceKey !== undefined) {
            expect(result.serviceKey).toBe(testCase.expected.serviceKey);
          }
        }
      });
    });

    // Special test for mail category comparison
    it('China Post international air vs sal comparison', () => {
      const airResult = calculatePostageRate('letter', 'CN-BJ', 'US', 20, 'air');
      const salResult = calculatePostageRate('letter', 'CN-BJ', 'US', 20, 'sal');

      expect(isError(airResult)).toBe(false);
      expect(isError(salResult)).toBe(false);
      if (!isError(airResult) && !isError(salResult)) {
        expect(airResult.details.totalPrice!).toBeGreaterThan(salResult.details.totalPrice!);
      }
    });
  });

  describe('Error Handling', () => {
    interface ErrorTestCase {
      description: string;
      input: {
        mailType: string;
        fromRegion: string;
        toRegion: string;
        weight: number;
        mailCategory?: 'air' | 'sal';
        isRegistered?: boolean;
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
        input: { mailType: 'postcard', fromRegion: 'CN-BJ', toRegion: 'CN-SH', weight: 25 },
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
        const result = calculatePostageRate(
          testCase.input.mailType as MailType,
          testCase.input.fromRegion,
          testCase.input.toRegion,
          testCase.input.weight,
          testCase.input.mailCategory,
          testCase.input.isRegistered,
        );

        expect(isError(result)).toBe(true);
        if (isError(result)) {
          expect(result.errorType).toBe(testCase.expectedError);
        }
      });
    });
  });
});
