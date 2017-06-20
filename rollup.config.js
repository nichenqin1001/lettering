import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  entry: './src/lettering.js',
  format: 'umd',
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    })
  ],
  moduleName: 'Lettering',
  dest: './dist/lettering.min.js',
};
