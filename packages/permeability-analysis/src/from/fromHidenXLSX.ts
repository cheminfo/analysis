import { Analysis } from 'base-analysis';

import { parseHidenXLSX } from './parseHidenXLSX';

/**
 * @param binary
 * @param options
 * @param options.units
 */
export function fromHidenXLSX(
  binary: ArrayBuffer | Uint8Array,
  options: {
    /**
     * Which columns contain the data
     *
     * @default 'ppm'
     */
    units?: string;
  } = {},
) {
  const parsed = parseHidenXLSX(binary);
  const { units = 'ppm' } = options;

  const time = parsed.data.Time['Elapsed Time (s)'];
  const data = parsed.data[units];
  const channels = Object.keys(data);

  const variables = {
    x: time,
    y: data[channels[0]],
  };
  for (let i = 1; i < channels.length; i++) {
    //@ts-expect-error we hope there is not too many channels
    variables[String.fromCharCode(96 + i)] = data[channels[i]];
  }
  let analysis = new Analysis();
  analysis.pushMeasurement(variables, {
    dataType: 'Permeability',
  });

  return analysis;
}
