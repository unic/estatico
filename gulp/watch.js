'use strict';

/**
 * @function `gulp watch`
 * @desc Run specific tasks when specific files have changed. Uses the `gulp-watch` package since the native `gulp.watch` currently does not pick up new folders.
 *
 * * Fall back to polling (e.g. in Vagrant): `gulp --pollWatch=true`
 */

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	util = require('gulp-util');

var taskName = 'watch',
	taskConfig = {};

gulp.task(taskName, function() {
	var _ = require('lodash'),
		tasks = require('require-dir')('./', {
			recurse: true
		});

	// Find tasks with watch paths specified and initialize them
	var initWatchTasks = function(tasks) {
			_.each(tasks, function(config) {
				if (config.taskName) {
					if (config.taskConfig.watch) {
						watch(config.taskConfig.watch, {
							usePolling: !!(util.env.pollWatch && util.env.pollWatch !== 'false')
						}, function() {
							gulp.start(config.taskName);
						});
					}
				} else {
					initWatchTasks(config);
				}
			});
		};

	initWatchTasks(tasks);
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
