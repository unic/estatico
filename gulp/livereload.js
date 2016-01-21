'use strict';

/**
 * @function `gulp livereload`
 * @desc Start livereload instance.
 *
 * CSS is injected without page-reload. However, the corresponding source map is not.
 * In order to have an updated source map after changing the CSS, the page has to be reloaded manually.
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
