import { MeasurementXY } from 'cheminfo-types';
import SimpleLinearRegression from 'ml-regression-simple-linear';
import fit from 'ml-savitzky-golay';

import { SlopeOptions, SlopeResult } from './types';

interface DiodeResult extends SlopeResult {
  forwardVoltage?: number;
  onVoltage?: number;
}

/**
 * Calculates the diode on resistance.
 *
 * @param spectrum - The spectrum to calculate the diode on resistance.
 * @param options - Options to calculate the diode on resistance.
 * @returns - The diode on resistance.
 */
export function diodeOnResistance(
  spectrum: MeasurementXY,
  options: SlopeOptions = {},
): DiodeResult | null {
  const { delta = 1e-2, fromIndex, toIndex } = options;

  const x = spectrum.variables.x.data as number[];
  const dx = Math.abs(x[0] - x[1]);

  const y = spectrum.variables.y.data as number[];
  const dy = fit(y, dx, { derivative: 1 });

  let Von = { x: 0, y: Infinity };
  let Vf = { x: 0, found: false };

  let xRes = [];
  let yRes = [];
  let xStart = Infinity;

  for (let i = 0; i < y.length; i++) {
    if (
      dy[i] > delta ||
      (fromIndex !== undefined && fromIndex >= i) ||
      (toIndex !== undefined && toIndex <= i)
    ) {
      xStart = Math.min(xStart, i);
      xRes.push(x[i]);
      yRes.push(y[i]);
    }

    const absY = Math.abs(y[i]);
    if (Von.y > absY) {
      Von = { x: x[i], y: absY };
    }

    if (!Vf.found && y[i] >= 0.1) {
      Vf = { x: x[i], found: true };
    }
  }

  const regression = new SimpleLinearRegression(xRes, yRes);
  const score = regression.score(xRes, yRes);
  const response = {
    slope: 1 / regression.slope,
    score,
    toIndex: xStart,
    fromIndex: xStart + xRes.length,
    forwardVoltage: Vf.found ? Vf.x : undefined,
    onVoltage: Von.x,
  };

  return response;
}
