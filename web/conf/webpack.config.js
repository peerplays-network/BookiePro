var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var Clean = require('clean-webpack-plugin');
var git = require('git-rev-sync');
require('es6-promise').polyfill();
var CopyWebpackPlugin = require('copy-webpack-plugin');
// BASE APP DIR
var root_dir = path.resolve(__dirname, '..');
var packageJSON = require('../package.json');
var chalk = require('chalk');

// FUNCTION TO EXTRACT CSS FOR PRODUCTION
function extractForProduction(loaders) {
  return ExtractTextPlugin.extract('style', loaders.substr(loaders.indexOf('!')));
}

module.exports = function(options) {
  console.log(chalk.gray('Options:', JSON.stringify(options, null, 4)));
  // console.log(options.prod ? "Using PRODUCTION options\n" : "Using DEV options\n");
  // STYLE LOADERS
  var cssLoaders = 'style-loader!css-loader!postcss-loader',
    scssLoaders = 'style!css!postcss-loader!sass?outputStyle=expanded';

  // DIRECTORY CLEANER
  var cleanDirectories = ['dist'];

  // OUTPUT PATH
  var outputPath = path.join(root_dir, 'assets');

  var define = {
    APP_PACKAGE_VERSION: JSON.stringify(packageJSON.version),
    SOFTWARE_UPDATE_REFERENCE_ACCOUNT_NAME: JSON
      .stringify(options.SOFTWARE_UPDATE_REFERENCE_ACCOUNT_NAME || 'ppcoreupdates'),
    APP_VERSION: JSON.stringify(packageJSON.version),
    __ELECTRON__: !!options.electron,
    CORE_ASSET: JSON.stringify('PPY'),
    BLOCKCHAIN_URL: JSON.stringify(options.blockchain || 'wss://pma.blockveritas.co:8089/'),
    FAUCET_URL: JSON.stringify(options.faucet || 'https://faucet.peerplays.download/faucet'),
    FAUCET_FILE: JSON.stringify(options.faucetFile || 'faucetUrls'),
    BITSHARES_WS: JSON.stringify(options.BITSHARES_WS || 'wss://bitshares.openledger.info/ws'),
  };
  console.log(chalk.gray('Environment configuration: ', JSON.stringify(define, null, 4)));
  // COMMON PLUGINS
  var plugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin(define)
  ];

  if (options.prod) {
    // WRAP INTO CSS FILE
    cssLoaders = extractForProduction(cssLoaders);
    scssLoaders = extractForProduction(scssLoaders);

    // PROD PLUGINS
    plugins.push(new Clean(cleanDirectories, {root: root_dir}));
    plugins.push(new webpack.DefinePlugin({'process.env': {NODE_ENV: JSON
      .stringify('production')}}));

    plugins.push(new ExtractTextPlugin('app.css'));

    if (!options.noUgly) {
      plugins.push(new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        sourceMap: true,
        compress: {
          warnings: true
        },
        output: {
          screw_ie8: true
        }
      }));
    }

    // plugins.push(new webpack.optimize.CommonsChunkPlugin({
    //     names: ["app", "vendors"],
    //     filename: "vendors.js"
    // }));

    // PROD OUTPUT PATH
    outputPath = path.join(root_dir, 'dist');

    plugins.push(new CopyWebpackPlugin([
      {from: path.resolve(root_dir, 'app/assets/openpgp'), to: path.resolve(outputPath, 'openpgp')},
      {from: path.resolve(root_dir, 'app/assets/createjs-2015.11.26.min.js'),
        to: path.resolve(outputPath, 'createjs-2015.11.26.min.js')},
    ]));
  } else {
    plugins.push(new webpack.DefinePlugin({
      'process.env': {NODE_ENV: JSON.stringify('development')}
    })),
    plugins.push(new webpack.HotModuleReplacementPlugin());

    if (options.ugly) {
      plugins.push(new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        sourceMap: true,
        compress: {
          warnings: true
        },
        output: {
          screw_ie8: true
        }
      }));
    }
  }

  var config = {
    entry: {
      app: options.prod ?
        path.resolve(root_dir, 'app/Main.js') :
        [
          'webpack-dev-server/client?http://localhost:8082',
          'webpack/hot/only-dev-server',
          path.resolve(root_dir, 'app/Main-dev.js')
        ]
    },
    output: {
      path: outputPath,
      filename: 'app.js',
      pathinfo: !options.prod,
      sourceMapFilename: '[name].js.map'
    },
    devtool: options.prod ? 'cheap-module-source-map' : 'eval',
    debug: !options.prod,
    module: {
      noParse: /node_modules\/openpgp\/dist\/openpgp.js/,
      loaders: [
        {
          test: /\.jsx$/,
          include: [path.join(root_dir, 'app'),
            path.join(root_dir, 'node_modules/react-foundation-apps'),
            '/home/sigve/Dev/graphene/react-foundation-apps'],
          loaders: options.prod ? ['babel-loader'] : ['babel-loader?cacheDirectory=../babel-cache']
        },
        {
          test: /\.js$/,
          exclude: [/node_modules/, path.resolve(root_dir, '../dl/node_modules')],
          loader: 'babel-loader',
          query: {compact: false, cacheDirectory: true}
        },
        {
          test: /\.json/, loader: 'json',
          exclude: [
            path.resolve(root_dir, '../dl/src/common'),
            path.resolve(root_dir, 'app/assets/locales')
          ]
        },
        {test: /\.coffee$/, loader: 'coffee-loader'},
        {test: /\.(coffee\.md|litcoffee)$/, loader: 'coffee-loader?literate'},
        {test: /\.css$/, loader: cssLoaders},
        {
          test: /\.scss$/,
          loader: scssLoaders
        },
        {
          test: /(\.png$)/, loader: 'url-loader?limit=100000',
          exclude:[
            path.resolve(root_dir, 'app/assets/asset-symbols'),
            path.resolve(root_dir, 'app/assets/images')
          ]
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
          exclude : [
            path.join(root_dir, 'app/assets/images')
          ]
        },
        {test: /\.woff$/, loader: 'url-loader?limit=100000&mimetype=application/font-woff'},
        {test: /.*\.svg$/, loaders: ['svg-inline-loader', 'svgo-loader'] ,
          exclude:[path.resolve(root_dir, 'app/assets/images/games/rps')]},
        {test: /\.md/, loader: 'html?removeAttributeQuotes=false!remarkable'},
      ],
      postcss: function () {
        return [precss, autoprefixer];
      }
    },
    resolve: {
      root: [path.resolve(root_dir, './app'), path.resolve(root_dir, '../dl/src')],
      extensions: ['', '.js', '.jsx', '.coffee', '.json'],
      modulesDirectories: ['node_modules'],
      fallback: [path.resolve(root_dir, './node_modules')]
    },
    resolveLoader: {
      root: path.join(root_dir, 'node_modules'),
      fallback: [path.resolve(root_dir, './node_modules')]
    },
    plugins: plugins,
    root: outputPath,
    remarkable: {
      preset: 'full',
      typographer: true
    },
    externals: {
      'createjs': 'createjs'
    }
  };

  // if(options.prod) config.entry.vendors = [
  //     "classnames", "react-router", "highcharts/highstock", "counterpart",
  //       "react-translate-component",
  //     "perfect-scrollbar", "jdenticon", "react-notification-system", "react-tooltip",
  //     "whatwg-fetch", "alt", "react-json-inspector",
  //     "immutable", "peerplaysjs-lib"
  // ];

  return config;
};
