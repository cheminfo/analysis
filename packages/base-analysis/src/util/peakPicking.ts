import type { MeasurementXY } from 'cheminfo-types';
// @ts-expect-error Untyped library.
import { optimize as optimizePeak } from 'ml-spectra-fitting';
import { xFindClosestIndex, xMaxValue } from 'ml-spectra-processing';

import { PeakPickingOptions } from '../types/PeakPickingOptions';

/**
 * Based on a x value we will return a peak
 * if you set optimize=True the returned positions will be
 * the closest actual datapoints to the fitted peak location.
 * The x/y of the fitted peak will be in xOptimized and yOptimized.
 * @param measurement
 * @param target
 * @param options
 */
export function peakPicking(
  measurement: MeasurementXY,
  /** Value to search (on x axis) */
  target: number,
  options: PeakPickingOptions = {},
) {
  const {
    xVariable = 'x',
    yVariable = 'y',
    optimize = false,
    expectedWidth = 1,
    max: isMax = true,
    shapeOptions = { kind: 'gaussian' },
  } = options;

  const x = measurement.variables[xVariable]?.data;
  let y;
  if (!isMax) {
    y = measurement.variables[yVariable]?.data.slice(); // do deep copy as we maybe need to flip sign
  } else {
    y = measurement.variables[yVariable]?.data;
  }

  if (!x || !y) return;
  const targetIndex = xFindClosestIndex(x, target);
  let optimizedPeak;
  let optimizedIndex;
  const result: Record<string, number> = {};
  if (optimize) {
    if (!isMax) {
      const maximumY = xMaxValue(y);
      for (let i = 0; i < y.length; i++) {
        y[i] *= -1;
        y[i] += maximumY; // This makes it somewhat more robust
      }
    }

    optimizedPeak = optimizePeak(
      { x, y },
      [{ x: x[targetIndex], y: y[targetIndex], width: expectedWidth }],
      { shape: shapeOptions },
    );

    optimizedIndex = xFindClosestIndex(x, optimizedPeak.peaks[0].x);

    for (const [key, variable] of Object.entries(measurement.variables)) {
      result[key] = variable.data[optimizedIndex];
    }
    // TODO: result is supposed to only contain numbers.
    result.optimized = optimizedPeak.peaks[0];
  } else {
    for (const [key, variable] of Object.entries(measurement.variables)) {
      result[key] = variable.data[targetIndex];
    }
  }

  return result;
}
