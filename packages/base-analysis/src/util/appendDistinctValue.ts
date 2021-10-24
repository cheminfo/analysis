import type { CounterType } from '../types/types';

/**
 * @param values
 * @param key
 */
export function appendDistinctValue(
  values: Record<string, CounterType>,
  key: string,
) {
  if (!values[key]) {
    values[key] = {
      key,
      count: 0,
    };
  }
  values[key].count++;
}
