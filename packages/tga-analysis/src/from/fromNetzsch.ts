// TODO: enable ts in this file.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { Analysis, MeasurementXY } from 'base-analysis';
import { ensureString } from 'ensure-string';

/**
 * @param arrayBuffer
 */
export function fromNetzsch(
  arrayBuffer: string | ArrayBuffer | Uint8Array,
): Analysis {
  const text = ensureString(arrayBuffer, { encoding: 'iso8859-1' });
  let lines = text.split(/\r?\n/).filter((line) => line);
  let parsed: MeasurementXY<number[]> = {
    meta: {},
    variables: {
      x: {
        data: [],
        label: 'Sample temperature [°C]',
        isDependent: true,
      },
      y: {
        data: [],
        label: 'Weight [mg]',
        isDependent: true,
      },
      t: {
        data: [],
        label: 'Time [min]',
        isDependent: false,
      },
    },
  };
  let inData = false;
  for (let line of lines) {
    if (inData) {
      const [temperature, time, weight] = line.split(';').map(parseFloat);
      parsed.variables.x.data.push(temperature);
      parsed.variables.y.data.push(weight);
      parsed.variables.t.data.push(time);
    } else if (line.startsWith('##')) {
      inData = true;
    } else {
      const groups = /#(?<label>.*?):(?<value>.*)/.exec(line)?.groups;
      if (!groups) throw new Error('TGA Netzsch parsing error');
      const { label, value } = groups;
      if (parsed.meta) parsed.meta[label] = value;
    }
  }

  const mass = parsed.meta && parseFloat(parsed.meta['SAMPLE MASS /mg']);
  if (mass) {
    parsed.variables.y.data = parsed.variables.y.data.map((i: number) => {
      return i * mass;
    });
  }
  let analysis = new Analysis();
  analysis.pushMeasurement(parsed.variables, {
    meta: parsed.meta,
    dataType: 'TGA',
  });

  return analysis;
}
