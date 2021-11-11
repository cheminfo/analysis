import { Value } from 'cheminfo-types';
import type { RegressionScore } from 'ml-regression-base';

export interface SlopeResult {
  slope: Value;
  score: RegressionScore;
  toIndex: number;
  fromIndex: number;
}

export interface SlopeOptions {
  delta?: number;
  fromIndex?: number;
  toIndex?: number;
}

export interface ThresholdVoltageOptions {
  threshold?: number;
}

export interface ThresholdVoltageResult extends Value {
  index: number;
}

export interface MedianSlopeResult {
  medianSlope: Value;
  toIndex: number;
  fromIndex: number;
}

export interface IntegralOptions {
  fromIndex?: number;
  toIndex?: number;
}

export interface IntegralResult {
  integral: Value;
  fromIndex: number;
  toIndex: number;
}
