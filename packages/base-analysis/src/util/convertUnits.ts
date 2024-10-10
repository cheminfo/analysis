import { DoubleArray } from 'cheminfo-types';
import Qty from 'js-quantities';

/**
 * Try to convert a number of an array from one unit to another
 * Will throw an error if the units can not be converted
 * @param array
 * @param fromUnits - String containing the original units
 * @param toUnits - String containing the destination units
 * @returns The converter value or array
 */
export function convertUnits<T extends DoubleArray | number>(
  array: T,
  fromUnits: string,
  toUnits: string,
): T {
  fromUnits = normalize(fromUnits);
  toUnits = normalize(toUnits);

  if (fromUnits === toUnits) return array;

  const convert = Qty.swiftConverter(fromUnits, toUnits); // Configures converter
  //@ts-expect-error convert does not allowed typed array but it works
  return convert(array);
}

/**
 * Deal with °C and °F
 * @param unit
 * @returns A normalized units
 */
function normalize(unit: string) {
  unit = unit.replace(/°C/g, 'tempC');
  unit = unit.replace(/°F/g, 'tempF');
  unit = unit.replace(/(^|\W)K(\W|$)/g, '$1tempK$2');
  return unit;
}
