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
			'!./source/demo/modules/**/*.data.js'
		]
	};

gulp.task(taskName, function() {
	var helpers = require('require-dir')('../../helpers'),
		util = require('gulp-util'),
		tap = require('gulp-tap'),
		path = require('path'),
		cached = require('gulp-cached'),
		jshint = require('gulp-jshint');

	return gulp.src(taskConfig.src)
		.pipe(cached('linting'))
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(util.env.dev ? tap(function(file) {
			if (!file.jshint.success) {
				helpers.errors({
					task: taskName,
					message: 'Linting error in file "' + path.relative('./source/', file.path) + '" (see console)'
				});
			}
		}) : jshint.reporter('fail').on('error', helpers.errors));
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
