import { MeasurementVariable } from 'cheminfo-types';
import { xMaxValue, xMinValue, xIsMonotone } from 'ml-spectra-processing';

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
    min: data ? xMinValue(data) : undefined,
    max: data ? xMaxValue(data) : undefined,
    isMonotone: data ? xIsMonotone(data) : false,
  };
}
