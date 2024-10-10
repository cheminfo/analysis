import { MeasurementVariable } from 'cheminfo-types';
import { convert } from 'jcampconverter';

import { Analysis } from '../Analysis';

/**
 * Creates a new Analysis from a JCAMP string.
 * @param jcamp - String containing the JCAMP data.
 * @param [options]
 * @param [options.id]
 * @param [options.label] - Human redeable label.
 * @param [options.measurementCallback] - A callback to apply on variables when creating measurement.
 * @returns - New class element with the given data.
 */
export function fromJcamp(jcamp: string | ArrayBuffer, options = {}): Analysis {
  const analysis = new Analysis(options);
  addJcamp(analysis, jcamp);
  return analysis;
}

/**
 * @param analysis
 * @param jcamp
 */
function addJcamp(analysis: Analysis, jcamp: string | ArrayBuffer) {
  const converted = convert(jcamp, {
    keepRecordsRegExp: /.*/,
  });

  for (const entry of converted.flatten) {
    if (!entry.spectra?.[0]) continue;
    const currentMeasurement = entry.spectra[0];

    // we ensure variables
    if (!currentMeasurement.variables) {
      const variables: Record<string, MeasurementVariable> = {};
      currentMeasurement.variables = variables;
      variables.x = {
        label: currentMeasurement.xUnits,
        symbol: 'X',
        data: currentMeasurement.data.x || currentMeasurement.data.X,
      };
      variables.y = {
        label: currentMeasurement.yUnits,
        symbol: 'Y',
        data: currentMeasurement.data.y || currentMeasurement.data.Y,
      };
    } else {
      for (const key in currentMeasurement.variables) {
        const variable = currentMeasurement.variables[key];
        if (variable.label) continue;
        variable.label = variable.name || variable.symbol || key;
        if (variable.units && !variable.label.includes(variable.units)) {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          variable.label += ` [${variable.units}]`;
        }
      }
    }

    // todo hack waiting jcampconverter update
    for (const symbol in currentMeasurement.variables) {
      const variable = currentMeasurement.variables[symbol];
      if (variable?.type?.toUpperCase() === 'DEPENDENT') {
        delete variable.type;
        variable.isDependent = true;
      }
      if (variable?.type?.toUpperCase() === 'INDEPENDENT') {
        delete variable.type;
        variable.isDependent = false;
      }
      delete variable.name;
    }

    analysis.pushMeasurement(currentMeasurement.variables, {
      dataType: entry.dataType,
      title: entry.title,
      meta: entry.meta,
    });
  }
}
