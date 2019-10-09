var path = require('path');

module.exports = {
	entry: './src/reach.lib.js',
	mode: 'production',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'reach.min.js',
		library: 'rch',
		libraryTarget: 'umd',
		libraryExport: 'default',
		globalObject: 'this'
	},
	module: {
		rules: [{
			test: /\.js?$/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: [
						[
							"@babel/preset-env", {
								"useBuiltIns": "false",
								"corejs": 3,
								"debug": true,
								"forceAllTransforms": true
							}
						]
					]
				}
			}
		}]
	}
};
