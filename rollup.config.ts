import { defineConfig } from 'rollup';
import manifest from './manifest.json';

export default defineConfig({
  input: 'build/provider.js',
  output: {
    file: 'bundles/provider.umd.js',
    format: 'umd',
    banner() {
      let banner = '/*\n';
      banner += JSON.stringify(manifest, null, 2);
      banner += ` \n*/\n`;
      return banner;
    },
    name: 'myProvider',
  },
});
