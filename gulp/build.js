'use strict';

/**
 * @function `gulp build`
 * @desc Create build by running every HTML, CSS, JavaScript and media task.
 */

var gulp = require('gulp');

var taskName = 'build',
	taskConfig = {};

gulp.task(taskName, function(cb) {
	var helpers = require('require-dir')('../helpers'),
		runSequence = require('run-sequence');

	// Currently, the modernizr task cannot run in parallel with other tasks. This should get fixed as soon as Modernizr 3 is published and the plugin is officially released.
	runSequence(
		'clean',
		[
			'css:colors',
			'css:fonts',
			'js:lodash',
			'js:templates',
			'js:mocks',
			'media:dataurls',
			'media:iconfont',
			'media:pngsprite'
		],
		'js:modernizr',
		[
			'html',
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
	);
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
