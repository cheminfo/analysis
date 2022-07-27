import type { OneLowerCase } from 'cheminfo-types';

interface MeasurementSelector {
  /** Allows to specify 2 units using a string like 'nm vs °C' */
  units?: string;
  /** Filter based on xUnits */
  xUnits?: string;
  /** Filter based on yUnits */
  yUnits?: string;
  /** Allows to specify 2 labels using a string like 'weight vs temperature' */
  labels?: string;
  /** Filter based on xLabel */
  xLabel?: string | RegExp;
  /** Filter based on yLabel */
  yLabel?: string | RegExp;
  /** Filter based on an array of allowed yLabel */
  yLabels?: (string | RegExp)[];
  /** Allows to specify X and Y variables using a string like 'c vs d' */
  variables?: string;
  /** Select based on the data type */
  dataType?: string | RegExp;
  /** Select based on the title field */
  title?: string | RegExp;
  /** Select based on the presence of a meta information */
  meta?: Record<string, string>;
  /** The index of the measurement in the measurements array */
  index?: number;
}

export interface MeasurementSelectorWithDefaultXY extends MeasurementSelector {
  /**
   * Select a specific X variable by one letter name.
   *
   * @default 'x'
   */
  xVariable?: OneLowerCase;
  /**
   * Select a specific Y variable by one letter name.
   *
   * @default 'y'
   */
  yVariable?: OneLowerCase;
}

export interface MeasurementSelectorWithoutDefaultXY
  extends MeasurementSelector {
  /**
   * Select a specific X variable by one letter name.
   */
  xVariable?: OneLowerCase;
  /**
   * Select a specific Y variable by one letter name.
   */
  yVariable?: OneLowerCase;
}
