const customWebpackConfig = require('../webpack.config.js')

module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  webpackFinal: (config) => {
    config.module.rules = [
      ...config.module.rules,
      ...customWebpackConfig.module.rules,
    ]
    config.resolve.extensions = [
      ...config.resolve.extensions,
      ...customWebpackConfig.resolve.extensions,
    ]

    return config
  },
}
