import { readFileSync } from 'fs';
import { join } from 'path';

import { JSGraph, fromJcamp } from 'base-analysis';

describe('read jcamp and create jsgraph', () => {
  const jcamp = readFileSync(join(__dirname, 'data/test.jdx'));
  const analysis = fromJcamp(jcamp);
  it('check number of charts', () => {
    const jsgraph = JSGraph.getJSGraph([analysis]);
    expect(jsgraph).toMatchSnapshot();
  });
});
