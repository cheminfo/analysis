import { readFileSync } from 'fs';
import { join } from 'path';

import { Analysis, JSGraph, fromJcamp } from '../..';

test('getJSGraph', () => {
  let analysis = new Analysis();
  expect(analysis.id).toHaveLength(36);

  analysis.pushMeasurement(
    {
      x: {
        data: [-1, 1, 2],
        units: 'xUnits',
        label: 'X axis (xUnits)',
      },
      y: {
        data: [2, 3, 4],
        units: 'yUnits',
        label: 'Y axis [yUnits]',
      },
    },
    {
      title: 'My measurement',
      dataType: 'TGA',
      meta: {
        meta1: 'Meta 1',
        meta2: 'Meta 2',
      },
    },
  );

  const jsgraph = JSGraph.getJSGraph([analysis], {
    normalization: { filters: [{ name: 'multiply', options: { value: 100 } }] },
    xAxis: {
      logScale: true,
    },
  });

  delete jsgraph.series[0].name;

  expect(jsgraph).toMatchSnapshot();
});

describe('getJSGraph isotherm', () => {
  const jcamp = readFileSync(
    join(__dirname, '../../from/__tests__/data/isotherm.jdx'),
  );
  let analysis = fromJcamp(jcamp);
  it('distinctLabelUnits', () => {
    const jsgraph = JSGraph.getJSGraph([analysis], {
      selector: { xLabel: '', yLabel: '' },
    });
    //@ts-expect-error Would be fixed if typed was correctly defined
    expect(jsgraph.series[0].data.x).toHaveLength(68);
  });
});
