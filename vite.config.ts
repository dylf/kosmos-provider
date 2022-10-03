import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import localtunnel from './vite-localtunnel-plugin';
import localtunnels from 'vite-plugin-localtunnel';

import manifest from './manifest.json';

const DEV_MANIFEST_FILE = 'manifest.dev.json';

const env = loadEnv('development', process.cwd(), '');

function banner() {
  let outputManifest = manifest;
  if (process.env.NODE_ENV == 'production' && env.SUBDOMAIN) {
    if (existsSync('manifest.json.dev')) {
      const devManifest = readFileSync(DEV_MANIFEST_FILE, {
        encoding: 'utf-8',
      });
      outputManifest = JSON.parse(devManifest);
    }
    outputManifest = {
      ...outputManifest,
      version: outputManifest.version + 1,
      permaUrl: `https://${process.env.SUBDOMAIN}.loca.lt/bundles/provider.umd.js`,
    };
    writeFileSync(DEV_MANIFEST_FILE, JSON.stringify(outputManifest, null, 2));
  }

  return `/*\n${JSON.stringify(outputManifest, null, 2)}\n*/\n`;
}

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/provider.ts'),
      name: 'myProvider',
      fileName: 'provider',
      formats: ['umd'],
    },
    outDir: 'bundles',
    target: 'esnext',
    reportCompressedSize: true,
    emptyOutDir: true,
    minify: false,
    rollupOptions: {
      output: {
        banner,
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.SUBDOMAIN': JSON.stringify(env.SUBDOMAIN),
  },
  plugins: [localtunnel({ subdomain: env.SUBDOMAIN })],
});
