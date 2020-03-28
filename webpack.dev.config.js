const path = require("path");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require("./webpack.common.config");

module.exports = merge(common, {
  node: {
    fs: 'empty'
  },
  mode: "development",
  devtool: "none",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    https: true,
    host: '0.0.0.0',
    overlay: {
      warnings: false,
      errors: true
    }
  },
  plugins: [new HtmlWebpackPlugin({
    template: "./src/index.html",
    filename: "index.html",
    inject: 'head'
  })]
});