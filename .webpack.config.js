
const path = require('path');

module.exports = {
  target: 'web',
  mode: 'development',
  entry: './src/okinawa.js',
  output: {
    library: 'okinawa',
    libraryTarget: 'umd2',
    path: path.join(__dirname, '/'),
    filename: 'okinawa.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }  
};
