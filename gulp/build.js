'use strict';

/**
 * Create build directory
 */

var gulp = require('gulp'),
	helpers = require('require-dir')('../helpers'),
	runSequence = require('run-sequence');

gulp.task('build', function(cb) {
	// Currently, the modernizr task cannot run in parallel with other tasks. This should get fixed as soon as Modernizr 3 is published and the plugin is officially released.
	runSequence('clean', ['css:colors', 'js:lodash', 'js:templates', 'media:iconfont', 'media:dataurls', 'media:pngsprite'], 'js:modernizr', ['html', 'css:default', 'js:lint', 'js:default', 'media:copy'], function(err) {
		if (err) {
			helpers.errors(err);
		}

		cb();
	});
});
