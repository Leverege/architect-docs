const path = require('path');
const Dotenv = require( 'dotenv-webpack' )
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const outputPath = path.resolve(__dirname, 'dist');

module.exports = {
  mode: 'development',
  entry: {
    app: require.resolve('./src/index'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.yaml$/,
        use: [
          { loader: 'json-loader' },
          { loader: 'yaml-loader' }
        ]
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin([
      outputPath
    ]),
    new CopyWebpackPlugin([
      {
        // Copy the Swagger OAuth2 redirect file to the project root;
        // that file handles the OAuth2 redirect after authenticating the end-user.
        from: require.resolve('swagger-ui/dist/oauth2-redirect.html'),
        to: './'
      }
    ]),
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    new Dotenv( {
      path : './.env', // Path to .env file (this is the default)
    } )
  ],
  output: {
    filename: '[name].bundle.js',
    path: outputPath,
  }
};
