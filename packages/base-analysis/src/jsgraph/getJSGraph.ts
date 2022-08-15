import { xyFilterXPositive } from 'ml-spectra-processing';

import { Analysis } from '../Analysis';
import { MeasurementNormalizationOptions } from '../types/MeasurementNormalizationOptions';
import { MeasurementSelector } from '../types/MeasurementSelector';

import { addStyle } from './addStyle';
import { COLORS } from './colors';

interface JSGraphAxisOptions {
  /**
   * Change the scale to logarithmic.
   *
   * @default false
   */
  logScale?: boolean;
  flipped?: boolean;
  display?: boolean;
  label?: string;
  units?: string;
}

interface JSGraphOptions {
  colors?: string[];
  opacities?: number[];
  linesWidth?: number[];
  selector?: MeasurementSelector;
  normalization?: MeasurementNormalizationOptions;
  xAxis?: JSGraphAxisOptions;
  yAxis?: JSGraphAxisOptions;
  /**
   * Define when we should change the color
   * Either per measurement, analysis, both or auto
   */
  colorChange?: 'measurement' | 'analysis' | 'both' | 'auto';
}
/**
 * Generate a jsgraph chart format from an array of Analysis.
 *
 * @param analyses
 * @param options
 */
export function getJSGraph(analyses: Analysis[], options: JSGraphOptions = {}) {
  const {
    colors = COLORS,
    opacities = [1],
    linesWidth = [1],
    selector = {},
    normalization,
    xAxis = {},
    yAxis = {},
    colorChange = 'auto',
  } = options;
  let series = [];

  let xLabel = xAxis.label;
  let yLabel = yAxis.label;
  let xUnits = xAxis.units;
  let yUnits = yAxis.units;

  let colorIndex = 0;

  for (let i = 0; i < analyses.length; i++) {
    const analysis = analyses[i];

    let measurements = analysis.getNormalizedMeasurements({
      selector,
      normalization,
    });
    if (measurements.length === 0) continue;
    const firstMeasurement = measurements[0];

    // todo: if many spectra are available and not xUnits / yUnits are specified we should ensure that all the3 spectra are compatible

    if (!xLabel) xLabel = firstMeasurement.variables.x.label;
    if (!yLabel) yLabel = firstMeasurement.variables.y.label;
    if (!xUnits) xUnits = firstMeasurement.variables.x.units;
    if (!yUnits) yUnits = firstMeasurement.variables.y.units;

    for (const measurement of measurements) {
      let serie: Record<string, unknown> = {};
      addStyle(serie, analysis, {
        color: colors[colorIndex % colors.length],
        opacity: opacities[i % opacities.length],
        lineWidth: linesWidth[i % linesWidth.length],
      });
      serie.data = {
        x: measurement.variables.x.data,
        y: measurement.variables.y.data,
      };

      if (xAxis.logScale) {
        // TODO: check if data can always exist.
        // @ts-expect-error Something wrong here.
        serie.data = xyFilterXPositive(serie.data);
      }
      const name = [];
      if (analyses.length > 1) {
        name.push(analysis.label);
      }
      if (analyses.length === 1 || measurements.length > 1) {
        name.push(measurement.variables.y.label);
      }
      serie.name = name.join(' - ');
      series.push(serie);

      if (colorChange === 'both' || colorChange === 'measurement') colorIndex++;
      if (colorChange === 'auto' && analyses.length === 1) colorIndex++;
    }
    if (colorChange === 'analysis') colorIndex++;
    if (colorChange === 'auto' && analyses.length > 1) colorIndex++;
  }
  return {
    axes: {
      x: {
        label: xLabel,
        unit: xUnits,
        unitWrapperBefore: '(',
        unitWrapperAfter: ')',
        flipped: false,
        display: true,
        ...xAxis,
      },
      y: {
        label: yLabel,
        unit: yUnits,
        unitWrapperBefore: '(',
        unitWrapperAfter: ')',
        flipped: false,
        display: true,
        ...yAxis,
      },
    },
    series,
  };
}
