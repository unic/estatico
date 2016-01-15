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
				plumber = require('gulp-plumber'),
				size = require('gulp-size'),
				livereload = require('gulp-livereload'),
				util = require('gulp-util'),
				resolveDependencies = require('gulp-resolve-dependencies'),
				sourcemaps = require('gulp-sourcemaps'),
				concat = require('gulp-concat'),
				uglify = require('gulp-uglify'),
				rename = require('gulp-rename'),
				lazypipe = require('lazypipe'),
				ignore = require('gulp-ignore'),
				_ = require('lodash'),
				path = require('path'),
				merge = require('merge-stream');

			// Optionally build dev scripts
			if (util.env.dev) {
				_.merge(config.src, config.devSrc);
			}

			var tasks = _.map(config.src, function(srcPath) {
					var fileName = path.basename(srcPath),
						writeSourceMaps = lazypipe()
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
							})
							.pipe(writeSourceMaps);

					return gulp.src(srcPath, {
						base: config.srcBase
					})
						.pipe(plumber())
						.pipe(resolveDependencies({
							pattern: /\* @requires [\s-]*(.*\.js)/g

							// log: true
						}).on('error', helpers.errors))
						.pipe(sourcemaps.init())
						.pipe(concat(fileName))
						.pipe(writeSourceMaps())
						.pipe(util.env.dev ? util.noop() : minify())
						.pipe(size({
							title: taskName,
							showFiles: true
						}))
						.pipe(gulp.dest(config.dest))
						.pipe(excludeSourcemaps())
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
