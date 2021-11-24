import { readFileSync } from 'fs';
import { join } from 'path';

import { toJcamp } from 'base-analysis';

import { fromBiologic } from '../fromBiologic';

describe('fromBiologic', () => {
  it('mpt', () => {
    let binary = readFileSync(join(__dirname, './data/TEST.mpt'));
    const analyses = fromBiologic(binary);
    const jcamp = toJcamp(analyses);
    console.log(jcamp);
    expect(true).toBe(true);
  });
});
