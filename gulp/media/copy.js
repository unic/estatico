'use strict';

/**
 * @function `gulp media:copy`
 * @desc Copy specific media files to build directory.
 */

var gulp = require('gulp'),
	util = require('gulp-util');

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
		configsSrc: [
			'./source/assets/js/configs/local.js',
			'./source/assets/js/configs/acceptance.js',
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
		size = require('gulp-size'),

		src = util.env.local || util.env.acceptance ?
			taskConfig.src.concat(taskConfig.configsSrc) :
			taskConfig.src;

	return gulp.src(src, {
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
