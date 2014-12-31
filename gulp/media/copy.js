'use strict';

/**
 * Copy specific media files to build directory
 */

var gulp = require('gulp'),
	changed = require('gulp-changed'),
	size = require('gulp-size');

gulp.task('media:copy', function() {
	var destPath = './build';

	return gulp.src([
			'./source/assets/fonts/{,**/}*',
			'./source/assets/media/*',
			'./source/tmp/media/*',
			'./source/styleguide/assets/media/*'
		], {
			base: './source/'
		})
		.pipe(changed(destPath))
		.pipe(size({
			title: 'media:copy'
		}))
		.pipe(gulp.dest(destPath));
});
