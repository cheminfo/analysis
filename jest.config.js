'use strict';

module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/lib/', '/lib-esm/'],
  coveragePathIgnorePatterns: ['/node_modules/', '/lib/', '/lib-esm/'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.base.json',
    },
  },
};
