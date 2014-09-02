'use strict';

var gulp = require('gulp');

/**
 * Copy specific media files to build directory
 */
gulp.task('media', function() {
	return gulp.src([
			'./source/assets/fonts/{,**/}*',
			'./source/assets/media/*.*',
			'./source/tmp/media/*'
		], {
			base: './source/'
		})
		.pipe(gulp.dest('./build'));
});
