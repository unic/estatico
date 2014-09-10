'use strict';

/**
 * Default task: Create connect server with livereload functionality
 * Serve build directory
 */

var gulp = require('gulp'),
	runSequence = require('run-sequence');

gulp.task('default', function (cb) {
	runSequence('livereload', 'build', 'watch', 'serve', function (err) {
		if (err) {
			console.log('[ERROR] in ' + err.task + ': ' + err.err);
			process.exit(1);
		}

		cb();
	});
});
