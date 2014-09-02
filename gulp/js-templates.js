'use strict';

var gulp = require('gulp'),
	handlebars = require('gulp-handlebars'),
	defineModule = require('gulp-define-module'),
	declare = require('gulp-declare'),
	concat = require('gulp-concat'),
	livereload = require('gulp-livereload'),
	tinylr = require('tiny-lr'),
	server = tinylr();

/**
 * Precompile JS templates (for demo purposes)
 */
gulp.task('js-templates', function() {
	return gulp.src(['./source/modules/**/*.html'])
		.pipe(handlebars())
		.pipe(defineModule('plain'))
		.pipe(declare({
			namespace: 'Unic.templates'
		}))
		.pipe(concat('templates.js'))
		.pipe(gulp.dest('./source/assets/.tmp/'))
		.pipe(livereload(server));
});
