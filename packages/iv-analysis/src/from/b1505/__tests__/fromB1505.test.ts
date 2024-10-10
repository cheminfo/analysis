import { readFileSync } from 'fs';
import { join } from 'path';

import { Analysis } from 'base-analysis';

import {
  fromBreakdown,
  fromCapacitance,
  fromIV,
  fromOutput,
  fromTransfer,
  fromMOSCapacitance,
  fromB1505,
} from '../index';

function testFile(
  name: string,
  func: (text: string) => Analysis[],
  length: number,
  title: string,
) {
  const csv = readFileSync(
    join(__dirname, `../../../../testFiles/B1505/${name}`),
    'latin1',
  );
  const analyses = func(csv);
  for (const analysis of analyses) {
    const { 'default.xLabel': xLabel, 'default.yLabel': yLabel } =
      analysis.measurements[0]?.meta || {};
    const measurement = analysis.getMeasurementXY({
      x: { label: xLabel },
      y: { label: yLabel },
    });

    expect(analysis?.label).toBe(title);

    expect(measurement?.variables.x.data).toHaveLength(length);
    expect(measurement?.variables.x.label).toStrictEqual(xLabel);

    expect(measurement?.variables.y.data).toHaveLength(length);
    expect(measurement?.variables.y.label).toStrictEqual(yLabel);
  }
}

describe('Automatic labels selection', () => {
  it('Breakdown', () => {
    const csv = readFileSync(
      join(__dirname, '../../../../testFiles/B1505/Breakdown/breakdown.csv'),
      'latin1',
    );
    const analyses = fromB1505(csv);
    expect(analyses[0].measurements[0].variables.x.label).toBe('Vd');
    expect(analyses[0].measurements[0].variables.d?.label).toBe('Id_dens');
  });

  it('Capacitance', () => {
    const csv = readFileSync(
      join(
        __dirname,
        '../../../../testFiles/B1505/Capacitance/high_voltage.csv',
      ),
      'latin1',
    );
    const analyses = fromB1505(csv);
    expect(analyses[0].measurements[0].variables.x.label).toBe('Vd');
    expect(analyses[0].measurements[0].variables.y.label).toBe('C_dens');
  });
});

describe('Breakdown', () => {
  it('Breakdown', () => {
    testFile(
      'Breakdown/breakdown.csv',
      fromBreakdown,
      119,
      '#089_LPCVD_trigate_die_r2c3_W100',
    );
  });

  it('Multiple breakdown', () => {
    const csv = readFileSync(
      join(
        __dirname,
        '../../../../testFiles/B1505/Breakdown/multiple_breakdown.csv',
      ),
      'latin1',
    );
    const analyses = fromBreakdown(csv);
    expect(analyses).toHaveLength(164);
  });

  it('HEMT Breakdown', () => {
    testFile(
      'Breakdown/HEMT_breakdown.csv',
      fromBreakdown,
      407,
      'Breakdown_Lgd15_dummy',
    );
  });
});

describe('Capacitance', () => {
  it('High voltage', () => {
    testFile(
      'Capacitance/high_voltage.csv',
      fromCapacitance,
      1000,
      '#Mc_cap_SC_die1_r3c2_WpPl15_capacitance_400V',
    );
  });

  it('MOS capacitance', () => {
    testFile(
      'Capacitance/mos_cap.csv',
      fromMOSCapacitance,
      1000,
      '#144_Noff_trigate_W30_S50_3qt3',
    );
  });
});

test('IV', () => {
  testFile('IV/sweep.csv', fromIV, 200, '#141_SBD_TG07_L10_W50_S150');
  testFile(
    'IV/sweep_diode.csv',
    fromIV,
    200,
    '#188_Diode_bridge_W200_S100_L15_D1_big',
  );
});

describe('Output', () => {
  it('F implant', () => {
    testFile(
      'Output/f_implant.csv',
      fromOutput,
      3207,
      '#188_F_implant_5nm_cap_die2_r4c1_W70_S70_full',
    );
  });

  it('lpcvd', () => {
    testFile(
      'Output/lpcvd.csv',
      fromOutput,
      200,
      '#089_LPCVD_trigate_die4_r2c2_SFP_W150',
    );
  });

  it('noff trigate', () => {
    testFile(
      'Output/noff_trigate.csv',
      fromOutput,
      300,
      '#144_Noff_trigate_Ni_W20_S50_Lgd25_1qb1',
    );
  });

  it('Output', () => {
    testFile(
      'Output/output.csv',
      fromOutput,
      200,
      '#089_LPCVD_trigate_die4_r2c2_Pl_lgd15',
    );
  });
});

describe('Transfer', () => {
  it('HEMT transfer', () => {
    testFile(
      'Transfer/hemt_transfer.csv',
      fromTransfer,
      200,
      '#089_LPCVD_trigate_die3_r1c3_SFP_W100',
    );
  });

  it('noff trigate', () => {
    testFile(
      'Transfer/noff_trigate.csv',
      fromTransfer,
      200,
      '#144_Noff_trigate_W15_S50_L1500_1qb_6_transfer',
    );
  });
});
