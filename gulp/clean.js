'use strict';

/**
 * Remove build folder
 */

var gulp = require('gulp'),
	del = require('del');

gulp.task('clean', function(cb) {
	del([
		'./build',
		'./source/assets/.tmp'
	], cb);
});
