# Analysis

[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]

## Packages

- [base-analysis](./packages/base-analysis)
- [tga-analysis](./packages/tga-analysis)
- [ir-spectrum](./packages/ir-spectrum)
<!-- END-Packages (do not remove) -->

## Development

### Add a new package

Let's say you want to add a new package named `test-analysis`.

1. Run the create-package script

   ```console
   node scripts/create-package.mjs test-analysis
   ```

2. Add a description to your package:
   - In `packages/test-analysis/package.json`
   - In `packages/test-analysis/README.md`
3. Implement the package. Do not forget to update the usage example in `packages/test-analysis/README.md`.

### Add a local dependency to a package

Example: `test-analysis` needs to depend on `other-analysis`.

- If `other-analysis` is already published in the npm registry: `npm i -w test-analysis other-analysis`.
- If `other-analysis` is not published yet, add the dependency manually, as `"other-analysis": "^0.0.0"`.

## License

[MIT](./LICENSE)

[ci-image]: https://github.com/cheminfo/analysis/workflows/Node.js%20CI/badge.svg?branch=main
[ci-url]: https://github.com/cheminfo/analysis/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/analysis.svg
[codecov-url]: https://codecov.io/gh/cheminfo/analysis
