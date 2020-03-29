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
  entry: {
    desktop: "./src/index.js",
    vr: "./src/vr.js"
  },
  output: {
    filename: "[name].[contentHash].bundle.js",
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
    chunks: ['desktop'],
    template: "./src/index.html",
    filename: "index.html",
    inject: 'body'
  }),
  new HtmlWebpackPlugin({
    chunks: ['vr'],
    template: "./src/vr.html",
    filename: "vr.html",
    inject: 'head'
  })]
});