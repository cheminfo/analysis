import { capacitanceIntegral } from '../../calculations/capacitanceIntegral';
import { diodeOnResistance } from '../../calculations/diodeOnResistance';
import { subthresholdSlope } from '../../calculations/subthresholdSlope';
import { thresholdVoltage } from '../../calculations/thresholdVoltage';
import { transistorOnResistance } from '../../calculations/transistorOnResistance';

import BaseB1505 from './BaseB1505';
import { getLabels } from './utils';

interface Options {
  xLabel: string;
  yLabel: string;
  scale: 'linear' | 'log';
}

/**
 * General parser from B1505 instrument.
 *
 * @param text - Original text from the file.
 * @param options - Query options.
 * @returns - List of general analysis.
 */
export function fromB1505(text: string, options?: Options) {
  if (options) {
    const { xLabel, yLabel, scale } = options;
    return new BaseB1505(xLabel, yLabel, scale).parseText(text);
  } else {
    const processor = new BaseB1505('', '', 'linear');
    const analyses = processor.parseText(text);
    if (analyses[0]) {
      const { xLabel, yLabel, scale } = getLabels(analyses[0]);
      return new BaseB1505(xLabel, yLabel, scale).parseText(text);
    } else {
      return [];
    }
  }
}

/**
 * Parser from breakdown process.
 *
 * @param text - Original text from the file.
 * @returns - List of breakdown analysis.
 */
export function fromBreakdown(text: string) {
  const analysis = new BaseB1505('Vd', 'Id_dens', 'log');
  analysis.addCalculation('thresholdVoltage', thresholdVoltage);
  return analysis.parseText(text);
}

/**
 * Parser from transfer process.
 *
 * @param text - Original text from the file.
 * @returns - List of transfer analysis.
 */
export function fromTransfer(text: string) {
  const analysis = new BaseB1505('Vg', 'Id_dens', 'log');
  analysis.addCalculation('thresholdVoltage', thresholdVoltage);
  analysis.addCalculation('subthresholdSlope', subthresholdSlope);
  return analysis.parseText(text);
}

/**
 * Parser from output process.
 *
 * @param text - Original text from the file.
 * @returns - List of output analysis.
 */
export function fromOutput(text: string) {
  const analysis = new BaseB1505('Vd', 'Id_dens', 'linear');
  analysis.addCalculation('resistanceOn', transistorOnResistance);
  return analysis.parseText(text);
}

/**
 * Parser from IV process.
 *
 * @param text - Original text from the file.
 * @returns - List of IV analysis.
 */
export function fromIV(text: string) {
  const analysis = new BaseB1505('Vd', 'Id_dens', 'linear');
  analysis.addCalculation('resistanceOn', diodeOnResistance);
  return analysis.parseText(text);
}

/**
 * Parser from capacitance process.
 *
 * @param text - Original text from the file.
 * @returns - List of capacitance analysis.
 */
export function fromCapacitance(text: string) {
  const analysis = new BaseB1505('Vd', 'C_dens', 'linear');
  analysis.addCalculation('capacitanceIntegral', capacitanceIntegral);
  return analysis.parseText(text);
}

/**
 * Parser from MOS capacitance process.
 *
 * @param text - Original text from the file.
 * @returns - List of MOS capacitance analysis.
 */
export function fromMOSCapacitance(text: string) {
  const analysis = new BaseB1505('VBias', 'C_dens', 'linear');
  analysis.addCalculation('capacitanceIntegral', capacitanceIntegral);
  return analysis.parseText(text);
}
