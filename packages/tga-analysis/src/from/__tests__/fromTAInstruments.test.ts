import { readFileSync } from 'fs';
import { join } from 'path';

import { toJcamp } from 'base-analysis';

import { fromTAInstruments } from '../fromTAInstruments';

describe('fromTAInstruments', () => {
  it('TAInstruments.txt', () => {
    const file = readFileSync(
      join(__dirname, '../../../testFiles/TAInstruments.txt'),
    );

    const analysis = fromTAInstruments(file);

    const jcamp = toJcamp(analysis)
      .split(/\r?\n/)
      .filter((line) => /##UNIT|##VAR_TYPE|##SYMBOL|##VAR_NAME/.exec(line));

    expect(jcamp).toStrictEqual([
      '##VAR_NAME=  Program temperature,Weight,Time',
      '##SYMBOL=    x,y,t',
      '##VAR_TYPE=  DEPENDENT,DEPENDENT,INDEPENDENT',
      '##UNITS=     °C,mg,min',
    ]);

    const measurement = analysis.getMeasurementXY();

    if (!measurement?.meta) {
      throw new Error('could not retrieve measurement with meta');
    }
    expect(Object.keys(measurement.variables)).toStrictEqual(['x', 'y']);

    expect(measurement.meta.sampleName).toBe('Cryo1-1_N1-2@25C');
    expect(measurement.title).toBe('Cryo1-1_N1-2@25C');
    expect(measurement.variables.x.data[0]).toBe(22.70189);
    expect(measurement.variables.x.data).toHaveLength(15577);
    expect(measurement.variables.x.data[15576]).toBe(25.00298);
    expect(measurement.variables.y.data).toHaveLength(15577);
    expect(measurement.meta.methodSteps).toHaveLength(10);
  });

  it('mof.txt', () => {
    const file = readFileSync(join(__dirname, '../../../testFiles/mof.txt'));

    const analysis = fromTAInstruments(file);

    const jcamp = toJcamp(analysis)
      .split(/\r?\n/)
      .filter((line) => /##UNIT|##VAR_TYPE|##SYMBOL|##VAR_NAME/.exec(line));

    expect(jcamp).toStrictEqual([
      '##VAR_NAME=  Program temperature,Weight,Time',
      '##SYMBOL=    x,y,t',
      '##VAR_TYPE=  DEPENDENT,DEPENDENT,INDEPENDENT',
      '##UNITS=     °C,mg,min',
    ]);

    const measurement = analysis.getMeasurementXY();
    if (!measurement?.meta) {
      throw new Error('could not retrieve measurement with meta');
    }

    expect(Object.keys(measurement.variables)).toStrictEqual(['x', 'y']);

    expect(measurement.meta.sampleName).toBe('Fe-BTC Grade A act');
    expect(measurement.title).toBe('Fe-BTC Grade A act');
    expect(measurement.variables.x.data[0]).toBe(46.87907);
    expect(measurement.variables.x.data).toHaveLength(18995);
    expect(measurement.variables.x.data[18994]).toBe(797.8466);
    expect(measurement.variables.y.data).toHaveLength(18995);
    expect(measurement.meta.methodSteps).toHaveLength(3);
  });
});
