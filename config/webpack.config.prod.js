var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var path = require('path');
var paths = require('./paths');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var Clean = require('clean-webpack-plugin');
var Config = require('./Config');

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
var publicPath = paths.servedPath;

// FUNCTION TO EXTRACT CSS FOR PRODUCTION
function extractForProduction(loaders) {
  return ExtractTextPlugin.extract('style', loaders.substr(loaders.indexOf('!')));
}

// STYLE LOADERS
var cssLoaders = 'style-loader!css-loader!postcss-loader',
  scssLoaders = 'style!css!postcss-loader!sass?outputStyle=expanded';

// DIRECTORY CLEANER
var cleanDirectories = ['build', 'dist'];

// GLOBAL VAR DEFINE
var define = {
  APP_PACKAGE_VERSION: JSON.stringify(Config.APP_PACKAGE_VERSION),
  SOFTWARE_UPDATE_REFERENCE_ACCOUNT_NAME: JSON.stringify(
    Config.SOFTWARE_UPDATE_REFERENCE_ACCOUNT_NAME
  ),
  APP_VERSION: JSON.stringify(Config.APP_VERSION),
  __ELECTRON__: true,
  CORE_ASSET: JSON.stringify(Config.CORE_ASSET),
  BLOCKCHAIN_URL: JSON.stringify(Config.BLOCKCHAIN_URLS),
  FAUCET_URL: JSON.stringify(Config.FAUCET_URLS),
  BITSHARES_WS: JSON.stringify(Config.BITSHARES_WS),
};

// COMMON PLUGINS
var plugins = [
  new HtmlWebpackPlugin({
    inject: true,
    template: paths.appHtml,
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true
    }
  }),
  new webpack.optimize.DedupePlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.DefinePlugin(define),
  new Clean(cleanDirectories),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  }),
  new ExtractTextPlugin('app.css'),
  new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    sourceMap: true,
    compress: {
      screw_ie8: true, // React doesn't support IE8
      warnings: false
    },
    mangle: {
      screw_ie8: true,
    },
    output: {
      comments: false,
      screw_ie8: true
    }
  }),
  new ManifestPlugin({fileName: 'asset-manifest.json'})
];

// WRAP INTO CSS FILE
cssLoaders = extractForProduction(cssLoaders);
scssLoaders = extractForProduction(scssLoaders);

module.exports = {
  bail: true,
  devtool: 'source-map',
  entry: [
    require.resolve('./polyfills'),
    paths.appIndexJs
  ],
  output: {
    // The build folder
    path: paths.appBuild,
    // Generated JS file names (with nested folders).
    // There will be one main bundle, and one file per asynchronous chunk.
    // We don't currently advertise code splitting but Webpack supports it.
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath: publicPath
  },
  debug: false,
  module: {
    noParse: /node_modules\/build/,
    loaders: [{
      test: /\.jsx$/,
      include: [
        paths.appSrc,
        path.join(paths.appNodeModules, '/react-foundation-apps'),
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
      query: {
        name: 'static/media/[name].[hash:8].[ext]'
      },
      exclude: [paths.assetSymbols, paths.assetImages]
    },
    {
      test: /\.svg$/,
      loader: 'file',
      query: {
        name: 'static/media/[name].[hash:8].[ext]'
      }
    },
    {
      test: /\.(jpe?g|png|gif)$/i,
      loaders: [
        'file?hash=sha512&digest=hex&name=[hash].[ext]',
        {
          loader: 'image-webpack',
          options: {
            bypassOnDebug: true,
            optipng: {
              optimizationLevel: true
            },
            gifsicle: {
              interlaced: true
            }
          }
        }
      ],
      exclude: [paths.assetImages]
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
