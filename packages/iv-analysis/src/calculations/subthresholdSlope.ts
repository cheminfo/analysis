import { MeasurementXY } from 'cheminfo-types';
import { SimpleLinearRegression } from 'ml-regression-simple-linear';

import { thresholdVoltage } from './thresholdVoltage';
import { RangeOptions, SlopeResult } from './types';

/**
 * Calculates the slope of the subthreshold current.
 * @param measurement - The measurement to calculate the subthreshold slope.
 * @param options - Options for the calculation.
 * @returns - The subthreshold slope.
 */
export function subthresholdSlope(
  measurement: MeasurementXY,
  options: RangeOptions = {},
): SlopeResult | null {
  let { fromIndex, toIndex } = options;

  if (fromIndex === undefined) {
    const fromVoltage = thresholdVoltage(measurement, { threshold: 1e-7 });
    if (fromVoltage === null) return null;
    fromIndex = fromVoltage.index;
  }

  if (toIndex === undefined) {
    const toVoltage = thresholdVoltage(measurement, { threshold: 1e-5 });
    if (toVoltage === null) return null;
    toIndex = toVoltage.index;
  }

  const xRes: number[] = [];
  const yRes: number[] = [];
  for (let i = fromIndex; i < toIndex; i++) {
    xRes.push(measurement.variables.x.data[i]);
    yRes.push(Math.log10(measurement.variables.y.data[i]));
  }

  const regression = new SimpleLinearRegression(xRes, yRes);
  const score = regression.score(xRes, yRes);
  return {
    slope: { value: 1 / regression.slope, units: 'V/dec' },
    score,
    toIndex,
    fromIndex,
  };
}
