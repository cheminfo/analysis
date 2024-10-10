import { readFileSync } from 'fs';
import { join } from 'path';

import * as xlsx from 'xlsx';

import { parseTAInstrumentsExcel, testables } from '../parseTAInstrumentsExcel';

const { parseMeta, parseDataSheet } = testables;

describe('TA instrument excel parser', () => {
  const data = readFileSync(
    join(__dirname, '../../../testFiles/190307-ALP-DMF@100%-TPD-2.xls'),
  );

  const workbook = xlsx.read(data);
  it('meta parsing', () => {
    const meta = parseMeta(workbook.Sheets.Details);
    expect(meta.fileName).toBe('190307-ALP-DMF@100%-TPD');
    expect(meta.instrumentName).toBe('TGA5500 (172.23.164.55)');
    expect(meta.procedure).toHaveLength(12);
    expect(meta.sampleWeight).toBe(5.977);
    expect(meta.sampleWeightUnit).toBe('mg');
  });

  it('parse data', () => {
    const data = parseDataSheet(workbook.Sheets['Isothermal 5.0 min']);
    expect(data[0][0]).toBe(45.4783);
    expect(data[1][0]).toBe(52.15);
    expect(data[2][0]).toBe(5.857);
    expect(data[3][0]).toBe(97.997);
    expect(data[0]).toHaveLength(2999);
    expect(data[1]).toHaveLength(2999);
    expect(data[2]).toHaveLength(2999);
    expect(data[3]).toHaveLength(2999);
    expect(data[0][2998]).toBe(50.475);
    expect(data[1][2998]).toBe(49.92);
    expect(data[2][2998]).toBe(5.858);
    expect(data[3][2998]).toBe(98.015);

    const data2 = parseDataSheet(workbook.Sheets['Isothermal 5.0 min-2']);
    expect(data2[0][2997]).toBe(119.39);
  });

  it('parse all sheets', () => {
    const output = parseTAInstrumentsExcel(data);
    expect(output.time).toHaveLength(71627);
  });
});
