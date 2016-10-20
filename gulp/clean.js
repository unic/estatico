'use strict';

/**
 * @function `gulp clean`
 * @desc Remove build and temp folders.
 */

var gulp = require('gulp');

var taskName = 'clean',
	taskConfig = {
		src: [
			'./build',
			'./source/assets/.tmp'
		]
	};

gulp.task(taskName, function(cb) {
	var del = require('del');

	del(taskConfig.src).then(function() {
		cb();
	});
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
