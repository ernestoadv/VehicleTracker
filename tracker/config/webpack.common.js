/** @type {import('webpack').Configuration} */
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { EnvironmentPlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DotenvWebpackPlugin = require("dotenv-webpack");
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  mode: "production",
  module: {
    rules: [
      {
        use: "babel-loader",
        test: /.(js|jsx)$/,
        exclude: /node_modules/,
      },
      {
        type: "asset",
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].[contenthash].js",
    publicPath: "",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new DotenvWebpackPlugin(),
    new EnvironmentPlugin({
      GOOGLE_MAPS_API_KEY: "AIzaSyCZgE5vU4EUwC3vqakIV4SPwJ79JcDYmX4",
      ROADS_API: "https://roads.googleapis.com/v1/snapToRoads",
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },
};
