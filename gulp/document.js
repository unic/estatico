'use strict';

/**
 * @function `gulp document`
 * @desc Read task files and create a markdown files from their JSDoc documentation (using `gulp-jsdoc-to-markdown`).
 */

var taskName = 'document',
	taskConfig = {
		src: './gulp/**/*.js',
		template: './docs/templates/tasks.hbs',
		dest: './docs/'

		// watch: [
		// 	'./gulp/**/*.js',
		// 	'./docs/templates/tasks.hbs'
		// ]
	};

var gulp = require('gulp');

gulp.task(taskName, function() {
	var helpers = require('require-dir')('../helpers'),
		plumber = require('gulp-plumber'),
		fs = require('fs'),
		concat = require('gulp-concat'),
		jsdocToMarkdown = require('gulp-jsdoc-to-markdown');

	var template = fs.readFileSync(taskConfig.template, 'utf8');

	return gulp.src(taskConfig.src)
		.pipe(concat('Tasks.md'))
		.pipe(plumber())
		.pipe(jsdocToMarkdown({
			template: template,
			helper: [
				'./helpers/handlebars.js'
			]
		}).on('error', helpers.errors))
		.pipe(gulp.dest(taskConfig.dest));
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
