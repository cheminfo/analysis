import type { RegressionScore } from 'ml-regression-base';

export interface SlopeResult {
  slope: number;
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

export interface ThresholdVoltageResult {
  index: number;
  value: number;
}

export interface MedianSlopeResult {
  medianSlope: number;
  toIndex: number;
  fromIndex: number;
}

export interface IntegralOptions {
  fromIndex?: number;
  toIndex?: number;
}

export interface IntegralResult {
  integral: number;
  fromIndex: number;
  toIndex: number;
}
