/* eslint-disable no-console */
import { Analysis } from 'base-analysis';

/**
 * From SIV file
 *
 * @param content - File content
 * @returns Analysis
 */
export function fromSIV(content: string) {
  const analysis = new Analysis();

  const allLines = content.split(/[\r\n]+/);
  const sampleMeta = parseS(allLines.filter((line) => /X S_/.exec(line)));
  const instrumentMeta = parseV(allLines.filter((line) => /X V_/.exec(line)));
  const date = parseDate(allLines.filter((line) => /X d_t/.exec(line))[0]);

  const parts = content.split('WAVES\t');

  for (const part of parts) {
    const lines = part.split(/[\r\n]+/);
    const ys = lines
      .filter((line) => /^[\t 0-9.eE-]+$/.exec(line))
      .map((line) => Number(line));
    if (ys.length < 10) continue;

    const kind = lines[0].trim();
    const metaLines = lines
      .filter((line) => /^X /.exec(line))
      .map((line) => line.substring(2));

    const axis = parseScale(metaLines[0], ys.length);

    if (axis.x === undefined) {
      console.log('Unknown X axis:', axis.kind, axis.unit);
      continue;
    }
    if (axis.y === undefined || axis.y.unit !== 'A') {
      console.log('Unknown Y axis:', axis.kind, axis.unit);
      continue;
    }

    // const note = parseNote(metaLines[1]);
    const xs = axis.x.values;
    const data = {
      x: xs,
      y: ys,
    };

    const meta = {
      ...sampleMeta,
      date,
      experiment: kind,
      ...instrumentMeta,
    };
    analysis.pushMeasurement(
      {
        x: {
          label: axis.x.kind,
          units: axis.x.unit,
          data: data.x || [],
        },
        y: {
          label: axis.y.kind,
          units: axis.y.unit,
          data: data.y,
        },
      },
      { dataType: 'IV measurement', meta },
    );
  }
  return analysis;
}

function parseDate(line: string) {
  return line.replace('X d_t=', '').trim().replace(/"/g, '');
}

function parseScale(line: string, nbValues: number) {
  let result: Record<string, PartType> = {};
  const parts = line.replace(/ (?<part>[xy]) /g, ',$<part>,').split('; ');

  for (const part of parts) {
    const parsedPart = parseScalePart(part, nbValues);
    result[parsedPart.axis] = parsedPart;
  }
  return result;
}

function parseS(lines: string[]) {
  let result: Record<string, number | string> = {};
  for (const line of lines) {
    const key = getFieldName(
      line.replace(/X ._(?<var>[^=]*)=(?<val>.*)/, '$<var>').trim(),
    );
    let value: number | string = line
      .replace(/X ._(?<var>[^=]*)=(?<val>.*)/, '$<val>')
      .trim()
      .replace(/^"(?<val>.*)"$/, '$<val>');
    if (!isNaN(Number(value))) value = Number(value);
    result[key] = value;
  }
  return result;
}

function parseV(lines: string[]) {
  let result: Record<string, string | number> = {};
  for (const line of lines) {
    const key = getFieldName(
      line.replace(/X ._(?<var>[^=]*)=(?<val>.*)/, '$<var>').trim(),
    );
    let value: number | string = line
      .replace(/X ._(?<var>[^=]*)=(?<val>.*)/, '$<val>')
      .trim()
      .replace(/^"(?<val>.*)"$/, '$<val>');
    if (!isNaN(Number(value))) value = Number(value);
    result[key] = value;
  }
  return result;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseNote(line: string) {
  line = line.replace(/"/g, '').replace(/\\r/g, ';');
  const parts = line.split(/ *[;,] */);
  let result: Record<string, string | number> = {};
  for (const part of parts) {
    const semiColumn = part.indexOf(':');
    const key = getFieldName(part.substring(0, semiColumn));
    let value: string | number = part
      .substring(semiColumn + 1)
      .trim()
      .replace(/^"(?<val>.*)"$/, '$<val>');
    if (!isNaN(Number(value))) value = Number(value);
    if (!key) continue;
    result[key] = value;
  }
}

interface PartType {
  axis: string;
  kind: string;
  unit: string;
  values?: number[];
}
function parseScalePart(scale: string, nbValues: number): PartType {
  const parts = scale.split(',');
  let result: PartType = {
    axis: parts[1],
    kind: parts[0],
    unit: parts[4].replace(/"/g, ''),
  };
  if (result.kind === 'SetScale/P') {
    let from = Number(parts[2]);
    const step = Number(parts[3]);
    const values = [];
    for (let i = 0; i < nbValues; i++) {
      values.push(from);
      from += step;
    }
    result.values = values;
  }
  return result;
}

function getFieldName(key: string) {
  const mapping = {
    CE: 'counterElectrodeType',
    Calibrationfile: 'calibrationFile',
    Username: 'username',
    WE: 'workingElectrodeGlass',
    cellname: 'cellname',
    electrolyte: 'electrolyteZ960',
    layer: 'semicondutorLayer',
    specification: 'remarks',
    temp: 'workingTemperature',
    type: 'typeOfCell',
    AR: 'cellActiveArea',
    IT: 'powerIn',
  };
  if (key in mapping) return mapping[key as keyof typeof mapping];
  return key;
}
