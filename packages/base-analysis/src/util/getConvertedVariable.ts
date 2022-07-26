import { MeasurementVariable } from 'cheminfo-types';
import max from 'ml-array-max';
import min from 'ml-array-min';
import { xIsMonotone } from 'ml-spectra-processing';

import { convertUnits } from './convertUnits';

/**
 * @param variable
 * @param newUnits
 */
export function getConvertedVariable(
  variable: MeasurementVariable,
  newUnits: string,
): MeasurementVariable {
  const data =
    variable.units !== undefined && variable.units !== newUnits // would be nice if convertUnits would allow typedArray
      ? convertUnits(Array.from(variable.data), variable.units, newUnits)
      : variable.data;
  return {
    units: newUnits,
    label: variable.label.replace(`[${variable.units || ''}]`, `[${newUnits}]`),
    data: data || [],
    min: data ? min(data) : undefined,
    max: data ? max(data) : undefined,
    isMonotone: data ? xIsMonotone(data) : false,
  };
}
