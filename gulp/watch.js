'use strict';

/**
 * @function `gulp watch`
 * @desc Run specific tasks when specific files have changed. Uses the `gulp-watch` package since the native `gulp.watch` currently does not pick up new folders.
 *
 * * Fall back to polling (e.g. in Vagrant): `gulp --pollWatch=true`
 */

var gulp = require('gulp');

var taskName = 'watch',
	taskConfig = {};

gulp.task(taskName, function() {
	var _ = require('lodash'),
		watch = require('gulp-watch'),
		util = require('gulp-util'),
		prettyTime = require('pretty-hrtime'),
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
						}, function(file) {
							// Explicitly run task function and provide changed file as parameter if returnChangedFileOnWatch is set
							// Log duration analogously to how gulp.start would do it
							if (config.taskConfig.returnChangedFileOnWatch && config.task) {
								var start = process.hrtime(),
									end,
									time;

								util.log('Starting', '\'' + util.colors.cyan(config.taskName) + '\'...');

								config.task(config.taskConfig, function() {
									end = process.hrtime(start);
									time = prettyTime(end);

									util.log('Finished', '\'' + util.colors.cyan(config.taskName) + '\'', 'after', util.colors.magenta(time));
								}, file.path);

							// Just trigger task otherwise
							} else {
								gulp.start(config.taskName);
							}
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
