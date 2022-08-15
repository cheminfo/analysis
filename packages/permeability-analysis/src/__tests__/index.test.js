import { readFileSync } from 'fs';
import { join } from 'path';

import { getJSGraph } from 'base-analysis/lib/jsgraph/getJSGraph.js';

import { fromJcamp } from '../index.js';

describe('read jcamp and create jsgraph', () => {
  let jcamp = readFileSync(join(__dirname, 'data/test.jdx'));
  let analysis = fromJcamp(jcamp);
  it('check number of charts', () => {
    const jsgraph = getJSGraph([analysis]);
    console.log(jsgraph);
  });
});
