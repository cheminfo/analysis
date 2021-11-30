import { Analysis } from 'base-analysis';
import { parse } from 'spc-parser';

import { spectrumCallback } from './utils/spectrumCallback';

/**
 * Creates a new Analysis from a SPC buffer
 * @param {ArrayBuffer} buffer
 * @param {object} [options={}]
 * @param {object} [options.id=Math.random()]
 * @param {string} [options.label=options.id] human redeable label
 * @param {string} [options.spectrumCallback] a callback to apply on variables when creating spectrum. Default will add a and t
 * @return {Analysis} - New class element with the given data
 */

export function fromSPC(buffer, options = {}) {
  let analysis = new Analysis({ ...options, spectrumCallback });
  let result = parse(buffer);

  if (result.meta) delete result.meta.parameters;

  for (let spectrum of result.spectra) {
    if (spectrum.meta) delete spectrum.meta.parameters;
    analysis.pushSpectrum(spectrum.variables, {
      dataType: 'IR SPECTRUM',
      title: '',
      meta: { ...result.meta, ...spectrum.meta },
    });
  }
  return analysis;
}
