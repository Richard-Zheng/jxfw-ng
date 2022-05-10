// see: https://stackoverflow.com/a/69594493/13483323

const rewire = require('rewire');
const defaults = rewire('react-scripts/scripts/build.js');
const config = defaults.__get__('config');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== 'false';

// config.optimization.minimize = false;
// config.devtool = 'inline-source-map'

const path = require('path');
const fs = require('fs');
// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebook/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
config.plugins[0] = new HtmlWebpackPlugin(
  Object.assign(
    {},
    {
      inject: 'body',
      template: resolveApp('public/index.html'),
    },
    undefined
  )
)

const webpack = require('webpack');
config.plugins.push(...[
  shouldInlineRuntimeChunk &&
    new HtmlInlineScriptPlugin(),
  shouldInlineRuntimeChunk &&
    new HTMLInlineCSSWebpackPlugin(),
  new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
].filter(Boolean))
