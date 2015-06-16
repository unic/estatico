'use strict';

/**
 * @function `gulp livereload`
 * @desc Start livereload instance.
 */

var gulp = require('gulp');

var taskName = 'livereload',
	taskConfig = {};

gulp.task('livereload', function() {
	var livereload = require('gulp-livereload');

	livereload.listen({
		host: null
	});
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
