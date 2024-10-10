import type { MeasurementXY } from 'cheminfo-types';

import { ThresholdVoltageOptions, ThresholdVoltageResult } from './types';

/**
 * Calculates the threshold voltage of a measurement.
 * @param measurement - The measurement to search for the threshold voltage.
 * @param options - The options for the threshold voltage calculation.
 * @returns - Threshold voltage result.
 */
export function thresholdVoltage(
  measurement: MeasurementXY,
  options: ThresholdVoltageOptions = {},
): ThresholdVoltageResult | null {
  const { threshold = 1e-6 } = options;

  const x = measurement.variables.x.data as number[];
  const y = measurement.variables.y.data as number[];

  // Search for the first point where the x value is above the threshold
  const units = 'V';
  let result = { index: -1, value: x[0], units };
  let converged = false;
  for (let i = 0; i < x.length && !converged; i++) {
    if (y[i] > threshold) {
      result = { index: i, value: x[i], units };
      converged = true;
    }
  }
  return converged ? result : null;
}
