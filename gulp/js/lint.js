'use strict';

/**
 * @function `gulp js:lint`
 * @desc Lint JavaScript files (using `JSHint`).
 */

var gulp = require('gulp');

var taskName = 'js:lint',
	taskConfig = {
		src: [
			'./source/assets/js/**/*.js',
			'./source/modules/**/*.js',
			'./source/demo/modules/**/*.js',
			'!./source/modules/**/*.data.js',
			'!./source/demo/modules/**/*.data.js',
			'!./source/modules/**/*.mock.js',
			'!./source/demo/modules/**/*.mock.js'
		]
	};

gulp.task(taskName, function() {
	var helpers = require('require-dir')('../../helpers'),
		util = require('gulp-util'),
		tap = require('gulp-tap'),
		path = require('path'),
		cached = require('gulp-cached'),
		jshint = require('gulp-jshint'),
		jscs = require('gulp-jscs'),
		lazypipe = require('lazypipe');

	var failReporter = lazypipe()
			.pipe(jshint.reporter, 'fail')
			.pipe(jscs.reporter, 'fail');

	return gulp.src(taskConfig.src)
		.pipe(cached('linting'))
		.pipe(jshint())
		.pipe(jscs({
			configPath: '.jscsrc'
			// fix: true
		}))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(jscs.reporter())
		.pipe(util.env.dev ? tap(function(file) {
			if (!file.jshint.success || !file.jscs.success) {
				helpers.errors({
					task: taskName,
					message: 'Linting error in file "' + path.relative('./source/', file.path) + '" (see console)'
				});
			}
		}) : failReporter().on('error', helpers.errors));
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
