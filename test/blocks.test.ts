import { describe, expect, it } from 'vite-plus/test';
import loadBlocks, { blocksIn } from '../src/lib/legend/blocks.ts';

const blocks = await loadBlocks();

describe('loadBlocks', () => {
  it('reads every block out of the Unicode Character Database', () => {
    expect(blocks.length).toBeGreaterThan(300);
  });

  it('keeps the ranges as numbers', () => {
    expect(blocks[0]).toEqual({ start: 0x0000, end: 0x007f, name: 'Basic Latin' });
  });
});

describe('blocksIn', () => {
  it('takes the blocks that reach onto the chart', () => {
    const selected = blocksIn(blocks, 0x0000, 0x007f);
    expect(selected).toEqual([{ start: 0x0000, end: 0x007f, name: 'Basic Latin' }]);
  });

  it('takes a block that only overlaps the chart', () => {
    // U+4E00..U+9FFF runs across the whole of the second and third charts.
    const names = blocksIn(blocks, 0x8000, 0xbfff).map((block) => block.name);
    expect(names).toContain('CJK Unified Ideographs');
  });

  it('leaves out a block that ends before the chart starts', () => {
    const names = blocksIn(blocks, 0x8000, 0xbfff).map((block) => block.name);
    expect(names).not.toContain('Yijing Hexagram Symbols');
  });

  it('returns them in code point order', () => {
    const selected = blocksIn(blocks, 0x0000, 0x3fff);
    const starts = selected.map((block) => block.start);
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
  });
});
