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

export function fromBreakdown(text: string) {
  const analysis = new BaseB1505('Vd', 'Id_dens', 'log');
  analysis.addCalculation('thresholdVoltage', thresholdVoltage);
  return analysis.parseText(text);
}

export function fromTransfer(text: string) {
  const analysis = new BaseB1505('Vg', 'Id_dens', 'log');
  analysis.addCalculation('thresholdVoltage', thresholdVoltage);
  analysis.addCalculation('subthresholdSlope', subthresholdSlope);
  return analysis.parseText(text);
}

export function fromOutput(text: string) {
  const analysis = new BaseB1505('Vd', 'Id_dens', 'linear');
  analysis.addCalculation('resistanceOn', transistorOnResistance);
  return analysis.parseText(text);
}

export function fromIV(text: string) {
  const analysis = new BaseB1505('Vd', 'Id_dens', 'linear');
  analysis.addCalculation('resistanceOn', diodeOnResistance);
  return analysis.parseText(text);
}

export function fromCapacitance(text: string) {
  const analysis = new BaseB1505('Vd', 'C_dens', 'linear');
  analysis.addCalculation('capacitanceIntegral', capacitanceIntegral);
  return analysis.parseText(text);
}

export function fromMOSCapacitance(text: string) {
  const analysis = new BaseB1505('VBias', 'C_dens', 'linear');
  analysis.addCalculation('capacitanceIntegral', capacitanceIntegral);
  return analysis.parseText(text);
}
