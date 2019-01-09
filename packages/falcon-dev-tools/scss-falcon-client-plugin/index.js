const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PostCssFlexBugFixes = require('postcss-flexbugs-fixes');
// const paths = require('razzle/config/paths');

const defaultOptions = {
  postcss: {
    dev: {
      sourceMap: true,
      ident: 'postcss'
    },
    prod: {
      sourceMap: false,
      ident: 'postcss'
    },
    plugins: [
      PostCssFlexBugFixes,
      autoprefixer({
        browsers: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9'],
        flexbox: 'no-2009'
      })
    ]
  },
  css: {
    dev: {
      sourceMap: true,
      importLoaders: 1,
      modules: false
    },
    prod: {
      sourceMap: false,
      importLoaders: 1,
      modules: false,
      minimize: true
    }
  },
  style: {},
  resolveUrl: {
    dev: {},
    prod: {}
  }
};

module.exports = (defaultConfig, { target, dev, paths }, webpack, userOptions = {}) => {
  const IS_NODE = target !== 'web';
  const ENV = dev ? 'dev' : 'prod';

  const config = Object.assign({}, defaultConfig);

  const options = Object.assign({}, defaultOptions, userOptions);

  const styleLoader = {
    loader: require.resolve('style-loader'),
    options: options.style
  };

  const cssLoader = {
    loader: require.resolve('css-loader'),
    options: options.css[ENV]
  };

  const resolveUrlLoader = {
    loader: require.resolve('resolve-url-loader'),
    options: options.resolveUrl[ENV]
  };

  const postCssLoader = {
    loader: require.resolve('postcss-loader'),
    options: Object.assign({}, options.postcss[ENV], {
      plugins: () => options.postcss.plugins
    })
  };

  const sassLoader = {
    loader: require.resolve('sass-loader'),
    options: {
      includePaths: [paths.appNodeModules],
      sourceMap: true
    }
  };

  config.module.rules = [
    ...config.module.rules,
    {
      test: /\.(sa|sc)ss$/,
      use: IS_NODE
        ? [
            {
              loader: require.resolve('css-loader/locals'),
              options: options.css[ENV]
            }
          ]
        : [dev ? styleLoader : MiniCssExtractPlugin.loader, cssLoader, resolveUrlLoader, postCssLoader, sassLoader]
    }
  ];

  return config;
};
