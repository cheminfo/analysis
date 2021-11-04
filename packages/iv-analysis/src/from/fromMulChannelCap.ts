import { Analysis } from 'base-analysis';
import { ndParse } from 'ndim-parser';

import { appendUnits } from './b1505/utils';

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
    return String.fromCharCode(65 + index);
  });
}

export function fromMulChannelCap(text: string) {
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
  analysis.pushMeasurement(appendUnits(data), {
    title: `Vg = ${data.g.data[0]}V`,
    meta: parseMeta(meta),
  });

  return analysis;
}
