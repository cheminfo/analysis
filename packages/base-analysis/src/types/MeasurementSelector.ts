import type { OneLowerCase } from 'cheminfo-types';

/**
 * @default {x:{variable'x'},y:{variable:'y'}}
 */
export interface MeasurementSelector {
  /**
   * Parameters allow to select the right X variable
   * If more that one variable match the selector, the first one is used.
   * @default {variable:'x'}
   */
  x?: {
    /** Filter based on xUnits */
    units?: string;
    /** Filter based on xLabel */
    label?: string | RegExp;
    /** Specify the 'x' variable */
    variable?: OneLowerCase;
  };
  /**
   * Parameters allow to select the right Y variable
   * All matching variable are used
   * @default {variable:'y'}
   */
  y?: {
    /** Filter based on yUnits */
    units?: string;
    /** Filter based on yLabel */
    label?: string | RegExp;
    /** Specify the 'y' variable */
    variable?: OneLowerCase;
  };
  /** Select based on the data type */
  dataType?: string | RegExp;
  /** Select based on the title field */
  title?: string | RegExp;
  /** Select based on the presence of a meta information */
  meta?: Record<string, string>;
  /** The index of the measurement in the measurements array */
  index?: number;
}
