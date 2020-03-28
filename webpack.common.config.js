module.exports = {
  devtool: "none",
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(svg|png|jpg|gif|patt)$/,
        use: {
          // The file-loader resolves import/require() on a file into a url and emits the file into the output directory.
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]",
            outputPath: "imgs"
          }
        }
      }
    ]
  }
}