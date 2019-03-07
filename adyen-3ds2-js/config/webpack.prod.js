const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const resolve = dir => path.resolve(__dirname, dir);
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const SDK_VERSION_NUM = require('../package.json').version;

module.exports = merge(commonConfig, {
    mode : 'production',
    output: {
        filename: 'threedsSDK.' + SDK_VERSION_NUM +'.min.js',
        path: resolve('../dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ],
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin({
            maxModules: Infinity,
            // Display bailout reasons
            optimizationBailout: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ]
});