import { ensureString } from 'ensure-string';

import { Analysis } from '..';

import { parseTAInstruments } from './parseTAInstruments';

/**
 * @param arrayBuffer
 */
export function fromTAInstruments(
  arrayBuffer: string | ArrayBuffer | Uint16Array,
) {
  const text = ensureString(arrayBuffer);
  const analysis = new Analysis();
  const parsed = parseTAInstruments(text);

  analysis.pushMeasurement(
    {
      x: {
        data: parsed.data.temperature,
        isDependent: true,
        label: 'Program temperature [°C]',
      },
      y: {
        data: parsed.data.weight,
        isDependent: true,
        label: 'Weight [mg]',
      },
      t: {
        data: parsed.data.time,
        isDependent: false,
        label: 'Time [min]',
      },
    },
    { dataType: 'TGA', title: parsed.meta.sampleName, meta: parsed.meta },
  );

  return analysis;
}
