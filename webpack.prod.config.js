const path = require("path");
const merge = require("webpack-merge");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

const common = require("./webpack.common.config");

module.exports = merge(common, {
  node: {
    fs: 'empty'
  },
  mode: "production",
  devtool: "none",
  entry: "./src/index.js",
  output: {
    filename: "[contentHash].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  devServer: {
    overlay: {
      warnings: false,
      errors: true
    }
  },
  optimization: {
    minimizer: [new TerserPlugin()]
  },
  plugins: [new CleanWebpackPlugin(), new HtmlWebpackPlugin({
    template: "./src/index.html",
    filename: "index.html",
    inject: 'head'
  })]
});