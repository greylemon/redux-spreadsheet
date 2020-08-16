import path from 'path'
import pkg from './package.json'
// import typescript from '@rollup/plugin-typescript'
import typescript from 'rollup-plugin-typescript2'
import scss from 'rollup-plugin-scss'
import resolve from '@rollup/plugin-node-resolve'

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
    plugins: [scss(), typescript(), resolve()],
    external,
  },
  {
    input,
    output: {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [scss(), typescript(), resolve()],
    external,
  },
]
