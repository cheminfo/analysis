import { Analysis, fromJcamp, JSGraph, toJcamp } from '..';

test('index', () => {
  const analysis = new Analysis();
  expect(analysis.id).toHaveLength(36);

  analysis.pushMeasurement(
    {
      x: {
        data: [1, 2],
        isMonotonic: 1,
        min: 1,
        max: 2,
        units: 'xUnits',
        label: 'X axis',
      },
      y: {
        data: [3, 4],
        min: 3,
        max: 4,
        units: 'yUnits',
        label: 'Y axis',
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

  const firstMeasurement = analysis.getMeasurementXY();

  expect(firstMeasurement?.variables.x.data).toStrictEqual([1, 2]);
  expect(firstMeasurement?.variables.y.data).toStrictEqual([3, 4]);

  const normalizedMeasurement = analysis.getNormalizedMeasurement({
    normalization: {
      filters: [{ name: 'normed' }],
    },
  });
  expect(
    (normalizedMeasurement?.variables?.y?.data?.[0] || 0) +
      (normalizedMeasurement?.variables?.y?.data?.[1] || 0),
  ).toBeCloseTo(1, 10);

  const undefinedMeasurement = analysis.getMeasurementXY({ x: { units: 'J' } });
  expect(undefinedMeasurement).toBeUndefined();

  const inverted = analysis.getMeasurementXY({
    x: { units: 'yUnits' },
    y: { units: 'xUnits' },
  });
  expect(inverted?.variables.x.data).toStrictEqual([3, 4]);
  expect(inverted?.variables.y.data).toStrictEqual([1, 2]);

  const jsgraph = JSGraph.getJSGraph([analysis]);
  expect(jsgraph.series[0].data).toStrictEqual({ x: [1, 2], y: [3, 4] });

  const jcamp = toJcamp(analysis, {
    info: {
      owner: 'cheminfo',
      origin: 'Common MeasurementXY',
    },
  });

  const analysis2 = fromJcamp(jcamp);

  expect(analysis2.measurements[0]).toMatchCloseTo({
    variables: {
      x: {
        data: [1, 2],
        isMonotonic: 1,
        min: 1,
        max: 2,
        units: 'xUnits',
        label: 'X axis',
        symbol: 'X',
      },
      y: {
        data: [3, 4],
        isMonotonic: 1,
        min: 3,
        max: 4,
        units: 'yUnits',
        label: 'Y axis',
        symbol: 'Y',
      },
    },
    title: 'My measurement',
    dataType: 'TGA',
    meta: { meta1: 'Meta 1', meta2: 'Meta 2' },
  });
});
