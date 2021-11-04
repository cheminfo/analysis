import { Analysis, MeasurementXY } from 'base-analysis';
import { appendedParser } from 'ndim-parser';

import { appendUnits, getDensities } from './utils';

type Scales = 'linear' | 'log';
type Calculation = (data: MeasurementXY) => unknown;

const enum VarHeadersKeys {
  name = 'Name',
  units = 'Unit',
}
const metaVarHeaders = [
  'Analysis.Setup.Vector.Graph.XAxis',
  'Analysis.Setup.Vector.Graph.YAxis',
  'Analysis.Setup.Vector.List.Datum',
  'Function.User',
];

export function metaUnits(meta: Record<string, string>) {
  let knownUnits: Record<string, string> = {};
  for (const key of metaVarHeaders) {
    const keyName = `${key}.${VarHeadersKeys.name}`;
    const keyUnits = `${key}.${VarHeadersKeys.units}`;
    if (meta[keyName] && meta[keyUnits]) {
      const names = meta[keyName].split(',');
      const units = meta[keyUnits].split(',');
      for (let index = 0; index < names.length; index++) {
        const [label] = getDensities(names[index]);
        if (label === 'Q_dens') {
          // TODO the existing parser doesn't recognize electron charge units
          knownUnits[label] = 'uC/mm';
        } else {
          knownUnits[label] = units[index];
        }
      }
    }
  }
  return knownUnits;
}

export default class BaseB1505 {
  private readonly xLabel: string;
  private readonly yLabel: string;
  private readonly scale: Scales;
  private calculations: Array<[string, Calculation]>;

  public constructor(xLabel: string, yLabel: string, scale: Scales) {
    this.xLabel = xLabel;
    this.yLabel = yLabel;
    this.scale = scale;
    this.calculations = [];
  }

  public addCalculation(name: string, calculation: Calculation) {
    this.calculations.push([name, calculation]);
  }

  private parseMeta(meta: Record<string, string>): Record<string, string> {
    if (!meta) return {};

    let ans: Record<string, string> = {};
    for (const key in meta) {
      ans[key] = meta[key]
        .split(',')
        .filter((val) => val !== '')
        .join(',');
    }

    // add default kind scale
    const { xLabel, yLabel, scale } = this;
    ans['default.xLabel'] = xLabel;
    ans['default.yLabel'] = yLabel;
    ans['default.scale'] = scale;

    return ans;
  }

  public parseText(text: string) {
    const series = appendedParser(text);
    let analyses = [];

    for (const { data, meta } of series) {
      const parsedMeta = this.parseMeta(meta);
      const knownUnits = metaUnits(meta);

      const title =
        parsedMeta.Remarks ||
        parsedMeta['TestRecord.Remarks'] ||
        parsedMeta['Device ID'] ||
        parsedMeta['Setup title'] ||
        parsedMeta.SetupTitle;
      let analysis = new Analysis();
      analysis.pushMeasurement(appendUnits(data, title, knownUnits), {
        meta: parsedMeta,
      });

      for (const [name, calculation] of this.calculations) {
        const spectrum = analysis.getMeasurementXY({
          xLabel: this.xLabel,
          yLabel: this.yLabel,
        });
        if (spectrum) {
          const result = JSON.stringify(calculation(spectrum));
          if (result) {
            if (spectrum.meta) {
              spectrum.meta[name] = result;
            } else {
              spectrum.meta = { [name]: result };
            }
          }
        }
      }
      analyses.push(analysis);
    }

    return analyses;
  }
}
