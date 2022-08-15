import { readFileSync } from 'fs';
import { join } from 'path';

import { JSGraph, fromJcamp } from 'base-analysis';

describe('read jcamp and create jsgraph', () => {
  let jcamp = readFileSync(join(__dirname, 'data/test.jdx'));
  let analysis = fromJcamp(jcamp);
  it('check number of charts', () => {
    const jsgraph = JSGraph.getJSGraph([analysis]);
    console.log(jsgraph);
  });
});
