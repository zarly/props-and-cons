
const path = require('path');

module.exports = {
	// context: path.resolve(__dirname, '..'),
	entry: {
		app: path.resolve(__dirname, '..', './index.js'),
	},
	output: {
		path: path.resolve(__dirname, '..', 'dist'),
		filename: '[name].js',
		publicPath: '/',
	},
	target: 'node',
};
