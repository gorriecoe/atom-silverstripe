'use strict';

const path = require('path');

const config = {
  target: 'node',

  entry: './src/extension.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]'
  },
  devtool: 'source-map',
  externals: {
    commonjs: 'commonjs',
    atom: 'atom',
    coffeescript: 'coffeescript',
    'spdx-exceptions': 'spdx-exceptions',
    'spdx-license-ids': 'spdx-license-ids',
    'spdx-license-ids/deprecated': 'spdx-license-ids/deprecated'
  },
  resolve: {
    extensions: ['.js']
  },
  node: {
    fs: "empty",
    node_child: "empty",
    child_process: "empty",
    spdx_expression_parse: "empty",
    spdx_exceptions: "empty"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'standard-loader'
      }
    ]
  }
};
module.exports = config;
