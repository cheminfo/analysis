import { capacitanceIntegral } from '../../calculations/capacitanceIntegral';
import { diodeOnResistance } from '../../calculations/diodeOnResistance';
import { subthresholdSlope } from '../../calculations/subthresholdSlope';
import { thresholdVoltage } from '../../calculations/thresholdVoltage';
import { transistorOnResistance } from '../../calculations/transistorOnResistance';
import {
  ThresholdVoltageOptions,
  SlopeOptions,
  RangeOptions,
} from '../../calculations/types';

import BaseB1505 from './BaseB1505';
import { getLabels } from './utils';

interface Options {
  xLabel: string;
  yLabel: string;
  scale: 'linear' | 'log';
}

/**
 * General parser from B1505 instrument.
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

interface BreakdownOptions {
  thresholdVoltage?: ThresholdVoltageOptions;
}
/**
 * Parser from breakdown process.
 * @param text - Original text from the file.
 * @param options - Calculation options.
 * @returns - List of breakdown analysis.
 */
export function fromBreakdown(text: string, options: BreakdownOptions = {}) {
  const analysis = new BaseB1505('Vd', 'Id_dens', 'log');
  analysis.addCalculation('thresholdVoltage', (val) =>
    thresholdVoltage(val, options.thresholdVoltage),
  );
  return analysis.parseText(text);
}

interface TransferOptions {
  thresholdVoltage?: ThresholdVoltageOptions;
  subthresholdSlope?: SlopeOptions;
}
/**
 * Parser from transfer process.
 * @param text - Original text from the file.
 * @param options - Calculation options.
 * @returns - List of transfer analysis.
 */
export function fromTransfer(text: string, options: TransferOptions = {}) {
  const analysis = new BaseB1505('Vg', 'Id_dens', 'log');
  analysis.addCalculation('thresholdVoltage', (val) =>
    thresholdVoltage(val, options.thresholdVoltage),
  );
  analysis.addCalculation('subthresholdSlope', (val) =>
    subthresholdSlope(val, options.subthresholdSlope),
  );
  return analysis.parseText(text);
}

interface OutputOptions {
  transistorOnResistance?: SlopeOptions;
}
/**
 * Parser from output process.
 * @param text - Original text from the file.
 * @param options - Calculation options.
 * @returns - List of output analysis.
 */
export function fromOutput(text: string, options: OutputOptions = {}) {
  const analysis = new BaseB1505('Vd', 'Id_dens', 'linear');
  analysis.addCalculation('resistanceOn', (val) =>
    transistorOnResistance(val, options.transistorOnResistance),
  );
  return analysis.parseText(text);
}

interface IVOptions {
  diodeOnResistance?: SlopeOptions;
}
/**
 * Parser from IV process.
 * @param text - Original text from the file.
 * @param options - Calculation options.
 * @returns - List of IV analysis.
 */
export function fromIV(text: string, options: IVOptions = {}) {
  const analysis = new BaseB1505('Vd', 'Id_dens', 'linear');
  analysis.addCalculation('resistanceOn', (val) =>
    diodeOnResistance(val, options.diodeOnResistance),
  );
  return analysis.parseText(text);
}

interface CapacitanceOptions {
  capacitanceIntegral?: RangeOptions;
}
/**
 * Parser from capacitance process.
 * @param text - Original text from the file.
 * @param options - Calculation options.
 * @returns - List of capacitance analysis.
 */
export function fromCapacitance(
  text: string,
  options: CapacitanceOptions = {},
) {
  const analysis = new BaseB1505('Vd', 'C_dens', 'linear');
  analysis.addCalculation('capacitanceIntegral', (val) =>
    capacitanceIntegral(val, options.capacitanceIntegral),
  );
  return analysis.parseText(text);
}

/**
 * Parser from MOS capacitance process.
 * @param text - Original text from the file.
 * @param options - Calculation options.
 * @returns - List of MOS capacitance analysis.
 */
export function fromMOSCapacitance(
  text: string,
  options: CapacitanceOptions = {},
) {
  const analysis = new BaseB1505('VBias', 'C_dens', 'linear');
  analysis.addCalculation('capacitanceIntegral', (val) =>
    capacitanceIntegral(val, options.capacitanceIntegral),
  );
  return analysis.parseText(text);
}
