import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  entry: './src/lettering.js',
  format: 'umd',
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
    uglify()
  ],
  moduleName: 'Lettering',
  dest: './dist/lettering.min.js',
};
