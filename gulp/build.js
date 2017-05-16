'use strict';

/**
 * @function `gulp build`
 * @desc Create build by running every HTML, CSS, JavaScript and media task.
 *
 * * Prompts whether the `js:qunit` task should run in the end (default: yes).
 * * For non-interactive mode: `gulp --interactive=false --skipTests`
 */

var gulp = require('gulp');

var taskName = 'build',
	taskConfig = {};

gulp.task(taskName, function(cb) {
	var helpers = require('require-dir')('../helpers'),
		runSequence = require('run-sequence'),
		util = require('gulp-util'),
		_ = require('lodash'),
		inquirer = require('inquirer');

	var callback = function(skipTests, cb) {
			// Currently, the modernizr task cannot run in parallel with other tasks. This should get fixed as soon as Modernizr 3 is published and the plugin is officially released.
			var runTasks = [
					'clean',
					[
						'css:colors',
						'css:fonts',
						'js:mocks',
						'media:dataurls',
						'media:iconfont',
						'media:pngsprite',
						'media:svgsprite'
					],
					'js:modernizr',
					[
						'html',
						'html:copy',
						'js',
						'css',
						'media:copy',
						'media:imageversions'
					],
					'js:qunit',
					function(err) {
						if (err) {
							helpers.errors(err);
						}

						cb();
					}
				];

			if (skipTests) {
				runTasks = _.without(runTasks, 'js:qunit');
			}

			runSequence.apply(this, runTasks);
		};

	if (util.env.interactive !== 'false') {
		inquirer.prompt([
			{
				type: 'confirm',
				name: 'runTests',
				message: 'Do you want to run all QUnit tests in the end?',
				default: true
			}
		]).then(function(answers) {
			callback(!answers.runTests, cb);
		});
	} else {
		callback(util.env.skipTests && util.env.skipTests !== 'false', cb);
	}
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
