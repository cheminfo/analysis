import { Analysis, fromText } from 'base-analysis';

import { fitPeaks } from '../calculations/fitPeaks';

/**
 * Parse an XRD file into an Analysis object.
 * @param input - Content to be parsed
 * @returns Enriched analysis object
 */
export function fromXRD(input: string | ArrayBuffer): Analysis {
  const analysis = fromText(input);
  const measurement = analysis.measurements[0];
  const peaks = JSON.stringify(fitPeaks(measurement));
  measurement.meta = { ...measurement.meta, peaks };
  analysis.measurements[0] = measurement;
  return analysis;
}

/**
 * Parse an XRC file into an Analysis object.
 * @param input - Content to be parsed
 * @returns Enriched analysis object
 */
export function fromXRC(input: string | ArrayBuffer): Analysis {
  return fromText(input);
}
