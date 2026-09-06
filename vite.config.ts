import { execFileSync, spawn } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';
import path from 'node:path';
import { defineConfig } from 'vite-plus';
import type { Plugin } from 'vite-plus';

/**
 * Rebuilds the posters whenever an input changes and reloads the preview page
 * at `/dev/` once the build succeeds, replacing the old chokidar + livereload
 * pair with the dev server's own watcher.
 */
const posterPreview = (): Plugin => ({
  name: 'unicode-map:preview',
  apply: 'serve',

  // The same page is published to GitHub Pages, where it falls back to the
  // latest release. This flag tells it that a local build is available.
  transformIndexHtml: {
    order: 'pre',
    handler: () => [
      { tag: 'script', children: 'window.__unicodeMapDev = true;', injectTo: 'head' },
    ],
  },

  configureServer(server) {
    const { root, logger } = server.config;

    // The workflow writes this file when it deploys the page; here the local
    // HEAD stands in for it, so the footer reads the same in both places.
    server.middlewares.use('/dev/commit.json', (_request, response) => {
      let body = '{}';

      try {
        const [hash, date] = execFileSync('git', ['log', '-1', '--format=%h%n%ad'], {
          cwd: root,
          encoding: 'utf8',
        })
          .trim()
          .split('\n');

        body = JSON.stringify({ hash, date });
      } catch {
        // Not a checkout with any commit in it: the footer leaves it out.
      }

      response.setHeader('content-type', 'application/json');
      response.end(body);
    });

    let running: ChildProcess | null = null;
    let queued = false;

    const rebuild = (): void => {
      if (running !== null) {
        queued = true;
        return;
      }

      logger.info('rebuilding posters...', { timestamp: true });

      running = spawn(process.execPath, ['--max-old-space-size=4096', 'src/index.ts'], {
        cwd: root,
        stdio: 'inherit',
      });

      running.on('exit', (code) => {
        running = null;

        if (code === 0) {
          server.hot.send({ type: 'full-reload' });
        } else {
          logger.error(`build failed with exit code ${String(code)}`, {
            timestamp: true,
          });
        }

        if (queued) {
          queued = false;
          rebuild();
        }
      });
    };

    // Only inputs may trigger a rebuild: the generated posters sit in the
    // project root, and watching those would loop forever.
    const isInput = (file: string): boolean => {
      const relative = path.relative(root, file);

      return (
        (relative.startsWith(`src${path.sep}`) && relative.endsWith('.ts')) ||
        relative.startsWith(`data${path.sep}`)
      );
    };

    server.watcher.add([path.join(root, 'src'), path.join(root, 'data')]);

    for (const event of ['add', 'change', 'unlink'] as const) {
      server.watcher.on(event, (file) => {
        if (isInput(file)) {
          rebuild();
        }
      });
    }
  },
});

export default defineConfig({
  plugins: [posterPreview()],
  server: {
    open: '/dev/',
  },
  fmt: {
    // The code point tables and the README are hand-formatted.
    ignorePatterns: ['data/**', 'README.md'],
    singleQuote: true,
  },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
  },
});
