var production = (process.env.PROD || false);
var webpack = require('webpack');
var ProgressPlugin = require('webpack/lib/ProgressPlugin');
var WebpackDevServer = require('webpack-dev-server');
var config = require(production ? './config/webpack.config.prod' : './config/webpack.config.dev');
var chalk = require('chalk');
var opn = require('opn');
var detect = require('detect-port');
var clearConsole = require('react-dev-utils/clearConsole');
var prompt = require('react-dev-utils/prompt');
var getProcessForPort = require('react-dev-utils/getProcessForPort');
var compiler = webpack(config);
var isInteractive = process.stdout.isTTY;
var DEFAULT_PORT = process.env.PORT || 8082;

function setupCompiler(host, port, protocol) {
  compiler.apply(new ProgressPlugin(function (percentage, msg) {
    process.stdout.write(chalk.green(
      (percentage * 100).toFixed(2) + '% ' + msg + '                 \033[0G'
    ));
  }));
}

function runDevServer(host, port, protocol) {
  var devServer = new WebpackDevServer(compiler, {
    compress: true,
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
    // Enable HTTPS if the HTTPS environment variable is set to 'true'
    https: protocol === 'https',
    host: host
  });

  devServer.listen(port, (err, result) => {
    if (err) {
      console.log(chalk.red(err));
    }
    console.log(
      chalk.cyan('Starting the development server... \n') +
      chalk.yellow('Listening at ' + host + ':' + port + '/')
    );
    console.log();
    opn(protocol + '://' + host + ':' + port + '/');
  })
}

function run(port) {
  var protocol = process.env.HTTPS === 'true' ? "https" : "http";
  var host = process.env.HOST || 'localhost';
  setupCompiler(host, port, protocol);
  runDevServer(host, port, protocol);
}

// We attempt to use the default port but if it is busy, we offer the user to
// run on a different port. `detect()` Promise resolves to the next free port.
detect(DEFAULT_PORT).then(port => {
  if (port === DEFAULT_PORT) {
    run(port);
    return;
  }

  if (isInteractive) {
    clearConsole();
    var existingProcess = getProcessForPort(DEFAULT_PORT);
    var question =
      chalk.yellow('Something is already running on port ' + DEFAULT_PORT + '.' +
        ((existingProcess) ? ' Probably:\n  ' + existingProcess : '')) +
      '\n\nWould you like to run the app on another port instead?';

    prompt(question, true).then(shouldChangePort => {
      if (shouldChangePort) {
        console.log(chalk.green('Using port: ' + port + ' instead.'))
        run(port);
      }
    });
  } else {
    console.log(chalk.red('Something is already running on port ' + DEFAULT_PORT + '.'));
  }
});