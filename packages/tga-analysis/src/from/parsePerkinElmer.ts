import { ensureString } from 'ensure-string';

export function parsePerkinElmer(
  arrayBuffer: string | ArrayBuffer | Uint8Array,
) {
  const text = ensureString(arrayBuffer);
  let lines = text.split(/[\r\n]+/);
  let result: any = {
    meta: { methodSteps: [] },
    data: { time: [], weight: [], temperature: [] },
  };
  let section = '';
  let inMethodSteps = false;
  for (let line of lines) {
    if (inMethodSteps) {
      if (line.startsWith('1) TGA')) {
        inMethodSteps = false;
      } else {
        if (!line.startsWith('\t') && line.length > 2) {
          result.meta.methodSteps.push(line.replace(/\t\n,+$/g, ''));
        }
      }
    } else if (/^[a-zA-Z -]+$/.exec(line)) {
      section = trim(line);
    } else if (/.*:.*/.exec(line)) {
      let position = line.indexOf(':');
      let description = line.substring(0, position);
      let value = trim(line.substring(position + 1));
      result.meta[(section ? `${section}_` : '') + description] = value;
    } else if (/^[0-9\t .]+$/.exec(line)) {
      let fields = line.replace(/^\t/, '').split('\t');
      result.data.time.push(Number(fields[0]) * 60);
      result.data.weight.push(Number(fields[1]));
      result.data.temperature.push(Number(fields[4]));
    } else {
      //  console.log('Problem: ', line);
    }
    if (line.startsWith('Method Steps:')) {
      inMethodSteps = true;
    }
  }
  return result;
}
function trim(string: string) {
  return string.replace(/^[ \t]*(.*?)[ \t]*$/, '$1');
}
