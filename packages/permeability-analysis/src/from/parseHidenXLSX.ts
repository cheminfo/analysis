import { read, utils } from 'xlsx';

/**
 * @param binary
 */
export function parseHidenXLSX(binary: ArrayBuffer | Uint8Array) {
  const workbook = read(binary, { type: 'array' });
  const scanSetup = parseScanSetup(
    utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
      header: 1,
      blankrows: false,
    }),
  );
  const data = parseData(
    utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[1]], {
      header: 1,
      blankrows: false,
    }),
  );
  return { scanSetup, data };
}

function parseScanSetup(matrix: string[][]) {
  const headers = matrix[0];
  const data = matrix.slice(1);
  const array = [];
  for (let row of data) {
    const data: Record<string, string> = {};
    for (let i = 0; i < headers.length; i++) {
      if (!headers[i]) continue;
      data[headers[i]] = row[i];
    }
    array.push(data);
  }
  const result: Record<string, any> = {};
  array.forEach((item) => (result[item['Gas Name']] = item));
  return result;
}

interface Variable {
  label: string;
  units: string;
  data: (number | string)[];
}

function parseData(matrix: string[][]) {
  // The first defines the categories
  const categoriesLabel = matrix[0];
  const categories: Record<string, any> = {};
  // The second row contains the headers
  const headers = matrix[1];
  let from = 0;
  let currentCategory = categoriesLabel[0];
  for (let i = 0; i < headers.length; i++) {
    if (headers[i] === undefined || i === headers.length - 1) {
      categories[currentCategory] = getVariables(
        matrix,
        from,
        i - 1,
        currentCategory,
      );
      from = i + 1;
      currentCategory = categoriesLabel[i + 1];
    }
  }
  return categories;
}

function getVariables(
  matrix: string[][],
  from: number,
  to: number,
  currentCategory: string,
) {
  const headers = matrix[1].slice(from, to + 1);
  matrix = matrix.slice(2);
  const submatrix = matrix.map((row) => row.slice(from, to + 1));

  const variables = headers.map((label): Variable => {
    return { label, units: currentCategory, data: [] };
  });

  for (let row of submatrix) {
    for (let i = 0; i < variables.length; i++) {
      if (row[i] === undefined) continue;
      variables[i].data.push(row[i]);
    }
  }
  const result: Record<string, any> = {};
  variables.forEach((variable) => (result[variable.label] = variable));
  return result;
}
