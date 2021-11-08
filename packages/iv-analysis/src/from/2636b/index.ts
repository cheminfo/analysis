import { Analysis } from 'base-analysis';
import {
  MeasurementVariable,
  MeasurementXYVariables,
  OneLowerCase,
} from 'cheminfo-types';
import { ndParse } from 'ndim-parser';

import { appendUnits } from '../b1505/utils';

function parseMeta(
  meta: Record<string, string> | undefined,
): Record<string, string> {
  if (!meta) return {};

  let ans: Record<string, string> = {};
  for (const key in meta) {
    const line = [key, ...meta[key].split(',')];
    for (let index = 0; index < line.length; index += 2) {
      if (line[index]) ans[line[index]] = line[index + 1];
    }
  }

  return ans;
}

function keyMap(keys: string[]) {
  return keys.map((key, index) => {
    if (key === 'Vd') return 'x';
    if (key === 'Id') return 'y';
    if (key === 'Vg') return 'g';
    if (key === 'Vs') return 's';
    return String.fromCharCode(97 + index) as OneLowerCase;
  });
}

/**
 * Parse a file from 2636B instrument.
 *
 * @param text - Text from the file.
 * @param name - Name of the experiment.
 * @returns - Analysis object.
 */
export function from2636b(text: string, name?: string) {
  const { variables, meta } = ndParse(text, { keyMap });

  const min = Object.values(variables).reduce(
    (prev, curr) => Math.min(curr.data.length, prev),
    Infinity,
  );

  for (const key in variables) {
    if (Object.prototype.hasOwnProperty.call(variables, key)) {
      (
        variables[key as keyof MeasurementXYVariables] as MeasurementVariable<
          number[]
        >
      ).data.length = min;
    }
  }

  const label =
    name ||
    (variables.g
      ? `Vg = ${variables.g.data[0]}V`
      : variables.s
      ? `Vs = ${variables.s.data[0]}V`
      : '2636b');
  let analysis = new Analysis({ label });
  analysis.pushMeasurement(appendUnits(variables), { meta: parseMeta(meta) });

  return analysis;
}
