'use strict';

/**
 * @function `gulp html`
 * @desc Compile Handlebars templates to HTML. Use `.data.js` files for - surprise! - data.
 */

var gulp = require('gulp');

var taskName = 'html:validate',
	taskConfig = {
		src: [
			'./build/modules/**/*.html',
			'./build/pages/**/*.html',
			'./build/demo/modules/**/*.html',
			'./build/demo/pages/**/*.html'
		],
		srcBase: './build/',
		watch: [
			'./build/modules/**/*.html',
			'./build/pages/**/*.html',
			'./build/demo/modules/**/*.html',
			'./build/demo/pages/**/*.html'
		]
	},
	task = function(config, cb) {
		var helpers = require('require-dir')('../../helpers'),
			path = require('path'),
			changed = require('gulp-changed-in-place'),
			tap = require('gulp-tap'),
			w3cjs = require('gulp-w3cjs');

		return gulp.src(taskConfig.src, {
				base: taskConfig.srcBase
			})
			.pipe(changed({
				firstPass: true
			}))
			.pipe(w3cjs())
			.pipe(tap(function(file) {
				if (!file.w3cjs.success) {
					helpers.errors({
						task: taskName,
						message: 'Linting error in file "' + path.relative(taskConfig.srcBase, file.path) + '" (details above)'
					});
				}
			}));
	};

gulp.task(taskName, function(cb) {
	return task(taskConfig, cb);
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig,
	task: task
};
