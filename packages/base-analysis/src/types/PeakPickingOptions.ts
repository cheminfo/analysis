import { OneLowerCase } from 'cheminfo-types';
import { OptimizeOptions } from 'ml-spectra-fitting';

export interface PeakPickingOptions {
  /**
   * X variable label.
   *
   * @default 'x'
   */
  xVariable?: OneLowerCase;
  /**
   * Y variable label.
   *
   * @default 'y'
   */
  yVariable?: OneLowerCase;
  /**
   * Whether to look for the closest min / max.
   *
   * @default true
   */
  optimize?: boolean;
  /**
   * Options of the peak shape fit.
   */
  shapeOptions?: OptimizeOptions['shape'];
  /**
   * Whether to  look for maxima or minima.
   *
   * @default true
   */
  max?: boolean;
  /**
   * Expected width.
   */
  expectedWidth?: number;
}
