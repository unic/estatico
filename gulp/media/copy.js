'use strict';

/**
 * Copy specific media files to build directory
 */

var gulp = require('gulp'),
	size = require('gulp-size');

gulp.task('media:copy', function () {
	return gulp.src([
			'./source/assets/fonts/{,**/}*',
			'./source/assets/media/*.*',
			'./source/tmp/media/*'
		], {
			base: './source/'
		})
		.pipe(size({
			title: 'media:copy'
		}))
		.pipe(gulp.dest('./build'));
});
