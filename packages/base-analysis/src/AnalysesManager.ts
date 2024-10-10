import { Analysis } from './Analysis';
import { CounterType, DifferentType } from './types/types';
import { appendDistinctParameter } from './util/appendDistinctParameter';
import { appendDistinctValue } from './util/appendDistinctValue';

interface GetAnalysesOptions {
  ids?: string[];
}

export class AnalysesManager {
  public analyses: Analysis[];

  public constructor() {
    this.analyses = [];
  }

  public addAnalysis(analysis: Analysis) {
    const index = this.getAnalysisIndex(analysis.id);
    if (index === undefined) {
      this.analyses.push(analysis);
    } else {
      this.analyses[index] = analysis;
    }
  }

  public getAnalyses(options: GetAnalysesOptions = {}) {
    const { ids } = options;
    const analyses: Analysis[] = [];
    for (const analysis of this.analyses) {
      if (!ids || ids.includes(analysis.id)) {
        analyses.push(analysis);
      }
    }
    return analyses;
  }

  public getMeasurements() {
    const measurements = [];
    for (const analysis of this.analyses) {
      measurements.push(...analysis.measurements);
    }
    return measurements;
  }

  public getAnalysisByMeasurementId(id: string) {
    for (const analysis of this.analyses) {
      for (const measurement of analysis.measurements) {
        if (measurement.id === id) return analysis;
      }
    }
    return undefined;
  }

  public getMeasurementById(id: string) {
    for (const analysis of this.analyses) {
      for (const measurement of analysis.measurements) {
        if (measurement.id === id) return measurement;
      }
    }
    return undefined;
  }

  /**
   * Get an array of objects (key + count) of all the titles.
   */
  public getDistinctTitles() {
    const values: Record<string, CounterType> = {};
    for (const measurement of this.getMeasurements()) {
      if (measurement.title) {
        appendDistinctValue(values, measurement.title);
      }
    }
    return Object.keys(values).map((key) => values[key]);
  }

  /**
   * Get an array of objects (key + count) of all the units.
   */
  public getDistinctUnits() {
    const values: Record<string, CounterType> = {};
    for (const measurement of this.getMeasurements()) {
      if (measurement.variables) {
        for (const [, variable] of Object.entries(measurement.variables)) {
          const units = variable.units?.replace(/\s+\[.*/, '');
          if (units) {
            appendDistinctValue(values, units);
          }
        }
      }
    }
    return Object.keys(values).map((key) => values[key]);
  }

  /**
   * Get an array of objects (key + unit + label + count) of all the units
   */
  public getDistinctLabelUnits() {
    const values: Record<
      string,
      { key: string; units: string; label: string; count: number }
    > = {};
    for (const spectrum of this.getMeasurements()) {
      if (spectrum.variables) {
        for (const [, variable] of Object.entries(spectrum.variables)) {
          const { label, units } = normalizeLabelUnits(
            variable.label,
            variable.units,
          );
          const key = label + (units ? ` (${units})` : '');
          if (key) {
            if (!values[key]) {
              values[key] = { key, units, label, count: 0 };
            }
            values[key].count++;
          }
        }
      }
    }
    return Object.keys(values).map((key) => values[key]);
  }

  /**
   * Get an array of objects (key + count) of all the labels.
   */
  public getDistinctLabels() {
    const values: Record<string, CounterType> = {};
    for (const measurement of this.getMeasurements()) {
      if (measurement.variables) {
        for (const [, variable] of Object.entries(measurement.variables)) {
          appendDistinctValue(values, variable.label.replace(/\s+\[.*/, ''));
        }
      }
    }
    return Object.keys(values).map((key) => values[key]);
  }

  /**
   * Get an array of objects (key + count) of all the dataTypes.
   */
  public getDistinctDataTypes() {
    const values: Record<string, CounterType> = {};
    for (const measurement of this.getMeasurements()) {
      if (measurement.dataType) {
        appendDistinctValue(values, measurement.dataType);
      }
    }
    return Object.keys(values).map((key) => values[key]);
  }

  /**
   * Get an array of objects (key + count) of all the meta.
   */
  public getDistinctMeta() {
    const values: Record<string, DifferentType> = {};
    for (const measurement of this.getMeasurements()) {
      if (measurement.meta) {
        for (const key in measurement.meta) {
          appendDistinctParameter(values, key, measurement.meta[key]);
        }
      }
    }
    return Object.keys(values).map((key) => values[key]);
  }

  public removeAllAnalyses() {
    this.analyses.splice(0);
  }

  /**
   * Remove the analysis from the AnalysesManager for the specified id.
   * @param id
   */
  public removeAnalysis(id: string) {
    const index = this.getAnalysisIndex(id);
    if (index === undefined) return undefined;
    return this.analyses.splice(index, 1);
  }

  /**
   * Returns the index of the analysis in the analyses array.
   * @param id
   */
  public getAnalysisIndex(id: string) {
    if (!id) return undefined;
    for (let i = 0; i < this.analyses.length; i++) {
      const analysis = this.analyses[i];
      if (analysis.id === id) return i;
    }
    return undefined;
  }

  /**
   * Checks if the ID of an analysis exists in the AnalysesManager.
   * @param id
   */
  public includes(id: string) {
    const index = this.getAnalysisIndex(id);
    return index === undefined ? false : !isNaN(index);
  }
}

function normalizeLabelUnits(
  originalLabel: string,
  originalUnits: string,
): { units: string; label: string } {
  if (!originalLabel) {
    return { units: '', label: '' };
  }
  if (originalLabel.search(/[[(]]/) >= 0) {
    const [units, label] = originalLabel.split(/\s*[[(]/);
    return { units: originalUnits || units, label };
  }
  return { label: originalLabel, units: originalUnits };
}
