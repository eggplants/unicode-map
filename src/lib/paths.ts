import { fileURLToPath } from 'node:url';

/** Absolute path of the repository root, so asset lookups do not depend on the cwd. */
export const rootDir = fileURLToPath(new URL('../..', import.meta.url));
