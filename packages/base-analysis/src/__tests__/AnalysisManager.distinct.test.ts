import { readFileSync } from 'fs';
import { join } from 'path';

import { Analysis, AnalysesManager, fromJcamp } from '..';

describe('AnalysesManager test', () => {
  let analysis1 = new Analysis();
  analysis1.pushMeasurement(
    {
      x: {
        data: [1, 2],
        min: 1,
        max: 2,
        units: 'xUnits',
        label: 'X axis [xUnits]',
      },
      y: {
        data: [3, 4],
        min: 3,
        max: 4,
        units: 'yUnits',
        label: 'Y axis [yUnits]',
      },
      t: {
        data: [5, 6],
        min: 5,
        max: 6,
        units: 'tUnits',
        label: 'T axis [tUnits]',
      },
    },
    {
      description: 'My measurement',
      dataType: 'TGA',
      meta: {
        meta1: 'Meta 1',
        meta2: 'Meta 2',
      },
    },
  );

  let analysis2 = new Analysis();
  analysis2.pushMeasurement(
    {
      x: {
        data: [1, 2],
        min: 1,
        max: 2,
        units: 'xUnits2',
        label: 'X axis2 [xUnits]',
      },
      y: {
        data: [3, 4],
        min: 3,
        max: 4,
        units: 'yUnits2',
        label: 'Y axis [yUnits]',
      },
      t: {
        data: [5, 6],
        min: 5,
        max: 6,
        units: 'tUnits',
        label: 'T axis [tUnits]',
      },
    },
    {
      description: 'My measurement 2',
      dataType: 'TGA',
      meta: {
        meta1: 'Meta2 1',
        meta3: 'Meta 3',
      },
    },
  );

  let analysis3 = new Analysis();
  analysis3.pushMeasurement(
    {
      x: {
        data: [1, 2],
        min: 1,
        max: 2,
        units: 'xUnits2',
        label: 'X axis2 [xUnits]',
      },
      y: {
        data: [3, 4],
        min: 3,
        max: 4,
        units: 'yUnits2',
        label: 'Y axis [yUnits]',
      },
    },
    {
      description: 'My measurement',
      dataType: 'TGA',
      meta: {
        meta1: 'Meta2 1',
        meta3: 'Meta 3',
      },
    },
  );

  const analysesManager = new AnalysesManager();
  analysesManager.addAnalysis(analysis1);
  analysesManager.addAnalysis(analysis2);
  analysesManager.addAnalysis(analysis3);

  it('getDistinctTitles', () => {
    let titles = analysesManager.getDistinctTitles();
    expect(titles).toHaveLength(2);
  });

  it('getDistinctDataTypes', () => {
    let dataTypes = analysesManager.getDistinctDataTypes();
    expect(dataTypes).toHaveLength(1);
  });

  it('getDistinctMeta', () => {
    let meta = analysesManager.getDistinctMeta();
    expect(meta).toHaveLength(3);
  });

  it('getDistinctUnits', () => {
    let units = analysesManager.getDistinctUnits();
    expect(units).toHaveLength(5);
  });

  it('getDistinctLabels', () => {
    let labels = analysesManager.getDistinctLabels();
    expect(labels).toHaveLength(4);
  });

  it('getDistinctLabelUnits', () => {
    let labels = analysesManager.getDistinctLabelUnits();
    expect(labels).toHaveLength(5);
    expect(labels[2]).toStrictEqual({
      key: 'T axis (tUnits)',
      units: 'tUnits',
      label: 'T axis',
      count: 2,
    });
  });
});

describe('AnalysesManager isotherm', () => {
  const jcamp = readFileSync(
    join(__dirname, '../from/__tests__/data/isotherm.jdx'),
  );
  let analysis = fromJcamp(jcamp);
  let analysesManager = new AnalysesManager();
  analysesManager.addAnalysis(analysis);
  it('distinctLabelUnits', () => {
    const distinctLabelUnits = analysesManager.getDistinctLabelUnits();
    expect(distinctLabelUnits).toHaveLength(3);
  });
});
