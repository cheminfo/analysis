import { parseHidenXLSX } from './parseHidenXLSX';

/**
 * @param binary
 */
export function fromHidenXLSX(binary: ArrayBuffer | Uint8Array) {
  const parsed = parseHidenXLSX(binary);
}
