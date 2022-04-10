/** @type {import('webpack').Configuration} */
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

const prodConfig = {
  devtool: "source-map",
  mode: "production",
  module: {
    rules: [
      {
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        test: /.(css|sass|scss)$/,
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};

module.exports = merge(common, prodConfig);
