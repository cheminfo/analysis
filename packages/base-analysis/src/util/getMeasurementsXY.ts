/* eslint-disable @typescript-eslint/no-dynamic-delete */

import type {
  MeasurementVariable,
  MeasurementXYVariables,
  OneLowerCase,
} from 'cheminfo-types';

import { MeasurementSelector } from '../types/MeasurementSelector';
import { MeasurementXYWithId } from '../types/MeasurementXYWithId';

import { convertUnits } from './convertUnits';
import { ensureRegexp } from './ensureRegexp';
import { getConvertedVariable } from './getConvertedVariable';

/**
 *
 * @param measurements
 * @param selector
 * @returns The list of matching measurements
 */
export function getMeasurementsXY(
  measurements: MeasurementXYWithId[] = [],
  selector: MeasurementSelector = {},
): MeasurementXYWithId[] {
  const selectedMeasurements: MeasurementXYWithId[] = [];

  if (measurements.length < 1) return selectedMeasurements;

  const {
    x: xSelector = { variable: 'x' },
    y: ySelector = { variable: 'y' },
    meta,
    index,
  } = selector;
  let { dataType, title } = selector;

  const { units: xUnits, variable: xVariable, label: xLabel } = xSelector;
  const { units: yUnits, variable: yVariable, label: yLabel } = ySelector;

  if (index !== undefined) {
    return [measurements[index]];
  }

  if (dataType) {
    dataType = ensureRegexp(dataType);
  }

  if (title) {
    title = ensureRegexp(title);
  }

  for (const measurement of measurements) {
    const variableNames = Object.keys(measurement.variables);
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
      for (const key in measurement.meta) {
        if (!measurement.meta[key]) continue;
        const value = ensureRegexp(measurement.meta[key]);
        if (!value.exec(measurement.meta[key])) continue;
      }
    }

    const xs = getPossibleVariables(measurement.variables, {
      units: xUnits,
      label: xLabel,
      variableName: xVariable,
    });
    const x = xs[0]; // could be improved in the future

    const ys = getPossibleVariables(measurement.variables, {
      units: yUnits,
      label: yLabel,
      variableName: yVariable,
    });

    if (x && ys.length > 0) {
      for (const y of ys) {
        selectedMeasurements.push({
          title: measurement.title,
          dataType: measurement.dataType,
          meta: measurement.meta,
          variables: { x, y },
          id: measurement.id,
        });
      }
    }
  }
  return selectedMeasurements;
}

interface PossibleVariableSelector {
  units?: string;
  label?: RegExp | string;
  variableName?: OneLowerCase;
}
function getPossibleVariables(
  variables: MeasurementXYVariables,
  selector: PossibleVariableSelector,
): MeasurementVariable[] {
  const { units, label, variableName } = selector;

  const labelRegExp = label !== undefined ? ensureRegexp(label) : undefined;

  const possible: MeasurementXYVariables = { ...variables };
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

  if (labelRegExp) {
    for (key in possible) {
      if (!labelRegExp.test(variables[key]?.label || '')) {
        delete possible[key];
      }
    }
  }

  if (variableName !== undefined) {
    if (possible[variableName]) {
      return [possible[variableName]];
    }
    const upper = variableName.toUpperCase();
    if (Object.hasOwn(possible, upper)) {
      return [possible[upper as keyof typeof possible] as MeasurementVariable];
    }
    const lower = variableName.toLowerCase();
    if (Object.hasOwn(possible, lower)) {
      return [possible[lower as keyof typeof possible] as MeasurementVariable];
    }
  }

  const possibleVariables = Object.values(possible).filter(
    (val) => val !== undefined,
  ) as MeasurementVariable[];
  return possibleVariables;
}
