import { Analysis } from 'base-analysis';
import type {
  MeasurementVariable,
  MeasurementXYVariables,
  OneLowerCase,
} from 'cheminfo-types';
import { ndParse } from 'ndim-parser';

import { appendUnits } from './b1505/utils';

function parseMeta(
  meta: Record<string, string> | undefined,
): Record<string, string> {
  if (!meta) return {};

  const ans: Record<string, string> = {};
  for (const key in meta) {
    const line = [key, ...meta[key].split(',')];
    for (let index = 0; index < line.length; index += 2) {
      if (line[index]) ans[line[index]] = line[index + 1];
    }
  }

  return ans;
}

function keyMap(keys: string[]) {
  let index = 0;
  return keys.map((key) => {
    if (key === 'Vd') return 'x';
    if (key === 'Id') return 'y';
    if (key === 'Vg') return 'g';
    if ([6, 24].includes(index)) index++;
    if (index === 23) index += 2;
    return String.fromCharCode(97 + index++) as OneLowerCase;
  });
}

/**
 * Parse a multi-channel capacitance file.
 * @param text - The text to parse.
 * @returns - Analysis with the parsed data.
 */
export function fromMulChannelCap(text: string) {
  const { variables, meta } = ndParse(text, { keyMap });

  const min = Object.values(variables).reduce(
    (prev, curr) => Math.min(curr.data.length, prev),
    Infinity,
  );

  for (const key in variables) {
    if (Object.hasOwn(variables, key)) {
      (
        variables[key as keyof MeasurementXYVariables] as MeasurementVariable<
          number[]
        >
      ).data.length = min;
    }
  }

  const analysis = new Analysis({
    label: variables.g ? `Vg = ${variables.g.data[0]}V` : undefined,
  });
  analysis.pushMeasurement(appendUnits(variables), {
    meta: parseMeta(meta),
  });

  return analysis;
}
