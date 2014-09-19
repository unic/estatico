'use strict';

/**
 * Lint files using .jshintrc
 */

var gulp = require('gulp'),
	errorHandler = require('gulp-unic-errors'),
	util = require('gulp-util'),
	tap = require('gulp-tap'),
	path = require('path'),
	cached = require('gulp-cached'),
	jshint = require('gulp-jshint');

gulp.task('js:lint', function() {
	return gulp.src([
			'./source/assets/js/*.js',
			'./source/modules/**/*.js',
			'!./source/assets/vendor/*.js'
		])
		.pipe(cached('linting'))
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(util.env.dev ? tap(function(file) {
			if (!file.jshint.success) {
				errorHandler({
					task: 'js:lint',
					message: 'Linting error in file "' + path.relative('./source/', file.path) + '" (see console)'
				});
			}
		}) : jshint.reporter('fail').on('error', errorHandler));
});
