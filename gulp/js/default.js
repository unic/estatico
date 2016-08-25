'use strict';

/**
 * @function `gulp js`
 * @desc Generate `main.js` and `head.js` by concatenating their dependencies (using `gulp-resolve-dependencies`) and optionally minifying the result (using `uglifyJS`).
 */

var gulp = require('gulp');

var taskName = 'js',
		taskConfig = {
			mainSrc: [
				'./source/assets/js/main.js',
				'./source/assets/js/head.js'
			],
			devSrc: [
				'./source/assets/js/dev.js'
			],
			srcBase: './source/assets/js/',
			dest: './build/assets/js/',
			watch: [
				'source/assets/js/**/*.js',
				'source/assets/.tmp/**/*.js',
				'source/modules/**/*.js',
				'source/demo/modules/**/*.js',
				'source/demo/modules/**/*.jsx',
				'!source/modules/**/*.data.js',
				'!source/demo/modules/**/*.data.js',
				'!source/modules/**/*.mock.js',
				'!source/demo/modules/**/*.mock.js'
			]
		},
		task = function(config, cb) {
			var helpers = require('require-dir')('../../helpers'),
				plumber = require('gulp-plumber'),
				size = require('gulp-size'),
				livereload = require('gulp-livereload'),
				util = require('gulp-util'),
				glob = require('glob'),
				sourcemaps = require('gulp-sourcemaps'),
				concat = require('gulp-concat'),
				webpack = require('gulp-webpack-sourcemaps'),
				tap = require('gulp-tap'),
				uglify = require('gulp-uglify'),
				rename = require('gulp-rename'),
				lazypipe = require('lazypipe'),
				ignore = require('gulp-ignore'),
				_ = require('lodash'),
				path = require('path'),
				merge = require('merge-stream');

				var tasks,
					src = config.src.map(function(pattern) {
						return glob.sync(pattern);
					});

				src = _.flatten(src);

				// Optionally build dev scripts
				if (util.env.dev) {
					src = src.concat(config.devSrc);
				}

				tasks = _.map(config.src, function(srcPath) {
					var writeSourceMaps = lazypipe()
							.pipe(sourcemaps.write, '.', {
								includeContent: false,
								sourceRoot: config.srcBase
							}),
						excludeSourcemaps = lazypipe()
							.pipe(ignore.exclude, function(file) {
								return path.extname(file.path) === '.map';
							}),

						minify = lazypipe()
							.pipe(gulp.dest, config.dest)
							.pipe(excludeSourcemaps)
							.pipe(uglify, {
								preserveComments: 'some'
							})
							.pipe(rename, {
								suffix: '.min'
							});

					return gulp.src(srcPath, {
						base: config.srcBase
					})
						.pipe(plumber())
						.pipe(tap(function(file) {
							// Add property for webpack
							file.named = path.basename(file.path, path.extname(file.path));
						}))
						.pipe(sourcemaps.init())
						.pipe(webpack({
							resolve: {
								alias: {
									handlebars: 'handlebars/runtime.js',
									jquery: path.join(__dirname, '../../node_modules/jquery/dist/jquery.js')
								}
							},
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
											presets: ['es2015', 'stage-0', 'react'],
											plugins: [
												'transform-class-properties',
												'transform-proto-to-assign', // it looks like also this plugin is needed, taken from https://github.com/babel/babelify/issues/133#issuecomment-172392178
												['transform-es2015-classes', {
													loose: true
												}]
											]
										}
									}
								]
							}
						}).on('error', function(error) {
							helpers.errors({
								task: taskName,
								message: error.message
							});
						}).on('warning', function(warning) {
							console.log(warning.message);
						}))
						.pipe(writeSourceMaps())
						.pipe(util.env.dev ? util.noop() : minify())
						.pipe(size({
							title: taskName,
							showFiles: true
						}))
						.pipe(gulp.dest(config.dest))
						.pipe(excludeSourcemaps())

						// TODO: Not very reliable, seems to be triggered to early
						.pipe(livereload());
				});

			merge(tasks).on('finish', cb);
		};

gulp.task(taskName, ['js:lint'], function(cb) {
	return task(taskConfig, cb);
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig,
	task: task
};
