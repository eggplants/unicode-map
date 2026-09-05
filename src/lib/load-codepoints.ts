import fs from 'node:fs/promises';
import path from 'node:path';
import { isScalar, parseDocument, visit } from 'yaml';
import type { Scalar } from 'yaml';
import codepointBuilder from './codepoint-builder.ts';
import type { CodepointInfo, CodepointSource } from './codepoint-builder.ts';
import { fromRoot, mergeMaps } from './util.ts';

const CODEPOINTS_DIR = fromRoot('data', 'codepoints');

/**
 * Every mapping key in the code point data is a hexadecimal token such as
 * `0670` or `0E00..0E7F`, but plain YAML scalars like those are otherwise
 * resolved as numbers, which loses the original digits. Reading the key back
 * from the source keeps them intact.
 */
const rawKey = (node: Scalar, source: string): string =>
  typeof node.value === 'string' ? node.value : source.slice(node.range?.[0], node.range?.[1]);

export const parseCodepointYaml = (source: string): Record<string, CodepointSource> => {
  const document = parseDocument(source, {
    uniqueKeys: (a, b) => isScalar(a) && isScalar(b) && rawKey(a, source) === rawKey(b, source),
  });

  if (document.errors.length > 0) {
    throw document.errors[0]!;
  }

  visit(document, {
    Pair(_, pair) {
      if (isScalar(pair.key) && typeof pair.key.value !== 'string') {
        pair.key.value = rawKey(pair.key, source);
      }
    },
  });

  return document.toJS() as Record<string, CodepointSource>;
};

const loadCodepoints = async (): Promise<Map<number, CodepointInfo>> => {
  const files = await fs.readdir(CODEPOINTS_DIR);
  const yamlFiles = files.filter((file) => file.endsWith('.yml'));

  const codepointMaps = await Promise.all(
    yamlFiles.map(async (yamlFile) => {
      const yaml = await fs.readFile(path.resolve(CODEPOINTS_DIR, yamlFile), 'utf8');
      return codepointBuilder(parseCodepointYaml(yaml));
    }),
  );

  return mergeMaps(codepointMaps);
};

export default loadCodepoints;
