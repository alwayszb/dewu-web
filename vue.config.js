const path = require('path');

const resolve = (url) => {
  return path.join(__dirname, url);
};

module.exports = {
  devServer: {
    port: 9000,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changOrigin: true,
        logLevel: 'debug',
        pathRewrite: { '^/api': '' },
      },
    },
  },

  chainWebpack: (config) => {
    config.plugins.delete('preload');
  },

  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [resolve('src/styles/variables.less'), resolve('src/styles/utilities.less')],
    },
  },
};
