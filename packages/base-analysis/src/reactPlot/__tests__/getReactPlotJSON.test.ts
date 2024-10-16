import { Analysis } from '../..';
import { getReactPlotJSON } from '../getReactPlotJSON';

const measurements = {
  variables: {
    x: {
      data: [1, 2],
      units: 'V',
      label: 'Voltage',
    },
    y: {
      data: [0.5, 0.2],
      units: 'A',
      label: 'Current',
    },
    z: {
      data: [5, 6],
      units: '°C',
      label: 'Temperature',
    },
    t: {
      data: [7, 8],
      units: 's',
      label: 'Time',
    },
  },
};

test('simple test case', () => {
  const len = 3;
  const analyses = new Array(len);
  for (let i = 0; i < len; i++) {
    analyses[i] = new Analysis();
    analyses[i].pushMeasurement(measurements.variables, {
      title: `Vg = ${i + 3}`,
    });
  }

  // ignored value
  analyses.push(new Analysis());

  const result = getReactPlotJSON(analyses, {
    x: { label: 'Voltage', units: 'V' },
    y: { label: 'Current', units: 'A' },
  });
  expect(result.content).toHaveLength(len);
  expect(result.axes).toStrictEqual([
    { id: 'x', label: 'Voltage [V]', position: 'bottom', type: 'main' },
    {
      id: 'y',
      label: 'Current [A]',
      position: 'left',
      type: 'main',
    },
  ]);
});

test('enforce growing', () => {
  const len = 3;
  const analyses = new Array(len);
  for (let i = 0; i < len; i++) {
    analyses[i] = new Analysis();
    analyses[i].pushMeasurement(measurements.variables, {
      title: `Vg = ${i + 3}`,
    });
  }

  // ignored value
  analyses.push(new Analysis());

  const result = getReactPlotJSON(
    analyses,
    {
      x: { label: 'Voltage', units: 'kV' },
      y: { label: 'Current', units: 'mA' },
    },
    { enforceGrowing: true },
  );
  expect(result.content).toHaveLength(len);
  expect(result.axes).toStrictEqual([
    { id: 'x', label: 'Voltage [kV]', position: 'bottom', type: 'main' },
    {
      id: 'y',
      label: 'Current [mA]',
      position: 'left',
      type: 'main',
    },
  ]);
});
