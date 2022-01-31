// TODO: enable ts in this file.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { parseXY } from 'xy-parser';

import { Analysis } from '../Analysis';

/**
 * Convert strings into JCAMP and add extra information.
 *
 * @param {string} data - Values to add to the file, usually a csv or tsv values.
 * @param {object} [options={}]
 * @param {string} [options.info={}] - Metadata of the file.
 * @param {string} [options.info.description = ''] - Description of the file.
 * @param {string} [options.info.dataType = ''] - Type of data.
 * @param {string} [options.info.xUnits = ''] - Units for the x axis.
 * @param {string} [options.info.yUnits = ''] - Units for the y axis.
 * @param {string} [options.info.xLabel = ''] - Label for the x axis.
 * @param {string} [options.info.yLabel = ''] - Label for the y axis.
 * @param {object} [options.meta = {}] - Comments to add to the file.
 * @param {object} [options.parser = {}] - 'xy-parser' options. ArrayType = 'xyxy' is enforced.
 * @returns {string} JCAMP of the input.
 */

/**
 * @param data
 * @param options
 */
export function fromText(data: string | ArrayBuffer, options = {}): Analysis {
  let analysis = new Analysis(options);

  const { info = {}, parser = {} } = options;

  parser.keepInfo = true;
  let parsed = parseXY(data, parser);
  const variables = {
    x: {
      data: parsed.data.x,
      units: info.xUnits,
      label: info.xLabel,
    },
    y: {
      data: parsed.data.y,
      units: info.yUnits,
      label: info.yLabel,
    },
  };

  analysis.pushMeasurement(variables, options);

  return analysis;
}
