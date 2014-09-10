'use strict';

/**
 * Default task: Create connect server with livereload functionality
 * Serve build directory
 */

var gulp = require('gulp'),
	errorHandler = require('gulp-unic-errors'),
	runSequence = require('run-sequence');

gulp.task('default', function (cb) {
	runSequence('livereload', 'build', 'watch', 'serve', function (err) {
		if (err) {
			errorHandler(err);
		}

		cb();
	});
});
