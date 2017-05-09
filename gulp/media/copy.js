'use strict';

/**
 * @function `gulp media:copy`
 * @desc Copy specific media files to build directory.
 */

var gulp = require('gulp');

var taskName = 'media:copy',
	taskConfig = {
		src: [
			'./source/assets/fonts/**/*',
			'./source/assets/media/**/*',
			'./source/tmp/media/**/*',
			'./source/preview/assets/media/**/*',
			'./source/modules/*/media/**/*',
			'./source/demo/modules/*/media/**/*'
		],
		dest: './build/',
		watch: [
			'source/assets/fonts/**/*',
			'source/assets/js/**/*.js',
			'source/assets/media/**/*',
			'source/tmp/media/**/*',
			'source/preview/assets/media/**/*',
			'source/modules/*/media/**/*',
			'source/demo/modules/*/media/**/*'
		]
	};

gulp.task(taskName, function() {
	var changed = require('gulp-changed'),
		livereload = require('gulp-livereload'),
		size = require('gulp-size');

	return gulp.src(taskConfig.src, {
			base: './source/'
		})
		.pipe(changed(taskConfig.dest))
		.pipe(size({
			title: taskName
		}))
		.pipe(gulp.dest(taskConfig.dest))
		.on('finish', function() {
			livereload.reload();
		});
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
