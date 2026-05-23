import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', '@wysiwyg/core', '@wysiwyg/shared'],
  treeshake: true,
  minify: process.env.NODE_ENV === 'production',
  target: 'es2020',
});
