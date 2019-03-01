const path = require('path');
const webpack = require('webpack');
const resolve = dir => path.resolve(__dirname, dir);
const SDK_VERSION_NUM = require('../package.json').version;

module.exports = {
    entry: [resolve('../src/index.js')],
    output: {
        filename: `threedsSDK.${SDK_VERSION_NUM}.js`,
        path: resolve('../dist/assets/'),
    },
    performance: {
        maxAssetSize: 400000,
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
        new webpack.DefinePlugin({
            'process.env': {
                __SDK_VERSION__: `"${SDK_VERSION_NUM}"`
            },
        }),
    ],
};
