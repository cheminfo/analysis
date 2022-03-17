import { Analysis, fromText } from 'base-analysis';

import { fitPeaks } from '../calculations/fitPeaks';

/**
 * Parse an XRC file into an Analysis object.
 *
 * @param input - Content to be parsed
 * @returns Enriched analysis object
 */
export function fromXRay(input: string | ArrayBuffer): Analysis {
  let analysis = fromText(input);
  let measurement = analysis.measurements[0];
  const peaks = JSON.stringify(fitPeaks(measurement));
  measurement.meta = { ...measurement.meta, peaks };
  analysis.measurements[0] = measurement;
  return analysis;
}
