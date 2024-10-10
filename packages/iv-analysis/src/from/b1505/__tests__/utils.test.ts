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
} from '../index';
import { getLabels } from '../utils';

function testFile(
  name: string,
  func: (text: string) => Analysis[],
  title: string,
  x: string,
  y: string,
) {
  const csv = readFileSync(
    join(__dirname, `../../../../testFiles/B1505/${name}`),
    'latin1',
  );
  const analysis = func(csv)[0];
  const { xLabel, yLabel, units } = getLabels(analysis);

  expect(analysis?.label).toBe(title);
  expect(xLabel).toBe(x);
  expect(yLabel).toBe(y);
  expect(units[xLabel]).toBeDefined();
  expect(units[yLabel]).toBeDefined();
}

describe('Breakdown', () => {
  it('Breakdown', () => {
    testFile(
      'Breakdown/breakdown.csv',
      fromBreakdown,
      '#089_LPCVD_trigate_die_r2c3_W100',
      'Vd',
      'Id_dens',
    );
  });

  it('HEMT Breakdown', () => {
    testFile(
      'Breakdown/HEMT_breakdown.csv',
      fromBreakdown,
      'Breakdown_Lgd15_dummy',
      'Vd',
      'Id_dens',
    );
  });
});

describe('Capacitance', () => {
  it('High voltage', () => {
    testFile(
      'Capacitance/high_voltage.csv',
      fromCapacitance,
      '#Mc_cap_SC_die1_r3c2_WpPl15_capacitance_400V',
      'Vd',
      'C_dens',
    );
  });

  it('MOS capacitance', () => {
    testFile(
      'Capacitance/mos_cap.csv',
      fromMOSCapacitance,
      '#144_Noff_trigate_W30_S50_3qt3',
      'VBias',
      'C',
    );
  });
});

test('IV', () => {
  testFile(
    'IV/sweep.csv',
    fromIV,
    '#141_SBD_TG07_L10_W50_S150',
    'Vd',
    'Id_dens',
  );
  testFile(
    'IV/sweep_diode.csv',
    fromIV,
    '#188_Diode_bridge_W200_S100_L15_D1_big',
    'Vd',
    'Id_dens',
  );
});

describe('Output', () => {
  it('F implant', () => {
    testFile(
      'Output/f_implant.csv',
      fromOutput,
      '#188_F_implant_5nm_cap_die2_r4c1_W70_S70_full',
      'Vd',
      'Id_dens',
    );
  });

  it('lpcvd', () => {
    testFile(
      'Output/lpcvd.csv',
      fromOutput,
      '#089_LPCVD_trigate_die4_r2c2_SFP_W150',
      'Vd',
      'Id_dens',
    );
  });

  it('noff trigate', () => {
    testFile(
      'Output/noff_trigate.csv',
      fromOutput,
      '#144_Noff_trigate_Ni_W20_S50_Lgd25_1qb1',
      'Vd',
      'Id_dens',
    );
  });

  it('Output', () => {
    testFile(
      'Output/output.csv',
      fromOutput,
      '#089_LPCVD_trigate_die4_r2c2_Pl_lgd15',
      'Vd',
      'Id_dens',
    );
  });
});

describe('Transfer', () => {
  it('HEMT transfer', () => {
    testFile(
      'Transfer/hemt_transfer.csv',
      fromTransfer,
      '#089_LPCVD_trigate_die3_r1c3_SFP_W100',
      'Vg',
      'Id_dens',
    );
  });

  it('noff trigate', () => {
    testFile(
      'Transfer/noff_trigate.csv',
      fromTransfer,
      '#144_Noff_trigate_W15_S50_L1500_1qb_6_transfer',
      'Vg',
      'Id_dens',
    );
  });
});
