'use strict';

var gulp = require('gulp'),
	runSequence = require('run-sequence');

/**
 * Default task: Create connect server with livereload functionality
 * Serve build directory
 */
gulp.task('default', function(callback) {
	runSequence(['build', 'watch'], 'serve', callback);
});
