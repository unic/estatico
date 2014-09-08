'use strict';

/**
 * Hint files using .jshintrc
 */

var gulp = require('gulp'),
	util = require('gulp-util'),
	cached = require('gulp-cached'),
	jshint = require('gulp-jshint');

gulp.task('js:hint', function () {
	return gulp.src([
			'./source/assets/js/*.js',
			'./source/modules/**/*.js',
			'!./source/assets/vendor/*.js'
		])
		.pipe(cached('linting'))
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'))
		.pipe(util.env.develop ? util.noop() : jshint.reporter('fail'))
		.on('error', function (err) {
			console.log('[ERROR] ' + err.message + '.');
			process.exit(1);
		});
});

