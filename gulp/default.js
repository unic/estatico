'use strict';

/**
 * @function `gulp`
 * @desc Create static webserver with livereload functionality, serve build directory on port 9000, watch source files.
 *
 * * Prompts whether the `build` task should run in advance.
 * * For non-interactive mode: `gulp --interactive=false --skipBuild`
 */

var gulp = require('gulp');

var taskName = 'default',
	taskConfig = {};

gulp.task(taskName, function(cb) {
	var helpers = require('require-dir')('../helpers'),
		util = require('gulp-util'),
		_ = require('lodash'),
		inquirer = require('inquirer'),
		runSequence = require('run-sequence');

	var callback = function(skipBuild, cb) {
			var runTasks = [
					'livereload',
					'build',
					'watch',
					'serve',
					function(err) {
						if (err) {
							helpers.errors(err);
						}

						cb();
					}
				];

			if (skipBuild) {
				runTasks = _.without(runTasks, 'build');
			}

			runSequence.apply(this, runTasks);
		};

	if (util.env.interactive !== 'false') {
		inquirer.prompt([
			{
				type: 'confirm',
				name: 'createBuild',
				message: 'Do you want to create a complete build before starting the server?',
				default: true
			}
		], function(answers) {
			callback(!answers.createBuild, cb);
		});
	} else {
		callback(util.env.skipBuild && util.env.skipBuild !== 'false', cb);
	}
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
