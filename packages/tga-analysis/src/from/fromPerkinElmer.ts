import { ensureString } from 'ensure-string';

import { Analysis } from '..';

import { parsePerkinElmer } from './parsePerkinElmer';

/**
 * Creates a new Chromatogram element based in a JCAMP string.
 *
 * @param text - String containing the JCAMP data.
 * @param arrayBuffer
 * @returns - New class element with the given data.
 */
export function fromPerkinElmer(
  arrayBuffer: string | ArrayBuffer | Uint8Array,
) {
  const text = ensureString(arrayBuffer);
  const analysis = new Analysis();
  const measurement = parsePerkinElmer(text);

  analysis.pushMeasurement(
    {
      x: {
        data: measurement.data.temperature,
        label: 'Temperature [°C]',
      },
      y: {
        data: measurement.data.weight,
        label: 'Weight [mg]',
      },
    },
    {
      dataType: 'TGA',
      description: measurement.meta['Sample ID'],
      meta: measurement.meta,
    },
  );
  analysis.pushMeasurement(
    {
      x: {
        data: measurement.data.time,
        label: 'Time [min]',
      },
      y: {
        data: measurement.data.weight,
        label: 'Weight [mg]',
      },
    },
    {
      dataType: 'TGA',
      description: measurement.meta['Sample ID'],
      meta: measurement.meta,
    },
  );
  return analysis;
}
