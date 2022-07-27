import { readFileSync } from 'fs';
import { join } from 'path';

import { from2636b } from '../index';

function testFile(name: string, length: number) {
  let csv = readFileSync(
    join(__dirname, `../../../../testFiles/2636B/${name}`),
    'latin1',
  );
  const analysis = from2636b(csv, 'test');
  let measurement = analysis.getMeasurementXY({
    x: { label: 'Vd' },
    y: { label: 'Id' },
  });

  expect(measurement?.variables.x.data).toHaveLength(length);
  expect(measurement?.variables.x.label).toBe('Vd');

  expect(measurement?.variables.y.data).toHaveLength(length);
  expect(measurement?.variables.y.label).toBe('Id');
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
