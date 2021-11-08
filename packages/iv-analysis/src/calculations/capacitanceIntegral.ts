import type { MeasurementXY } from 'cheminfo-types';

import { IntegralOptions, IntegralResult } from './types';

/**
 * Calculates the capacitance integral of a given XY measurement.
 *
 * @param spectrum - Measurement to integrate.
 * @param options - Options for integration.
 * @returns - Integral result.
 */
export function capacitanceIntegral(
  spectrum: MeasurementXY,
  options: IntegralOptions = {},
): IntegralResult {
  const x = spectrum.variables.x.data as number[];
  const y = spectrum.variables.y.data as number[];

  const { fromIndex = 0, toIndex = x.length - 1 } = options;

  // Uniform grid trapezoidal rule integration
  const dx = x[1] - x[0];
  let sum = 0;
  for (let i = fromIndex + 1; i <= toIndex - 1; i++) {
    sum += y[i];
  }
  const integral = dx * (sum + (y[fromIndex] + y[toIndex]) / 2);
  return { integral, fromIndex, toIndex };
}
