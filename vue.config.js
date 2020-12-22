const path = require('path');

const resolve = (url) => {
  return path.join(__dirname, url);
};

module.exports = {
  devServer: {
    port: 9000,
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
