import type { MeasurementXY } from 'cheminfo-types';
import { gsd, optimizePeaks } from 'ml-gsd';
import { optimize } from 'ml-spectra-fitting';

/**
 * Calculates the capacitance integral of a given XY measurement.
 * @param measurement - Measurement to integrate.
 * @returns - Integral result.
 */
export function fitPeaks(measurement: MeasurementXY) {
  const x = measurement.variables.x.data as number[];
  const y = measurement.variables.y.data as number[];
  const data = { x, y };
  const basePeaks = gsd(data, {
    minMaxRatio: 0.1,
    maxCriteria: true,
    smoothY: true,
    sgOptions: { windowSize: 7, polynomial: 3 },
  });

  const peaks = optimizePeaks(data, basePeaks);
  return optimize(data, peaks, {
    shape: { kind: 'pseudoVoigt' },
    optimization: { kind: 'lm', options: { maxIterations: 10 } },
  });
}
