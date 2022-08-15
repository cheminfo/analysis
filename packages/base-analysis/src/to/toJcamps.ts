import type { MeasurementXY } from 'cheminfo-types';
import { fromVariables } from 'convert-to-jcamp';

import { Analysis } from '../Analysis';

interface GetJcampOptions {
  info?: Record<string, string>;
  meta?: Record<string, string>;
}
/**
 * Converts an analysis to an array of jcamp string. Each measurement will be in a different jcamp string
 *
 * @param analysis
 * @param options
 * @returns array of jcamp strings
 */
export function toJcamps(analysis: Analysis, options: GetJcampOptions = {}) {
  let jcamps = [];
  for (let measurement of analysis.measurements) {
    jcamps.push(getJcamp(measurement, options));
  }
  return jcamps;
}

/**
 * @param measurement
 * @param options
 */
function getJcamp(measurement: MeasurementXY, options: GetJcampOptions) {
  const { info = {}, meta = {} } = options;

  let jcampOptions = {
    options: {},
    info: {
      title: measurement.title,
      dataType: measurement.dataType,
      ...info,
    },
    meta: { ...measurement.meta, ...meta },
  };

  return fromVariables(measurement.variables, jcampOptions);
}
