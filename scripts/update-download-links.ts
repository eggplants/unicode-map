/**
 * Rewrites the download list in README.md from the assets of a published
 * release, so the links and sizes always match what was actually uploaded.
 *
 * Run once the release exists:
 *   RELEASE_TAG=<tag> node scripts/update-download-links.ts
 */
import fs from 'node:fs/promises';
import configs from '../src/configs.ts';
import { fromRoot, toHex } from '../src/lib/util.ts';

const START = '<!-- downloads:start -->';
const END = '<!-- downloads:end -->';

/** Each poster covers a 128x128 block of the Hilbert curve. */
const POSTER_SIZE = 128 * 128;

const FORMATS = ['svg', 'png', 'pdf'];

type ReleaseAsset = {
  name: string;
  size: number;
  browser_download_url: string;
};

type Release = {
  name?: string | null;
  assets?: ReleaseAsset[];
};

const required = (name: string): string => {
  const value = process.env[name];

  if (value === undefined || value === '') {
    throw new Error(`${name} is not set`);
  }

  return value;
};

const fetchRelease = async (repository: string, tag: string): Promise<Release> => {
  const headers: Record<string, string> = {
    accept: 'application/vnd.github+json',
  };
  const token = process.env.GITHUB_TOKEN;

  if (token !== undefined && token !== '') {
    headers.authorization = `Bearer ${token}`;
  }

  const response = await fetch(`https://api.github.com/repos/${repository}/releases/tags/${tag}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(
      `Cannot read release ${tag} of ${repository}: ${response.status} ${response.statusText}`,
    );
  }

  return (await response.json()) as Release;
};

const megabytes = (bytes: number): string => (bytes / 1e6).toFixed(1);

const renderDownloads = (assets: ReleaseAsset[], label: string): string => {
  const sections: string[] = [];

  for (const config of configs) {
    const links: string[] = [];

    for (const format of FORMATS) {
      const asset = assets.find(
        (candidate) => candidate.name === `${config.name}-poster.${format}`,
      );

      if (asset !== undefined) {
        links.push(
          `* [${format.toUpperCase()} (${megabytes(asset.size)} MB)](${asset.browser_download_url})`,
        );
      }
    }

    if (links.length === 0) {
      continue;
    }

    const first = `U+${toHex(config.codepoint).toUpperCase()}`;
    const last = `U+${toHex(config.codepoint + POSTER_SIZE - 1).toUpperCase()}`;

    sections.push(
      `### ${config.name.toUpperCase()} (${first} - ${last}) ${label}\n\n${links.join('\n')}`,
    );
  }

  if (sections.length === 0) {
    throw new Error('The release carries no poster assets');
  }

  return sections.join('\n\n');
};

const main = async (): Promise<void> => {
  const repository = required('GITHUB_REPOSITORY');
  const tag = required('RELEASE_TAG');

  const release = await fetchRelease(repository, tag);
  // A named release reads better in the headings than a bare timestamp tag.
  const label = release.name ?? tag;

  const readmePath = fromRoot('README.md');
  const readme = await fs.readFile(readmePath, 'utf8');

  const start = readme.indexOf(START);
  const end = readme.indexOf(END);

  if (start === -1 || end === -1 || end < start) {
    throw new Error(`README.md is missing the ${START} / ${END} markers`);
  }

  const updated = [
    readme.slice(0, start + START.length),
    '\n\n',
    renderDownloads(release.assets ?? [], label),
    '\n\n',
    readme.slice(end),
  ].join('');

  if (updated === readme) {
    console.log('README.md is already up to date.');
    return;
  }

  await fs.writeFile(readmePath, updated);
  console.log(`README.md now links the ${label} assets.`);
};

await main();
