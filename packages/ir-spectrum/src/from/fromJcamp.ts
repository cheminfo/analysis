import { fromJcamp as commonFromJcamp } from 'base-analysis';

import { spectrumCallback } from './utils/spectrumCallback';

/**
 * Creates a new Analysis from a SPC buffer
 * @param {ArrayBuffer|string} jcamp
 * @param {object} [options={}]
 * @param {object} [options.id=Math.random()]
 * @param {string} [options.label=options.id] human redeable label
 * @param {string} [options.spectrumCallback] a callback to apply on variables when creating spectrum. Default will add a and t
 * @return {Analysis} - New class element with the given data
 */
export function fromJcamp(
  jcamp: string | ArrayBuffer | Uint8Array,
  options = {},
) {
  return commonFromJcamp(jcamp, { ...options, spectrumCallback });
}
