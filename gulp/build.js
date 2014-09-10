'use strict';

/**
 * Create build directory
 */

var gulp = require('gulp'),
	errorHandler = require('gulp-unic-errors'),
	runSequence = require('run-sequence');

gulp.task('build', function (cb) {
	// Currently, the modernizr task cannot run in parallel with other tasks. This should get fixed as soon as Modernizr 3 is published and the plugin is officially released.
	runSequence('clean', ['js:lodash', 'media:iconfont', 'media:dataurls', 'media:pngsprite'], 'js:modernizr', ['html', 'css', 'js:lint', 'js:head', 'js:main', 'media:copy'], function (err) {
		if (err) {
			errorHandler(err);
		}

		cb();
	});
});
