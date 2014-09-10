'use strict';

/**
 * Precompile JS templates (optional)
 */

var gulp = require('gulp'),
	//handlebars = require('gulp-handlebars'),
	defineModule = require('gulp-define-module'),
	declare = require('gulp-declare'),
	concat = require('gulp-concat'),
	unicHandlebars = require('gulp-unic-handlebars'),
	path = require('path'),
	util = require('gulp-util'),
	livereload = require('gulp-livereload');

gulp.task('js:templates', function () {
	return gulp.src(['./source/modules/**/*.hbs'])
		.pipe(unicHandlebars({
			precompile: true,
			partials: './source/modules/**/*.hbs'
		}))
		.pipe(defineModule('plain', { // RequireJS: use 'amd' over plain and uncomment lines below
			//require: {
				//Handlebars: 'handlebars'
			//},
			context: {
				handlebars: 'Handlebars.template(<%= contents %>)'
			},
			wrapper: '<%= handlebars %>'
		}))
		.pipe(declare({
			namespace: 'Unic.templates',
			processName: function (filePath) {
				// Use "modules/x/y" as partial name, e.g.
				var name = path.relative('./source/', filePath);

				return util.replaceExtension(name, '');
			}
		}))
		.pipe(concat('templates.js'))
		.pipe(gulp.dest('./source/assets/.tmp/'))
		.pipe(livereload({
			auto: false
		}));
});
