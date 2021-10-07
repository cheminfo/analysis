import { readFileSync } from 'fs';
import { join } from 'path';

import xlsx from 'xlsx';

import { parseTAInstrumentsExcel, testables } from '../parseTAInstrumentsExcel';

const { parseMeta, parseDataSheet } = testables;

describe('TA instrument excel parser', () => {
  let data = readFileSync(
    join(__dirname, '../../../testFiles/190307-ALP-DMF@100%-TPD-2.xls'),
  );

  const workbook = xlsx.read(data);
  it('meta parsing', () => {
    let meta = parseMeta(workbook.Sheets.Details);
    expect(meta.fileName).toStrictEqual('190307-ALP-DMF@100%-TPD');
    expect(meta.instrumentName).toStrictEqual('TGA5500 (172.23.164.55)');
    expect(meta.procedure).toHaveLength(12);
    expect(meta.sampleWeight).toStrictEqual(5.977);
    expect(meta.sampleWeightUnit).toStrictEqual('mg');
  });

  it('parse data', () => {
    let data = parseDataSheet(workbook.Sheets['Isothermal 5.0 min']);
    expect(data[0][0]).toStrictEqual(45.4783);
    expect(data[1][0]).toStrictEqual(52.15);
    expect(data[2][0]).toStrictEqual(5.857);
    expect(data[3][0]).toStrictEqual(97.997);
    expect(data[0]).toHaveLength(2999);
    expect(data[1]).toHaveLength(2999);
    expect(data[2]).toHaveLength(2999);
    expect(data[3]).toHaveLength(2999);
    expect(data[0][2998]).toStrictEqual(50.475);
    expect(data[1][2998]).toStrictEqual(49.92);
    expect(data[2][2998]).toStrictEqual(5.858);
    expect(data[3][2998]).toStrictEqual(98.015);

    let data2 = parseDataSheet(workbook.Sheets['Isothermal 5.0 min-2']);
    expect(data2[0][2997]).toStrictEqual(119.39);
  });

  it('parse all sheets', () => {
    let output = parseTAInstrumentsExcel(data);
    expect(output.time).toHaveLength(71627);
  });
});
