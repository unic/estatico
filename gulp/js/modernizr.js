'use strict';

/**
 * @function `gulp js:modernizr`
 * @desc Generate customized Modernizr build (using `Customizr`, crawling through files and gathering up references to Modernizr tests).
 */

var gulp = require('gulp');

var taskName = 'js:modernizr',
	taskConfig = {
		src: [
			'./source/assets/css/**/*.scss',
			'./source/modules/**/*.scss',
			'./source/assets/js/**/*.js',
			'./source/modules/**/*.js',
			'./source/demo/modules/**/*.js'
		],
		file: 'modernizr.js',
		dest: './source/assets/.tmp/'
	};

gulp.task(taskName, function() {
	var modernizr = require('gulp-modernizr'),
		tap = require('gulp-tap');

	return gulp.src(taskConfig.src)
		.pipe(modernizr(taskConfig.file, {
			options: [
				'setClasses'
			]
		}))
		.pipe(tap(function(file) {
			var content = file.contents.toString();

			// Remove bang from test comments to allow for removal on uglifying
			content = content.replace(/\/\*\!\n{/g, '/*\n{').replace(/\!\*\//g, '*/');

			file.contents = new Buffer(content);
		}))
		.pipe(gulp.dest(taskConfig.dest));
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
