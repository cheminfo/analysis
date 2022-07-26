/* eslint-disable @typescript-eslint/no-dynamic-delete */

import type { OneLowerCase, MeasurementXYVariables } from 'cheminfo-types';

import { MeasurementSelector } from '../types/MeasurementSelector';
import { MeasurementXYWithId } from '../types/MeasurementXYWithId';

import { convertUnits } from './convertUnits';
import { ensureRegexp } from './ensureRegexp';
import { getConvertedVariable } from './getConvertedVariable';

/**
 * Retrieve the measurement with only X/Y data that match all the selectors
 * If more than one variable match the selector the 'x' or 'y' variable will be
 * taken
 *
 * @param measurements
 * @param selector
 */
export function getMeasurementsXY(
  measurements: Array<MeasurementXYWithId> = [],
  selector: MeasurementSelector = {},
): MeasurementXYWithId[] {
  const selectedSpectra: MeasurementXYWithId[] = [];

  if (measurements.length < 1) return selectedSpectra;

  let {
    dataType,
    title,
    xUnits,
    yUnits,
    variables,
    xVariable = 'x',
    yVariable = 'y',
    units,
    labels,
    xLabel,
    yLabel,
    meta,
    index,
  } = selector;

  if (index !== undefined) {
    return [measurements[index]];
  }

  if (dataType) {
    dataType = ensureRegexp(dataType);
  }

  if (title) {
    title = ensureRegexp(title);
  }

  if (units && !xUnits && !yUnits) [yUnits, xUnits] = units.split(/\s*vs\s*/);
  if (labels && !xLabel && !yLabel) {
    [yLabel, xLabel] = labels.split(/\s*vs\s*/);
  }
  if (variables) {
    const parts = variables.split(/\s*vs\s*/);
    if (parts.length === 2) {
      xVariable = parts[1] as OneLowerCase;
      yVariable = parts[0] as OneLowerCase;
    }
  }

  if (xLabel) xLabel = ensureRegexp(xLabel);
  if (yLabel) yLabel = ensureRegexp(yLabel);

  for (let measurement of measurements) {
    let variableNames = Object.keys(measurement.variables);
    if (!(variableNames.length > 1)) continue;

    // we filter on general measurement information
    if (dataType) {
      if (
        !measurement.dataType ||
        !(dataType as RegExp).exec(measurement.dataType)
      ) {
        continue;
      }
    }

    if (title) {
      if (!measurement.title || !(title as RegExp).exec(measurement.title)) {
        continue;
      }
    }

    if (meta && typeof meta === 'object') {
      if (!measurement.meta) continue;
      for (let key in measurement.meta) {
        if (!measurement.meta[key]) continue;
        let value = ensureRegexp(measurement.meta[key]);
        if (!value.exec(measurement.meta[key])) continue;
      }
    }

    let x = getPossibleVariable(measurement.variables, {
      units: xUnits,
      label: xLabel,
      variableName: xVariable,
    });
    let y = getPossibleVariable(measurement.variables, {
      units: yUnits,
      label: yLabel,
      variableName: yVariable,
    });

    if (x && y) {
      selectedSpectra.push({
        title: measurement.title,
        dataType: measurement.dataType,
        meta: measurement.meta,
        variables: { x, y },
        id: measurement.id,
      });
    }
  }
  return selectedSpectra;
}

interface Selector {
  units?: string;
  label?: string | RegExp;
  variableName?: OneLowerCase;
}
function getPossibleVariable(
  variables: MeasurementXYVariables,
  selector: Selector = {},
) {
  const { units, label, variableName } = selector;
  let possible: MeasurementXYVariables = { ...variables };
  let key: keyof typeof possible;
  if (units !== undefined) {
    for (key in possible) {
      const variable = variables[key];
      let convertibleUnits = true;
      try {
        convertUnits(1, variable?.units || '', units);
      } catch (e) {
        convertibleUnits = false;
      }
      if (convertibleUnits && variable) {
        possible[key] = getConvertedVariable(variable, units);
      } else {
        delete possible[key];
      }
    }
  }

  if (label !== undefined) {
    const regexpLabel = ensureRegexp(label);
    for (key in possible) {
      if (!regexpLabel.exec(variables[key]?.label ?? '')) {
        delete possible[key];
      }
    }
  }

  if (variableName !== undefined) {
    if (possible[variableName]) return possible[variableName];
    const upper = variableName.toUpperCase();
    if (Object.prototype.hasOwnProperty.call(possible, upper)) {
      return possible[upper as keyof typeof possible];
    }
    const lower = variableName.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(possible, lower)) {
      return possible[lower as keyof typeof possible];
    }
  }

  const possibleFiltered = Object.values(possible).filter(
    (val) => val !== undefined,
  );

  if (possibleFiltered.length > 0) {
    return possibleFiltered[0];
  }
}
