import type { FromTo } from 'cheminfo-types';
import type { FilterXYType } from 'ml-signal-processing';

export interface MeasurementNormalizationOptions {
  from?: number;
  to?: number;
  numberOfPoints?: number;
  processing?: boolean;
  filters?: FilterXYType[];
  zones?: FromTo[];
  exclusions?: FromTo[];
  keepYUnits?: boolean;
}
