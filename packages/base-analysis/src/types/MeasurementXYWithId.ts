import { MeasurementXY } from 'cheminfo-types';

export interface MeasurementXYWithId extends MeasurementXY {
  id: string; // id is now required
}
