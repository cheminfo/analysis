// TODO: enable ts in this file.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { tgaParseMettlerToledo } from 'physical-chemistry-parser';

import { Analysis } from '..';

/**
 * @param arrayBuffer
 */
export function fromMettlerToledo(
  arrayBuffer: string | ArrayBuffer | Uint8Array,
) {
  const analysis = new Analysis();

  const results: any[] = tgaParseMettlerToledo(arrayBuffer);

  // we try to find the right results
  const result = results.filter(
    (result) =>
      result.variables?.y &&
      (result.variables.y.units === 'mg' || result.variables.y.units === '%'),
  )[0];

  const cheminfo = result.meta;

  analysis.pushMeasurement(result.variables, {
    dataType: 'TGA',
    meta: { ...result.meta, cheminfo },
  });

  return analysis;
}
