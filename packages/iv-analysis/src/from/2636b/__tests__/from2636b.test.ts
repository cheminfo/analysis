import { readFileSync } from 'fs';
import { join } from 'path';

import { from2636b } from '../index';

function testFile(name: string, length: number) {
  let csv = readFileSync(
    join(__dirname, `../../../../testFiles/2636B/${name}`),
    'latin1',
  );
  const analysis = from2636b(csv, 'test');
  let spectrum = analysis.getMeasurementXY({ xLabel: 'Vd', yLabel: 'Id' });

  expect(spectrum?.variables.x.data).toHaveLength(length);
  expect(spectrum?.variables.x.label).toStrictEqual(
    `Vd [${spectrum?.variables.x.units || ''}]`,
  );

  expect(spectrum?.variables.y.data).toHaveLength(length);
  expect(spectrum?.variables.y.label).toStrictEqual(
    `Id [${spectrum?.variables.y.units || ''}]`,
  );
}

test('IV', () => {
  testFile('iv.csv', 601);
});

test('Output', () => {
  testFile('output.csv', 121);
});

test('Transfer', () => {
  testFile('transfer.csv', 201);
});
