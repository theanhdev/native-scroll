const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'native-scroll.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'native-scroll.min.js'
  },
  devtool: 'source-map'
};