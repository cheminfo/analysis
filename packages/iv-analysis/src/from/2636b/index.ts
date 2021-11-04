import { Analysis } from 'base-analysis';
import { ndParse } from 'ndim-parser';

import { appendUnits } from '../b1505/utils';

function parseMeta(meta: Record<string, string>): Record<string, string> {
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
    return String.fromCharCode(65 + index);
  });
}

export function from2636b(text: string, name?: string) {
  const { data, meta } = ndParse(text, { keyMap });

  const min = Object.values(data).reduce(
    (prev, curr) => Math.min(curr.data.length, prev),
    Infinity,
  );

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      data[key].data.length = min;
    }
  }

  let analysis = new Analysis();
  const title =
    name ||
    (data.g
      ? `Vg = ${data.g.data[0]}V`
      : data.s
      ? `Vs = ${data.s.data[0]}V`
      : '2636b');
  analysis.pushMeasurement(appendUnits(data), {
    title,
    meta: parseMeta(meta),
  });

  return analysis;
}
