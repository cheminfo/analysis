import type { MeasurementXY } from 'cheminfo-types';
import { filterXY } from 'ml-signal-processing';
import { xIsMonotone, xMinValue, xMaxValue } from 'ml-spectra-processing';

import { MeasurementNormalizationOptions } from '../types/MeasurementNormalizationOptions';

/**
 * @param measurement
 * @param options
 */
export function getNormalizedMeasurement(
  measurement: MeasurementXY,
  options: MeasurementNormalizationOptions = {},
): MeasurementXY {
  let data = {
    x: measurement.variables.x.data,
    y: measurement.variables.y.data,
  };
  let newMeasurement: MeasurementXY = {
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

  let {
    from = measurement.variables.x.min,
    to = measurement.variables.x.max,
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

  filters = JSON.parse(JSON.stringify(filters));
  if (numberOfPoints) {
    filters.push({
      name: 'equallySpaced',
      options: { from, to, exclusions, zones, numberOfPoints },
    });
  } else {
    filters.push({
      name: 'filterX',
      options: { from, to, exclusions, zones },
    });
  }

  let { x, y } = filterXY(data, filters).data;

  newMeasurement.variables.x.data = x;
  newMeasurement.variables.x.min = xMinValue(x);
  newMeasurement.variables.x.max = xMaxValue(x);
  newMeasurement.variables.x.isMonotone = xIsMonotone(x);
  newMeasurement.variables.y.data = y;
  newMeasurement.variables.y.min = xMinValue(y);
  newMeasurement.variables.y.max = xMaxValue(y);
  newMeasurement.variables.y.isMonotone = xIsMonotone(y);

  return newMeasurement;
}
