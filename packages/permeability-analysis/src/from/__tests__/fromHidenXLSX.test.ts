import { readFileSync } from 'fs';
import { join } from 'path';

import { fromHidenXLSX } from '../fromHidenXLSX';

describe('fromHidenXLSX', () => {
  it('should work', () => {
    const binary = readFileSync(join(__dirname, 'data/hiden.export.xlsx'));
    const result = fromHidenXLSX(binary);
  });
});
