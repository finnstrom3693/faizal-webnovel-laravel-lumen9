import { dirname } from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'main.js',
    publicPath: '/', // 👈 Add this to ensure correct asset loading
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  devServer: {
    historyApiFallback: {
      index: '/', // 👈 Explicit fallback to index.html
      disableDotRule: true, // 👈 Allows routes with dots (e.g., /novel/1.2)
    },
    static: {
      directory: __dirname + '/public', // 👈 Full path recommended
    },
    hot: true,
    open: false,
    port: 5173,
    compress: true, // 👈 Enable gzip compression
  },
};