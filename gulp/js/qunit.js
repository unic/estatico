'use strict';

/**
 * @function `gulp js:qunit`
 * @desc Run QUnit tests (using PhantomJS).
 */

var gulp = require('gulp');

var taskName = 'js:qunit',
	taskConfig = {
		srcTests: [
			'./node_modules/qunitjs/qunit/*',
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
		srcQUnit: './node_modules/qunitjs/qunit/qunit.js',
		destTemplates: './.qunit/',
		srcPolyfills: [
			'./node_modules/phantomjs-polyfill/bind-polyfill.js'
		],
		watch: [
			'source/modules/**/*.test.js',
			'source/demo/modules/**/*.test.js'
		]
	};

gulp.task(taskName, function(cb) {
	var helpers = require('require-dir')('../../helpers'),
		path = require('path'),
		_ = require('lodash'),
		rename = require('gulp-rename'),
		tap = require('gulp-tap'),
		ignore = require('gulp-ignore'),
		qunit = require('gulp-qunit'),
		del = require('del'),
		glob = require('glob');

	var srcTests = taskConfig.srcTests,
		ignoreFiles = [],
		polyfills = [],
		polyfillPathPrefix = path.relative(taskConfig.srcTemplatesBase, taskConfig.destTests);

	// Add polyfills to files to be copied
	srcTests = srcTests.concat(taskConfig.srcPolyfills);

	// Resolve paths of polyfills
	taskConfig.srcPolyfills.forEach(function(fileGlob) {
		polyfills = polyfills.concat(glob.sync(fileGlob));
	});

	// Copy test files
	gulp.src(srcTests, {
		base: taskConfig.srcBase
	})
		.pipe(rename(function(filePath) {
			// Move node_modules into the same dest dir
			filePath.dirname = filePath.dirname.replace(path.join('..', 'node_modules'), 'node_modules');
		}))
		.pipe(gulp.dest(taskConfig.destTests))
		.on('finish', function() {
			// Run tests
			gulp.src(taskConfig.srcTemplates, {
				base: taskConfig.srcTemplatesBase
			})
				.pipe(tap(function(file) {
					var content = file.contents.toString(),
						relPathPrefix = path.relative(file.path, taskConfig.srcTemplatesBase);

					relPathPrefix = relPathPrefix
						.replace(new RegExp('\\' + path.sep, 'g'), '/') // Normalize path separator
						.replace(/\.\.$/, ''); // Remove trailing ..

					// Ignore files without a QUnit script reference
					if (content.search(taskConfig.srcQUnit) === -1) {
						ignoreFiles.push(file.path);

						return;
					}

					// Make paths relative to build directory, add base tag
					content = content
						.replace('<head>', '<head><base href="' + path.resolve(taskConfig.srcTemplatesBase) + path.sep + '">')
						.replace(new RegExp(relPathPrefix, 'g'), '');

					// Re-enable autostart
					content = content.replace('QUnit.config.autostart = false;', '');

					// Insert polyfills for PhantomJS
					polyfills.forEach(function(filePath) {
						filePath = path.join(polyfillPathPrefix, filePath);

						content = content.replace('<script', '<script src="' + filePath + '"></script><script');
					});

					file.contents = new Buffer(content);
				}))
				.pipe(ignore.exclude(function(file) {
					return _.indexOf(ignoreFiles, file.path) !== -1;
				}))

				// Move them outside /build/ for some weird phantomJS reason
				.pipe(gulp.dest(taskConfig.destTemplates))
				.pipe(qunit({
					'phantomjs-options': ['--web-security=no']
				}).on('error', helpers.errors))
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
