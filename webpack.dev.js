/* eslint-disable */
const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common')
/* eslint-enable */

module.exports = merge(common, {
  mode: 'development',
  output: {
    publicPath: '/',
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    // hot: true,
    port: 5000,
    open: true,
    historyApiFallback: true,
    writeToDisk: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
        exclude: [/node_modules/],
      },
    ],
  },
})
