import { convertUnits } from '../convertUnits';

test('getConversionFactor', () => {
  expect(convertUnits(1, 'mg', 'g')).toBeCloseTo(0.001, 6);
  expect(convertUnits([1, 2, 3], 'g', 'mg')).toBeDeepCloseTo(
    [1000, 2000, 3000],
    6,
  );
  expect(convertUnits(1, 'kg', 'ug')).toBeCloseTo(1e9, 6);
  expect(() => convertUnits(1, 'kg', 'ml')).toThrow(
    'Incompatible units: kg and ml',
  );
  expect(convertUnits(100, 'tempC', 'tempK')).toBeCloseTo(373.15, 6);
  expect(convertUnits(100, '°C', 'K')).toBeCloseTo(373.15, 6);
  expect(convertUnits(100, 'tempC', 'tempF')).toBeCloseTo(212, 6);
  expect(convertUnits(100, 'min', 's')).toBeCloseTo(6000, 6);
  expect(convertUnits(100, 'm^2', 'cm^2')).toBeCloseTo(1000000, 6);
  expect(convertUnits(100, 'm^2 / cal', 'cm^2 / J')).toBeCloseTo(
    1000000 / 4.184,
    6,
  );
  expect(convertUnits(100, 'm^2 cal', 'cm^2 J')).toBeCloseTo(
    1000000 * 4.184,
    6,
  );
  expect(convertUnits(100, 'm^2 * cal', 'cm^2 * J')).toBeCloseTo(
    1000000 * 4.184,
    6,
  );
});
