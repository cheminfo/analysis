import { getJSGraph } from './jsgraph/getJSGraph';
import { getNormalizationAnnotations } from './jsgraph/getNormalizationAnnotations';

export * from './AnalysesManager';
export * from './Analysis';
export * from './from/fromJcamp';
export * from './from/fromText';
export * from './to/toJcamp';
export * from './to/toJcamps';
export * from './to/toText';
export * from './util/getNormalizedMeasurement';

export * from './util/peakPicking';
export * from './util/autoPeakPicking';

export * from './types/types';
export * from './types/AutoPeakPickingOptions';
export { FilterXYType } from 'ml-signal-processing';
export * from './types/MeasurementNormalizationOptions';
export { MeasurementVariable, MeasurementXY } from 'cheminfo-types';
export * from './types/PlotObject';
export * from './types/MeasurementSelector';

export { getReactPlotJSON } from './reactPlot/getReactPlotJSON';

export const JSGraph = {
  getJSGraph,
  getNormalizationAnnotations,
};
