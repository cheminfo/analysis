import { ensureString } from 'ensure-string';

/**
 * @param arrayBuffer
 */
export function parseTAInstruments(
  arrayBuffer: string | ArrayBuffer | Uint8Array,
) {
  let text = ensureString(arrayBuffer);
  text = text.replace(/[\r\f]/g, '');
  let metaLines = text.split(/\n/).filter((line) => /^[a-zA-Z]/.test(line));
  let allDataLines = text
    .split(/\n/)
    .filter((line) => /^[0-9.-]/.exec(line))
    .map((line) => line.split(/\s+/).map(Number));

  let meta = parseMeta(metaLines);

  //let events = allDataLines.filter((line) => line[0] < 0);
  let dataLines = allDataLines.filter((line) => line[0] > 0);

  meta.balancePurgeFlow = [];
  meta.samplePurgeFlow = [];
  // We now assume that we always have 5 columns in the same order ...
  const result: any = {
    meta,
    data: {
      time: [],
      weight: [],
      temperature: [],
    },
  };
  result.data.time = dataLines.map((fields) => fields[0]);
  result.data.temperature = dataLines.map((fields) => fields[1]);
  result.data.weight = dataLines.map((fields) => fields[2]);
  result.meta.balancePurgeFlow = dataLines.map((fields) => fields[3]);
  result.meta.samplePurgeFlow = dataLines.map((fields) => fields[4]);

  return result;
}

/**
 * @param string
 * @param item
 */
function splitTrim(string: string, item = 1) {
  return string.split(/\t/)[item].replace(/^[ \t]*(.*?)[ \t]*$/, '$1');
}

/**
 * @param lines
 */
function parseMeta(lines: string[]) {
  const meta: any = { comments: [], methodSteps: [] };
  for (let [i, line] of lines.entries()) {
    if (/^Instrument/.exec(line)) {
      meta.instrument = splitTrim(line);
    } else if (/^InstSerial/.exec(line)) {
      meta.instrumentSerial = splitTrim(line);
    } else if (/^Sample/.exec(line)) {
      meta.sampleName = splitTrim(line);
    } else if (/^Size/.exec(line)) {
      meta.weight = parseFloat(splitTrim(line));
      meta.weightUnit = splitTrim(line, 2);
    } else if (/^Xcomment|^Comment/.exec(line)) {
      meta.comments.push(splitTrim(line));
    } else if (/^Method/.exec(line)) {
      meta.method = splitTrim(line);
    } else if (/^Mode/.exec(line)) {
      meta.mode = splitTrim(line);
    } else if (/^File/.exec(line)) {
      meta.file = splitTrim(line);
    } else if (/^Date/.exec(line)) {
      meta.date = splitTrim(line);
    } else if (/^Time/.exec(line)) {
      meta.time = splitTrim(line);
    } else if (/^OrgMethod/.exec(line)) {
      meta.methodSteps.push(splitTrim(line));
    } else if (/^Controls/.exec(line)) {
      meta.controls = splitTrim(line);
    } else if (/^FurnaceType/.exec(line)) {
      meta.furnaceType = splitTrim(line);
    } else if (/^Operator/.exec(line)) {
      meta.operator = splitTrim(line);
    } else if (/^RunSerial/.exec(line)) {
      meta.runSerial = splitTrim(line);
    } else if (/^ProcName/.exec(line)) {
      meta.procName = splitTrim(line);
    } else if (/^OrgFile/.exec(line)) {
      meta.dataStart = i + 1;
      break;
    }
  }

  return meta;
}
