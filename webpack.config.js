const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

let ENV = process.env.ENV
let isDev = ENV !== 'production'

module.exports = {
  mode: ENV || 'development',
  entry: './src/index.ts',
  devtool: isDev && 'source-map-cheap-eval',
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
  },

  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      title: '3 match',
      template: 'src/index.html',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: { allowTsInNodeModules: true },
          },
        ],
        include: [/node_modules\/noru-utils/, path.resolve(__dirname, 'src')],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },

  devServer: {
    open: true,
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.css', '.scss', '.sass'],
  },
}
