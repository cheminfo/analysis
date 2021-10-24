import { Analysis } from '../Analysis';

import { toJcamps } from './toJcamps';

interface GetJcampOptions {
  info?: Record<string, string>;
  meta?: Record<string, string>;
}
/**
 * @param analysis
 * @param options
 */
export function toJcamp(analysis: Analysis, options: GetJcampOptions = {}) {
  return toJcamps(analysis, options).join('\n');
}
