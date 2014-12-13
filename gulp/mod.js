'use strict';

/**
 * Scaffold new module
 * Arguments: -n NAME, --nocss, --nojs
 */

var gulp = require('gulp'),
	helpers = require('require-dir')('../helpers'),
	livereload = require('gulp-livereload'),
	util = require('gulp-util'),
	tap = require('gulp-tap'),
	ignore = require('gulp-ignore'),
	rename = require('gulp-rename'),
	changeCase = require('change-case'),
	args = require('yargs').argv;

gulp.task('mod', function() {
	if (!args.n) {
		helpers.errors({
			task: 'mod',
			message: 'Parameter -n not specified.'
		});

		return;
	}

	var name = args.n.replace(/(_|-)/g, ' '),
		snakeCase = changeCase.snake(name),
		camelCase = changeCase.camel(name),
		pascalCase = changeCase.pascal(name),
		titleCase = changeCase.title(name),
		lowerCase = changeCase.lower(name).replace(' ', '');

	return gulp.src([
		'./source/modules/.scaffold/*'
	])
		// Replace {{CASE}} with the specified name
		.pipe(tap(function(file) {
			var content = file.contents.toString()
					.replace(/\{\{snakeCase\}\}/g, snakeCase)
					.replace(/\{\{camelCase\}\}/g, camelCase)
					.replace(/\{\{pascalCase\}\}/g, pascalCase)
					.replace(/\{\{titleCase\}\}/g, titleCase)
					.replace(/\{\{lowerCase\}\}/g, lowerCase);

			file.contents = new Buffer(content);
		}))
		// Skip CSS file if --nocss is specified
		.pipe(args.nocss ? ignore.exclude('*.scss') : util.noop())
		// Skip JS file if --nojs is specified
		.pipe(args.nojs ? ignore.exclude('*.js') : util.noop())
		.pipe(rename({
			basename: snakeCase
		}))
		.pipe(gulp.dest('./source/modules/' + snakeCase))
		.on('end', function() {
			if (!args.nocss) {
				// Add @import to main.scss
				gulp.src([
					'./source/assets/css/main.scss'
				])
					.pipe(tap(function(file) {
						var cssImport = '@import "' + snakeCase + '/' + snakeCase + '";\n//*autoinsertmodule*',
							content = file.contents.toString().replace(/\/\/\*autoinsertmodule\*/g, cssImport);

						file.contents = new Buffer(content);
					}))
					.pipe(gulp.dest('./source/assets/css'))
					.pipe(livereload({
						auto: false
					}));
			}

			if (!args.nojs) {
				// Add @requires to main.js
				gulp.src([
					'./source/assets/js/main.js'
				])
					.pipe(tap(function(file) {
						var cssImport = '@requires ../../modules/' + snakeCase + '/' + snakeCase + '.js\n * //*autoinsertmodule*',
							content = file.contents.toString().replace(/\/\/\*autoinsertmodule\*/g, cssImport);

						file.contents = new Buffer(content);
					}))
					.pipe(gulp.dest('./source/assets/js'))
					.pipe(livereload({
						auto: false
					}));
			}
		});
});
