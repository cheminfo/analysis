import { JSGraph as OriginalJSGraph } from 'base-analysis';

import { fromSPC } from './from/fromSPC';
import { getAnnotations } from './jsgraph/getAnnotations';

export {
  Analysis,
  AnalysesManager,
  toJcamp,
  peakPicking,
  autoPeakPicking,
} from 'base-analysis';

export { fromJcamp } from './from/fromJcamp';
export { fromSPC } from './from/fromSPC';

export const JSGraph = { ...OriginalJSGraph, getAnnotations };
