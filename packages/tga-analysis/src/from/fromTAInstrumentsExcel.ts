import { Analysis } from '..';

import { parseTAInstrumentsExcel } from './parseTAInstrumentsExcel';

/**
 * @param arrayBuffer
 */
export function fromTAInstrumentsExcel(arrayBuffer: ArrayBuffer | Uint8Array) {
  let analysis = new Analysis();
  let parsed = parseTAInstrumentsExcel(arrayBuffer);

  analysis.pushMeasurement(
    {
      x: {
        data: parsed.temperature,
        isDependent: true,
        label: 'Program temperature [°C]',
      },
      y: {
        data: parsed.weight,
        isDependent: true,
        label: 'Weight [mg]',
      },
      z: {
        data: parsed.weightPercent,
        isDependent: true,
        label: 'Weight [%]',
      },
      t: {
        data: parsed.time,
        isDependent: false,
        label: 'Time [s]',
      },
    },
    { dataType: 'TGA', description: parsed.meta.sampleName, meta: parsed.meta },
  );

  return analysis;
}
