'use strict';

/**
 * @function `gulp css:colors`
 * @desc Import colors from ColorSchemer HTML export and save to Sass file (based on Handlebars template).
 *
 * Non-alphanumeric characters are removed from the name.
 * Works with JSON, too. Just replace the HTML file with a JSON one (containing "colorName": "#000000" pairs).
 */

var gulp = require('gulp');

var taskName = 'css:colors',
	taskConfig = {
		src: './source/assets/css/templates/_colors.scss',
		dest: './source/assets/.tmp',
		input: 'source/assets/css/data/colors.html', // Optional: Replace this with a JSON file
		watch: 'source/assets/css/data/colors.html' // Optional: Replace this with a JSON file
	};

gulp.task(taskName, function() {
	var helpers = require('require-dir')('../../helpers'),
		plumber = require('gulp-plumber'),
		path = require('path'),
		dataHelper = require('../../helpers/data.js'),
		handlebars = require('gulp-hb');

	var filePath = path.resolve(taskConfig.input),
		colors = dataHelper.getColors(filePath);

	return gulp.src(taskConfig.src)
		.pipe(plumber())
		.pipe(handlebars({
			data: {
				colors: colors
			},
			bustCache: true
		}).on('error', helpers.errors))
		.pipe(gulp.dest(taskConfig.dest));
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
