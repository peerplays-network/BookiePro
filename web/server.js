var env = (process.env.PROD || false);
var isDevNet = (process.env.DEV_NET || false);

var webpack = require('webpack');
var ProgressPlugin = require('webpack/lib/ProgressPlugin');
var WebpackDevServer = require('webpack-dev-server');
var config = isDevNet ?
  require('./conf/webpack-dev-net') :
  require(env ?
    './conf/webpack-dev-ugly' :
    './conf/webpack-dev'
  );

var compiler = webpack(config);


compiler.apply(new ProgressPlugin(function (percentage, msg) {
  process.stdout.write((percentage * 100).toFixed(2) + '% ' + msg + '                 \033[0G');
}));
new WebpackDevServer(compiler, {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  // Switch assets, children, chunks to see verbose information in console.
  stats: {
    assets: false,
    children: false,
    colors: true,
    chunks: false,
    errors: true,
    errorDetails: true,
    warnings: true
  },
  port: 8082
}).listen(8082, '0.0.0.0', function (err, result) {
  if (err) {
    console.log(err);
  }
  console.log('Listening at 0.0.0.0:8082');
});