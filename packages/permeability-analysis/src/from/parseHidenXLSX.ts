//@ts-expect-error types are not defiend
import { parseString } from 'dynamic-typing';
import { read, utils } from 'xlsx';

/**
 * @param binary
 */
export function parseHidenXLSX(binary: ArrayBuffer | Uint8Array) {
  const workbook = read(binary, { type: 'array' });
  const scanSetup = parseScanSetup(
    utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
      header: 1,
    }),
  );
  const data = parseData(
    utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[1]], {
      header: 1,
    }),
  );
  return { scanSetup, data };
}

function parseScanSetup(matrix: string[][]) {
  const headers = matrix[0];
  const data = matrix.slice(1);
  const result = [];
  for (let row of data) {
    const data: Record<string, string> = {};
    for (let i = 0; i < headers.length; i++) {
      data[headers[i]] = row[i];
    }
    result.push(data);
  }

  return result;
}

interface Variable {
  label: string;
  data: (number | string | boolean)[];
}

function parseData(matrix: string[][]) {
  const variables = matrix[0].map((label): Variable => {
    return { label, data: [] };
  });
  console.log(variables);
  const data = matrix.slice(1);
  for (let row of data) {
    for (let i = 0; i < variables.length; i++) {
      if (!row[i]) continue;
      variables[i].data.push(parseString(row[i]));
    }
  }
  return variables;
}
