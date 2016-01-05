'use strict';

/**
 * @function `gulp js:mocks`
 * @desc Create static JSON data mocks
 */

var gulp = require('gulp');

var taskName = 'js:mocks',
	taskConfig = {
		src: [
			'./source/modules/**/*.mock.js',
			'./source/demo/modules/**/*.mock.js'
		],
		dest: './build/mocks/',
		watch: [
			'source/modules/**/*.mock.js',
			'source/demo/modules/**/*.mock.js'
		]
	};

gulp.task(taskName, function() {
	var tap = require('gulp-tap'),
		rename = require('gulp-rename');

	return gulp.src(taskConfig.src, {
			base: './source/',
			read: false
		})
		.pipe(tap(function(file) {
			var data = require(file.path);

			file.contents = new Buffer(JSON.stringify(data));
		}))
		.pipe(rename(function(path) {
			path.basename = path.basename.replace('.mock', '');
			path.extname = '.json';
		}))
		.pipe(gulp.dest(taskConfig.dest));
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
