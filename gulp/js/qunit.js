'use strict';

/**
 * @function `gulp js:qunit`
 * @desc Run QUnit tests (using PhantomJS).
 */

var gulp = require('gulp');

var taskName = 'js:qunit',
	taskConfig = {
		srcTests: [
			'./source/assets/vendor/qunit/qunit/*',
			'./source/modules/**/*.test.js',
			'./source/demo/modules/**/*.test.js'
		],
		srcBase: './source/',
		destTests: './build/test/',
		srcTemplates: [
			'./build/pages/**/*.html',
			'./build/demo/pages/**/*.html',
			'./build/modules/**/*.html',
			'./build/demo/modules/**/*.html'
		],
		srcTemplatesBase: './build/',
		srcQUnit: 'assets/vendor/qunit/qunit/qunit.js',
		destTemplates: './.qunit/',
		watch: [
			'source/modules/**/*.test.js',
			'source/demo/modules/**/*.test.js'
		]
	};

gulp.task(taskName, function(cb) {
	var helpers = require('require-dir')('../../helpers'),
		path = require('path'),
		_ = require('lodash'),
		tap = require('gulp-tap'),
		ignore = require('gulp-ignore'),
		qunit = require('gulp-qunit'),
		del = require('del');

	var ignoreFiles = [];

	// Copy test files
	gulp.src(taskConfig.srcTests, {
		base: taskConfig.srcBase
	})
		.pipe(gulp.dest(taskConfig.destTests))
		.on('finish', function() {
			// Run tests
			gulp.src(taskConfig.srcTemplates, {
				base: taskConfig.srcTemplatesBase
			})
				.pipe(tap(function(file) {
					var content = file.contents.toString(),
						relPathPrefix = path.join(path.relative(file.path, taskConfig.srcTemplatesBase)).replace(/\.\.$/, '');

					// Ignore files without a QUnit script reference
					if (content.search(taskConfig.srcQUnit) === -1) {
						ignoreFiles.push(file.path);

						return;
					}

					// Make paths relative to build directory, add base tag
					content = content
						.replace('<head>', '<head><base href="' + path.resolve(taskConfig.srcTemplatesBase) + '/">')
						.replace(new RegExp(relPathPrefix, 'g'), '');

					// Re-enable autostart
					content = content.replace('QUnit.config.autostart = false;', '');

					file.contents = new Buffer(content);
				}))
				.pipe(ignore.exclude(function(file) {
					return _.indexOf(ignoreFiles, file.path) !== -1;
				}))
				// Move them outside /build/ for some weird phantomJS reason
				.pipe(gulp.dest(taskConfig.destTemplates))
				.pipe(qunit().on('error', helpers.errors))
				.on('finish', function() {
					// Remove .qunit tmp folder
					del(taskConfig.destTemplates, cb);
				});
		});
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
