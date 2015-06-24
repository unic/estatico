'use strict';

/**
 * @function `gulp html`
 * @desc Compile Handlebars templates to HTML. Use `.data.js` files for - surprise! - data.
 */

var gulp = require('gulp');

var taskName = 'html',
	taskConfig = {
		src: [
			'./source/*.hbs',
			'./source/pages/**/*.hbs',
			'./source/demo/pages/**/*.hbs',
			'./source/modules/**/!(_)*.hbs',
			'./source/demo/modules/**/!(_)*.hbs',
			'./source/preview/styleguide/*.hbs'
		],
		partials: [
			'source/layouts/*.hbs',
			'source/modules/**/*.hbs',
			'source/demo/modules/**/*.hbs',
			'source/preview/**/*.hbs'
		],
		dest: './build/',
		watch: [
			'source/*.hbs',
			'source/layouts/*.hbs',
			'source/pages/**/*.hbs',
			'source/demo/pages/**/*.hbs',
			'source/modules/**/*.hbs',
			'source/demo/modules/**/*.hbs',
			'source/preview/**/*.hbs',
			'source/data/**/*.data.js',
			'source/pages/**/*.data.js',
			'source/demo/pages/**/*.data.js',
			'source/modules/**/*.data.js',
			'source/demo/modules/**/*.data.js',
			'source/preview/**/*.data.js',
			'source/modules/**/*.md',
			'source/demo/modules/**/*.md',
			'source/assets/css/data/colors.html'
		]
	};

gulp.task(taskName, function(cb) {
	var helpers = require('require-dir')('../../helpers'),
		plumber = require('gulp-plumber'),
		livereload = require('gulp-livereload'),
		util = require('gulp-util'),
		requireNew = require('require-new'),
		path = require('path'),
		tap = require('gulp-tap'),
		rename = require('gulp-rename'),
		// prettify = require('gulp-prettify'),
		handlebars = require('gulp-hb');

	gulp.src(taskConfig.src, {
			base: './source'
		})
		.pipe(tap(function(file) {
			var dataFile = util.replaceExtension(file.path, '.data.js'),
				data = (function() {
					try {
						return requireNew(dataFile);
					} catch (err) {
						helpers.errors({
							task: taskName,
							message: 'Error reading "' + path.relative('./', dataFile) + '": ' + err,
							stack: err.stack
						});
					}
				})(),
				modulePrepend = new Buffer('{{#extend "preview/layouts/module"}}{{#content "content" mode="replace"}}'),
				moduleAppend = new Buffer('{{/content}}{{/extend}}');

			// Save data by file name
			file.data = data;

			// Wrap modules with custom layout for preview purposes
			if (file.path.indexOf(path.sep + 'modules' + path.sep) !== -1) {
				file.contents = Buffer.concat([modulePrepend, file.contents, moduleAppend]);
			}
		}))
		.pipe(plumber())
		.pipe(handlebars({
			dataEach: function(context, file) {
				return file.data;
			},
			partials: taskConfig.partials,
			bustCache: true
		}).on('error', helpers.errors))
		// Relativify absolute paths
		.pipe(tap(function(file) {
			var content = file.contents.toString(),
				relPathPrefix = path.join(path.relative(file.path, './source'));

			relPathPrefix = relPathPrefix
				// Normalize path separator
				.replace(new RegExp('\\' + path.sep, 'g'), '/')
				// Remove trailing ..
				.replace(/\.\.$/, '');

			content = content.replace(/('|")\//g, '$1' + relPathPrefix);

			file.contents = new Buffer(content);
		}))
		// .pipe(prettify({
		// 	indent_with_tabs: true,
		// 	max_preserve_newlines: 1
		// }))
		.pipe(rename({
			extname: '.html'
		}))
		.pipe(gulp.dest(taskConfig.dest))
		.on('finish', function() {
			livereload.reload();

			cb();
		});
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
