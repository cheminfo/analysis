import { Analysis, MeasurementVariable } from 'base-analysis';
import type { MeasurementXYVariables } from 'cheminfo-types';

import { metaUnits } from './BaseB1505';

interface Options {
  xLabel: string;
  yLabel: string;
  scale: 'linear' | 'log';
  units: Record<string, string>;
}

/**
 * Unifies the densities of the variables.
 * @param label - The label of the variable.
 * @returns - Replaced label with boolean if it had a density word.
 */
export function getDensities(label: string): [string, boolean] {
  const isDens = /dens/.exec(label);
  if (isDens) {
    return [
      label.replace(
        /(?<name>.+)(?<separator>_|\s)density/,
        '$<name>$<separator>dens',
      ),
      true,
    ];
  } else {
    return [label, false];
  }
}

const stdUnits: Record<string, string> = {
  C: 'F',
  I: 'A',
  V: 'V',
  R: 'Ohm',
  G: 'S',
  Q: 'C',
  F: 'Hz',
  T: 's',
};
const generatedVars = ['Ron', 'gm'];

/**
 * Append the units to the measurement.
 * @param data - The data to be check the units.
 * @param knownUnits - Dictionary of known units.
 * @returns - Data with the units replaced.
 */
export function appendUnits(
  data: MeasurementXYVariables,
  knownUnits: Record<string, string> = {},
): MeasurementXYVariables {
  let key: keyof MeasurementXYVariables;
  for (key in data) {
    const value = data[key] as MeasurementVariable;
    let label = value.label.trim();

    // In the case of calculated variables unifies naming
    if (generatedVars.includes(label)) {
      label = `${label}_dens`;
    }

    const [densLabel, isDens] = getDensities(label);

    // The variable already has a default unit
    if (knownUnits[label]) {
      value.units = knownUnits[label];
    }

    // Infer the variables units based on the name
    else {
      const unit = stdUnits[label[0].toUpperCase()] || undefined;
      if (unit) {
        value.units = isDens ? `${unit}/mm` : unit;
      }
    }

    // Replaces density for dens
    if (isDens) {
      label = densLabel;
    }

    const labelUnits = value.units ? ` [${value.units}]` : '';
    value.label = label + labelUnits;
  }
  return data;
}

/**
 * Query the analysis for the variables.
 * @param analysis - The analysis to query all labels.
 * @returns - Main labels, scale and units.
 */
export function getLabels(analysis: Analysis): Options {
  const { meta = {}, variables } = analysis.measurements[0];
  const [xLabel] = getDensities(
    meta['Output.Graph.XAxis.Data'] || variables.x.label,
  );
  const [yLabel] = getDensities(
    meta['Output.Graph.YAxis.Data']?.split(',')[0].trim() || variables.y.label,
  );
  const scale =
    meta['Output.Graph.YAxis.Scale']?.split(',')[0].trim().toLowerCase() ===
    'linear'
      ? 'linear'
      : 'log';
  const units = metaUnits(meta);
  units[xLabel] = units[xLabel] || stdUnits[xLabel[0].toUpperCase()] || '';
  units[yLabel] = units[yLabel] || stdUnits[yLabel[0].toUpperCase()] || '';
  return { xLabel, yLabel, scale, units };
}
