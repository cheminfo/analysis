import type { AxisProps, LineSeriesProps, PlotObjectPlot } from 'react-plot';

import { Analysis } from '../Analysis';
import { MeasurementSelector } from '../types/MeasurementSelector';

type LineSeriesType = { type: 'line' } & LineSeriesProps;

export type ReactPlotOptions = Omit<
  PlotObjectPlot,
  'axes' | 'content' | 'dimensions'
> & {
  enforceGrowing?: boolean;
  xAxis?: Partial<AxisProps>;
  yAxis?: Partial<AxisProps>;
  content?: Partial<LineSeriesProps>;
  dimensions?: PlotObjectPlot['dimensions'];
};

/**
 * Parses from {x[], y[]} to [{x,y}].
 */
interface DataXY {
  x: number;
  y: number;
}

type ListNumber = number[] | Float64Array;

/**
 * Transforms a list of numbers into a list of objects with x and y properties.
 *
 * @param x - List of x values.
 * @param y - List of y values.
 * @returns array of x-y objects
 */
function getData(x: ListNumber, y: ListNumber) {
  let data: DataXY[] = new Array(x.length);
  for (let i = 0; i < x.length; i++) {
    data[i] = { x: x[i], y: y[i] };
  }
  return data;
}

/**
 * Generate a react-plot chart format from an array of Analysis.
 *
 * @param analyses - An array of Analysis objects.
 * @param query - Object with keys for each measurement selector.
 * @param options - Options for the plot.
 * @returns properties for a react-plot chart
 */
export function getReactPlotJSON(
  analyses: Analysis[],
  query: MeasurementSelector,
  options: ReactPlotOptions = {},
): PlotObjectPlot & { meta: Record<string, string>[] } {
  const {
    enforceGrowing = false,
    xAxis: xAxisOptions = {},
    yAxis: yAxisOptions = {},
    content: seriesOptions = { displayMarker: true },
    dimensions = { width: 550, height: 500 },
    ...otherOptions
  } = options;
  let content: PlotObjectPlot['content'] = [];
  let meta: Record<string, string>[] = [];
  type Axes = { type: 'main' } & AxisProps;
  let xAxis: Axes | null = null;
  let yAxis: Axes | null = null;

  for (const analysis of analyses) {
    let measurements = enforceGrowing
      ? analysis.getNormalizedMeasurement({
          selector: query,
          normalization: {
            filters: [{ name: 'ensureGrowing' }],
            keepYUnits: true,
          },
        })
      : analysis.getMeasurementXY(query);
    if (!measurements) continue;
    if (measurements.meta) meta.push(measurements.meta);

    const { x, y } = measurements.variables;
    xAxis = {
      id: 'x',
      label: x.label + (x.units ? ` [${x.units}]` : ''),
      ...xAxisOptions,
      position: 'bottom',
      type: 'main',
    };
    yAxis = {
      id: 'y',
      label: y.label + (y.units ? ` [${y.units}]` : ''),
      ...yAxisOptions,
      position: 'left',
      type: 'main',
    };

    const data = getData(x.data, y.data);
    const series: LineSeriesType = {
      type: 'line',
      label: measurements.description,
      data,
      ...seriesOptions,
    };
    content.push(series);
  }

  if (xAxis === null || yAxis === null) {
    throw new Error('The axes were not defined');
  }

  return {
    content,
    axes: [xAxis, yAxis],
    dimensions,
    meta,
    ...otherOptions,
  };
}
