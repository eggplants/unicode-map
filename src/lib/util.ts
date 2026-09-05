import path from 'node:path';
import { rootDir } from './paths.ts';

export const log = (text: string): void => {
  const dateString = new Date().toISOString();
  const memory = Math.floor(process.memoryUsage().rss / (1024 * 1024));
  console.log(`[${dateString} (Memory: ${memory}MiB)] ${text}`);
};

export const mergeMaps = <K, V>(maps: Map<K, V>[]): Map<K, V> =>
  new Map(maps.flatMap((map) => Array.from(map)));

export const toHex = (codepoint: number): string =>
  codepoint < 0x10000 ? `0000${codepoint.toString(16)}`.slice(-4) : codepoint.toString(16);

/** Resolves a path relative to the repository root. */
export const fromRoot = (...segments: string[]): string => path.join(rootDir, ...segments);

/** `foo-bar` to `fooBar`. Names that are already camel-cased are left untouched. */
export const camelCase = (text: string): string =>
  text
    .split('-')
    .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join('');
