/** @type {import('webpack').Configuration} */
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { HotModuleReplacementPlugin } = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

const devConfig = {
  devServer: {
    hot: true,
    open: true,
    port: 3000,
    static: "../dist",
  },
  devtool: "eval-source-map",
  mode: "development",
  module: {
    rules: [
      {
        use: ["style-loader", "css-loader", "sass-loader"],
        test: /.(css|sass|scss)$/,
      },
    ],
  },
  plugins: [new HotModuleReplacementPlugin(), new ReactRefreshWebpackPlugin()],
  target: "web",
};

module.exports = merge(common, devConfig);
