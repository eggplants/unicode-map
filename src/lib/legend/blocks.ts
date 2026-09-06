import fs from 'node:fs/promises';
import { fromRoot } from '../util.ts';

/** One row of the Unicode Character Database's `Blocks.txt`. */
export type UnicodeBlock = {
  start: number;
  end: number;
  name: string;
};

const BLOCKS_FILE = fromRoot('data', 'blocks.txt');
const BLOCK_LINE = /^([\dA-F]+)\.\.([\dA-F]+); (.+)$/;

const loadBlocks = async (): Promise<UnicodeBlock[]> => {
  const source = await fs.readFile(BLOCKS_FILE, 'utf8');

  return source
    .split('\n')
    .map((line) => BLOCK_LINE.exec(line.trim()))
    .filter((match) => match !== null)
    .map((match) => ({
      start: Number.parseInt(match[1]!, 16),
      end: Number.parseInt(match[2]!, 16),
      name: match[3]!,
    }));
};

/** The blocks that reach onto a chart covering `[start, end]`, in code point order. */
export const blocksIn = (blocks: UnicodeBlock[], start: number, end: number): UnicodeBlock[] =>
  blocks
    .filter((block) => block.end >= start && block.start <= end)
    .sort((a, b) => a.start - b.start);

export default loadBlocks;
