'use strict';

/**
 * @function `gulp html:hbs:copy`
 * @desc Copy the handlebars files to the assets folder. Note: this task is disabled by default. You need to enable this in build.js	
 */

var gulp = require('gulp'),
    htmlTask = require('./default');

var src = ['source/**/*.hbs'],
	taskName = 'html:hbs:copy',
	taskConfig = {
		src: src,
		dest: './build/templates/',
		watch: src
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
