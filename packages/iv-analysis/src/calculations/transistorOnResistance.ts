import { MeasurementXY } from 'base-analysis/lib/types';
import SimpleLinearRegression from 'ml-regression-simple-linear';
import fit from 'ml-savitzky-golay';

import { SlopeOptions, SlopeResult } from './types';

export function transistorOnResistance(
  spectrum: MeasurementXY,
  options: SlopeOptions = {},
): SlopeResult | null {
  const { delta = 1e-2, fromIndex, toIndex } = options;

  const x = spectrum.variables.x.data as number[];
  const dx = Math.abs(x[0] - x[1]);

  const y = spectrum.variables.y.data as number[];
  const dy = fit(y, dx, { derivative: 1 });

  let xRes = [];
  let yRes = [];
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
  const response = {
    slope: 1 / regression.slope,
    score,
    toIndex: xStart,
    fromIndex: xStart + xRes.length,
  };

  return response;
}
