import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  entry: './lettering.js',
  format: 'umd',
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    })
  ],
  moduleName: 'Lettering',
  dest: 'lettering.min.js'
};
