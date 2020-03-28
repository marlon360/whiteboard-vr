module.exports = {
  devtool: "none",
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ]
  }
}