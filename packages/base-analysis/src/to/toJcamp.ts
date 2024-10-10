import { Analysis } from '../Analysis';

import { toJcamps } from './toJcamps';

interface GetJcampOptions {
  info?: Record<string, string>;
  meta?: Record<string, string>;
}

/**
 * converts an analysis to a jcamp string
 * @param analysis
 * @param options
 * @returns Jcamp text file containing the analysis
 */
export function toJcamp(analysis: Analysis, options: GetJcampOptions = {}) {
  return toJcamps(analysis, options).join('\n');
}
