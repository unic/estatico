'use strict';

/**
 * @function `gulp move`
 * @desc Move build assets into drupal directory
 */

var gulp = require('gulp');

var taskName = 'move',
	taskConfig = {
		src1: [
			'./build/assets/**/*.*'
		],
		dest1: '../site/web/themes/estatico/assets',
		src2: [
			'./source/themeconfig/**/*.*'
		],
		dest2: '../site/web/themes/estatico'
	};

gulp.task(taskName, function() {
	gulp.src(taskConfig.src1).pipe(gulp.dest(taskConfig.dest1));
	// gulp.src(taskConfig.src2).pipe(gulp.dest(taskConfig.dest2));
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
