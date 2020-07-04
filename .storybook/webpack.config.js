const customWebpackConfig = require('../webpack.config.js')

module.exports = ({ config }) => {
  config.module.rules = [
    ...config.module.rules,
    // ...customWebpackConfig.module.rules,
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
      test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
      use: ['file-loader'],
    },
  ]
  config.resolve.extensions = [
    ...config.resolve.extensions,
    ...customWebpackConfig.resolve.extensions,
  ]

  return config
}
