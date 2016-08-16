'use strict';

/**
 * @function `gulp js:qunit`
 * @desc Run QUnit tests (using PhantomJS).
 */

var gulp = require('gulp');

var taskName = 'js:qunit',
	taskConfig = {
		srcTests: [
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
		srcQUnit: './source/preview/assets/js/test.js',
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
		tap = require('gulp-tap'),
		ignore = require('gulp-ignore'),
		webpack = require('webpack'),
		qunit = require('gulp-qunit'),
		del = require('del'),
		glob = require('glob');

	var srcTests = [],
		ignoreFiles = [],
		polyfills = [],
		polyfillPathPrefix = path.relative(taskConfig.srcTemplatesBase, taskConfig.destTests);

	// Resolve test paths
	taskConfig.srcTests.forEach(function(fileGlob) {
		srcTests = srcTests.concat(glob.sync(fileGlob));
	});

	// Add polyfills to files to be copied
	srcTests = srcTests.concat(taskConfig.srcPolyfills);

	// Resolve paths of polyfills
	taskConfig.srcPolyfills.forEach(function(fileGlob) {
		polyfills = polyfills.concat(glob.sync(fileGlob));
	});

	// Prepare test-config
	webpack({
		// Create a map of entries, i.e. {'assets/js/main': './source/assets/js/main.js'}
		entry: helpers.webpack.getEntries([taskConfig.srcQUnit], taskConfig.srcBase),
		module: {
			loaders: [
				{
					test: /qunit\.js$/,
					loader: 'expose?QUnit'
				},
				{
					test: /\.css$/,
					loader: 'style-loader!css-loader'
				}
			]
		},
		externals: {
			'jquery': 'jQuery'
		},
		output: {
			path: taskConfig.destTests,
			filename: '[name].js'
		}
	}, function(err, stats) {
		helpers.webpack.log(err, stats, taskName);

		// Copy test files
		webpack({
			// Create a map of entries, i.e. {'assets/js/main': './source/assets/js/main.js'}
			entry: helpers.webpack.getEntries(srcTests, taskConfig.srcBase, function(key) {
				// Move files from node_modules into target dir, too
				return key.replace(path.join('..', 'node_modules'), 'node_modules');
			}),

			externals: {
				'qunitjs': 'QUnit',
				'jquery': 'jQuery'
			},
			output: {
				path: taskConfig.destTests,
				filename: '[name].js'
			}
		}, function(err, stats) {
			helpers.webpack.log(err, stats, taskName);

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
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};
