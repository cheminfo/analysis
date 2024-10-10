import { Analysis, fromJcamp, JSGraph, toJcamp, toJcamps } from '..';

describe('case for ntuples', () => {
  const analysis = new Analysis();

  analysis.pushMeasurement(
    {
      x: {
        data: [1, 2],
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
      t: {
        data: [5, 6],
        min: 5,
        max: 6,
        units: 'tUnits',
        label: 'T axis',
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

  it('Check analysis ID', () => {
    expect(analysis.id).toHaveLength(36);
  });

  it('First measurement', () => {
    const firstMeasurement = analysis.getMeasurementXY();

    expect(firstMeasurement?.variables.x.data).toStrictEqual([1, 2]);
    expect(firstMeasurement?.variables.y.data).toStrictEqual([3, 4]);

    const normalized = analysis.getNormalizedMeasurement({
      normalization: {
        filters: [{ name: 'normed' }],
      },
    })?.variables;
    expect(
      (normalized?.y?.data?.[0] || 0) + (normalized?.y?.data?.[1] || 0),
    ).toBeCloseTo(1, 10);
  });

  it('MeasurementXY by units', () => {
    const selector = {
      x: { units: 'tUnits' },
      y: { units: 'xUnits' },
    };
    const measurement = analysis.getMeasurementXY(selector);
    expect(measurement?.variables.x.data).toStrictEqual([5, 6]);
    expect(measurement?.variables.y.data).toStrictEqual([1, 2]);

    const jsgraph = JSGraph.getJSGraph([analysis], { selector });
    expect(jsgraph.series[0].data).toStrictEqual({ x: [5, 6], y: [1, 2] });

    const jcamps = toJcamps(analysis, {
      info: {
        owner: 'cheminfo',
        origin: 'Common MeasurementXY',
      },
    });

    expect(jcamps).toHaveLength(1);

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
          symbol: 'x',
          isDependent: false,
          dim: 2,
          units: 'xUnits',
          data: [1, 2],
          isMonotonic: 1,
          min: 1,
          max: 2,
          label: 'X axis',
          first: 1,
          last: 2,
        },
        y: {
          symbol: 'y',
          isDependent: true,
          dim: 2,
          units: 'yUnits',
          isMonotonic: 1,
          min: 3,
          max: 4,
          data: [3, 4],
          label: 'Y axis',
          first: 3,
          last: 4,
        },
        t: {
          symbol: 't',
          isDependent: true,
          dim: 2,
          units: 'tUnits',
          isMonotonic: 1,
          min: 5,
          max: 6,
          data: [5, 6],
          label: 'T axis',
          first: 5,
          last: 6,
        },
      },
      title: 'My measurement',
      dataType: 'TGA',
      meta: { meta1: 'Meta 1', meta2: 'Meta 2' },
    });
  });
});
