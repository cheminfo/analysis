import { readFileSync } from 'fs';
import { join } from 'path';

import { fromTAInstrumentsExcel } from '../fromTAInstrumentsExcel';

test('import from TA instruments excel file', () => {
  let data = readFileSync(
    join(__dirname, '../../../testFiles/190307-ALP-DMF@100%-TPD-2.xls'),
  );

  const output = fromTAInstrumentsExcel(data);
  expect(output.measurements).toHaveLength(1);
  expect(Object.keys(output.measurements[0].variables)).toStrictEqual([
    'x',
    'y',
    'z',
    't',
  ]);

  const variables = output.measurements[0].variables;

  expect(variables.x.data).toHaveLength(71627);
  expect(variables.y.data).toHaveLength(71627);
  // @ts-expect-error
  expect(variables.z.data).toHaveLength(71627);
  // @ts-expect-error
  expect(variables.t.data).toHaveLength(71627);
  expect(variables.x.data[0]).toStrictEqual(25.77);
  expect(variables.x.data[71625]).toStrictEqual(169.93);
});
