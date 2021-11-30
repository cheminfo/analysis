/**
 * @typedef {Object} Peak
 * @property {number} wavenumber
 * @property {number} transmittance
 * @property {number} absorbance
 * @property {number} kind
 * @property {number} assignment
 */

/**
 * Creates annotations for jsgraph that allows to display the result of peak picking
 * @param {array<Peak>} peaks
 * @param {object} [options={}]
 * @param {string} [options.fillColor='green']
 * @param {string} [options.strokeColor='red']
 * @param {string} [options.showKind=true] Display the kind, 'm', 'w', 'S'
 * @param {string} [options.showAssignment=true] Display the assignment
 * @param {function} [options.createFct] (annotation, peak) => {}: callback allowing to add properties
 * @param {string} [options.mode='t100'] 't100'=transmittance in %, 't'=transmittance, 'a'=absorbance
 * @returns array
 */

export function getAnnotations(peaks, options = {}) {
  const {
    fillColor = 'green',
    strokeColor = 'red',
    creationFct,
    mode = 't100',
  } = options;
  let annotations = peaks.map((peak) => {
    let annotation = {
      line: 1,
      type: 'rect',
      strokeColor: strokeColor,
      strokeWidth: 0,
      fillColor: fillColor,
    };
    if (creationFct) {
      creationFct(annotation, peak);
    }
    switch (mode) {
      case 'a':
        annotationAbsorbance(annotation, peak, options);
        break;
      case 't':
        annotationTransmittance(annotation, peak, 1, options);
        break;
      case 't100':
        annotationTransmittance(annotation, peak, 100, options);
        break;
      default:
    }
    return annotation;
  });
  return annotations;
}

function annotationTransmittance(annotation, peak, factor = 1, options = {}) {
  const { showKind = true, showAssignment = true } = options;
  let labels = [];
  let line = 0;

  if (showKind) {
    labels.push({
      text: peak.kind,
      size: '18px',
      anchor: 'middle',
      color: 'red',
      position: {
        x: peak.wavenumber,
        y: peak.transmittance * factor,
        dy: `${23 + line * 14}px`,
      },
    });
    line++;
  }

  if (showAssignment) {
    labels.push({
      text: peak.assignment,
      size: '18px',
      anchor: 'middle',
      color: 'darkred',
      position: {
        x: peak.wavenumber,
        y: peak.transmittance * factor,
        dy: `${23 + line * 14}px`,
      },
    });
    line++;
  }

  annotation.labels = labels;
  annotation.position = [
    {
      x: peak.wavenumber,
      y: peak.transmittance * factor,
      dy: '10px',
      dx: '-1px',
    },
    {
      x: peak.wavenumber,
      y: peak.transmittance * factor,
      dy: '5px',
      dx: '1px',
    },
  ];
}

function annotationAbsorbance(annotation, peak, options = {}) {
  const {
    showKind = true,
    showAssignment = true,
    assignmentAngle = -45,
  } = options;
  let labels = [];
  let line = 0;

  if (showKind) {
    labels.push({
      text: peak.kind,
      size: '18px',
      anchor: 'middle',
      color: 'red',
      position: {
        x: peak.wavenumber,
        y: peak.absorbance,
        dy: `${-15 - line * 14}px`,
      },
    });
    line++;
  }

  if (showAssignment) {
    labels.push({
      text: peak.assignment,
      size: '18px',
      angle: assignmentAngle,
      anchor: 'left',
      color: 'darkred',
      position: {
        x: peak.wavenumber,
        y: peak.absorbance,
        dy: `${-15 - line * 14}px`,
      },
    });
    line++;
  }

  annotation.labels = labels;

  annotation.position = [
    {
      x: peak.wavenumber,
      y: peak.absorbance,
      dy: '-10px',
      dx: '-1px',
    },
    {
      x: peak.wavenumber,
      y: peak.absorbance,
      dy: '-5px',
      dx: '1px',
    },
  ];
}
