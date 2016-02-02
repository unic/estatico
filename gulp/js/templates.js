'use strict';

/**
 * @function `gulp js:templates`
 * @desc Precompile Twig templates.
 */

var gulp = require('gulp');

var taskName = 'js:templates',
	taskConfig = {
		src: [
			'./source/modules/**/_*.js.twig',
			'./source/demo/modules/**/_*.js.twig'
		],
		dest: './source/assets/.tmp/',
		watch: [
			'source/modules/**/_*.js.twig',
			'source/demo/modules/**/_*.js.twig'
		]
	};

gulp.task(taskName, function(cb) {
	var helpers = require('require-dir')('../../helpers'),
		plumber = require('gulp-plumber'),
		util = require('gulp-util'),
		livereload = require('gulp-livereload'),
		defineModule = require('gulp-define-module'),
		declare = require('gulp-declare'),
		concat = require('gulp-concat'),
		tap = require('gulp-tap'),
		file = require('gulp-file'),
		twig = require('gulp-twig'),
		path = require('path');

	var c = 0;

	gulp.src(taskConfig.src)
		.pipe(plumber())
		.pipe(tap(function() {
			c++;
		}))
		.pipe(twig({
			precompile: true
		}).on('error', helpers.errors))
		.pipe(defineModule('plain', { // RequireJS: use 'amd' over plain and uncomment lines below
			// require: {
			//     Twig: 'twig'
			// },
			context: {
				twig: 'Twig.twig({ data: <%= contents %>, precompiled: true })'
			},
			wrapper: '<%= twig %>'
		}))
		.pipe(declare({
			namespace: 'Twig.partials',
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
		.pipe(gulp.dest(taskConfig.dest))
		.pipe(livereload())
		.on('end', function() {
			if (c === 0) {
				// Create empty file if nothing was streamed
				file('templates.js', '', {
					src: true
				})
					.pipe(gulp.dest(taskConfig.dest))
					.on('finish', cb);
			} else {
				cb();
			}
		});
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
