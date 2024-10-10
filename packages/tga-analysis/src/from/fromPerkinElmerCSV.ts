import { ensureString } from 'ensure-string';
import Papa from 'papaparse';

import { Analysis } from '..';

/**
 * Creates a new Chromatogram element based in a JCAMP string.
 * @param text - String containing the JCAMP data.
 * @param arrayBuffer
 * @returns - New class element with the given data.
 */
export function fromPerkinElmerCSV(
  arrayBuffer: string | ArrayBuffer | Uint8Array,
) {
  const text = ensureString(arrayBuffer);
  const parsed = Papa.parse(text, {
    skipEmptyLines: true,
    header: true,
    dynamicTyping: true,
  }).data;

  const analysis = new Analysis();
  analysis.pushMeasurement(
    {
      x: {
        data: parsed.map((d: any) => d['Sample Temperature']) as number[],
        label: 'Sample temperature [°C]',
        isDependent: true,
      },
      y: {
        data: parsed.map((d: any) => d['Unsubtracted Weight']) as number[],
        label: 'Weight [mg]',
        isDependent: true,
      },
      p: {
        data: parsed.map((d: any) => d['Program Temperature']) as number[],
        label: 'Program temperature [°C]',
        isDependent: true,
      },
      t: {
        data: parsed.map((d: any) => d.Time) as number[],
        label: 'Time [min]',
        isDependent: false,
      },
    },
    { dataType: 'TGA' },
  );

  return analysis;
}
