'use strict';

/**
 * Lint files using .jshintrc
 */

var gulp = require('gulp'),
	errorHandler = require('gulp-unic-errors'),
	util = require('gulp-util'),
	cached = require('gulp-cached'),
	jshint = require('gulp-jshint');

gulp.task('js:lint', function () {
	return gulp.src([
			'./source/assets/js/*.js',
			'./source/modules/**/*.js',
			'!./source/assets/vendor/*.js'
		])
		.pipe(cached('linting'))
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(util.env.dev ? util.noop() : jshint.reporter('fail').on('error', errorHandler));
});
