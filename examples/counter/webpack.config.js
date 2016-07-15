var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-source-map',
  entry: [
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist'
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    alias: {
      'preact-flyd': path.join(__dirname, '..', '..', 'src')
    },
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      // include: [__dirname,path.join(__dirname, '..', '..', 'src')],
      query: {
        presets: ['es2015'],
        plugins: [
          ["transform-react-jsx", { "pragma":"h" }]
        ]
      }
    }]
  },
  devServer: {
    historyApiFallback: true
  },
};
