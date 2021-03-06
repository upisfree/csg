import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

const date = new Date();
const banner = `/**
 * ${ pkg.name } v${ pkg.version } build ${ date.toUTCString() }
 * ${ pkg.homepage }
 * Copyright ${ date.getUTCFullYear() } ${ pkg.author.name }
 * @license ${ pkg.license }
 */`;

const BUILD_FOLDER = 'build/ts';

export default [
  {
    input: 'src/csg.ts',
    output: [
      {
        file: 'build/csg.esm.js',
        format: 'es',
        exports: 'named',
        sourcemap: true,
        banner
      }
    ],
    watch: true,
    plugins: [
      resolve({ browser: true }),
      commonjs({ sourceMap: true }),
      typescript({
        outDir: BUILD_FOLDER
      })
    ]
  }
];