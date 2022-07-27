/* eslint-disable @typescript-eslint/no-dynamic-delete */

import type {
  OneLowerCase,
  MeasurementXYVariables,
  MeasurementVariable,
} from 'cheminfo-types';

import { MeasurementSelectorWithoutDefaultXY } from '../types/MeasurementSelector';
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
  measurements: Array<MeasurementXYWithId> = [],
  selector: MeasurementSelectorWithoutDefaultXY = {},
): MeasurementXYWithId[] {
  const selectedMeasurements: MeasurementXYWithId[] = [];

  if (measurements.length < 1) return selectedMeasurements;

  let {
    dataType,
    title,
    xUnits,
    yUnits,
    variables,
    xVariable,
    yVariable,
    units,
    labels,
    xLabel,
    yLabel,
    yLabels,
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

  const xLabelsRegExp = xLabel ? [ensureRegexp(xLabel)] : [];

  const yLabelRegExp = yLabel && ensureRegexp(yLabel);
  const yLabelsRegExp = yLabels ? yLabels.map(ensureRegexp) : [];
  if (
    yLabelRegExp &&
    !yLabelsRegExp
      .map((yLabel) => yLabel.toString())
      .includes(yLabelRegExp.toString())
  ) {
    yLabelsRegExp.push(yLabelRegExp);
  }

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

    let xs = getPossibleVariables(measurement.variables, {
      units: xUnits,
      labels: xLabelsRegExp,
      variableName: xVariable,
    });
    let x = xs[0]; // could be improved in the future

    let ys = getPossibleVariables(measurement.variables, {
      units: yUnits,
      labels: yLabelsRegExp,
      variableName: yVariable,
    });

    if (x && ys.length > 0) {
      for (let y of ys) {
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
  labels: RegExp[];
  variableName?: OneLowerCase;
}
function getPossibleVariables(
  variables: MeasurementXYVariables,
  selector: PossibleVariableSelector = { labels: [] },
): MeasurementVariable[] {
  const { units, labels, variableName } = selector;
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

  if (labels.length > 0) {
    for (key in possible) {
      let isOk = false;
      for (let label of labels) {
        if (label.test(variables[key]?.label || '')) {
          isOk = true;
          break;
        }
      }
      if (!isOk) {
        delete possible[key];
      }
    }
  }

  if (variableName !== undefined) {
    if (possible[variableName]) {
      return [possible[variableName] as MeasurementVariable];
    }
    const upper = variableName.toUpperCase();
    if (Object.prototype.hasOwnProperty.call(possible, upper)) {
      return [possible[upper as keyof typeof possible] as MeasurementVariable];
    }
    const lower = variableName.toLowerCase();
    if (Object.prototype.hasOwnProperty.call(possible, lower)) {
      return [possible[lower as keyof typeof possible] as MeasurementVariable];
    }
  }

  const possibleVariables = Object.values(possible).filter(
    (val) => val !== undefined,
  ) as MeasurementVariable[];
  return possibleVariables;
}
