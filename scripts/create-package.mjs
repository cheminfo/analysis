import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';

const [, , packageName] = process.argv;

if (!packageName) {
  console.error('Usage: node scripts/create-package.mjs package-name');
  process.exit(1);
}

const packageUrl = relativeUrl(`packages/${packageName}/`);
const packageSrcUrl = new URL('./src/', packageUrl);

// Check that the package doesn't exist.
if (existsSync(packageUrl)) {
  console.error(`Package "${packageName}" already exists`);
  process.exit(1);
}

console.log(`Creating new package named "${packageName}"`);

// Create the package's root and src folders.
await mkdir(packageUrl);
await mkdir(packageSrcUrl);

// Create LICENSE.
await copyTemplate('LICENSE', packageUrl, {
  year: new Date().getFullYear(),
});

// Create README.
await copyTemplate('README.md', packageUrl, {
  packageName,
});

// Create package.json.
await copyTemplate('package.json', packageUrl, {
  packageName,
});

// Create .npmignore and dummy index file.
await copyTemplate('.npmignore', packageSrcUrl);
await copyTemplate('index.ts', packageSrcUrl);

// Create tsconfig files
await copyTemplate('tsconfig.esm.json', packageUrl);
await copyTemplate('tsconfig.json', packageUrl);
await copyTemplate('tsconfig.test.json', packageUrl);

{
  // Add references to the main `tsconfig.json`.
  const mainTsconfig = await readJSON('tsconfig.json');
  mainTsconfig.references.push({
    path: `./packages/${packageName}/tsconfig.json`,
  });
  mainTsconfig.references.push({
    path: `./packages/${packageName}/tsconfig.esm.json`,
  });
  mainTsconfig.references.push({
    path: `./packages/${packageName}/tsconfig.test.json`,
  });
  await writeJSON('tsconfig.json', mainTsconfig);
}

{
  // Add new package to `release-please-config.json`.
  const releasePleaseConfig = await readJSON('release-please-config.json');
  releasePleaseConfig.packages[`packages/${packageName}`] = {};
  await writeJSON('release-please-config.json', releasePleaseConfig);
}

{
  // Update packages list in README.md.
  const readmeUrl = relativeUrl('README.md');
  const readme = await readFile(readmeUrl, 'utf-8');
  const newReadme = readme.replace(
    '<!-- END-Packages',
    `- [${packageName}](./packages/${packageName})\n<!-- END-Packages`,
  );
  await writeFile(readmeUrl, newReadme);
}

/**
 * Read a local file as JSON.
 * @param {string} path - Relative path of the file to read.
 * @returns {object} The parsed JSON.
 */
async function readJSON(path) {
  return JSON.parse(await readFile(relativeUrl(path)));
}

/**
 * Write JSON to a local file.
 * @param {string} path - Relative path of the file to write.
 * @param {object} json - The JSON to write.
 */
async function writeJSON(path, json) {
  await writeFile(relativeUrl(path), `${JSON.stringify(json, null, 2)}\n`);
}

/**
 * Convert a relative path to a file: URL.
 * @param {string} path - Relative path of the file.
 * @returns {URL} - URL of the file.
 */
function relativeUrl(path) {
  return new URL(`../${path}`, import.meta.url);
}

/**.
 * Copy a template while replacing its
 *
 * @param {string} file - Template file name.
 * @param {URL} baseUrl - Base URL where to copy.
 * @param {Record<string, string>} [data] - Data to interpolate.
 */
async function copyTemplate(file, baseUrl, data = {}) {
  const tpl = await readFile(
    new URL(`templates/${file}`, import.meta.url),
    'utf-8',
  );
  const destination = new URL(`./${file}`, baseUrl);

  let result = tpl;
  for (const [key, value] of Object.entries(data)) {
    // Replace occurrences of "${{key}}" with "value".
    result = result.replaceAll(`$\{{${key}}}`, value);
  }
  await writeFile(destination, result);
}
