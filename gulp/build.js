'use strict';

var gulp = require('gulp'),
	runSequence = require('run-sequence');

/**
 * Create build directory
 */
gulp.task('build', function(callback) {
	// Currently, the modernizr task cannot run in parallel with other tasks. This should get fixed as soon as Modernizr 3 is published and the plugin is officially released.
	runSequence('clean', ['lodash', 'iconfont', 'pngsprite'], 'modernizr', ['html', 'css', 'jshint', 'js-head', 'js-main', 'media'], callback);
});