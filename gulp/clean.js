'use strict';

var gulp = require('gulp'),
	clean = require('gulp-clean');

/**
 * Remove build folder
 */
gulp.task('clean', function() {
	return gulp
		.src(['build'], {read: false})
		.pipe(clean());
});
