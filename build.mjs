import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  outfile: 'dist/index.js',
  banner: {
    js: `import { createRequire as _createRequire } from 'module';
const require = _createRequire(import.meta.url);`
  }
});

console.log('Build completed successfully');
