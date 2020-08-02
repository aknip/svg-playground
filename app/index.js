'use strict';

var path = require('path');
const Webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');

const compiler = Webpack(webpackConfig);

var port = process.env['WEB_APP_PORT']; // used by iPad App "play.js" for preview
if (port == undefined) {
  port = '8080';
}

const devServerOptions = {
  host: '0.0.0.0',
  contentBase: path.resolve(__dirname, 'src'),
  stats: {
    colors: true
  }
};

const server = new webpackDevServer(compiler, devServerOptions);

server.listen(port, '0.0.0.0', () => {
  console.log('Starting server on http://localhost:'+port);
});

