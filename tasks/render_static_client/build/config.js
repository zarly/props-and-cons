
const path = require('path');
const utils = require('../../../client/build/utils');
const vueLoaderConfig = require('../../../client/build/vue-loader.conf');

function resolve (dir) {
	return path.join(__dirname, '..', dir);
}

module.exports = {
	// context: path.resolve(__dirname, '..'),
	entry: {
		index: resolve('src/index.ts'),
	},
	output: {
		path: path.resolve(__dirname, '..', 'dist'),
		filename: '[name].js',
	},
	target: 'node',
	mode: 'production',
	resolve: {
		extensions: ['.js', '.ts', '.vue', '.json'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'@': resolve('src'),
		}
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: vueLoaderConfig
			},
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
			},
			// {
			// 	test: /\.js$/,
			// 	loader: 'babel-loader',
			// 	include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
			// },
			{
				test: /\.svg(\?.*)?$/,
				loader: 'vue-svg-loader',
				include: [resolve('static/icons')]
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]')
				},
				exclude: [resolve('static/icons')]
			},
			{
				test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('media/[name].[hash:7].[ext]')
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
				}
			}
		]
	},
};
