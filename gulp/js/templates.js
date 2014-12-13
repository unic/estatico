'use strict';

/**
 * Precompile JS templates (optional)
 */

var gulp = require('gulp'),
	helpers = require('require-dir')('../../helpers'),
	plumber = require('gulp-plumber'),
	util = require('gulp-util'),
	livereload = require('gulp-livereload'),
	defineModule = require('gulp-define-module'),
	declare = require('gulp-declare'),
	concat = require('gulp-concat'),
	unicHandlebars = require('gulp-unic-handlebars'),
	path = require('path');

gulp.task('js:templates', function() {
	return gulp.src([
			'./source/modules/**/_*.js.hbs'
		])
		.pipe(plumber())
		.pipe(unicHandlebars({
			precompile: true,
			partials: null // Partials have to be treated like templates (add to src glob above)
		}).on('error', helpers.errors))
		.pipe(defineModule('plain', { // RequireJS: use 'amd' over plain and uncomment lines below
			// require: {
			// 	Handlebars: 'handlebars'
			// },
			context: {
				handlebars: 'Handlebars.template(<%= contents %>)'
			},
			wrapper: '<%= handlebars %>'
		}))
		.pipe(declare({
			namespace: 'Handlebars.partials',
			processName: function(filePath) {
				// Use "modules/x/y" as partial name, e.g.
				var name = path.relative('./source/', filePath);

				// Remove file extension
				name = util.replaceExtension(util.replaceExtension(name, ''), '');

				// Fix path on windows
				name = name.replace(new RegExp('\\' + path.sep, 'g'), '/');

				return name;
			}
		}))
		.pipe(concat('templates.js'))
		.pipe(gulp.dest('./source/assets/.tmp/'))
		.pipe(livereload({
			auto: false
		}));
});
