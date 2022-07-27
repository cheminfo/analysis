const testRegExp = /^\/((?:\\\/|[^/])+)\/([migyu]{0,5})?$/;

/**
 * @param value
 */
export function ensureRegexp(value: string | RegExp): RegExp {
  if (typeof value !== 'string') return value;
  const parts = testRegExp.exec(value);
  if (parts) {
    try {
      return new RegExp(parts[1], parts[2]);
    } catch (err) {
      return stringToRegexp(value);
    }
  } else {
    return stringToRegexp(value);
  }
}

/**
 * @param string
 * @param flags
 */
function stringToRegexp(string: string, flags = 'i') {
  return new RegExp(
    string.replace(/[[\]\\{}()+*?.$^|]/g, (match: string) => `\\${match}`),
    flags,
  );
}
