// TODO: enable ts in this file.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import type { MeasurementXY } from 'cheminfo-types';

import { MeasurementSelectorWithDefaultXY } from '../types/MeasurementSelector';

import { getMeasurementsXY } from './getMeasurementsXY';

/**
 * Retrieve the measurement with only X/Y data that match all the selectors
 * If more than one variable match the selector the 'x' or 'y' variable will be
 * taken.
 *
 * @param measurements - the measurements to filter
 * @param selector - the selector to match
 * @returns measurement with x/y data
 */
export function getMeasurementXY(
  measurements: Array<MeasurementXY> = [],
  selector: MeasurementSelectorWithDefaultXY = {},
): MeasurementXY | undefined {
  const selectedSpectra = getMeasurementsXY(measurements, {
    xVariable: 'x',
    yVariable: 'y',
    ...selector,
  });
  if (selectedSpectra.length === 0) return undefined;
  return selectedSpectra[0];
}
