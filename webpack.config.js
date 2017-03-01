'use strict'
process.env.NODE_ENV = 'production';

const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: [
    // './app/index.js'
    './src/index.js'
  ],
  target: 'electron',
  output: {
    path: path.resolve(__dirname, 'bundle'),
    publicPath: '/bundle/',
    filename: 'app.bundle.js'
  },
  module: {
    // preLoaders: [
    //   {
    //     test: /\.(js|jsx)$/,
    //     loader: 'eslint',
    //     include: path.appSrc,
    //   }
    // ],
    loaders: [
      // ** ADDING/UPDATING LOADERS **
      // The "url" loader handles all assets unless explicitly excluded.
      // The `exclude` list *must* be updated with every change to loader extensions.
      // When adding a new loader, you must add its `test`
      // as a new entry in the `exclude` list for "url" loader.

      // "url" loader embeds assets smaller than specified size as data URLs to avoid requests.
      // Otherwise, it acts like the "file" loader.
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.less$/,
          /\.css$/,
          /\.json$/,
          /\.svg$/
        ],
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      // Process JS with Babel.
      {
        test: /\.(js|jsx)$/,
        include: path.appSrc,
        loader: 'babel',
        query: {
          plugins: [
            ['import', [{ libraryName: "antd", style: true }]],  // import less
          ],
          // This is a feature of `babel-loader` for webpack (not Babel itself).
          // It enables caching results in ./node_modules/.cache/babel-loader/
          // directory for faster rebuilds.
          cacheDirectory: true
        }
      },
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use a plugin to extract that CSS to a file, but
      // in development "style" loader enables hot editing of CSS.
      {
        test: /\.css$/,
        loader: 'style!css?importLoaders=1!postcss'
      },
      // JSON is not enabled by default in Webpack but both Node and Browserify
      // allow it implicitly so we also enable it.
      {
        test: /\.json$/,
        loader: 'json'
      },
      // "file" loader for svg
      {
        test: /\.svg$/,
        loader: 'file',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      // Parse less files and modify variables
      {
        test: /\.less$/,
        loader: 'style!css!postcss!less'
      },
      // ** STOP ** Are you adding a new loader?
      // Remember to add the new extension(s) to the "url" loader exclusion list.
    ],
    rules: [{
      test: /\.js$/,
      include: [path.resolve(__dirname, 'app')],
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        presets: [
          ['es2015',  { "modules": false }],
          'react'
        ]
      }
    }, {
      test: /\.(scss|css)$/,
      loaders: ['style-loader', 'css-loader', 'sass-loader']
    }, {
      test: /\.json/,
	  // exclude: /node_modules/,
	  loader: 'json-loader'
    }, {
      test: /\.(png|jpg)$/,
      loader: 'url-loader'
    }, {
      test: /\.html$/,
      loader: 'html-loader'
    }, {
      test: /\.txt$/,
      loader: 'text-loader'
    }, {
      test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff'
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader'
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
    }]
  },
  // externals: [nodeExternals({
    // this WILL include `jquery` and `webpack/hot/dev-server` in the bundle, as well as `lodash/*`
    // whitelist: ['jquery', 'webpack/hot/dev-server', /^lodash/]
  // })]
}
