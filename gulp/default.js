'use strict';

/**
 * Default task: Create connect server with livereload functionality
 * Serve build directory
 *
 * --nobuild flag skips the build task
 */

var gulp = require('gulp'),
	helpers = require('require-dir')('../helpers'),
	util = require('gulp-util'),
	_ = require('lodash'),
	runSequence = require('run-sequence');

gulp.task('default', function(cb) {
	var callback = function(err) {
			if (err) {
				helpers.errors(err);
			}

			cb();
		},
		tasks = ['livereload', 'build', 'watch', 'serve', callback];

	// Skip build task if "--nobuild" flag was used
	if (util.env.nobuild) {
		tasks = _.without(tasks, 'build');
	}

	runSequence.apply(this, tasks);
});
