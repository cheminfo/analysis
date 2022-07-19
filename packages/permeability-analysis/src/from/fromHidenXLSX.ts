import { Analysis } from 'base-analysis';

import { parseHidenXLSX } from './parseHidenXLSX';

/**
 * @param binary
 * @param options
 */
export function fromHidenXLSX(binary: ArrayBuffer | Uint8Array) {
  const parsed = parseHidenXLSX(binary);

  const time = parsed.data.Time['Elapsed Time (s)'];
  const raw = parsed.data['Raw Data'];
  const channels = Object.keys(raw);

  const variables = {
    x: time,
    y: raw[channels[0]],
  };
  for (let i = 1; i < channels.length; i++) {
    //@ts-expect-error we hope there is not too many channels
    variables[String.fromCharCode(96 + i)] = raw[channels[i]];
  }

  let analysis = new Analysis();
  analysis.pushMeasurement(variables, {
    dataType: 'Permeability',
  });

  return analysis;
}
