/* eslint-disable @typescript-eslint/prefer-regexp-exec */
import { MeasurementVariable } from 'cheminfo-types';
import { ensureString } from 'ensure-string';

import { Analysis } from '../..';
/**
 * @param binary - File to be parsed
 */
export function fromBiologic(binary: string | ArrayBuffer | Uint8Array) {
  const text = ensureString(binary, { encoding: 'latin1' });
  const lines = text.split(/\r?\n/);
  let i = 0;
  for (; i < lines.length; i++) {
    if (lines[i].startsWith('mode')) {
      break;
    }
  }
  const header = lines.slice(0, i);
  const data = lines.slice(i);

  const meta = parseHeader(header);
  const variables = parseData(data);
  let analysis = new Analysis({});
  analysis.pushMeasurement(variables, { meta, dataType: 'IV analysis' });

  return analysis;
}

function parseHeader(header: string[]) {
  header = header.filter((line) => line);
  const meta: Record<string, string> = {};
  let currentKey = '';
  for (let line of header) {
    if (line.match(' : ')) {
      currentKey = line.replace(/:.*/, '').trim();
      const value = line.replace(/.*?:/, '').trim();
      if (value) {
        meta[currentKey] = value;
      }
    } else {
      if (currentKey) {
        meta[currentKey] += `\n${line}`;
      }
    }
  }
  return meta;
}

function parseData(data: string[]) {
  let matrix = data.map((line) => line.split('\t'));

  const variables: Record<string, MeasurementVariable> = {};

  const fields = matrix[0];

  matrix = matrix.slice(1);
  for (let i = 0; i < fields.length; i++) {
    const fieldName = fields[i];
    if (!fieldName.includes('/')) continue;
    variables[fieldName] = {
      label: fieldName.split('/')[0],
      units: fieldName.split('/')[1],
      isDependent: fieldName === 'time/s' ? false : true,
      data: matrix.map((row) => Number(row[i])),
    };
  }

  return {
    x: variables['I/mA'],
    y: variables['Ewe/V'],
    t: variables['time/s'],
  };
}
