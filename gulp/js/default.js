'use strict';

/**
 * @function `gulp js`
 * @desc Generate `main.js` and `head.js` by concatenating their dependencies (using `gulp-resolve-dependencies`) and optionally minifying the result (using `uglifyJS`).
 */

var gulp = require('gulp');

var taskName = 'js',
		taskConfig = {
			src: {
				main: './source/assets/js/main.js',
				head: './source/assets/js/head.js'
			},
			devSrc: {
				dev: './source/assets/js/dev.js'
			},
			srcBase: './source/',
			dest: './build/assets/js/',
			watch: [
				'source/assets/js/**/*.js',
				'source/assets/.tmp/**/*.js',
				'source/modules/**/*.js',
				'source/demo/modules/**/*.js',
				'!source/modules/**/*.data.js',
				'!source/demo/modules/**/*.data.js',
				'!source/modules/**/*.mock.js',
				'!source/demo/modules/**/*.mock.js'
			]
		},
		task = function(config, cb) {
			var helpers = require('require-dir')('../../helpers'),
				size = require('gulp-size'),
				livereload = require('gulp-livereload'),
				util = require('gulp-util'),
				webpack = require('gulp-webpack'),
				tap = require('gulp-tap'),
				uglify = require('gulp-uglify'),
				rename = require('gulp-rename'),
				lazypipe = require('lazypipe'),
				_ = require('lodash'),
				path = require('path'),
				merge = require('merge-stream');

			// Optionally build dev scripts
			if (util.env.dev) {
				_.merge(config.src, config.devSrc);
			}

			var tasks = _.map(config.src, function(srcPath) {
					var minify = lazypipe()
							.pipe(gulp.dest, config.dest)
							.pipe(uglify, {
								preserveComments: 'some'
							})
							.pipe(rename, {
								suffix: '.min'
							});

					return gulp.src(srcPath, {
						base: config.srcBase
					})
						.pipe(tap(function(file) {
							// Add property for webpack
							file.named = path.basename(file.path, path.extname(file.path));
						}))
						.pipe(webpack({
							resolve: {
								alias: {
									handlebars: 'handlebars/runtime.js'
								}
							},
							module: {
								loaders: [
									{
										test: /\.hbs$/,
										loader: 'handlebars-loader'
									}
								]
							}
						}, null, function(err, stats) {
							stats.compilation.errors.forEach(function(error) {
								helpers.errors({
									message: error.message
								});
							});

							stats.compilation.warnings.forEach(function(error) {
								console.log(error.message);
							});
						}))
						.pipe(util.env.dev ? util.noop() : minify())
						.pipe(size({
							title: taskName,
							showFiles: true
						}))
						.pipe(gulp.dest(config.dest))

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
