import type { DataXY, DoubleArray, MeasurementXY } from 'cheminfo-types';
import { filterXY } from 'ml-signal-processing';
import { xIsMonotonic, xMaxValue, xMinValue } from 'ml-spectra-processing';

import { MeasurementNormalizationOptions } from '../types/MeasurementNormalizationOptions';

/**
 * @param measurement
 * @param options
 */
export function getNormalizedMeasurement(
  measurement: MeasurementXY,
  options: MeasurementNormalizationOptions = {},
): MeasurementXY {
  const data = {
    x: measurement.variables.x.data,
    y: measurement.variables.y.data,
  };
  const newMeasurement: MeasurementXY = {
    variables: {
      x: {
        data: measurement.variables.x.data,
        units: measurement.variables.x.units,
        label: measurement.variables.x.label,
      },
      y: {
        data: measurement.variables.y.data,
        units: measurement.variables.y.units,
        label: measurement.variables.y.label,
      },
    },
  };

  for (const key of ['title', 'dataType', 'meta', 'id']) {
    //@ts-expect-error don't know how to type this
    if (measurement[key]) {
      //@ts-expect-error don't know how to type this
      newMeasurement[key] = measurement[key];
    }
  }

  const {
    numberOfPoints,
    filters = [],
    exclusions = [],
    zones = [],
    keepYUnits = false,
  } = options;

  if (!keepYUnits && filters.length) {
    // filters change the y axis, we get rid of the units
    // TODO we should deal correctly with this problem
    newMeasurement.variables.y.units = '';
    newMeasurement.variables.y.label =
      newMeasurement.variables.y.label?.replace(/\s*\[.*\]/, '');
  }

  const preprocessed = filterXY(data, filters).data;

  const from =
    options.from === undefined ? xMinValue(preprocessed.x) : options.from;
  const to = options.to === undefined ? xMaxValue(preprocessed.x) : options.to;

  let final: DataXY;
  if (numberOfPoints) {
    final = filterXY(preprocessed, [
      {
        name: 'equallySpaced',
        options: { from, to, exclusions, zones, numberOfPoints },
      },
    ]).data;
  } else {
    final = filterXY(preprocessed, [
      {
        name: 'filterX',
        options: { from, to, exclusions, zones },
      },
    ]).data;
  }

  const { x, y } = final;

  newMeasurement.variables.x.data = x as DoubleArray;
  newMeasurement.variables.x.min = xMinValue(x);
  newMeasurement.variables.x.max = xMaxValue(x);
  newMeasurement.variables.x.isMonotonic = xIsMonotonic(x);
  newMeasurement.variables.y.data = y as DoubleArray;
  newMeasurement.variables.y.min = xMinValue(y);
  newMeasurement.variables.y.max = xMaxValue(y);
  newMeasurement.variables.y.isMonotonic = xIsMonotonic(y);

  return newMeasurement;
}
