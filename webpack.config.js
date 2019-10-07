var path = require('path');

const TerserPlugin = require('terser-webpack-plugin');

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
			use: [
				{
					loader: require.resolve('babel-loader'),
					options: {
						compact: true,
						highlightCode: true,
						plugins: [
							"@babel/plugin-transform-template-literals",
							"@babel/plugin-transform-arrow-functions"
						]
					}
				}
			]
		}]
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				parallel: true,
				terserOptions: {
					parse: {
						// we want uglify-js to parse ecma 8 code. However, we don't want it
						// to apply any minfication steps that turns valid ecma 5 code
						// into invalid ecma 5 code. This is why the 'compress' and 'output'
						// sections only apply transformations that are ecma 5 safe
						// https://github.com/facebook/create-react-app/pull/4234
						ecma: 8
					},
					compress: {
						ecma: 5,
						warnings: false,
						// Disabled because of an issue with Uglify breaking seemingly valid code:
						// https://github.com/facebook/create-react-app/issues/2376
						// Pending further investigation:
						// https://github.com/mishoo/UglifyJS2/issues/2011
						comparisons: false
					},
					mangle: {
						// Pass true to work around the Safari 10 loop
						// iterator bug "Cannot declare a let variable twice".
						safari10: true
					},
					output: {
						ecma: 5,
						comments: false,
						// Turned on because emoji and regex is not minified properly using default
						// https://github.com/facebook/create-react-app/issues/2488
						ascii_only: true
					}
				}
			})
		]
	}
};
