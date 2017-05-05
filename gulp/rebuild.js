'use strict';

/**
 * @function `gulp build`
 * @desc Create build by running every HTML, CSS, JavaScript and media task.
 *
 * * Prompts whether the `js:qunit` task should run in the end (default: yes).
 * * For non-interactive mode: `gulp --interactive=false --skipTests`
 */

var gulp = require('gulp');

var taskName = 'rebuild',
	taskConfig = {};

gulp.task(taskName, function(cb) {
	var helpers = require('require-dir')('../helpers'),
		runSequence = require('run-sequence');

	var callback = function(cb) {
			// Currently, the modernizr task cannot run in parallel with other tasks. This should get fixed as soon as Modernizr 3 is published and the plugin is officially released.
			var runTasks = [
					'clean',
					[
						'css:colors',
						'css:fonts',
						'media:svgsprite'
					],
					'js:modernizr',
					[
						'css',
						'js',
						'media:copy'
					],
					// 'move',
					function(err) {
						if (err) {
							helpers.errors(err);
						}

						cb();
					}
				];

			runSequence.apply(this, runTasks);
		};

	callback(cb);

});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
