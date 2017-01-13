var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var loaders = [
  {
    "test": /\.js?$/,
    "exclude": /node_modules/,
    "loader": "babel",
    "query": {
      "presets": [
        "es2015",
        "stage-0"
      ],
      "plugins": [
        [
          "transform-react-jsx",
          {
            "pragma": "h"
          }
        ]
      ]
    }
  }
];

module.exports = {
  // devtool: 'eval-source-map',
  devtool: 'cheap-source-map',
  entry: path.resolve('src', 'index.js'),
  resolve: {
    alias: {
      'preact-flyd': path.join(__dirname, '..', '..', 'src')
    },
    extensions: ['', '.js']
  },
  output: {
    path: path.resolve('build'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve('src', 'index.tpl.html'),
      inject: 'body',
      filename: 'index.html'
    })
  ],
  module: {
    loaders: loaders
  },
  devServer: {
    historyApiFallback: true
  },
};
