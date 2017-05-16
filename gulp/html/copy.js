'use strict';

var gulp = require('gulp'),
    htmlTask = require('./default');

var taskName = 'html:copy',
	taskConfig = {
		src: htmlTask.taskConfig.src,
		dest: './build/assets/html',
		watch: htmlTask.taskConfig.src
	},
	task = function(config) {
		return gulp.src(config.src, {
				base: './source'
			})
			.pipe(gulp.dest(config.dest));
	};

gulp.task(taskName, function() {
	return task(taskConfig);
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig,
	task: task
};
