import { read, utils } from 'xlsx';

export function parseTAInstrumentsExcel(blob: ArrayBuffer | Uint8Array) {
  const workbook = read(blob);
  let meta = parseMeta(workbook.Sheets.Details);

  let data: any = {
    time: [],
    temperature: [],
    weight: [],
    weightPercent: [],
  };

  let parsedData;

  workbook.SheetNames.forEach((sheetName) => {
    if (sheetName !== 'Details') {
      parsedData = parseDataSheet(workbook.Sheets[sheetName]);
      data.time.push(...parsedData[0]);
      data.temperature.push(...parsedData[1]);
      data.weight.push(...parsedData[2]);
      data.weightPercent.push(...parsedData[3]);
    }
  });

  data.meta = meta;

  return data;
}

function valueElseUndefined(cell: any) {
  return cell ? cell.v : undefined;
}

function valueElseUndefinedFloat(cell: any) {
  return cell ? parseFloat(cell.v) : undefined;
}

function parseDataSheet(sheet: any) {
  let range = utils.decode_range(sheet['!ref']);
  let data: any = [[], [], [], []]; // we assume that it is time, temperature, weight, weight %
  let rowNum;
  let colNum;
  for (rowNum = range.s.r + 4; rowNum <= range.e.r; rowNum++) {
    // the first row seems to always be constant
    for (colNum = 0; colNum <= 3; colNum++) {
      data[colNum].push(
        valueElseUndefinedFloat(
          sheet[utils.encode_cell({ r: rowNum, c: colNum })],
        ),
      );
    }
  }

  return data;
}

function parseMeta(detailsSheet: any) {
  let meta: any = {};
  meta.fileName = valueElseUndefined(detailsSheet.B1);
  meta.instrumentName = valueElseUndefined(detailsSheet.B2);
  meta.operator = valueElseUndefined(detailsSheet.B3);
  meta.date = valueElseUndefined(detailsSheet.B8);
  meta.sampleName = valueElseUndefined(detailsSheet.B5);
  meta.procedure = valueElseUndefined(detailsSheet.B6)
    .split(';')
    .map((item: string) => item.trim());
  let mass = valueElseUndefined(detailsSheet.B16).split(' ');
  meta.sampleWeight = parseFloat(mass[0]);
  meta.sampleWeightUnit = mass[1].trim();
  meta.comments = valueElseUndefined(detailsSheet.B18);

  return meta;
}

export const testables = {
  parseMeta: parseMeta,
  parseDataSheet: parseDataSheet,
};
