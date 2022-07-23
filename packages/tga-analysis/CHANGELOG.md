# Changelog

## [0.2.0](https://www.github.com/cheminfo/analysis/compare/tga-analysis-v0.1.5...tga-analysis-v0.2.0) (2022-07-19)


### Features

* add permeability analysis ([2f11868](https://www.github.com/cheminfo/analysis/commit/2f11868fb67e7cf0d0af3fe9855fcbaa4b53fa36))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * base-analysis bumped from ^0.1.5 to ^0.2.0

### [0.1.5](https://www.github.com/cheminfo/analysis/compare/tga-analysis-v0.1.4...tga-analysis-v0.1.5) (2022-05-25)


### Bug Fixes

* update dependencies ([#26](https://www.github.com/cheminfo/analysis/issues/26)) ([21c58be](https://www.github.com/cheminfo/analysis/commit/21c58beb1aeb2df5e4629347edf7b4eb696116e1))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * base-analysis bumped from ^0.1.4 to ^0.1.5

### [0.1.4](https://www.github.com/cheminfo/analysis/compare/tga-analysis-v0.1.3...tga-analysis-v0.1.4) (2022-05-24)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * base-analysis bumped from ^0.1.3 to ^0.1.4

### [0.1.3](https://www.github.com/cheminfo/analysis/compare/tga-analysis-v0.1.2...tga-analysis-v0.1.3) (2022-02-25)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * base-analysis bumped from ^0.1.2 to ^0.1.3

### [0.1.2](https://www.github.com/cheminfo/analysis/compare/tga-analysis-v0.1.1...tga-analysis-v0.1.2) (2022-02-16)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * base-analysis bumped from ^0.1.1 to ^0.1.2

### [0.1.1](https://www.github.com/cheminfo/analysis/compare/tga-analysis-v0.1.0...tga-analysis-v0.1.1) (2022-01-31)


### Bug Fixes

* update dependencies and publish lib folders ([#11](https://www.github.com/cheminfo/analysis/issues/11)) ([6f5161f](https://www.github.com/cheminfo/analysis/commit/6f5161f8c9fd51845e82b975229398a3b6c1211c))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * base-analysis bumped from ^0.1.0 to ^0.1.1

## 0.1.0 (2021-11-15)


### Features

* setup packages for publication ([8bf1107](https://www.github.com/cheminfo/analysis/commit/8bf1107c30da3f458d8442e9c54e7c39044ab845))

### [0.18.1](https://www.github.com/cheminfo/tga-spectrum/compare/v0.18.0...v0.18.1) (2021-09-28)


### Bug Fixes

* export missing fromMettlerToledo ([777220b](https://www.github.com/cheminfo/tga-spectrum/commit/777220bcbf2fee2ae5a05d3a2eca321128b797ad))

## [0.18.0](https://www.github.com/cheminfo/tga-spectrum/compare/v0.17.0...v0.18.0) (2021-09-28)


### ⚠ BREAKING CHANGES

* typescript lactame build
* improve fromMettlerToledo

### Features

* add build script ([b95ae2e](https://www.github.com/cheminfo/tga-spectrum/commit/b95ae2eef12257cb980ccf1a85565ee7fdbcc42e))
* add fromMettlerToledo ([bc5035d](https://www.github.com/cheminfo/tga-spectrum/commit/bc5035d5c9ece1a128197465ce6439334be46291))
* add release-please ([3991b0d](https://www.github.com/cheminfo/tga-spectrum/commit/3991b0df086df8e722a38236fc725b1005bf77dc))
* improve fromMettlerToledo ([a35b44f](https://www.github.com/cheminfo/tga-spectrum/commit/a35b44f199e6cc7679aca6ad3cb23ebe4c5da98b))
* refactor to typescript ([9521b3e](https://www.github.com/cheminfo/tga-spectrum/commit/9521b3ea67fd7219f4d1668ba86ced7b7ab5c15a))
* typescript lactame build ([05f5c9a](https://www.github.com/cheminfo/tga-spectrum/commit/05f5c9aac2a55d0cec89608dd1d2df8ed670ba87))
* typescript refactoring ([5d0b42a](https://www.github.com/cheminfo/tga-spectrum/commit/5d0b42a20136afe0f37615e23b5d82120fba585a))


### Bug Fixes

* improve TAinstruments text parser ([750e47e](https://www.github.com/cheminfo/tga-spectrum/commit/750e47ebc811d91edef1b52369c4bf815147ebff))

## [0.17.0](https://www.github.com/cheminfo/tga-spectrum/compare/v0.16.0...v0.17.0) (2021-09-14)

### Features

- auto select utf16 for ta instruments ([eff05ef](https://www.github.com/cheminfo/tga-spectrum/commit/eff05ef70dab9aed745c8cf1b4ca01770077fe19))

### Bug Fixes

- from TAInstruments to deal with mof.txt ([33af3a5](https://www.github.com/cheminfo/tga-spectrum/commit/33af3a584bca6335ee248c31fd8eacd806b204e6))

## [0.16.0](https://www.github.com/cheminfo/tga-spectrum/compare/v0.15.1...v0.16.0) (2021-05-07)

### Features

- fromTAInstrument will convert ArrayBuffer to text ([080d9d8](https://www.github.com/cheminfo/tga-spectrum/commit/080d9d8a9f53d180407d0da390aa2f29de9d5c04))

### [0.15.1](https://www.github.com/cheminfo/tga-spectrum/compare/v0.15.0...v0.15.1) (2021-05-06)

### Bug Fixes

- use named imports from xlsx ([1081b83](https://www.github.com/cheminfo/tga-spectrum/commit/1081b834bd8d6b3f525db295c0895e2683f91a03))

## [0.15.0](https://www.github.com/cheminfo/tga-spectrum/compare/v0.14.1...v0.15.0) (2021-05-06)

### ⚠ BREAKING CHANGES

- Break compatibility with node 10 and 12

### Features

- add fromNetzsch ([89a40cd](https://www.github.com/cheminfo/tga-spectrum/commit/89a40cda2c527086187ac74eea7bf0460c72d50f))
- adding cheminfo metadata ([8444025](https://www.github.com/cheminfo/tga-spectrum/commit/8444025838b745283bb91a47f48748d38b183457))
- Break compatibility with node 10 and 12 ([0a40609](https://www.github.com/cheminfo/tga-spectrum/commit/0a406098ed1b9bb2178b085271c8f1d010f0374b))

### Bug Fixes

- mass in Netzsch parser ([#35](https://www.github.com/cheminfo/tga-spectrum/issues/35)) ([957fd00](https://www.github.com/cheminfo/tga-spectrum/commit/957fd0020b5356157d9acd169c830bc3e11f6d74))
- typo in package.json metadata ([99df58d](https://www.github.com/cheminfo/tga-spectrum/commit/99df58d48cca5a135c42a4a1c59b73990b0e36d4))

### [0.14.1](https://www.github.com/cheminfo/tga-spectrum/compare/v0.14.0...v0.14.1) (2021-03-02)

### Bug Fixes

- ta parser bug ([5d295ca](https://www.github.com/cheminfo/tga-spectrum/commit/5d295ca2fc7b2b1fb7f40b8c7c217cd68b281b5a))

## [0.14.0](https://www.github.com/cheminfo/tga-spectrum/compare/v0.13.0...v0.14.0) (2021-03-01)

### Features

- udate dependencies for baseline correction ([ca8a845](https://www.github.com/cheminfo/tga-spectrum/commit/ca8a845f1289b1be110da79188d347bff8332795))

### Bug Fixes

- ta parser did not work on all ta txt files due to StartOfData line ([323a090](https://www.github.com/cheminfo/tga-spectrum/commit/323a090ddef464b0f6e305ffbf2076bd7ff50598))

## [0.13.0](https://www.github.com/cheminfo/tga-spectrum/compare/v0.12.1...v0.13.0) (2021-02-09)

### Features

- added excel parser, [#9](https://www.github.com/cheminfo/tga-spectrum/issues/9) ([3f06bad](https://www.github.com/cheminfo/tga-spectrum/commit/3f06bad27d7fd6e6799d23bdc21bf51d7cc02ad5))
- update dependencies and add JSGraph export object ([e741d25](https://www.github.com/cheminfo/tga-spectrum/commit/e741d25196f07946fde180f9aa5656533d1097cc))

### Bug Fixes

- fix time units, [#10](https://www.github.com/cheminfo/tga-spectrum/issues/10) ([#12](https://www.github.com/cheminfo/tga-spectrum/issues/12)) ([e06dff3](https://www.github.com/cheminfo/tga-spectrum/commit/e06dff371e90dec314c188c11bc0eff99cb93382))

# [0.7.0](https://github.com/cheminfo/tga-spectrum/compare/v0.6.2...v0.7.0) (2020-06-20)

### Features

- add support for ntuples jcamp ([3843985](https://github.com/cheminfo/tga-spectrum/commit/3843985a9c7164db420da1100268bc69c39fabb9))

## [0.6.2](https://github.com/cheminfo/tga-spectrum/compare/v0.6.1...v0.6.2) (2020-06-16)

### Bug Fixes

- remove empty lines in perkin CSV ([5f5e1b7](https://github.com/cheminfo/tga-spectrum/commit/5f5e1b728e922597389a1b8e6c180353854b6020))

# [0.6.0](https://github.com/cheminfo/tga-spectrum/compare/v0.5.0...v0.6.0) (2020-06-12)

### Bug Fixes

- remove useless "new" CommonSpectrum ([943c4b4](https://github.com/cheminfo/tga-spectrum/commit/943c4b46e4d68aa79d1a3e000f0042706e5858c4))

# [0.4.0](https://github.com/cheminfo/tga-spectrum/compare/v0.3.0...v0.4.0) (2020-05-26)

### Features

- add fromPerkinElmerCSV ([be74226](https://github.com/cheminfo/tga-spectrum/commit/be74226446b0bcc372ce0c59be69d71bd780e7bd))

## [0.2.4](https://github.com/cheminfo/tga-spectrum/compare/v0.2.3...v0.2.4) (2020-02-19)

## [0.0.4](https://github.com/cheminfo/tga-spectrum/compare/v0.0.3...v0.0.4) (2019-04-15)

## [0.0.2](https://github.com/cheminfo/tga-spectrum/compare/v0.0.1...v0.0.2) (2019-03-22)

## 0.0.1 (2019-03-22)



### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * base-analysis bumped from ^0.0.0 to ^0.1.0