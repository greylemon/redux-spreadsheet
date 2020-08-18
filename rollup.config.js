import path from 'path'
import pkg from './package.json'
// import typescript from '@rollup/plugin-typescript'
import typescript from 'rollup-plugin-typescript2'
import scss from 'rollup-plugin-scss'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import replace from '@rollup/plugin-replace'

const external = (id) => !id.startsWith('.') && !path.isAbsolute(id)
const input = './src/index.ts'

export default [
  {
    input,
    output: {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      replace({ __buildEnv__: 'production' }),
      scss(),
      typescript(),
      resolve(),
      terser(),
    ],
    external,
  },
  {
    input,
    output: {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      replace({ __buildEnv__: 'production' }),
      scss(),
      typescript(),
      resolve(),
      terser(),
    ],
    external,
  },
]
