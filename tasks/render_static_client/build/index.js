
const ora = require('ora');
const chalk = require('chalk');
const webpack = require('webpack');
const config = require('./config');
const {getIdeas} = require('./db');

async function webpackPromise (config) {
	return new Promise((resolve, reject) => {
		webpack(config, (error, stats) => {
			if (error) return reject(error);
			resolve(stats);
		});
	});
}

async function displayWebpackStats (stats) {
	process.stdout.write(stats.toString({
		colors: true,
		modules: false,
		children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
		chunks: false,
		chunkModules: false
	}) + '\n\n');

	if (stats.hasErrors()) {
		console.log(chalk.red('  Build failed with errors.\n'));
		process.exit(1);
	}

	console.log(chalk.cyan('  Build complete.\n'));
	console.log(chalk.yellow(
		'  Tip: built files are meant to be served over an HTTP server.\n' +
		'  Opening index.html over file:// won\'t work.\n'
	));
}

const spinner = ora('Webpack building...');
spinner.start();

(async function main () {
	await getIdeas(async (idea) => {
		console.log('idea', idea);
		const stats = await webpackPromise(config);
		await displayWebpackStats(stats);
	});
	spinner.stop();
})();
