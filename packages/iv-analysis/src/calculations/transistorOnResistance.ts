import { MeasurementXY } from 'cheminfo-types';
import { SimpleLinearRegression } from 'ml-regression-simple-linear';
import fit from 'ml-savitzky-golay';

import { SlopeOptions, SlopeResult } from './types';

/**
 * Calculates the transistor resistance.
 * @param measurement - The measurement to calculate the transistor resistance.
 * @param options - Options for the calculation.
 * @returns - The calculated resistance.
 */
export function transistorOnResistance(
  measurement: MeasurementXY,
  options: SlopeOptions = {},
): SlopeResult | null {
  const { delta = 1e-2, fromIndex, toIndex } = options;

  const x = measurement.variables.x.data as number[];
  const dx = Math.abs(x[0] - x[1]);

  const y = measurement.variables.y.data as number[];
  const dy = fit(y, dx, { derivative: 1 });

  const xRes = [];
  const yRes = [];
  let xStart = Infinity;

  let converged = false;
  for (let i = 0; i < y.length - 1 && !converged; i++) {
    if (
      Math.abs(dy[i + 1] - dy[i]) > delta ||
      (toIndex !== undefined && i >= toIndex)
    ) {
      converged = true;
    } else if (x[i] > 0 || (fromIndex !== undefined && i >= fromIndex)) {
      xStart = Math.min(xStart, i);
      xRes.push(x[i]);
      yRes.push(y[i]);
    }
  }

  const regression = new SimpleLinearRegression(xRes, yRes);
  const score = regression.score(xRes, yRes);
  return {
    slope: { value: 1 / regression.slope, units: 'Ohm/mm' },
    score,
    toIndex: xStart,
    fromIndex: xStart + xRes.length,
  };
}
