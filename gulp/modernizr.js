'use strict';

var gulp = require('gulp'),
	modernizr = require('gulp-modernizr'),
	util = require('gulp-util'),
	uglify = require('gulp-uglify'),
	exec = require('child_process').exec;

/**
 * Generate customized Modernizr build in source/assets/.tmp/
 * Using Customizr, crawl through project files and gather up references to Modernizr tests
 *
 * See https://github.com/doctyper/customizr
 */
gulp.task('modernizr', function() {
	return gulp.src([
		'./source/assets/css/*.scss',
		'./source/modules/**/*.scss',
		'./source/assets/js/*.js',
		'./source/modules/**/*.js',
		'!./source/assets/vendor/*.js'
	])
		.pipe(modernizr({}))
		.pipe(util.env.production ? uglify() : util.noop())
		.pipe(gulp.dest('./source/assets/.tmp'));
});
