
const path = require('path');

module.exports = {
	// context: path.resolve(__dirname, '..'),
	entry: {
		index: path.resolve(__dirname, '..', './index.js'),
	},
	output: {
		path: path.resolve(__dirname, '..', 'dist'),
		filename: '[name].js',
	},
	target: 'node',
};
