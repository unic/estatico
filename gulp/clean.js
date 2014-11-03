'use strict';

/**
 * Remove build folder
 */

var gulp = require('gulp'),
	del = require('del');

gulp.task('clean', function(cb) {
	del([
		'./build',
		'./test',
		'./source/assets/.tmp',
		'./source/styleguide/sections/colors.json'
	], cb);
});
