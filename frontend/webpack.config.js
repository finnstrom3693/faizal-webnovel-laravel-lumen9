// webpack.config.js
import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import Dotenv from 'dotenv-webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: process.env.REACT_APP_BASE_URL || '/',
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
        use: ['style-loader', 'css-loader', 'postcss-loader'], // Corrected 'postcss-loader' to 'postcss-loader'
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'), // Ensure path is resolved
    }),
    new Dotenv({
      path: path.resolve(__dirname, '.env'), // Specify the path to your .env file
    }),
  ],
  devServer: {
    historyApiFallback: {
      index: '/',
      disableDotRule: true,
    },
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    hot: true,
    open: false,
    port: 5173,
    compress: true,
  },
};