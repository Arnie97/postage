import { describe, test, expect } from 'vitest';
import {
  getPostalZone,
  getChinaPostMainlandParcelZone,
  MAINLAND_PROVINCES,
  type RegionCode,
} from './regions';

describe('getChinaPostMainlandParcelParcelZone', () => {
  test.each(
    MAINLAND_PROVINCES.flatMap((fromProvince) =>
      MAINLAND_PROVINCES.map((toProvince) => [fromProvince.code, toProvince.code]),
    ),
  )('$0 <-> $1 symmetry', (fromProvince, toProvince) => {
    const outbound = getChinaPostMainlandParcelZone(fromProvince, toProvince);
    const inbound = getChinaPostMainlandParcelZone(toProvince, fromProvince);

    // Ensure both directions return valid zone numbers
    expect(outbound).toStrictEqual(inbound);
    expect(Number.isInteger(inbound)).toBe(true);
    expect(outbound).toBeGreaterThanOrEqual(1);
    expect(outbound).toBeLessThanOrEqual(fromProvince === toProvince ? 2 : 6);
  });

  test.each([
    { fromProvince: 'SC', toProvince: 'SC', expected: 1 },
    { fromProvince: 'QH', toProvince: 'QH', expected: 2 }, // 696,647 km²
    { fromProvince: 'NM', toProvince: 'HL', expected: 2 }, // < 2000 km but adjacent
    { fromProvince: 'TJ', toProvince: 'SD', expected: 2 }, // < 500 km but not adjacent
    { fromProvince: 'SD', toProvince: 'SX', expected: 3 }, // < 1000 km
    { fromProvince: 'SX', toProvince: 'GZ', expected: 4 }, // > 1000 km
    { fromProvince: 'GZ', toProvince: 'XZ', expected: 5 },
    { fromProvince: 'XZ', toProvince: 'FJ', expected: 6 },
    { fromProvince: 'FJ', toProvince: 'TW', expected: undefined },
    { fromProvince: 'TW', toProvince: 'JP', expected: undefined },
    { fromProvince: 'JP', toProvince: 'VN', expected: undefined },
    { fromProvince: 'VN', toProvince: 'GX', expected: undefined },
  ])(
    '$fromProvince -> $toProvince should return $expected',
    ({ fromProvince, toProvince, expected }) => {
      const resultWithPrefix = getChinaPostMainlandParcelZone(
        `CN-${fromProvince}`,
        `CN-${toProvince}`,
      );
      expect(resultWithPrefix).toBe(expected);
      const resultWithoutPrefix = getChinaPostMainlandParcelZone(fromProvince, toProvince);
      expect(resultWithoutPrefix).toBe(expected);
    },
  );
});

describe('getPostalZone', () => {
  test.each([
    { fromRegion: 'CN', toRegion: 'XO', expected: { air: { letter: 4, other: 3 }, surface: 2 } },
    { fromRegion: 'HK', toRegion: 'JP', expected: { air: 2, surface: 2 } },
    { fromRegion: 'MO', toRegion: 'VN', expected: { air: 1 } },
    { fromRegion: 'MO', toRegion: 'EG', expected: { air: 3, surface: 1 } },
    { fromRegion: 'TW', toRegion: 'HK', expected: { air: 1 } },
    { fromRegion: 'TW', toRegion: 'JP', expected: { air: 2 } },
    { fromRegion: 'TW', toRegion: 'ZA', expected: { air: 3 } },
    { fromRegion: 'TW', toRegion: 'PR', expected: { air: 4 } },
    { fromRegion: 'TW', toRegion: 'US', expected: { air: 5 } },
    { fromRegion: 'CN', toRegion: 'HK', expected: null },
    { fromRegion: 'HK', toRegion: 'CN-BJ', expected: null },
    { fromRegion: 'MO', toRegion: 'AQ', expected: null },
    { fromRegion: 'TW', toRegion: 'XX', expected: null },
  ])(
    'should return null for invalid or unsupported combinations: $fromRegion → $toRegion',
    ({ fromRegion, toRegion, expected }) => {
      const result = getPostalZone(fromRegion as RegionCode, toRegion);
      expect(result).toStrictEqual(expected);
    },
  );
});
