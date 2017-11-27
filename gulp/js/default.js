'use strict';

/**
 * @function `gulp js`
 * @desc Use Webpack to transpile and bundle JavaScript sources. By default, Webpack's built-in, faster file watcher is used while developing. Add the `--skipWebpackWatch` flag to fall back to a simple gulp watcher.
 */

var gulp = require('gulp'),
	util = require('gulp-util');

var taskName = 'js',
	taskConfig = {
		src: [
			'./source/assets/js/main.js',
			'./source/assets/js/head.js',
			'./source/preview/assets/js/test.js',
			'./source/demo/modules/**/*.test.js'
		],
		devSrc: [
			'./source/assets/js/dev.js'
		],
		srcBase: './source/assets/js/',
		dest: './build/assets/js/',
		destBase: './build/',
		destAsyncSuffix: 'async/',
		watch: [
			'source/assets/js/**/*.js',
			'source/assets/js/**/*.jsx',
			'source/assets/.tmp/**/*.js',
			'source/modules/**/*.js',
			'source/modules/**/*.jsx',
			'source/demo/modules/**/*.js',
			'source/demo/modules/**/*.jsx',
			'!source/modules/**/*.data.js',
			'!source/demo/modules/**/*.data.js',
			'!source/modules/**/*.mock.js',
			'!source/demo/modules/**/*.mock.js',
			'!source/modules/**/*.test.js',
			'!source/demo/modules/**/*.test.js'
		],
		hasWebpackWatch: true
	},
	task = function(config, cb) {
		var helpers = require('require-dir')('../../helpers'),
			_ = require('lodash'),
			path = require('path'),
			glob = require('glob'),
			webpack = require('webpack'),
			livereload = require('gulp-livereload');

		var src = taskConfig.src.reduce(function(paths, pathGlob) {
				var resolvedGlob = glob.sync(pathGlob).map(function(file) {
						return path.resolve(file);
					});

				return paths.concat(resolvedGlob);
			}, []),
			compiler;

		// Optionally build dev scripts
		if (util.env.dev) {
			src = src.concat(config.devSrc);
		}

		compiler = webpack({
			// Create a map of entries, i.e. {'assets/js/main': './source/assets/js/main.js'}
			entry: helpers.webpack.getEntries(src, config.srcBase),
			module: {
				loaders: [
					{
						test: /\.hbs$/,
						loader: 'handlebars-loader'
					},
					{
						test: /jquery\.js$/,
						loader: 'expose?$!expose?jQuery'
					},
					{
						test: /handlebars\.js$/,
						loader: 'expose?Handlebars'
					},
					{
						test: /(\.js|\.jsx)$/,
						exclude: /node_modules/,
						loader: 'babel-loader',
						query: {
							presets: ['es2015', 'react'],
							plugins: [
								// Work around some issues in IE
								'transform-class-properties',
								'transform-proto-to-assign',
								['transform-es2015-classes', {
									loose: true
								}]
							]
						}
					},
					{
						test: /qunit\.js$/,
						loader: 'expose?QUnit'
					},
					{
						test: /\.css$/,
						loader: 'style-loader!css-loader'
					}
				]
			},
			externals: function(context, request, callback) {
				// Do not include jQuery in test-related files
				if (request === 'jquery' && /(\/preview\/assets\/js|\/modules\/)/.test(context)) {
					return callback(null, 'jQuery');
				// Do not include QUnit in every single test file
				} else if (request === 'qunitjs' && /\/modules\//.test(context)) {
					return callback(null, 'QUnit');
				}

				callback();
			},

			// Minifiy in prod mode
			plugins: [

			].concat(util.env.dev ? [] : [
				new webpack.DefinePlugin({
					'process.env': {
						'NODE_ENV': JSON.stringify('production')
					}
				}),
				new webpack.optimize.UglifyJsPlugin({
					mangle: {
						'keep_fnames': true
					}
				})
			]),
			output: {
				path: config.dest,
				filename: util.env.dev ? '[name].js' : '[name].min.js',

				// Save async loaded files (using require.ensurce) in special dir
				chunkFilename: config.destAsyncSuffix + (util.env.dev ? '[name].js' : '[name].min.js'),

				// Tell webpack about the asset path structure in the browser to be able to load async files
				publicPath: path.join('/', path.relative(config.destBase, config.dest), '/')
			},
			devtool: util.env.dev ? 'eval-cheap-module-source-map' : null,
			handlebarsLoader: {
				partialResolver: function(partial, callback) {
					var resolvedPath = path.resolve('./source/', partial + '.hbs');

					callback(null, resolvedPath);
				}
			}
		});

		if (util.env.watch && !util.env.skipWebpackWatch) {
			cb = _.once(cb);

			compiler.watch({

			}, function(err, stats) {
				helpers.webpack.log(err, stats, taskName);

				livereload.reload();

				cb();
			});
		} else {
			compiler.run(function(err, stats) {
				helpers.webpack.log(err, stats, taskName);

				livereload.reload();

				cb();
			});
		}
	};

gulp.task(taskName, ['js:lint'], function(cb) {
	return task(taskConfig, cb);
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig,
	task: task
};
