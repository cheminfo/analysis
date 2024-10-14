# Changelog

## [0.4.0](https://www.github.com/cheminfo/analysis/compare/permeability-analysis-v0.3.1...permeability-analysis-v0.4.0) (2024-10-14)


### ⚠ BREAKING CHANGES

* `isMonotone` is renamed to `isMonotonic` and now contains a number (-1, 0, 1). Some returned objects now contain Float64Array for data instead of Array. `rollingBallBaseline` and `airPLSBaseline` normalizations have been updated and give different results.

### Miscellaneous Chores

* update dependencies ([a5f734a](https://www.github.com/cheminfo/analysis/commit/a5f734a597bd6f841b6998bc13917abaa9d26399))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * base-analysis bumped from ^0.3.0 to ^0.4.0

### [0.3.1](https://www.github.com/cheminfo/analysis/compare/permeability-analysis-v0.3.0...permeability-analysis-v0.3.1) (2022-08-17)


### Bug Fixes

* force release of permeability ([#38](https://www.github.com/cheminfo/analysis/issues/38)) ([3e104a7](https://www.github.com/cheminfo/analysis/commit/3e104a7e15071ecd110b7f353064d078a95f136a))

## [0.3.0](https://www.github.com/cheminfo/analysis/compare/permeability-analysis-v0.2.0...permeability-analysis-v0.3.0) (2022-08-16)


### Features

* allow to select 'units' in fromHidenXLSX ([#35](https://www.github.com/cheminfo/analysis/issues/35)) ([73d15d8](https://www.github.com/cheminfo/analysis/commit/73d15d86ea256f76d6e0db9a2ee4f28bb95d3608))

## [0.2.0](https://www.github.com/cheminfo/analysis/compare/permeability-analysis-v0.1.0...permeability-analysis-v0.2.0) (2022-08-16)


### Features

* enhance getJSGraph to have many measurements ([6680c33](https://www.github.com/cheminfo/analysis/commit/6680c33166a076af84aa126604cb4f781173ccb4))


### Bug Fixes

* error in fromHidenXLSX parser with 0 value ([2605f80](https://www.github.com/cheminfo/analysis/commit/2605f80974945002cc5f2df3903c15102b136eba))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * base-analysis bumped from ^0.2.0 to ^0.3.0

## 0.1.0 (2022-07-19)


### Features

* add permeability analysis ([2f11868](https://www.github.com/cheminfo/analysis/commit/2f11868fb67e7cf0d0af3fe9855fcbaa4b53fa36))



### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * base-analysis bumped from ^0.1.5 to ^0.2.0