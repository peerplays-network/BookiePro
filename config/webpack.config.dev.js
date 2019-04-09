var autoprefixer = require('autoprefixer');
var path = require('path');
var paths = require('./paths');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var Clean = require('clean-webpack-plugin');

// BASE APP DIR
var root_dir = path.resolve(__dirname, '..');
var Config = require('./Config');

// FUNCTION TO EXTRACT CSS FOR PRODUCTION
function extractForProduction(loaders) {
  return ExtractTextPlugin.extract('style', loaders.substr(loaders.indexOf('!')));
}

var publicPath = '/';

// STYLE LOADERS
var cssLoaders = 'style-loader!css-loader!postcss-loader',
  scssLoaders = 'style!css!postcss-loader!sass?outputStyle=expanded';

// DIRECTORY CLEANER
var cleanDirectories = ['build'];

// GLOBAL VAR DEFINE
var define = {
  APP_PACKAGE_VERSION: JSON.stringify(Config.APP_PACKAGE_VERSION),
  SOFTWARE_UPDATE_REFERENCE_ACCOUNT_NAME: JSON.stringify(
    Config.SOFTWARE_UPDATE_REFERENCE_ACCOUNT_NAME
  ),
  APP_VERSION: JSON.stringify(Config.APP_VERSION),
  __ELECTRON__: false,
  CORE_ASSET: JSON.stringify(Config.CORE_ASSET),
  BLOCKCHAIN_URL: JSON.stringify(Config.BLOCKCHAIN_URLS),
  FAUCET_URL: JSON.stringify(Config.FAUCET_URLS),
  BITSHARES_WS: JSON.stringify(Config.BITSHARES_WS),
};

// COMMON PLUGINS
var plugins = [
  // Generates an `index.html` file with the <script> injected.
  new HtmlWebpackPlugin({
    inject: true,
    template: paths.appHtml,
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.DefinePlugin(define),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('development')
    }
  }),
  new webpack.HotModuleReplacementPlugin(),
  new Clean(cleanDirectories),
];


module.exports = {
  entry: [
    require.resolve('react-dev-utils/webpackHotDevClient'),
    require.resolve('./polyfills'),
    // Finally, this is your app's code:
    paths.appIndexJs
  ],
  output: {
    // Next line is not used in dev but WebpackDevServer crashes without it:
    path: paths.appBuild,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: true,
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: 'static/js/bundle.js',
    // This is the URL that app is served from. We use "/" in development.
    publicPath: publicPath
  },
  devtool: 'source-map',
  debug: true,
  module: {
    noParse: /node_modules\/build/,
    loaders: [{
      test: /\.jsx$/,
      include: [
        paths.appSrc,
        path.join(root_dir, 'node_modules/react-foundation-apps'),
        '/home/sigve/Dev/graphene/react-foundation-apps'
      ],
      loaders: ['babel-loader']
    },
    {
      test: /\.js$/,
      exclude: [/node_modules/, paths.appNodeModules],
      loader: 'babel-loader',
      query: {
        compact: false,
        cacheDirectory: true
      }
    },
    {
      test: /\.json/,
      loader: 'json',
      exclude: [
        // path.resolve(root_dir, '../common'),
        paths.locales
      ]
    },
    {
      test: /\.coffee$/,
      loader: 'coffee-loader'
    },
    {
      test: /\.(coffee\.md|litcoffee)$/,
      loader: 'coffee-loader?literate'
    },
    {
      test: /\.css$/,
      loader: cssLoaders
    },
    {
      test: /\.scss$/,
      loader: scssLoaders
    },
    {
      test: /(\.png$)/,
      loader: 'url-loader?limit=100000',
      exclude: [paths.assetSymbols, paths.assetImages]
    },
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'file?hash=sha512&digest=hex&name=[hash].[ext]',
        `image-webpack?${JSON.stringify({
          bypassOnDebug: true,
          optipng: {
            optimizationLevel: true
          },
          gifsicle: {
            interlaced: true
          }
        })}`
      ],
      exclude: [
        path.join(root_dir, 'src/assets/images')
      ]
    },
    {
      test: /\.woff$/,
      loader: 'url-loader?limit=100000&mimetype=application/font-woff'
    },
    {
      test: /.*\.svg$/,
      loaders: ['svg-inline-loader', 'svgo-loader'],
      exclude: [paths.rps]
    },
    {
      test: /\.md/,
      loader: 'html?removeAttributeQuotes=false!remarkable'
    },
    ],
    postcss: function() {
      return [
        autoprefixer({
          browsers: [
            '>1%',
            'last 4 versions',
            'Firefox ESR',
            'not ie < 9', // React doesn't support IE8 anyway
          ]
        }),
      ];
    },
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.coffee', '.json'],
    fallback: paths.nodePaths
  },
  plugins: plugins,
  remarkable: {
    preset: 'full',
    typographer: true
  }
};