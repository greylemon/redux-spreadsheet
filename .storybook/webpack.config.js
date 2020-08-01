const { merge } = require('webpack-merge')
const customWebpackConfig = require('../webpack.config.js')
const path = require('path')

const maxAssetSize = 1024 * 1024

module.exports = ({ config }) => {
  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
    },
    {
      test: /\.tsx?$/,
      use: ['ts-loader', 'react-docgen-typescript-loader'],
      exclude: [/node_modules/],
    },
    {
      test: /\.(woff(2)?|ttf|eot|xlsx)(\?v=\d+\.\d+\.\d+)?$/,
      use: ['file-loader'],
    },
    {
      test: /\.stories\.jsx?$/,
      loaders: [
        {
          loader: '@storybook/source-loader',
          options: {
            parser: 'typescript',
            prettierConfig: {
              printWidth: 100,
              singleQuote: false,
            },
          },
        },
      ],
      enforce: 'pre',
    },
  ]
  config.resolve.extensions = [
    ...config.resolve.extensions,
    ...customWebpackConfig.resolve.extensions,
    '.xlsx',
  ]

  config.node = {
    fs: 'empty',
  }

  config.resolve.modules = [
    ...(config.resolve.modules || []),
    path.resolve('./'),
  ]

  return merge(config, {
    //...

    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 30 * 1024,
        maxSize: maxAssetSize,
      },
    },
    performance: {
      maxAssetSize: maxAssetSize,
    },
  })
}
