import { readFileSync } from 'fs';
import { join } from 'path';

import { fromHidenXLSX } from '../fromHidenXLSX';

describe('fromHidenXLSX', () => {
  it('should work', () => {
    const binary = readFileSync(join(__dirname, 'data/hiden.export.xlsx'));
    const result = fromHidenXLSX(binary);

    expect(Object.keys(result.measurements[0].variables)).toStrictEqual([
      'x',
      'y',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
    ]);
    expect(result.measurements[0].dataType).toBe('Permeability');
  });
});
