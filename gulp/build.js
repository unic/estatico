'use strict';

/**
 * Create build directory
 */

var gulp = require('gulp'),
	runSequence = require('run-sequence');

gulp.task('build', function (cb) {
	// Currently, the modernizr task cannot run in parallel with other tasks. This should get fixed as soon as Modernizr 3 is published and the plugin is officially released.
	runSequence('clean', ['js:lodash', 'media:iconfont', 'media:pngsprite'], 'js:modernizr', ['html', 'css', 'js:hint', 'js:head', 'js:main', 'media:copy'], function (err) {
		if (err) {
			console.log('[ERROR] in ' + err.task + ': ' + err.err);
			process.exit(1);
		}

		cb();
	});
});
