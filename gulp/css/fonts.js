'use strict';

/**
 * @function `gulp css:fonts`
 * @desc Encode *.otf or *.ttf or *.woff fonts to base64 data
 */

var gulp = require('gulp');

var taskName = 'css:fonts',
	taskConfig = {
		src: ['./source/assets/fonts/**/*.otf', './source/assets/fonts/**/*.ttf', './source/assets/fonts/**/*.woff'],
		dest: './source/assets/.tmp/',
		fileName: 'fonts.css'
	};

gulp.task(taskName, function() {
	var font64 = require('gulp-simplefont64'),
		concat = require('gulp-concat'),
		cssMinify = require('gulp-minify-css'),
		tap = require('gulp-tap');

	return gulp.src(taskConfig.src)
		.pipe(font64())
		.pipe(concat(taskConfig.fileName))
		.pipe(cssMinify())
		.pipe(tap(function(file) {
			file.contents = new Buffer(file.contents.toString().replace(/\; base64/g, ';charset=utf-8;base64'));
		}))
		.pipe(gulp.dest(taskConfig.dest));
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
